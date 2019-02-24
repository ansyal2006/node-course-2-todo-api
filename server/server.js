var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');

var app = express();

//this is a middleware which will be used for every request made.
app.use(bodyParser.json());
// body-parser parsed your incoming request, assembled the chunks containing your form data,
// then created this body object for you and filled it with your form data.
app.post('/todos',(req, res) => {
  console.log(req.body);
  var todo = new Todo({text : req.body.text});

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.listen(3000, () => {
  console.log('Started on port 3000.');
});

// var newUser = new User({email : '    ansyal2006@gmail.com  '});
//
// newUser.save().then((doc) => {
//   console.log('Saved the user', doc);
// }, (err) => {
//   console.log('Unable to save the user', err);
// });

// var newTodo = new Todo({text : 'Hardwork, Dedication.'});

// newTodo.save().then((doc) => {
//   console.log('Saved Todo.', doc);
// }, (err) => {
//   console.log('Unable to save Todo.',err);
// });

// var newTodo1 = new Todo({text : 'Hardwork, Dedication.', completed : true, completedAt : 1234});

// var newTodo2 = new Todo({text : '   Hardwork, Dedication.    '});
//
// newTodo2.save().then((doc) => {
//   console.log('Saved Todo.', doc);
// },(err) =>{
//   console.log('Unable to save Todo.', err);
// });
