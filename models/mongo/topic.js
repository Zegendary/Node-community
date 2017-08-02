/**
 * Created by zhangxinwang on 02/08/2017.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReplySchema = new Schema({
  creator: Schema.Types.ObjectId,
  content: String,
  date: { type: Date, default: Date.now }
});

const TopicSchema = new Schema({
  creator: {type: String, required: true},
  title: { type: String, required: true},
  content: String,
  date: { type: Date, default: Date.now },
  replyLists: [ReplySchema]
});

TopicSchema.index({title :1},{unique: true});
const TopicModel = mongoose.model('topic',TopicSchema);

async function index(params = {page: 0, pageSize: 10}) {
  let flow = TopicModel.find({})
  flow.skip(params.page * params.pageSize)
  flow.limit(params.pageSize)
  return await flow
    .catch(e => {
      console.log(e);
      throw new Error('error getting data in db')
    })
}

async function show(topicId) {
  return await TopicModel.findOne({_id: topicId})
    .catch(e =>{
      console.log(e);
      throw new Error(`error in getting data by topicId: ${topicId}`)
    })
}

async function create(params){
  const topic = new TopicModel({
    creator: params.creator,
    title: params.title,
    content: params.content
  })
  await topic.save()
    .then(r => {
      console.log(r);
    })
    .catch(e => {
      console.log(e);
      throw new Error(`Error in create topic with ${params}`)
    })
  return topic
};

async function update(topicId,update) {
  return await TopicModel.findOneAndUpdate({_id: topicId},update,{new: true})
    .catch(e => {
      console.log(e);
      throw new Error(`error in updating data by topicId: ${topicId}`)
    })
}

async function destroy(topicId) {
  return await TopicModel.findOneAndRemove({_id: topicId})
    .catch(e => {
      console.log(e);
      throw new Error(`error in removing data by topicId: ${topicId}`)
    })
}

async function reply(params) {
  return await TopicModel.findOneAndUpdate(
    {_id: params.topicId},
    {$push: {replyLists: {creator: params.creator, content: params.content}}},
    {new: true})
    .catch(e => {
      console.log(e)
      throw new Error(`error replying topic ${JSON.stringify(params)}`)
    })
}

module.exports = {
  model: TopicModel,
  index,
  show,
  create,
  update,
  destroy,
  reply
};