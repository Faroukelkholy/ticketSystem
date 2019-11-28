const BasicStrategy = require("passport-http").BasicStrategy;
const BearerStrategy = require("passport-http-bearer").Strategy;
const ClientPasswordStrategy = require("passport-oauth2-client-password").Strategy;
const settings = require("../settings.js");
const clientID = settings.oauthCredentials.clientID;
const clientSecret = settings.oauthCredentials.clientSecret;
const Token = require("./token");
var tokenLogic;
const MongoUFE = require('../storage/mongoUFE.js');
const mongoUFE = new MongoUFE(settings.mongo);
mongoUFE.onConnection().then(() => {
  tokenLogic = new Token(mongoUFE);
});
mongoUFE.handleError();


const bearerStrategy = new BearerStrategy(
  function(accessToken, done) {
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
  if (clientID === client_Id && client_Secret === clientSecret) {
    let client = {};
    return done(null, client);
  } else {
    console.log("client not_available");

    return done(null, false, {
      message: "client not_available"
    });
  }

}


function passwordTokenExchange(client, email, password, scope, done) {
  console.log('passwordTokenExchange :', client);
  email = email.toLowerCase();
  let user = {};
  user.email = email;
  user.password = password;
  mongoUFE.user.authenticateUser(user).then(function(auth_user) {
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
  passwordTokenExchange: passwordTokenExchange,
  refreshTokenExchange: refreshTokenExchange
};
