var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');

var app = express();
const port = process.env.PORT || 3000;

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

app.get('/todos', (req,res) => {

  Todo.find().then((todos) => {
    res.send({todos : todos});
  }, (e) => res.status(400));
});

app.get('/todos/:id' , (req,res) => {

  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo : todo});
  }).catch((e) => res.status(400).send());

});

app.listen(port, () => {
  console.log(`Started on port ${port}.`);
});

module.exports = { app };
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
