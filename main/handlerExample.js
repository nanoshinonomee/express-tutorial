
// this is called from appCallHandler.js which is called from index.js
// this is basically a way you can link things and organize them if you want

// this is basically exporting a function that will handle a request, and the response
exports.handlerExampleFunc = function(req, res){

    // you could do something here with the request if you needed to, if it was a post

	var listOfUsers = {
		users : [
			{ name: "M1", email: "jfkdla@jkdlfa.com"},
			{ name: "M2",   email: "h@h.com"},
			{ name: "M3",  email: "y@y.com"}
        ],
        users2 : [
			{ name: "M1", email: "jfkdla@jkdlfa.com"},
			{ name: "M2",   email: "h@h.com"},
			{ name: "M3",  email: "y@y.com"}
        ],
	};


	res.send(listOfUsers);  // response is to send back the list of users
};




// we can also parse out what we want to do into functions like below
function handlerGetListOfUsers(){
	var listOfUsers = {
		users : [
			{ name: "M1", email: "jfkdla@jkdlfa.com"},
			{ name: "M2",   email: "h@h.com"},
			{ name: "M3",  email: "y@y.com"}
        ],
        users2 : [
			{ name: "M1", email: "jfkdla@jkdlfa.com"},
			{ name: "M2",   email: "h@h.com"},
			{ name: "M3",  email: "y@y.com"}
        ],
	};

	return listOfUsers;
}
exports.handlerGetListOfUsers = handlerGetListOfUsers;	// you MUST do this if you want to call an exported function as a function in the same file it is listed



// this will link to the function above and is called from our code in appCallHander.js
exports.getListOfUsersResponse = function(req, res){
	res.send(handlerGetListOfUsers());
};

