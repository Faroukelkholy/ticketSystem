var express = require('express');
var router = express.Router();
const settings = require('../settings');
const MongoDriver = require('../storage/mongoDriver');
const mongoDriver = new MongoDriver(settings.mongo);
mongoDriver.onConnection().then(() => {
  mongoDriver.handleError();
});


/**
GET /tickets
*@return {Status} 200 {"message":"Success", result:tickets}
*@return {Status} 403 Forbidden
*@return {Status} 500 Internal Server Error
*@memberof API
*/
router.get('/', async (req, res) => {
  try {
    const tickets = await mongoDriver.ticket.getTickets();
    return res.status(200).json({
      message: "Success",
      result: tickets
    });
  } catch (e) {
    return res.status(500);
  }
});

/**
GET /tickets/:id
*@param {String} id req.param.id
*@return {Status} 200 {"message":"Success", result:ticket}
*@return {Status} 403 Forbidden
*@return {Status} 500 Internal Server Error
*@memberof API
*/
router.get('/:id', async (req, res) => {
  try {
    const ticket = await mongoDriver.ticket.getTicket(req.param.id);
    return res.status(200).json({
      message: "Success",
      result: ticket
    });
  } catch (e) {
    return res.status(500);
  }
});


/**
POST /tickets
*@param {{title: string,description: string}} ticket req.body.ticket
*@param {{name: string, email: string, mobile: number}} author req.body.author
*@return {Status} 200 {"message":"Success"}
*@return {Status} 403 Forbidden
*@return {Status} 500 Internal Server Error
*@memberof API
*/
router.post('/', async (req, res) => {
  try {
    await mongoDriver.ticket.saveTicket(req.body.ticket, req.body.author);
    return res.status(200).json({
      message: "Success"
    });
  } catch (e) {
    return res.status(500);
  }
});

/**
PUT /tickets/
*@param {{id: string, status: string}} ticket req.body.ticket
*@param {{name: string, email:string, mobile: number}} assignee req.body.assignee
*@return {Status} 204 {"message":"Success"}
*@return {Status} 403 Forbidden
*@return {Status} 500 Internal Server Error
*@memberof API
*/
router.put('/:id', async (req, res) => {
  try {
    await mongoDriver.ticket.editTicket(req.body.ticket,req.body.assignee);
    return res.status(204).json({
      message: "Success"
    });
  } catch (e) {
    return res.status(500);
  }
});

/**
DELETE /tickets/:id
*@param {String} id req.param.id
*@return {Status} 204 {"message":"Success"}
*@return {Status} 403 Forbidden
*@return {Status} 500 Internal Server Error
*@memberof API
*/
router.delete('/:id', async (req, res) => {
  try {
    await mongoDriver.ticket.deleteTicket(req.param.id);
    return res.status(204).json({
      message: "Success"
    });
  } catch (e) {
    return res.status(500);
  }
});




module.exports = router;