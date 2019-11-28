const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const statisticsRouter = require('./routes/statistics');
const usersRouter = require('./routes/users');
const ticketsRouter = require('./routes/tickets');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/tickets', ticketsRouter);
app.use('/statistics', statisticsRouter);



module.exports = app;
