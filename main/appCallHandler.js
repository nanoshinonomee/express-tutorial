

const express = require('express');
const app = express();
const handlerFile = require('./handlerExample');


// example of how you can parse out your http handlers into a different file
exports.callHandlerFunc = function(app){
    //console.log("called here");
    app.get("/handlerExamplePath",  handlerFile.handlerExampleFunc);    // now you can move the handler into a completely other file if you want
};


exports.callGetUsersAsJsonDataRaw = function(app){
    //console.log("called here");
    app.get("/handlerUserListRawData",  handlerFile.getListOfUsersResponse);   
};

exports.callUserList = function(app){
    
    app.get("/handlerUserListAsJsonResponse", function (req, res) {
        console.log("You have called this and will be returned json data in the response, I think you need to parse this easier");
        var users = handlerFile.handlerGetListOfUsers;
        //console.log(users);
        res.json(users);    // returns it as a json response instead
    });
};


