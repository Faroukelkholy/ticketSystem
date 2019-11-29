const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
const moment = require("moment");
var ObjectID = require("mongodb").ObjectID;

const ticket_Schema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  status: { //    Open || inProgress || Assigned || Resolved || Closed 
    type: String,
    default: "Open"
  },
  author: {
    name: String,
    email: String,
    mobile: String
  },
  assignee: {
    name: String,
    email: String,
    mobile: String,
    assigned_date: Date
  },
  ts: Date
});

ticket_Schema.statics.saveTicket = function saveTicket(ticket, author) {
  const ticketCreated = new this(ticket);
  const currentDate = moment(new Date()).format('D MMM YYYY,h:mm:ss a');
  ticketCreated.ts = currentDate;
  ticketCreated.author = author;
  const ticketToUpsert = ticketCreated.toObject();
  delete ticketToUpsert._id;
  const options = {
    upsert: true
  };
  return this.updateOne({
      "author.email": author.email,
      "description": ticket.description
    }, {
      $setOnInsert: ticketToUpsert
    },
    options);
};



ticket_Schema.statics.getTickets = function getTickets() {
  return this.find({}).sort({
    "_id": -1
  });
};

ticket_Schema.statics.getTicket = function getTicket(id) {
  console.log('typeof id:',typeof id);
  // ObjectID(id)
  return this.find({
    _id: id 
  });
};


ticket_Schema.statics.editTicket = function editTicket(ticket, assignee) {
  const currentDate = moment(new Date()).format('D MMM YYYY,h:mm:ss a');
  assignee.assigned_date = currentDate;
  const id = ticket._id;
  delete ticket._id;
  return this.updateOne({
    _id: id
  }, {
    $set: {
      status: ticket.status,
      assignee: assignee
    }
  });
};

ticket_Schema.statics.deleteTicket = function deleteTicket(id) {
  return this.deleteOne({
    _id: id
  });
};

ticket_Schema.statics.statistics = function statistics() {
  return this.aggregate([{
      $project: {
        ticket: 1,
        Open: {
          $cond: [{
            $eq: ["$status", "Open"]
          }, 1, 0]
        },
        inProgress: {
          $cond: [{
            $eq: ["$status", "inProgress"]
          }, 1, 0]
        },
        Assigned: {
          $cond: [{
            $eq: ["$status", "Assigned"]
          }, 1, 0]
        },
        Resolved: {
          $cond: [{
            $eq: ["$status", "Resolved"]
          }, 1, 0]
        },
        Closed: {
          $cond: [{
            $eq: ["$status", "Closed"]
          }, 1, 0]
        }
      }
    },
    {
      $group: {
        _id: "$ticket",
        countOpen: {
          $sum: "$Open"
        },
        countInProgress: {
          $sum: "$inProgress"
        },
        countAssigned: {
          $sum: "$Assigned"
        },
        countResolved: {
          $sum: "$Resolved"
        },
        countClosed: {
          $sum: "$Closed"
        }
      }
    }
  ]);
}



module.exports = ticket_Schema;