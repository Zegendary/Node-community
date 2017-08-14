const express = require('express');
const router = express.Router();
const User   = require('../models/mongo/user');
const {SECRET} = require('../cipher')
const JWT = require('jsonwebtoken')

/* GET home page. */

router.route('/')
  .get((req, res, next) => {
    res.send('trying to get user list');
  })
  .post((req, res, next) => {
    res.send({msg: 'sss'});
  });

router.route('/login')
  .post((req, res, next) => {
    (async () => {
      const user  = await User.login(req.body.phoneNumber, req.body.password);
      const token = JWT.sign({
        _id: user._id,
        iat: Date.now(),
        expire: Date.now() + 1000 * 60 * 24 * 10
      }, SECRET);
      return {
        code: 0,
        data: {user: user, token: token}
      }
    })()
      .then(r => {
        res.json(r);
      })
      .catch(e => {
        next(e);
      })
  });
module.exports = router;