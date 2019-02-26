const {ObjectID} = require('mongodb');

var {mongoose} = require('./../server/db/mongoose.js');
var {Todo} = require('./../server/models/todo.js');
var {User} = require('./../server/models/user.js');

// Todo.remove({}).then((result) => {
//   console.log(result);
// });

// Todo.findOneAndRemove({_id : '5c7542457e1ab30dc0bfbd7a'}).then((todo) => {
//   console.log(todo);
// });
//

Todo.findByIdAndRemove('5c754114686d9d0200d6271e').then((todo) => {
  console.log(todo);
});
