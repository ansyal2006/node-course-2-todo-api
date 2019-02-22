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

  // db.collection('Todos').insertOne({
  //   text :'Something to do',
  //   completed : false
  // },(err, result) => {
  //   if(err){
  //     return console.log('Unable to insert todo.', err);
  //   }
  //
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });
  //
  // db.collection('Users').insertOne({
  //   name : 'Anshul',
  //   age : 24,
  //   location : 'Gurgaon'
  // }, (err, result) => {
  //   if(err){
  //     return console.log('Unable to insert the user.', err);
  //   }
  //
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  //   console.log(result.ops[0]);
  //   console.log(result.ops[0]._id);
  //   console.log(result.ops[0]._id.getTimestamp());
  // });


  client.close();
});
