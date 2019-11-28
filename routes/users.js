var express = require('express');
var router = express.Router();

/**
GET /users
*@return {Status} 200 {"message":"Success", result:users}
*@return {Status} 403 Forbidden
*@return {Status} 500 Internal Server Error
*@memberof API
*/
router.get('/', async (req, res) => {
  try {
    const users = await mongoDriver.user.getUsers();
    return res.status(200).json({
      message: "Success",
      result: users
    });
  } catch (e) {
    return res.status(500);
  }
});

/**
GET /user/:email
*@param {String} email req.param.email
*@return {Status} 200 {"message":"Success", result:user}
*@return {Status} 403 Forbidden
*@return {Status} 500 Internal Server Error
*@memberof API
*/
router.get('/:email', async (req, res) => {
  try {
    const user = await mongoDriver.user.getUser(req.param.email);
    return res.status(200).json({
      message: "Success",
      result: user
    });
  } catch (e) {
    return res.status(500);
  }
});

/**
POST /users
*@param {{firstname: string, lastname:string, email: string,password: string, mobile: number, address: string, gender: string, dob:Date}} user req.body.user
*@param {{name: string, email: string, mobile: number}} admin req.body.admin
*@return {Status} 200 {"message":"Success"}
*@return {Status} 403 Forbidden
*@return {Status} 500 Internal Server Error
*@memberof API
*/
router.post('/', async (req, res) => {
  try {
    await mongoDriver.user.saveUser(req.body.user, req.body.admin);
    return res.status(200).json({
      message: "Success"
    });
  } catch (e) {
    return res.status(500);
  }
});

/**
PUT /user/:email
*@param {{email: string, mobile: number, address: string, gender: string, dob:Date}} user req.body.user
*@return {Status} 204 {"message":"Success"}
*@return {Status} 403 Forbidden
*@return {Status} 500 Internal Server Error
*@memberof API
*/
router.put('/:email', async (req, res) => {
  try {
    await mongoDriver.user.editUser(req.body.user);
    return res.status(204).json({
      message: "Success"
    });
  } catch (e) {
    return res.status(500);
  }
});

/**
DELETE /user/:email
*@param {String} email req.param.email
*@return {Status} 204 {"message":"Success"}
*@return {Status} 403 Forbidden
*@return {Status} 500 Internal Server Error
*@memberof API
*/
router.delete('/:email', async (req, res) => {
  try {
    await mongoDriver.user.deleteUser(req.param.email);
    return res.status(204).json({
      message: "Success"
    });
  } catch (e) {
    return res.status(500);
  }
});


module.exports = router;