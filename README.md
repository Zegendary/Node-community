# Hello Mongoose

#### Guide

```javascript
//链接服务器
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test');

//监听mongoose接口
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('created');
});

// 定义SChema类型
var kittySchema = mongoose.Schema({
  name: String
});

// NOTE: methods must be added to the schema before compiling it with mongoose.model()
kittySchema.methods.speak = function () {
  var greeting = this.name
    ? 'Meow name is ' + this.name
    : 'I don\'t have a name';
  console.log(greeting);
};
var Kitten = mongoose.model('Kitten', kittySchema);

var fluffy = new Kitten({ name: 'fluffy' });
fluffy.speak();
var silence = new Kitten({ name: 'Silence' });

console.log(silence);
//储存数据
fluffy.save(function (err, fluffy) {
  if (err) return console.error(err);
  fluffy.speak();
});
```

#### Schmal数据校验

```
{
    name:{
        type: String,
        required: true
    }, //存储之前会验证
    age:{
        type:Number,
        min:1,
        max:[12, 'Growned are not welcome!'],
    },
    address:[new Schema({
      city:String,
      province:String,
    })]
}
```

#### 查询（流）

```
const query = Model.find({name:{$regex:"a"}});
query.where('age').lte(2);
query.limit({age:1});
query.sort('-age');

const result = await query.then();
```

#### MongoDB 常用命令行

```
#查看所有数据库
> show dbs 
local    0.078125GB
test    0.203125GB
users    0.203125GB

#选择数据库
> use test 
switched to db test

#查看所有集合(表)
> show tables 
system.indexes
user1
user3

#排序
>db.user3.find().sort({name:1}) #1正序 -1倒序

#根据索引或字段查找数据
> db.user3.find({name:"lichuang"}) 

#查询所有数据
> db.user3.find() 

#查询一条数据
> db.user3.findOne();

#更新数据
> db.user3.update({name:"lichuang"},{$set:{name:"lifei"}})

#更新多条数据，第三个参数设置为false，第四个参数为ture
> db.user3.update({name:"lichuang"},{$set:{name:"lifei"}},false,true)

#更新数据不存在自动创建，第三个参数设置为true
> db.user3.update({name:"lichuang"},{$set:{name:"lifei"}},true)

#删除数据
>db.user3.remove({name:"lichuang"})

#删除集合
> db.users.drop()

#添加数据，如果user3集合不存在，自动创建
1.> db.user3.insert({time:new Date()});
2.> db.user3.save({name:"lichuang"});

#查看集合索引，添加数据的同时自动创建一个_id的索引
> db.user3.getIndexes()

#删除索引
> db.user3.dropIndex("name_1")

#单键索引
> db.user3.ensureIndex({title:1})
> db.user3.ensureIndex({titile:1},{name:"indexname"})#第二个属性设置索引名称
> db.user3.ensureIndex({titile:1},{unique:true/false})#第二个属性设置为true说明该字段中值不能重复，false可以重复

#复合索引
> db.user3.ensureIndex({name:1,age:1}) #多个值

#多键索引
> db.user3.insert({name:["lili","wangwu"]}) #为数组

#过期索引，字段的值必须为指定的时间类型必须是ISODate或ISODate数组否则不能被删除，expireAfterSeconds设置过期时间单位 秒
> db.user3.ensureIndex({time:1},{expireAfterSeconds:10})

#全文索引，指定为text类型,每个数据集合中只允许创建一个全文索引
> db.user3.insert({"article","text"})

作者：李大闯
链接：http://www.jianshu.com/p/e34489d0c7c7
來源：简书
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```