const {Todo} = require('./../../models/todo.js');
const {User} = require('./../../models/user.js');

const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');


const newid1 = new ObjectID();
const newid2 = new ObjectID();
const users = [
  {
    _id : newid1,
    email : 'ans1@gmail.com',
    password : 'qwerty11',
    tokens : [{
      access : 'auth',
      token : jwt.sign({ _id : newid1.toHexString(), access : 'auth'}, 'abc123').toString()
     }]
  },
  {
    _id : newid2,
    email : 'ans2@gmail.com',
    password : 'qwerty22'
  }
];


const todos = [
  {
    _id : new ObjectID(),
    text : 'First todo'
  } ,
  {
    _id : new ObjectID(),
    text : 'Second todo',
    completed : true,
    completedAt : 333
  }
];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    //insertMany function adds elements of an array to a collection and returns a promise on which another then() call is made.
    //insertMany function does not trigger save middleware.
    return Todo.insertMany(todos);
  }).then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    //the password is hashed pre-save through a middleware written before. The saved document(with hashed password) is stored in userOne & userTwo.
    //note that save() is an asynchronous function. Hence, it returns a Promise.
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();
    //ensures that both promises are executed before the then() call.
    return Promise.all([userOne , userTwo]);
  }).then(() => done());
};




module.exports = { todos, populateTodos , users, populateUsers };
