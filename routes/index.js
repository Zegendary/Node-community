const express = require('express');
const router = express.Router();

/* GET home page. */

router.route('/')
  .get((req, res, next) => {
    res.send('trying to get user list');
  })
  .post((req, res, next) => {
    res.send({msg: 'sss'});
  });

module.exports = router;