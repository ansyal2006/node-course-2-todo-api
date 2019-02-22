// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
  if(err){
    return console.log('Unable to connect to MongoDB server.');
  }
  console.log('Connected to MongoDB server.');
  const db = client.db('TodoApp');

//This is a promise(asynchronous func), therefore, a then() call is made on the promise.
//Note that the find() function below returns a CURSOR on which different useful methods such as toArray() and count() are applied.
  db.collection('Todos').find({ _id : new ObjectID('5c6fdfb8a8d65ba5fc7f11f9')}).toArray().then((docs11) => {
      console.log('Todos');
      console.log(JSON.stringify(docs11, undefined, 2));
  },(err) => {
    console.log('Unable to fetch Todos', err);
  });

  db.collection('Todos').find().count().then((cnt) =>{
    console.log(`Todos count : ${cnt}`);
  },(err) => {
    console.log('Unable to fetch todos.', err);
  });

  db.collection('Users').find({name : 'Anshul'}).toArray().then((docs) => {
    console.log('Users');
    console.log(JSON.stringify(docs, undefined, 2));
  },(err) => {
    console.log('No such user found.', err);
  });

  // client.close();
});
