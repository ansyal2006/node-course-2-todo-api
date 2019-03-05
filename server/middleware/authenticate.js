var {User} = require('./../models/user.js')

//Creating a middleware for easy access. Note that a middleware has access to (request, response and next middleware) in the app.
//authenticate middleware helps us to make certain routes private.
var authenticate = (req, res, next) => {
    var token = req.header('x-auth');
    User.findByToken(token).then((user) => {
      if(!user){
          return Promise.reject();
      }

      req.user = user;
      req.token = token;
      // console.log(req);
      next();
    }).catch((e) => {
      res.status(401).send();
    });
};

module.exports = { authenticate };
