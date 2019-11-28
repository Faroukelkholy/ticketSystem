var mongoose = require("mongoose"),
  Schema = mongoose.Schema;
var moment = require("moment");

var TokenSchema = new Schema({
  access_token: {
    type: String,
    required: true
  },
  client_id: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  last_login: String
});

TokenSchema.statics.saveToken = function saveToken(user, access_token) {
  var tokenCreated = new this();
  tokenCreated.access_token = access_token;
  var last_login = moment(new Date()).format('D MMM YYYY,h:mm:ss a');
  tokenCreated.last_login = last_login;
  var options = {
    upsert: true
  };
  return this.updateOne({
      email: user.email
    }, {
      $set: {
        access_token: access_token,
        last_login: last_login
      }
    },
    options).then((to)=>{
      return this.findOne({
        access_token: access_token
      });
    }).otherwise((err)=>{
      console.log("saveToken err:",err);
       return Promise.reject(err);
    });

}

TokenSchema.statics.updateToken = function updateToken(user, access_token) {
  var tokenCreated = new this();
  tokenCreated.access_token = access_token;
  return this.updateOne({
    email: user.email
  }, {
    $set: {
      access_token: access_token
    }
  });
}

TokenSchema.statics.findAccessToken = function findAccessToken(accessToken) {
  return this.findOne({
    access_token: accessToken
  });
}


TokenSchema.statics.removeToken = function removeToken(accessToken) {
  return this.deleteOne({
    access_token: accessToken
  });
}


module.exports = TokenSchema;
