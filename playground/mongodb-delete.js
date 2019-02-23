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

  // db.collection('Todos').deleteMany({text : 'Hardwork, Dedication.'}).then((result) => {
  //   console.log(result);
  // });

  // db.collection('Todos').deleteOne({text : 'Hardwork, Dedication.'}).then((result) => {
  //   console.log(result);
  // });

  // db.collection('Todos').findOneAndDelete({completed : true}).then((result) => {
  //   console.log(result);
  // });

  // db.collection('Users').deleteMany({name : 'Anshul' }).then((result) => {
  //   console.log(result);
  // });

  db.collection('Users').findOneAndDelete({_id : new ObjectID('5c6fd119312a9a07340c9b90')}).then(result => {
    console.log(result);
  });


  // client.close();
});
