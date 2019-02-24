var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApplication', { useNewUrlParser: true } );

module.exports = {
  mongoose
};
