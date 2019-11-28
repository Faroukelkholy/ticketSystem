var express = require('express');
var router = express.Router();
const settings = require('../settings');
const MongoDriver = require('../storage/mongoDriver');
const mongoDriver = new MongoDriver(settings.mongo);
mongoDriver.onConnection().then(() => {
  mongoDriver.handleError();
});


/**
GET /statistics/tickets
*@return {Status} 200 {"message":"Success", result:stats}
*@return {Status} 403 Forbidden
*@return {Status} 500 Internal Server Error
*@memberof API
*/
router.get('/tickets', async (req, res) => {
try {
  const stats = await mongoDriver.ticket.statistics();
  return res.status(200).json({
    message: "Success",
    result: stats
  });
} catch (e) {
  return res.status(500);
}
});

module.exports = router;
