const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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
//toJSON method is used to modify what is sent in the res.send() command. The database saves all the attributes in the collection,
// while the res.send() command responds with only the (_id and email) of the user. All other attributes are hidden.
UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

//This is a user-defined custom method.
//(schema.methods) makes instance methods, that operate over a document/instance of the collection.
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

//(schema.statics) makes model methods, that operate over the collection/model as a whole.
UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token , 'abc123');
  } catch(e) {
    return Promise.reject();
  }

  return User.findOne({
    _id : decoded._id,
    'tokens.token' : token,
    'tokens.access' : decoded.access
  });

};

//Using mongoose middleware, which acts very similar to the express middleware,
// we modify the user document before it is saved to the database.We hash the password and save the hashedPassword in the database.
UserSchema.pre('save', function (next) {
  var user = this;

  if(user.isModified('password')){
    bcrypt.genSalt(10, (err, salt) =>{
      bcrypt.hash(user.password, salt, (err, hash) => {
        hashedPassword = hash;
        // console.log(hashedPassword);
        user.password = hashedPassword;
        next();
      });
    });
  }  else {
    next();
  }

});


var User = mongoose.model('User', UserSchema );

module.exports = {User};
