var when = require("when");
var jwt = require("jsonwebtoken");
var settings = require("../settings.js");
var tokenSecret = settings.oauthCredentials.tokenSecret;
var randomstring = require("randomstring");

class Token {
  constructor(mongoUFE) {
    this.mongoUFE = mongoUFE;
  };

  findAccessToken(accessToken) {
    let self = this;
    return when.promise(function(resolve, reject) {
      self.mongoUFE.token.findAccessToken(accessToken).then(function(token) {
        if (!token) {
          return reject();
        }
        jwt.verify(token.access_token, tokenSecret, function(err, user) {
          if (err) {
            //  tokens.revoke(token.access_token,"","");
            console.log("AT expired " + token.access_token.substring(0, 50));
            console.log("jwt verify ", err);
            return reject({
              message: "Invalid access_token"
            });
          } else {
            user.access_token = token.access_token;
            user.auth = "Bearer";
            return resolve(user);
          }
        });
      }).otherwise(function(err) {
        console.log("Access Token error", err);
        return reject({
          message: "Invalid access_token"
        });
      });
    });
  };
  
  createAccessToken(auth_user) {
    let self = this;
    return when.promise(function(resolve, reject) {
      var access_token = jwt.sign(auth_user.toJSON(), tokenSecret, {
        issuer: "backendOauth",
        expiresIn: "30d"
      });
      var refreshToken = randomstring.generate({
        length: 32,
        charset: 'hex'
      });
      // console.log("createAccessToken refreshToken :", refreshToken);
      // var user = jwt.decode(access_token,settings.secret);
      self.mongoUFE.token.saveToken(auth_user, access_token, refreshToken).then(function(token) {
        return resolve(token);
      }).otherwise(function(error) {
        console.log("otherwise saveToken error :", error);
        return reject(error);
      });
    });
  }
  
}







module.exports = Token;
