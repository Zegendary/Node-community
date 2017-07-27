var express = require('express');
var router = express.Router();
const User = require('../models/in_memo/User')

/* GET users listing. */
router.route('/')
  .get((req, res, next) => {
    (async () => {
      let users = await User.index()
      return {
        code: 0,
        users
      }
    })().then(r =>{
      res.json(r)
    }).catch(e => {
      next(e)
    })
  })
  .post((req, res, next) => {
    (async () => {
      let user = await User.create({
        name: req.body.name,
        age: req.body.age
      })
      return {
        user
      }
    })().then(r =>{
      res.json(r)
    }).catch(e => {
      next(e)
    })
  })

router.route('/:id')
  .get((req, res, next) => {
    (async () => {
      let user = await User.show(req.params.id)
      return {
        code: 0,
        user
      }
    })().then(r =>{
      res.json(r)
    }).catch(e => {
      next(e)
    })
  })
  .patch((req, res, next) => {
    (async () => {
      let user = await User.update(req.params.id,{
        name: req.body.name,
        age: req.body.age
      })
      return {
        code: 0,
        user
      }
    })().then(r =>{
      res.json(r)
    }).catch(e => {
      next(e)
    })
  })
  .delete((req, res, next) => {
    (async () => {
      let message = await User.destroy(req.params.id)
      return {
        code: 0,
        message
      }
    })().then(r =>{
      res.json(r)
    }).catch(e => {
      next(e)
    })
  })



module.exports = router;
