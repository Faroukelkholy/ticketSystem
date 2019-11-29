const express = require('express');
const router = express.Router();
const oauth = require("../oauth/oauth");
const settings = require("../settings.js");
const MongoDriver = require('../storage/mongoDriver.js');
const mongoDriver = new MongoDriver(settings.mongo);

mongoDriver.onConnection().then(() => {
  mongoDriver.handleError();
});


router.post('/token',oauth.token);

router.post('/logout', function(req, res, next) {
mongoDriver.token.removeToken(req.body.access_token).then((tokenRemoved)=>{
    return res.status(200).json({
      message: "Success"
    });
  }).otherwise((error)=>{
    console.error("/logout otherwise error:",error);
    return res.status(500).json({
      message: "Failed"
    });
  })

});

module.exports = router;
