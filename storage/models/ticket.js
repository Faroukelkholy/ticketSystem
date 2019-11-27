const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

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
  assigned_to: {
    name: String,
    email: String,
    mobile: String,
    assigned_date:Date
  },
});

ticket_Schema.statics.saveTicket = function saveTicket(ticket) {
  const ticketCreated = new this(ticket);
  const ticketToUpsert = ticketCreated.toObject();
  delete ticketToUpsert._id;
  const options = {
    upsert: true
  };
  return this.updateOne({
      "author.email": ticket.author.email,
      "description": ticket.description
    }, {
      $setOnInsert: ticketToUpsert
    },
    options);
};



ticket_Schema.statics.getTickets = function getTickets() {
  return this.find({
  }).sort({
    "_id": -1
  });
};

ticket_Schema.statics.getTicket = function getTicket(_id) {
  return this.find({
    _id: _id
  });
};


ticket_Schema.statics.editTicket = function editTicket(ticket) {
  const _id = ticket.ticket_id
  delete ticket.ticket_id;
  return this.updateOne({
    _id: _id
  }, {
    $set: ticket
  });
};

ticket_Schema.statics.deleteTicket = function deleteTicket(ticket) {
  const _id = ticket.ticket_id
  return this.deleteOne({
    _id: _id
  });
};



module.exports = ticket_Schema;