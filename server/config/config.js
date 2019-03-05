var env = process.env.NODE_ENV || 'development';

//Note that these statements are only for local environments : 'development' and 'test'
//Heroku environment has PORT and MONGODB_URI set automatically, although we have to provide it with JWT_SECRET through command line
//heroku config//heroku config:set JWT_SECRET=erjg88902jmUBF8HUggHQUPQRrtd020//heroku config:get JWT_SECRET
if(env === 'development' || env === 'test'){
  var config = require('./config.json');
  //For referencing properties of an object, dot notation is replaced by [] notation when referencing a variable (env)
  //env is a variable -- it could take the value 'development' or 'test', and hence is under [] brackets.
  var envConfig = config[env];
  //The Object.keys() method returns an array of a given object's keys.
  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
}

// if(env === 'development'){
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApplication';
// }else if (env === 'test') {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/TodoApplicationTest';
// }
