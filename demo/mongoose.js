/**
 * Created by zhangxinwang on 31/07/2017.
 */

const mongoose = require('mongoose');
const uri = 'mongodb://localhost/zxw-zzz';
const bluebird = require('bluebird');

mongoose.Promise = bluebird.Promise;
// const db = mongoose.createConnection(uri);

mongoose.connect(uri, { useMongoClient: true })
const db = mongoose.connection
const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: { type: String, required: true, unique: true, enum:['zxw','laozhang','']},
  age: { type: Number, max: 90, min: [1, 'nobody could be younger than 1 years old']}
});

UserSchema.methods.sayYourName = function () {
  return this.name
}

UserSchema.statics.findByName = function (name) {
  return this.findOne({name:name})
}

const UserModel = mongoose.model('user',UserSchema);

(async ()=>{
  let found = await UserModel.findOne({}).then()

  console.log(found.sayYourName());
  return found
})().then(r => {
    console.log(r);
  }).catch(e => {
  console.log(e);
})

db.once('open',function(){
  console.log('connoction created');

  (async (params) => {
    // create 数据
    // let created = await UserModel.create({
    //   name: 'zxw',
    //   age: 25
    // }).then();
    // return created;

    //查找name
    // let found = await UserModel.findByName('zxw')
    // return found

    //存储校验
    // let user = new UserModel({name: 'zxw',age: 0})
    // await user.save()

    //工厂模式
    let flow = UserModel.find({})
    flow.where('age').lt(90)
    flow.select({name: 1})
    flow.skip(0)
    if (params.sort) flow.sort(params.sort)
    let r = flow.then()

    return r
  })()
    .then(r => {
      console.log(r);
    })
    .catch(e => {
      console.log(e);
    });
});



db.on('error',console.error.bind(console,'connect error:'));