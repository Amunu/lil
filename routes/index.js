
/*
 * GET home page.
 */
var crypto = require('crypto');
var User = require('../models/user');

exports.index = function(req, res){
  res.render('index', {
	title: '首页',
    user: req.session.user
  });
};

exports.doIndex = function(req, res){
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password + "nbut").digest('base64');

    User.get(req.body.username, function(err, user) {
        if (!user) {
            req.session.error =  '咕。没有这个人呢！';
            return res.redirect('/');
        }
        if (user.password !== password) {
            req.session.error = '密码错了呢0///0';
            return res.redirect('/');
        }
        req.session.user = user;
        req.session.success = '欢迎回来～主人(>^ω^<)';
        res.redirect('/user');
    });
}
exports.user = function(req, res) {
    res.render('user',{
        title: 'user',
        user: req.session.user
    });
};
exports.regi = function(req, res){
    res.render('regi',{
        title: '用户注册',
        user: req.session.user
    });
}
exports.doRegi = function(req, res){
    if(req.body.loginnum.length !== 11){
        req.session.error = "请输入正确的学号";
        return res.redirect('/regi');
    }
    if(req.body.loginphone.length !== 11){
        req.session.error = "请输入正确的长号";
        return res.redirect('/regi');
    }
    if(req.body.loginshortphone.length !== 6){
        req.session.error = "请输入正确的短号";
        return res.redirect('/regi');
    }    
    var newUser = new User({
        name: req.session.user.name,
        password: req.session.user.password,
        id : req.body.loginrealname,
        num : req.body.loginnum,
        class : req.body.loginclass,
        lphone : req.body.loginphone,
        sphone : req.body.loginshortphone
    });
    console.log({
        name: req.session.user.name,
        password: req.session.user.password,
        id : req.body.loginrealname,
        num : req.body.loginnum,
        class : req.body.loginclass,
        lphone : req.body.loginphone,
        sphone : req.body.loginshortphone
    });
    User.update(newUser, function(err, user){
        if (err) {
            req.session.error = err;
            return res.redirect('/regi');
        }
        req.session.user = newUser;
        req.session.success = 'hello～主人(>^ω^<)';
        return res.redirect('/user');
    });
}
exports.reg = function(req, res){
	res.render('reg', {
        title: '用户注册',
        user: req.session.user
    });
}
exports.doReg = function(req, res){
    if (req.body['password'] !== req.body['passwordagain']) {
        req.session.error = '两遍密码不一样哦～';
        return res.redirect('/reg');
    }
    if(req.body.password.length < 6){
        req.session.error = '密码要大于6位~';
        return res.redirect('/reg');
    }
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password + "nbut").digest('base64');
   // var password = req.body.password;

    var newUser = new User({
        name: req.body.username,
        password: password,
        id : "",
        num : "",
        class : "",
        lphone : "",
        sphone : ""
    });

    User.get(newUser.name, function(err, user) {
        if (user) {
            err = '昵称已经被抢了哦T T换一个吧～';
        }
        if (err) {
            req.session.error = err;
            return res.redirect('/reg');
        }
 
        newUser.save(function(err) {
            if (err) {
                req.session.error = err;
                return res.redirect('/reg');
            }

            req.session.user = newUser;
            req.session.success = '初次见面～主人(>^ω^<)';
            res.redirect('/regi');
        });
    });
}
exports.change = function(req, res) {
    res.render('change', {
    title: 'change',
    user: req.session.user
  });
    console.log("dshagdsa");
};

exports.doChange = function(req, res) {
     if(req.body.loginnum.length !== 11){
        req.session.error = "请输入正确的学号";
        return res.redirect('/change');
    }
    if(req.body.loginphone.length !== 11){
        req.session.error = "请输入正确的长号";
        return res.redirect('/change');
    }
    if(req.body.loginshortphone.length !== 6){
        req.session.error = "请输入正确的短号";
        return res.redirect('/change');
    }    
    var newUser = new User({
        name: req.session.user.name,
        password: req.session.user.password,
        id : req.body.loginrealname,
        num : req.body.loginnum,
        class : req.body.loginclass,
        lphone : req.body.loginphone,
        sphone : req.body.loginshortphone
    });
    console.log({
        name: req.session.user.name,
        password: req.session.user.password,
        id : req.body.loginrealname,
        num : req.body.loginnum,
        class : req.body.loginclass,
        lphone : req.body.loginphone,
        sphone : req.body.loginshortphone
    });
    User.update(newUser, function(err, user){
        if (err) {
            req.session.error = err;
            return res.redirect('/change');
        }
        req.session.user = newUser;
        req.session.success = '修改成功(>^ω^<)';
        return res.redirect('/user');
    });
}

exports.logout = function(req, res) {
    req.session.user = null;
    req.session.success =  '主人T T再见';
    res.redirect('/');
};


exports.checkLogin = function(req, res, next) {
    if (!req.session.user) {
	req.session.error = '还没有登陆哦～';
        return res.redirect('/');
    }
    next();
};
exports.checkNotLogin = function(req, res, next) {
    if (req.session.user) {
        req.session.error = '0。0你要相信你已经登陆了';
        return res.redirect('/');
    }
    next();
};
