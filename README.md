Ticket System
=====

## Table of contents
* [GeneralInfo](#GeneralInfo)
* [Technologies](#Technologies)
* [Deployment](#Deployment)
* [Testing](#Testing)


## Generalinfo
Ticketing system where is possible to create, list, and finally auto assign tickets to online operators.

> Tickets are auto assigned to an operator when he is available on the operator page only.
> for an example, 2 operators are active on the operator page and a user create a first ticket and a second ticket. The tickets will be assigned based on FIFO

## Technologies
Project is created with:
* Node
* Mongo
* Rabbitmq
* socket.io
* Oauth
* JWT
	
## Deployment
The web app is deployed on Heroku using mLab and CloudAMQP

> **URL**  https://ticketsystemapp.herokuapp.com/

## Testing

```
$ npm test
```

