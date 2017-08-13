var express = require('express');
var router = express.Router();
const User = require('../models/mongo/user');
const Topic = require('../models/mongo/Topic');

/* GET topics listing. */
router.route('/')
  .get((req, res, next) => {
    (async () => {
      let topics = await Topic.index()
      return {
        code: 0,
        topics
      }
    })().then(r =>{
      res.json(r)
    }).catch(e => {
      next(e)
    })
  })
  .post((req, res, next) => {
    (async () => {
      const user = await User.show(req.body.userId)
      let topic = await Topic.create({
        creator: user,
        title: req.body.title,
        content: req.body.content
      })
      return {
        code: 0,
        topic
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
      let topic = await Topic.show(req.params.id)
      return {
        code: 0,
        topic
      }
    })().then(r =>{
      res.json(r)
    }).catch(e => {
      next(e)
    })
  })
  .patch((req, res, next) => {
    (async () => {
      let update = {}
      if (req.body.title) update.title = req.body.title
      if (req.body.content) update.content = req.body.content
      let topic = await Topic.update(req.params.id,update)
      return {
        topic
      }
    })().then(r =>{
      res.json(r)
    }).catch(e => {
      next(e)
    })
  })
  .delete((req, res, next) => {
    (async () => {
      let message = await Topic.destroy(req.params.id)
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
router.route('/:id/reply')
  .post((req, res, next) => {
    (async () => {
      const user = await User.show(req.body.userId)
      let topic = await Topic.reply({
        topicId: req.params.id,
        creator: user,
        content: req.body.content
      })
      return {
        code: 0,
        topic
      }
    })().then(r =>{
      res.json(r)
    }).catch(e => {
      next(e)
    })
  })



module.exports = router;
