require('./config/config.js');

const _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');
var {authenticate} = require('./middleware/authenticate.js');

var app = express();
const port = process.env.PORT;

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


app.delete('/todos/:id', (req,res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo : todo});
  }).catch((e) => res.status(400).send());
});

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var bod = _.pick(req.body, ['text', 'completed']);

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  if( _.isBoolean(bod.completed) && bod.completed){
    bod.completedAt = new Date().getTime();
  } else {
    bod.completed = false;
    bod.completedAt = null;
  }

//bod is an object with some of the attributes of the Todo collection.
// When we set {$set : bod}, that updates only the attributes contained in the bod object. Other attributes remain the same.
  Todo.findByIdAndUpdate(id, {$set : bod}, {new : true}).then((todo) => {

    if(!todo){
      return res.status(404).send();
    }
    res.send({todo : todo});

  }).catch((e) => res.status(400).send());

});

app.post('/users',(req, res) => {
  // console.log(req.body);
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    // console.log(jwt.verify(token , 'abc123'));
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

//Using the authenticate middleware for the GET /users/me route, by passing it as the second argument.
app.get('/users/me', authenticate ,(req, res) => {
  res.send(req.user);
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
