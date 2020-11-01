const express = require('express');
const app = express();
const port = 3000;
const localHostString = `http://localhost:${port}`  // string literal templayes using acutes `

const callHandlerExample = require('./appCallHandler');



const websiteStaticDirName = "website_static";


var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;


// this is for the login passport example
const mongoose = require('mongoose');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
// routes for our login passport example
const connectEnsureLogin = require('connect-ensure-login');

const got = require('got');
const bodyParser = require('body-parser');


app.use(express.static(websiteStaticDirName));  // this allows the static serving of all webpages in the website_static page

// we will piece in the express session for use here
const expressSession = require('express-session')({
    secret: 'secretExampleHere',
    resave: false,  // field forces the session to be saved back to the session store
    saveUninitialized: false    // field forces a session that is “uninitialized” to be saved to the store
});








const helmet = require("helmet");
app.use(helmet());  // adds in the helmet middleware to increase security by removing the headers out of http requests
// this works after me applying it after writing all the other examples


// get is basically the read
app.get('/', (req, res) => {        // the / or route is looking for the root url path, which in our case is just http://localhost:port/ 
    res.send('Hello World!')
})

// post creates new resources in the server somehow someway, think of it like writing,
app.post('/', (req, res) => {        // the / or route is looking for the root url path, which in our case is just http://localhost:port/ 
    res.send('post!')
})

// put is like updating resources in the server environment, however it can introduce new things too.  
// this replaces the original resource
app.put('/', (req, res) => {        // the / or route is looking for the root url path, which in our case is just http://localhost:port/ 
    res.send('put!')
})

// this is more like a modify, it only changes the resource. the patch body will be something like in json or xml to patch it.
// this does not replace the oriignal resource
app.patch('/', (req, res) => {        // the / or route is looking for the root url path, which in our case is just http://localhost:port/ 
    res.send('patch!')
})

// literally deletes a resource
app.delete('/', (req, res) => {        // the / or route is looking for the root url path, which in our case is just http://localhost:port/ 
    res.send('del!')
})



app.get('/testpath', (req, res) => {       // this should happen when going to  http://localhost:port/testpath
    res.send('Hello Test Paadddddaaath!')
})

// queries vs parameters
// next we are going to go to links using queries and parameters
// params come first, they are used to identify and find a specific resource
// queries are used 2nd and are used to sort and filter those resources that have been identified
// although this is the standard, you can manipulate them, but follow the standard

// this example uses something in he users path, and wants the parameter for ID. 
// and it also wants a query with the color
// http://localhost:3000/user/12345?color=red
// this would give the id of 12345 and the query of red
app.get("/user/:id", function (req, res) {
    var id = req.params.id;
    var color = req.query.color;

    res.send("Yes? You asked for customer '" + id +
        "' and passed the color = '" + color + "'");
});

// this example passes in multiple parameters and multiple queries
// http://localhost:3000/users/12345&54321?color1=red&color2=blue
// notice how the seperation between parameters and queries is the ? in the url
// notice how the paramters below have the identifier of : in fron of them
// notice how both params and queries are speerated with an &, but queries require specific named variables
app.get("/users/:id1&:id2", function (req, res) {
    var id1 = req.params.id1;
    var id2 = req.params.id2;
    var color1 = req.query.color1;
    var color2 = req.query.color2;

    res.send("Yes? You asked for customer ids of  '" + id1 + " and " + id2 +
        "' and passed the colors = '" + color1 + " and " + color2 + "'");
});



app.use(bodyParser.json()); // allows express to properly parse out json using this route type. 
app.use(bodyParser.urlencoded({ extended: true })); // this is for better security I assume
app.use(expressSession);


app.post("/userstuff", function (req, res) {
    //console.log(req.body);
    var name = req.body.user.name;
    var email = req.body.user.email;

    // using respones type json
    var jsonReturnData = {
        stringOfText: "You sent name = '" + name + "' and email='" + email + "'"
    }
    //res.send(jsonReturnData);

    // using response type text
    res.send("You sent name = '" + name + "' and email='" + email + "'");



});

callHandlerExample.callHandlerFunc(app);    // example of how you can move the entire http handler into a different file
callHandlerExample.callGetUsersAsJsonDataRaw(app);
callHandlerExample.callUserList(app);








app.listen(port, () => {        // this will listen on the provided port
    console.log(`Example app listening at ${localHostString}`)
});

// this is a post using got as an example
(async () => {
    //console.log("made it");
    const { body } = await got.post('http://localhost:3000/userstuff', {
        json: {             // this is the "type that is being sent, this corresponds to how the parsing needs to be done"
            // refer to app.use(bodyParser.json());
            user: {         // this is going to set up the data as if it was req.body.user.name or .email
                name: 'hello',
                email: 'world'
            },
            name: 'hello',      // this will just set up the data as if it was req.body.name or body.email
            email: 'world'
        },

        // the repsonse type is important
        // comes in 3 different flavors, text, json, or buffer
        // you are probably going to normally need to use text or json
        //responseType: 'json'
        responseType: 'text'      // this is the type of response the data MUST BE IN
        // IF YOU DONT HAVE THE DATA res. RESPONSE DATA CORRECT FOR YOUR POST YOU ARE SCREWED
        // SO MAKE SURE YOU HAVE THE DATA RESPONDED AS IN JSON FORMAT ORWHATEVER TYPE OF DATA YOU NEED
        // YOU CAN ALSO DO IT WITH TEXT OR JSON
    });

    // using response type Json
    //console.log("body: " + body.stringOfText);

    // using response type Text
    //console.log("body: " + body);
    //=> {hello: 'world'}
})();





(async () => {
    // call the databaseConnection.js
    const databaseConnectionFile = require('./databaseConnection');
    await databaseConnectionFile.connectToDatabase();
    await databaseConnectionFile.createCollectionInDB();
    //await databaseConnectionFile.insertIntoCollection();
    await databaseConnectionFile.findInCollection();
})();


(async () => {
    // before I do passport, I need to get a database implemented, looks like I'm going to be using mongoDB
    // I will also use mongoose for easier connecting and data object management
    const passportExampleReq = require('./passportExample');
    //await passportExampleReq.connectPassportWithMongoose(app);

    // example using passport called here
    // no longer used
    //passportExampleReq.passportExampleFunc(app);
    // need to do a post
    //passportExampleReq.callPassportExample();

    console.log("pass port here example");
    // now we can add in our Passport usage after the express sesssion has been created back in index.js
    app.use(passport.initialize());
    app.use(passport.session());

    
    

    // connect up to the database we will be looking to
    mongoose.connect('mongodb://localhost/MyDatabaseExample', { useNewUrlParser: true, useUnifiedTopology: true });

    
    // create a schema for holding our data
    // basically this just defines our datastructure for UserDetail
    const Schema = mongoose.Schema;
    const UserDetail = new Schema({
        username: String,
        password: String
    });

    UserDetail.plugin(passportLocalMongoose);   // this inputs the plugin

    //                       1. name param in database of collection   2.ref to schema       3. name assigned to collection in mongoose
    const UserDetails = mongoose.model('userInfoCollectionNameInDB', UserDetail, 'userInfoCollectionNameInMongoose');     // we will pass in the user information to the USerDetails
    // the .model creates a model in mongoose for us. 
    // first parameter is the Name of the collection in the Database
    



    // local authentication with passport
    passport.use(UserDetails.createStrategy()); // creates the local strategy User Details, by passport-local-mongoose

    passport.serializeUser(UserDetails.serializeUser());    // serializes our Users - callback, invoked on auth, stores session via cookie

    passport.deserializeUser(UserDetails.deserializeUser());    // Deserialize User - callback, invoked on request to deserialize and provide unique cookie (credential)


    app.post('/loginPassport', (req, res, next) => {
        passport.authenticate('local',      // this will use the authenticate method which auths with strats using the 'local' parameter
            (err, user, info) => {
                if (err) {
                    console.log("failed1");
                    return next(err);
                }

                if (!user) {
                    console.log("failed2");
                    return res.redirect('/loginPassport?info=' + info);     // if the auth fails it goes here
                }

                req.logIn(user, function (err) {
                    if (err) {
                        console.log("failed3");
                        return next(err);
                    }
                    console.log("success");
                    return res.redirect('/homeLogin');  // if success goes here
                });

            })(req, res, next);
    });

    app.get('/loginPassport',       // sends the login page with anoyne who gets it
        (req, res) => res.sendFile('login.html', { root: websiteStaticDirName })
    );

    app.get('/homeLogin',
        connectEnsureLogin.ensureLoggedIn('loginPassport'),        // this guards our routes to make sure we are logged in first
        // connectEnsureLogin.ensureLoggedIn(), NOTE: You can also do it this way just to return to a default home, but we want to redirect to a specific page
        // using ensureLoggedIn();
        function(req, res) {
            console.log("lol");
            res.sendFile('homeLogin.html', { root: websiteStaticDirName });
        }
        //(req, res) => res.sendFile('homeLogin.html', { root: websiteStaticDirName }), 
    );

    app.get('/private',
        connectEnsureLogin.ensureLoggedIn('loginPassport'),     // this guards our routes to make sure we are logged in first
        (req, res) => res.sendFile('private.html', { root: websiteStaticDirName })
    );

    app.get('/userPassport',
        connectEnsureLogin.ensureLoggedIn('loginPassport'),     // this guards our routes to make sure we are logged in first
        (req, res) => res.send({ user: req.user })      // returns information about the user that is currently logged in
    );


    


    var userDetailRecords = await UserDetails.find({}); // get all the records in the Model that has been created and connected up to
    // console.log(userDetailRecords.length);
    console.log(userDetailRecords[0]);

    // this will do a check first to see if 
    var userDetailRecords = await UserDetails.find({ username: 'paul'}); // get all the records in the Model that has been created and connected up to
    //console.log(userDetailRecords.length);
    if(userDetailRecords.length == 0){
        //  passport-local-mongoose .register users in our database
        // using  passport-local-mongoose .register it will salt the password for us
        UserDetails.register({ username: 'paul', active: false }, 'paul');  // creates the username
        console.log("user paul has been created");

        // UserDetails.register({ username: 'jay', active: false }, 'jayPassword');
        // UserDetails.register({ username: 'roy', active: false }, 'royPassword');
    }

    // lets learn to delete the database, collection, and record
    var deleteRecord = false;
    if(deleteRecord){
        await UserDetails.deleteOne({ username: 'paul'}, function (err) {
            if (err) return handleError(err);
            console.log("deleted username paul");
          });
    }

    var deleteCollection = false;
    if(deleteCollection){
        UserDetails.collection.drop();
        console.log(`UserDetails collection dropped.`);
    }


    var deleteDb = false;
    if(deleteDb){
        await mongoose.connection.db.dropDatabase();
        console.log(`${mongoose.connection.db.databaseName} database dropped.`);
    }








})();


// example of serving a single static file, usually I would not do this I would do a directory
app.get('/about', (req, res) => {
    res.sendFile('singlestatic.html', { root: "single_static_file" });
});

// if yuo do this, you can set it in one single step
app.use('/aboutTestStatic', express.static('staticdirExample'));
// now you can go to http://localhost:3000/aboutTestStatic/singlestaticTest.html
// to see everything in the static directory "staticdirExample"




