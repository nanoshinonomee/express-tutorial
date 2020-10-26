// this will be the file where we connect up to the db then do some tutorial operations.
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;

// this creates the database at our localhost on port 27017
// it then closes the db connection after creating it
async function connectToDatabase() {
    var url = "mongodb://localhost:27017/mydb";

    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) throw err;
        console.log("Can connect to the DB!");   // note, without a collection the DB has not actually been created
        db.close();
    });

}

exports.connectToDatabase = connectToDatabase;



async function createCollectionInDB() {
    var url = "mongodb://localhost:27017/";

    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, async function (err, db) {
        if (err) throw err;

        // connects up to the db, and now has the db object, dbo
        var dbo = db.db("mydb");

        // get the list of collections first to see what's in the database
        const collections = await dbo.listCollections().toArray();
        // list of collections with just the names in an array so we can check them
        const collectionNames = collections.map(c => c.name);

        //console.log("collectionNames", collectionNames);

        // check if our collection exists first by name
        if (collectionNames.indexOf("customers") == -1) {
            // we will create a collection, which actually creates the database 
            dbo.createCollection("customers", function (err, res) {
                if (err) throw err;
                //console.log("Collection created!");
                db.close();
            });
        }
        else {
            //console.log(`Collection: customers - already exists`);
        }


    });
}

exports.createCollectionInDB = createCollectionInDB;





async function insertIntoCollection() {
    var url = "mongodb://localhost:27017/";

    
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, async function (err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");


        const collections = await dbo.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);
        if (collectionNames.indexOf("customers") != -1) {
            var myobj = { name: "Company Inc", address: "Highway 37" };
            dbo.collection("customers").insertOne(myobj, function (err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                // if you want to insert more than that, then just use insertMany instead of InsertOne

                db.close();
            });
        }
        else {
            console.log("Collection not found to be inserted into");
        }

        

        

    });

    

}

exports.insertIntoCollection = insertIntoCollection;



async function findInCollection() {
    var url = "mongodb://localhost:27017/";

    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, async function (err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");


        const collections = await dbo.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);
        if (collectionNames.indexOf("customers") != -1) {
            const resultFindOne = await dbo.collection("customers").findOne({}, function (err, res) {
                if (err) throw err;
                //console.log("found one record in Collection: " + res.name);

            });

            const resultFindAll = await dbo.collection("customers").find({}).toArray(function (err, res) {
                if (err) throw err;
                //console.log("find all records in collection \"customers\"", res);
                db.close(); // close this off at the end of the calls
            });


            // you can also do the findSome command which will filter out some of the fields that are returned when finding
            // you can also add in filters, using Queries which you add to the .find command
            // var query = { address: "Park Lane 38" };
            // you can also do a sort method
            
        }
        else {
            console.log("Collection not found to find a record in");
        }

        

    });

    

}

exports.findInCollection = findInCollection;



