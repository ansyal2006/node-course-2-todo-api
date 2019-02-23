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

//$set is one of the many update operations for findOneAndUpdate function. Search google for more.
  // db.collection('Todos').findOneAndUpdate({_id : new ObjectID('5c6fbf78665fd82684b7400e')},{
  //   $set : {completed : true}
  // },{ returnOriginal : false}).then(result => {
  //   console.log(result);
  // });

  db.collection('Users').findOneAndUpdate({name : 'McGregor'},{
    $set : {location : 'Dublin, Ireland'},
    $inc : {age : 1}
  },{returnOriginal : false}).then((result) => {
    console.log(result);
  });

  // client.close();
});
