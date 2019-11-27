const mongoose = require("mongoose");
const crypto = require("crypto");
const Schema = mongoose.Schema;

const userSchema = Schema({
  firstname: {
    type: String,
    lowercase: true
  },
  lastname: {
    type: String,
    lowercase: true
  },
  name: {
    type: String,
    lowercase: true
  },
  type: String, // admin || operator || user
  email: String,
  password: {
    type: String,
    required: true
  },
  mobile: String,
  gender: String,
  dob: String,
  address: String,
  permissions: {
    type: Schema.Types.Mixed,
    default: []
  },
  addedBy: {
    name: String,
    email: String,
    mobile: String
  }
});

userSchema.statics.authenticateUser = function authenticateUser(user) {
  const password = crypto.createHash("md5").update(user.password).digest("hex");
  return this.findOne({
    email: user.email.toLowerCase(),
    password: password
  }, {
    _id: 0,
    password: 0,
    firstname: 0,
    lastname: 0,
    dob: 0,
    addedBy: 0
  });
};

userSchema.statics.saveUser = function saveUser(user, admin) {
  const userCreated = new this(user);
  userCreated.name = user.firstname + " " + user.lastname;
  const userToUpsert = userCreated.toObject();
  delete userToUpsert._id;
  const options = {
    upsert: true
  };
  return this.updateOne({
      email: user.email
    }, {
      $setOnInsert: userToUpsert,
      $push: {
        "addedBy": admin
      }
    },
    options);
};

userSchema.statics.getUsers = function getUsers() {
  return this.find({}, {
    _id: 0,
    password: 0,
    addedBy: 0
  });
};

userSchema.statics.findUser = function findUser(user) {
  return this.find({
    email: user.email
  });
};

userSchema.statics.editUser = function editUser(user) {
  return this.updateOne({
    email: user.email
  }, {
    $set: {
      mobile: user.mobile,
      address: user.address,
      gender: user.gender,
      dob: user.dob
    }
  });
};

userSchema.statics.deleteUser = function deleteUser(email) {
  return this.deleteOne({
    email: email
  });
};


userSchema.statics.checkCurrentPassword = function checkCurrentPassword(email, password) {
  const hashedPassword = crypto.createHash("md5").update(password).digest("hex");
  return this.findOne({
    email: email,
    password: hashedPassword
  }, {
    _id: 0,
    password: 1
  });
};

userSchema.statics.changePassword = function changePassword(email, password) {
  const hashedPassword = crypto.createHash("md5").update(password).digest("hex");
  return this.updateOne({
    email: email
  }, {
    $set: {
      password: hashedPassword
    }
  })
}


userSchema.index({
  emails: 1
}, {
  unique: true
});

module.exports = userSchema;