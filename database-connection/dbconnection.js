require("dotenv").config();
const mongoClient= require("mongodb").MongoClient;

let _connection= null;
const open= function() {
    if(!_connection) {
        mongoClient.connect(process.env.DATABASE_CONNECTION_URL, function(error, client){
            if(error){
                console.log("Database conncetion could not be established!");
                console.log(error.message);
                return;
            } else {
                _conncetion= client.db(process.env.DATABASE_NAME);
                console.log("Database conncetion established successfuly!");
            }
        });
    } else {
        console.log("There is an existing Database connection!");
    }
};
const get= function(){
    return _conncetion;
}

module.exports= {
    get: get,
    open: open
}