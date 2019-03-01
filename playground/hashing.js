const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


var password = '123abc!';

//bcrypt.genSalt is an asynchronous function, hence it has a callback function as its last argument.
 // Same is the case with bcrypt.hash function and bcrypt.compare function.
bcrypt.genSalt(10, (err, salt) =>{
  bcrypt.hash(password, salt, (err, hash) => {
    hashedPassword = hash;
    console.log(hashedPassword);
    bcrypt.compare(password, hashedPassword, (err, res) => {
      console.log(res);
    });
  });
});

// //We can also handle bcrypt functions through then() calls as they are all callback functions.
bcrypt.genSalt(10)
.then((salt) => {
  return bcrypt.hash(password, salt);
})
.then((hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
})
.then((res) => console.log(res)).catch((e) => console.log(e));


// var data = {
//   id : 10
// };
//
// var token = jwt.sign(data, '123abc');
// console.log(token);
//
// var decoded = jwt.verify(token, '123abc');
// console.log(decoded);
//
//
//

// var message = 'I am user number 3';
// var hash = SHA256(message).toString();
//
// console.log(message);
// console.log(hash);
//
// //This is the token prvided by the server to the client.
// var data = {
//   id : 4
// };
// var token = {
//   data,
//   hash : SHA256(JSON.stringify(data) + 'secretstring').toString()
// };
//
//
// //Middle man (user with id : 4) tries to manipulate other users' data (user with id : 5) like this
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'secretstring').toString()
//
// if(resultHash === token.hash){
//   console.log('Data was not manipulated.');
// }else {
//   console.log('Data was manipulated. Do not trust.');
// }
