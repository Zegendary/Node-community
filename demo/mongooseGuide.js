/**
 * Created by zhangxinwang on 01/08/2017.
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('created');
});

var kittySchema = mongoose.Schema({
  name: String
});


kittySchema.methods.speak = function () {
  var greeting = this.name
    ? 'Meow name is ' + this.name
    : 'I don\'t have a name';
  console.log(greeting);
};
var Kitten = mongoose.model('Kitten', kittySchema);

var fluffy = new Kitten({ name: 'fluffy' });
fluffy.speak();
var silence = new Kitten({ name: 'Silence' });

console.log(silence);
fluffy.save(function (err, fluffy) {
  if (err) return console.error(err);
  fluffy.speak();
});