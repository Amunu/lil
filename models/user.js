var mongodb = require('./db');

function User(user) {
    this.name = user.name;
    this.password = user.password;
    this.id = user.id;
    this.num = user.num;
    this.class = user.class;
    this.lphone = user.lphone;
    this.sphone = user.sphone;
}

module.exports = User;

User.prototype.save = function save(callback) {
    var user = {
        name: this.name,
        password: this.password,
        id: this.id,
        num: this.num,
        class: this.class,
        lphone: this.lphone,
        sphone: this.sphone
    };
    console.log(user);
    mongodb.open(function (err, db) {
        if(err) {
            return callback(err);
        }

        db.collection('users', function (err, collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }

            collection.ensureIndex('name', {unique: true});
            collection.insert(user, {safe: true}, function (err, user) {
                mongodb.close();
                callback(err, user);
            });
        });
    });
};

User.get = function get(username, callback) {
    mongodb.open(function (err, db) {
        if(err){
            return callback(err);
        }

        db.collection('users', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }

            collection.findOne({name: username}, function (err, doc) {
                mongodb.close();
                if(doc) {
                    var user = new User(doc);
                    callback(err, user);
                } else{
                    callback(err, null);
                }
            });
        });
    });
};
// update()命令

// db.collection.update( criteria, objNew, upsert, multi )

// criteria : update的查询条件，类似sql update查询内where后面的
// objNew   : update的对象和一些更新的操作符（如$,$inc...）等，也可以理解为sql update查询内set后面的
// upsert   : 这个参数的意思是，如果不存在update的记录，是否插入objNew,true为插入，默认是false，不插入。
// multi    : mongodb默认是false,只更新找到的第一条记录，如果这个参数为true,就把按条件查出来多条记录全部更新。

// 例：
// db.test0.update( { "count" : { $gt : 1 } } , { $set : { "test2" : "OK"} } ); 只更新了第一条记录
// db.test0.update( { "count" : { $gt : 3 } } , { $set : { "test2" : "OK"} },false,true ); 全更新了
// db.test0.update( { "count" : { $gt : 4 } } , { $set : { "test5" : "OK"} },true,false ); 只加进去了第一条
// db.test0.update( { "count" : { $gt : 5 } } , { $set : { "test5" : "OK"} },true,true ); 全加进去了
// db.test0.update( { "count" : { $gt : 15 } } , { $inc : { "count" : 1} },false,true );全更新了
// db.test0.update( { "count" : { $gt : 10 } } , { $inc : { "count" : 1} },false,false );只更新了第一条

User.update = function update(user, callback){
    mongodb.open(function (err, db) {
        if(err){
            return callback(err);
        }

        db.collection('users', function (err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
        collection.update({name: user.name}, {$set: {id : user.id, num : user.num, lphone : user.lphone, sphone : user.sphone, class : user.class} }, 
            function(error, doc){
                mongodb.close();
                if(doc) {
                    var user = new User(doc);
                    callback(err, user);
                } else{
                    callback(err, null);
                }
            });
        });
    });
};