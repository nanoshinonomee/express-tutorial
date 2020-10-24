const express = require('express');
const app = express();
const port = 3000;
const localHostString = `http://localhost:${port}`  // string literal templayes using acutes `

const callHandlerExample = require('./appCallHandler');


const got = require('got');
const bodyParser = require('body-parser');


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

app.post("/userstuff", function (req, res) {
	console.log(req.body);
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


(async () => {
    //console.log("made it");
    const {body} = await got.post('http://localhost:3000/userstuff', {
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
    console.log("body: " + body);
    //=> {hello: 'world'}
})();