Ticket System
=====

## Table of contents
* [Generalinfo](#Generalinfo)
* [Technologies](#Technologies)
* [Deployment](#Deployment)
* [UseCases](#UseCases)
* [Testing](#Testing)


## Generalinfo
This project is a simple Ticket system which should create, list, and assign tickets.

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

