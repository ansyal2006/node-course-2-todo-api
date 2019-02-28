const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
  email : {
    type : String,
    required : true,
    minlength : 1,
    trim : true,
    unique: true,
    //the 'validate' KEY takes a custom validator function as VALUE,which forms a KEY-VALUE pair for the 'email' object definition.
    validate: {
      validator: (value) => {
        return validator.isEmail(value);
      },
      message : '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required : true
    },
    token: {
      type: String,
      required : true
    }
  }]

});

//This is a method which already existed, but is now overridden.
UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

//This is a user-defined custom method.
UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';

  //note that this user is already saved in the Users collection,
  // and hence has a valid _id which is used below for generating the token.
  var token = jwt.sign({ _id : user._id.toHexString(), access}, 'abc123').toString();

  user.tokens = user.tokens.concat([{access , token}]);
  //newly updated tokens[] attribute for this particular user is saved in the Users collection.
  // This user already existed in the Users collection, and had the version value "__v" : 0,
  // now it's next saved version is "__v" : 1
  return user.save().then(() => {
    return token;
  });
};

var User = mongoose.model('User', UserSchema );

module.exports = {User};
