const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const ticketsRouter = require('./routes/tickets');
const statisticsRouter = require('./routes/statistics');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
app.use(express.static(path.join(__dirname, '/dist/ticketSystemFront')));

app.get('/*',(req,res)=>{ res.sendFile(path.join(__dirname))});

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/tickets', ticketsRouter);
app.use('/statistics', statisticsRouter);



module.exports = app;