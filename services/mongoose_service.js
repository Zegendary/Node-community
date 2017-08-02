/**
 * Created by zhangxinwang on 02/08/2017.
 */
const mongoose = require('mongoose');
const uri = 'mongodb://localhost/node-community';
const bluebird = require('bluebird');

mongoose.Promise = bluebird.Promise;

mongoose.connect(uri, { useMongoClient: true });
const db = mongoose.connection;

db.once('open',function(){
  console.log('connoction created');

});

db.on('error',console.error.bind(console,'connect error:'));