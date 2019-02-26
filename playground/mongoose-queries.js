const {ObjectID} = require('mongodb');

var {mongoose} = require('./../server/db/mongoose.js');
var {Todo} = require('./../server/models/todo.js');
var {User} = require('./../server/models/user.js');

// const id = '5c74ef361392554594b7a1a0';
//
// if(!ObjectID.isValid(id)){
//   console.log('ID is not valid!');
// }

// Todo.find({_id : id}).then((todos) => {
//   console.log(todos);
// });
//
// Todo.findOne({_id : id}).then((todo) => {
//   console.log(todo);
// });

// Todo.findById(id).then((todo) => {
//   if(!todo){
//     return console.log('ID not found.');
//   }
//   console.log(todo);
// }).catch((e) => console.log(e));

const user_id = '5c71adbdff32603afc3dcf9a';

User.findById(user_id).then((todo) => {
  if(!todo){
    return console.log('User ID not found.');
  }
  console.log(todo);
}).catch((e) => console.log(e));
