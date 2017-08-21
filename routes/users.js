var express = require('express');
var router = express.Router();
const User = require('../models/mongo/user')
const auth = require('../middlewares/auth_user');
const multer = require('multer')
const path = require('path')
const upload = multer({dest: path.join(__dirname, '../public/upload')})
const HOST = process.env.NODE_ENV === 'production' ? 'http://some.host/': 'http://localhost:8082'

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
        age: req.body.age,
        password: req.body.password,
        phoneNumber: req.body.phone
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
  .patch(auth(),upload.single('avatar'),(req, res, next) => {
    (async () => {
      let update = {}
      if (req.body.name) update.name = req.body.name
      if (req.body.age) update.age = req.body.age
      update.avatar = `/upload/${req.file.filename}`
      let user = await User.update(req.params.id,update)
      user.avatar = `${HOST}${user.avatar}`
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
  .delete(auth(),(req, res, next) => {
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
