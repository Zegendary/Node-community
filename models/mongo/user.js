/**
 * Created by zhangxinwang on 02/08/2017.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: { type: String, required: true},
  age: { type: Number, max: [90,'nobody could be older than 90 years old']}
});
UserSchema.index({name :1},{unique: true})
const UserModel = mongoose.model('user',UserSchema);

async function index(params = {page: 0, pageSize: 10}) {
  let flow = UserModel.find({})
  flow.skip(params.page * params.pageSize)
  flow.limit(params.pageSize)
  return await flow
    .catch(e => {
      console.log(e);
      throw new Error('error getting data in db')
    })
}

async function show(userId) {
  return await UserModel.findOne({_id: userId})
    .catch(e =>{
      console.log(e);
      throw new Error(`error in getting data by userId: ${userId}`)
    })
}

async function create(params){
  const user = new UserModel({name: params.name, age: params.age})
  await user.save()
    .then(r => {
      console.log(r);
    })
    .catch(e => {
      console.log(e);
      switch (e.code) {
        case 11000:
          throw new Error(`someone create this name,please change another one`)
          break
        default:
          throw new Error(`error in creating data`)
          break
      }
    })
  return user
};

async function update(userId,update) {
  return await UserModel.findOneAndUpdate({_id: userId},update,{new: true})
    .catch(e => {
      console.log(e);
      throw new Error(`error in updating data by id: ${userId}`)
    })
}

async function destroy(userId) {
  return await UserModel.findOneAndRemove({_id: userId})
    .catch(e => {
      console.log(e);
      throw new Error(`error in removing data by id: ${userId}`)
    })
}

module.exports = {
  model: UserModel,
  index,
  show,
  create,
  update,
  destroy
};