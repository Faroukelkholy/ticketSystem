const MongoDriver = require('./mongoDriver.js');
const settings = require("../settings.js");
const moment = require("moment");
const mongoDriver = new MongoDriver(settings.mongo);
mongoDriver.onConnection().then(() => {
    init();
});
const admin = {
    "name": "Eman Sleem",
    "email": "esleem@gmail.com",
    "mobile": "01111111111"
};

const users = [{
        "email": "samir@gmail.com",
        "firstname": "Samir",
        "lastname": "Hady",
        "type":"operator",
        "password": "e10adc3949ba59abbe56e057f20f883e",
        "gender": "male",
        "dob": "1992-08-13",
        "mobile": "01111011111",
        "address": "5 nozha",
        "permissions": ["ticket.read", "ticket.update"]
    }, {
        "email": "mariham@gmail.com",
        "firstname": "mariham",
        "lastname": "mike",
        "type":"user",
        "password": "e10adc3949ba59abbe56e057f20f883e",
        "gender": "female",
        "dob": "1992-05-15",
        "mobile": "01111111111",
        "address": "10 marghani",
        "permissions": ["ticket.write","ticket.read", "ticket.update"]
    }, {
        "email": "karim@gmail.com",
        "firstname": "karim",
        "lastname": "hamdi",
        "type":"operator",
        "password": "e10adc3949ba59abbe56e057f20f883e",
        "gender": "male",
        "dob": "1992-08-13",
        "mobile": "01111011111",
        "address": "6 horeya",
        "permissions": ["ticket.read", "ticket.update"]
    },
    {
        "email": "esleem@gmail.com",
        "firstname": "Eman",
        "lastname": "Sleem",
        "type":"admin",
        "password": "e10adc3949ba59abbe56e057f20f883e",
        "gender": "female",
        "dob": "1990-10-15",
        "mobile": "01111011111",
        "address": "3 mokhtar alGuindy",
        "permissions": ["user.write","user.read","user.update","user.delete","operator.write","operator.read","operator.update","operator.delete","ticket.read"]
    }
];
const currentDate = moment(new Date()).format('D MMM YYYY,h:mm:ss a');
const author = {name:"ahmed samir",email:"ahmed@gmail.com", mobile:"01111011111"};
const assignee = {name:"karim hamdi",email:"karim@gmail.com", mobile:"01111011111",assigned_date:currentDate};

const tickets = [{
        title: 'System performance',
        description: 'There a latency in retrieving tickets',
        author: author,
        assigned_to:assignee
    },
    {
        title: 'System Error',
        description: 'There a huge bug in the system',
        status: "Open",
        author: author
    }
];

function init() {
    for (let i in tickets) {
        mongoDriver.ticket.saveTicket(tickets[i]).then(() => {});
    }

    for (let i in users) {
        mongoDriver.user.saveUser(users[i], admin).then(() => {
            if ((parseInt(i) + 1) === users.length) {
                console.log('mongo will disconnect');
                mongoDriver.disconnect();
            }
        });

    }

}