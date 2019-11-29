const BasicStrategy = require("passport-http").BasicStrategy;
const BearerStrategy = require("passport-http-bearer").Strategy;
const ClientPasswordStrategy = require("passport-oauth2-client-password").Strategy;
const settings = require("../settings.js");
const clientID = settings.oauthCredentials.clientID;
const clientSecret = settings.oauthCredentials.clientSecret;
const Token = require("./token");
var tokenLogic;
const MongoDriver = require('../storage/mongoDriver.js');
const mongoDriver = new MongoDriver(settings.mongo);
mongoDriver.onConnection().then(() => {
  tokenLogic = new Token(mongoDriver);
});
mongoDriver.handleError();


const bearerStrategy = new BearerStrategy(
  function(accessToken, done) {
    console.log('##strategies.bearerStrategy');
    tokenLogic.findAccessToken(accessToken).then(function(user) {
      if (user) {
        return done(null, user);
      }
    }).otherwise(function(err) {
      console.error("##################bearerStrategy err", err);
      if (err) {
        return done(null, false, err);
      }
      return done(null, false);
    });
  });


function _clientCredentialsAuth(req, client_Id, client_Secret, done) {
  console.log('##strategies._clientCredentialsAuth');
  if (clientID === client_Id && client_Secret === clientSecret) {
    let client = {};
    client.client_Id =  client_Id;
    return done(null, client);
  } else {
    console.log("client not_available");

    return done(null, false, {
      message: "client not_available"
    });
  }

}


function passwordTokenExchange(client, email, password, scope, done) {
  console.log('strategies.passwordTokenExchange :', client);
  email = email.toLowerCase();
  let user = {};
  user.email = email;
  user.password = password;
  mongoDriver.user.authenticateUser(user).then(function(auth_user) {
    console.log("authenticateUser auth_user :");
    if(!auth_user){
      console.log("authenticateUser !auth_user auth_user :", auth_user);
      return done(null, false, {
        message: "Invalid username/password"
      });
    } else {
      tokenLogic.createAccessToken(auth_user).then(function(token) {
        return done(null, token.access_token, token.refresh_token, {
          message: "Success",
          user:auth_user
        });
      }).otherwise(function(error) {
        console.error("createAccessToken error :",error);
        return done(error);
      });
    }

  }).otherwise(function(error) {
    console.error("otherwise authenticateUser error :", error);
    return done(null, false, {
      message: "Invalid username/password"
    });
  });
}


var clientBasicStrategy = new BasicStrategy({
  passReqToCallback: true
}, _clientCredentialsAuth);

const clientPasswordStrategy = new ClientPasswordStrategy({
  passReqToCallback: true
}, _clientCredentialsAuth);



module.exports = {
  clientPasswordStrategy: clientPasswordStrategy,
  clientBasicStrategy: clientBasicStrategy,
  bearerStrategy: bearerStrategy,
  passwordTokenExchange: passwordTokenExchange
};
