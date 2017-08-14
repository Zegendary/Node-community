/**
 * Created by zhangxinwang on 14/08/2017.
 */

const JWT = require('jsonwebtoken');
const {SECRET} = require('../cipher');

module.exports = function(options) {
  return function(req, res, next) {
    try {
      if (!req.get('Authorization')) throw new Error('No auth!');
      let auth = req.get('Authorization').split(' ');
      if (!auth || auth.length < 2){
        next(new Error('No auth'));
        return;
      }
      const token = auth[1];
      const obj = JWT.verify(token, SECRET);
      if (!obj || !obj._id || !obj.expire) throw new Error('No auth!');
      if (Date.now() - obj.expire > 0) throw new Error('Token Expired!');
      next();
    } catch(err) {
      err.status = 401;
      next(err);
    }
  };
};