/**
 * Created by zhangxinwang on 09/08/2017.
 */
const JWT = require('jsonwebtoken');
const crypto = require('crypto');
const SECRET = 'jwt demo';
const bluebird = require('bluebird')


let token = JWT.sign({
  userId: 1,
  iat: Date.now(),
  expire: Date.now() + 24*60*60*1000
},SECRET);

console.log(token);

let decoded = JWT.verify(token, SECRET);

console.log(decoded);

let pbkdf2Async = bluebird.promisify(crypto.pbkdf2)

(async () => {
  return pbkdf2Async()
})()
  .then(r => {

  })
  .catch(e => {

  })
