const express = require('express');
const app = express();
const passport = require('passport');
const got = require('got');
const websiteStaticDirName = "website_static";
var GoogleStrategy = require('passport-google-oauth20');
var TwitterStrategy = require('passport-twitter');
const port = 3000;


const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const connectEnsureLogin = require('connect-ensure-login');

// when using passport, authentication methods and mechanics are known as "strategies"
// strategies are packaged as modules
// now below in the passportExampleFunc we use the strategy called 'local'
// I am going to need to configure this strategy before I can use it.

// exmaples below are no longer used
// function passportExampleFunc(app) {

//     app.post('/login', passport.authenticate('local'), function (req, res) {
//         // If this function gets called, authentication was successful.
//         // `req.user` contains the authenticated user.
//         res.redirect('/loginsuccessful/' + req.user.username);
//     });
// }
// exports.passportExampleFunc = passportExampleFunc;	// you MUST do this if you want to call an exported function as a function in the same file it is listed

// // this will be a post done using got
// function callPassportExample() {

//     // this is a post using got as an example
//     (async () => {
//         //console.log("made it");
//         const { body } = await got.post('http://localhost:3000/login', {
//             json: {             // this is the "type that is being sent, this corresponds to how the parsing needs to be done"
//                 info: {         // this is going to set up the data as if it was req.body.user.name or .email
//                     name: 'exampleName',
//                     pass: 'examplePass'
//                 },
//             },
//             responseType: 'text'
//         });
//         console.log("post to passport example was a success");
//     })();
// }
// exports.callPassportExample = callPassportExample;






async function connectPassportWithMongoose(app) {
    console.log("pass port example with mongoose called");
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
        console.log("uphere1");
        passport.authenticate('local',      // this will use the authenticate method which auths with strats using the 'local' parameter
            (err, user, info) => {
                console.log("uphere3");
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
        function (req, res) {
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
    var userDetailRecords = await UserDetails.find({ username: 'paul' }); // get all the records in the Model that has been created and connected up to
    //console.log(userDetailRecords.length);
    if (userDetailRecords.length == 0) {
        //  passport-local-mongoose .register users in our database
        // using  passport-local-mongoose .register it will salt the password for us
        UserDetails.register({ username: 'paul', active: false }, 'paul');  // creates the username
        console.log("user paul has been created");

        // UserDetails.register({ username: 'jay', active: false }, 'jayPassword');
        // UserDetails.register({ username: 'roy', active: false }, 'royPassword');
    }

    // lets learn to delete the database, collection, and record
    var deleteRecord = false;
    if (deleteRecord) {
        await UserDetails.deleteOne({ username: 'paul' }, function (err) {
            if (err) return handleError(err);
            console.log("deleted username paul");
        });
    }

    var deleteCollection = false;
    if (deleteCollection) {
        UserDetails.collection.drop();
        console.log(`UserDetails collection dropped.`);
    }


    var deleteDb = false;
    if (deleteDb) {
        await mongoose.connection.db.dropDatabase();
        console.log(`${mongoose.connection.db.databaseName} database dropped.`);
    }

}
exports.connectPassportWithMongoose = connectPassportWithMongoose;



async function connectPassportWithGoogle(app) {
    console.log("google passport");
    app.use(passport.initialize()); // Used to initialize passport
    app.use(passport.session()); // Used to persist login sessions

    // Strategy config
    passport.use(new GoogleStrategy({
        clientID: '491600299986-a1b5l9r41eah26hm9vqj019a0m6og668.apps.googleusercontent.com',
        clientSecret: 'Ru-gTb8X62dpNJBcHEwEzDCp',
        callbackURL: 'http://localhost:3000/auth/google/callback'
    },
        (accessToken, refreshToken, profile, done) => {
            done(null, profile); // passes the profile data to serializeUser
        }
    ));

    // Used to stuff a piece of information into a cookie
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    // Used to decode the received cookie and persist session
    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    // Routes
    app.get('/googleindex', (req, res) => {
        res.render('index.ejs');
    });

    // passport.authenticate middleware is used here to authenticate the request
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile'] // Used to specify the required data
    }));

    // The middleware receives the data from Google and runs the function on Strategy config
    app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
        res.redirect('/googlesecret');
    });

    // Secret route
    app.get('/googlesecret', isUserAuthenticated, (req, res) => {
        res.send('You have reached the secret route');
    });

    // Logout route
    app.get('/googlelogout', (req, res) => {
        req.logout();
        res.redirect('/googleindex');
    });




}
exports.connectPassportWithGoogle = connectPassportWithGoogle;



async function connectPassportWithTwitter(app) {
    console.log("twitter passport");
    app.use(passport.initialize()); // Used to initialize passport
    app.use(passport.session()); // Used to persist login sessions

    passport.use(new TwitterStrategy({
        consumerKey: "iujI4oZwkzfEOj2P24eXn8bA9",
        consumerSecret: "J7NcBvEwu4J96bcnJPFDBfbbpkHq4HwTSm6YfICPNIVjmvTrar",
        callbackURL: "http://localhost:3000/auth/twitter/callback",
        proxy: false
    },
        function (token, tokenSecret, profile, cb) {
            // In this example, the user's Twitter profile is supplied as the user
            // record.  In a production-quality application, the Twitter profile should
            // be associated with a user record in the application's database, which
            // allows for account linking and authentication with other identity
            // providers.
            return cb(null, profile);
        }));

    passport.serializeUser(function (user, cb) {
        cb(null, user);
    });

    passport.deserializeUser(function (obj, cb) {
        cb(null, obj);
    });

    // Define routes.
    app.get('/twitterhome',
        function (req, res) {
            res.render('twitterhome.ejs', { user: req.user });
        });

    app.get('/twitterlogin',
        function (req, res) {
            // console.log('ENV');
            // console.log(process.env);
            // console.log('Headers:');
            // console.log(req.headers)
            res.render('twitterlogin.ejs');
        });

    app.get('/twitterlogin/twitter', passport.authenticate('twitter'));

    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', { failureRedirect: '/twitterlogin' }),
        function (req, res) {
            res.redirect('/twitterhome');
        });

    app.get('/twitterprofile',
        require('connect-ensure-login').ensureLoggedIn(),
        function (req, res) {
            res.render('twitterprofile.ejs', { user: req.user });
        });

    app.get('/twitterlogout',
        function (req, res) {
            req.logout();
            res.redirect('/twitterhome');

            // req.session.destroy(function (err) {
            //     res.redirect('/twitterhome');
            // });
        });
}
exports.connectPassportWithTwitter = connectPassportWithTwitter;


// Middleware to check if the user is authenticated
function isUserAuthenticated(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.send('You must login!');
    }
}