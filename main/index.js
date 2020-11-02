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


// we will serve up our favicon
var favicon = require('serve-favicon');
app.use(favicon("./favicon/favicon.jpg"));


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
    await passportExampleReq.connectPassportWithMongoose(app);

    // example using passport called here
    // no longer used
    //passportExampleReq.passportExampleFunc(app);
    // need to do a post
    //passportExampleReq.callPassportExample();





})();


// example of serving a single static file, usually I would not do this I would do a directory
app.get('/about', (req, res) => {
    res.sendFile('singlestatic.html', { root: "single_static_file" });
});

// if yuo do this, you can set it in one single step
app.use('/aboutTestStatic', express.static('staticdirExample'));
// now you can go to http://localhost:3000/aboutTestStatic/singlestaticTest.html
// to see everything in the static directory "staticdirExample"




