const mongoose = require('mongoose');
const User = require('./models/user.js');
const Ticket = require('./models/ticket.js');
const Token = require('./models/token.js');
const when = require("when");


class MongoUFE{

  constructor(mongoSettings) {
    this._connect(mongoSettings);
  };

  _connect(mongoSettings){
    console.log(`Backend creating Connection to [ mongodb:// ${mongoSettings.dbURL}${mongoSettings.port}${mongoSettings.dbName} ]`);
    mongoose.Promise = when.Promise;
    mongoose.set('useCreateIndex', true);  
    mongoose.set('useUnifiedTopology', true);
    this.db = mongoose.createConnection("mongodb://"+mongoSettings.dbURL + mongoSettings.port + mongoSettings.dbName, { useNewUrlParser: true});
    mongoose.set('debug', function (coll, method, query, doc,options) {
        console.log(` Mongoose collection: ${coll.toString()} --method: ${method.toString()} --query: ${Object.values(query)} `);
       });
  }
  
  handleError() {
    this.db.on('error', console.error);
  };
  
  onConnection() {
    let _this = this;
    return when.promise(function(resolve, reject) {
    _this.db.once('open', function() {
      console.log("mongoDb connected");
      _this.user = _this.db.model("user", User);
      _this.ticket = _this.db.model("ticket", Ticket);
      _this.token = _this.db.model("token", Token);
      _this.user.createIndexes().then(function() {
        console.log('create user index successfully');
        return resolve();
      }).otherwise(function(err) {console.log(err);});
    });
  });
  
  };

  disconnect(){
    console.log('disconnecting a mongo connection');
    this.db.close();
  }
  
}


module.exports = MongoUFE;
