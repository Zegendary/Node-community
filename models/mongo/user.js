/**
 * Created by zhangxinwang on 02/08/2017.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const bluebird = require('bluebird')
const pbkdf2Async = bluebird.promisify(crypto.pbkdf2)
const {SALT,SECRET} = require('../../cipher')

const UserSchema = new Schema({
  name: { type: String, required: true},
  age: { type: Number, max: [90,'nobody could be older than 90 years old']},
  phoneNumber: { type: String},
  password: { type: String }
});

UserSchema.index({name: 1}, {unique: true});
UserSchema.index({name: 1, age: 1});
const DEFAULT_PROJECTION = {password: 0, phoneNumber: 0, __v: 0};

const UserModel = mongoose.model('user',UserSchema);

async function index(params = {page: 0, pageSize: 10}) {
  let flow = UserModel.find({})
  flow.skip(params.page * params.pageSize)
  flow.limit(params.pageSize)
  flow.select(DEFAULT_PROJECTION);
  return await flow
    .catch(e => {
      console.log(e);
      throw new Error('error getting data in db')
    })
}

async function show(userId) {
  return await UserModel.findOne({_id: userId})
    .select(DEFAULT_PROJECTION)
    .catch(e =>{
      console.log(e);
      throw new Error(`error in getting data by userId: ${userId}`)
    })
}

async function create(params){
  let user = new UserModel({
    name: params.name,
    age: params.age,
    phoneNumber: params.phoneNumber
  })
  user.password = await pbkdf2Async(params.password, SALT, 512, 128, 'sha1')
    .then(r => r.toString())
    .catch(e=>{
      console.log(e);
      throw Error('error generate password string')
    })

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
  return {
    _id: user._id,
    name: user.name,
    age: user.age
  }
};

async function update(userId,update) {
  return await UserModel.findOneAndUpdate({_id: userId},update,{new: true})
    .select(DEFAULT_PROJECTION)
    .catch(e => {
      console.log(e);
      throw new Error(`error in updating data by id: ${userId}`)
    })
}

async function destroy(userId) {
  return await UserModel.findOneAndRemove({_id: userId})
    .select(DEFAULT_PROJECTION)
    .catch(e => {
      console.log(e);
      throw new Error(`error in removing data by id: ${userId}`)
    })
}

async function login(phoneNumber, password) {
  const pwd = await pbkdf2Async(password, SALT, 512, 128, 'sha1')
    .then(r => {
      return r.toString();
    })
    .catch(e => {
      console.log(e);
      throw new Error('something goes wrong inside the server');
    });
  const user = await UserModel.findOne({phoneNumber: phoneNumber, password: pwd})
    .select(DEFAULT_PROJECTION)
    .catch(e => {
      throw new Error(`something wrong with the server`)
    });
  if (!user) throw new Error('No such user!');
  return user;
}

module.exports = {
  model: UserModel,
  index,
  show,
  create,
  update,
  destroy,
  login
};