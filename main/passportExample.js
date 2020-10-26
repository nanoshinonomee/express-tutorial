const express = require('express');
const app = express();
const passport = require('passport');
const got = require('got');

// when using passport, authentication methods and mechanics are known as "strategies"
// strategies are packaged as modules
// now below in the passportExampleFunc we use the strategy called 'local'
// I am going to need to configure this strategy before I can use it.

function passportExampleFunc(app) {

    app.post('/login', passport.authenticate('local'), function (req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        res.redirect('/loginsuccessful/' + req.user.username);
    });
}
exports.passportExampleFunc = passportExampleFunc;	// you MUST do this if you want to call an exported function as a function in the same file it is listed




// this will be a post done using got
function callPassportExample() {

    // this is a post using got as an example
    (async () => {
        //console.log("made it");
        const { body } = await got.post('http://localhost:3000/login', {
            json: {             // this is the "type that is being sent, this corresponds to how the parsing needs to be done"
                info: {         // this is going to set up the data as if it was req.body.user.name or .email
                    name: 'exampleName',
                    pass: 'examplePass'
                },
            },
            responseType: 'text'
        });
        console.log("post to passport example was a success");
    })();
}
exports.callPassportExample = callPassportExample;


