
/*
 * GET home page.
 */
var crypto = require('crypto');
var User = require('../models/user.js');

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
        res.redirect('/');
    });
}
exports.user = function(req, res) {
    
};
exports.regi = function(req, res){
    res.render('regi');
}
exports.doRegi = function(req, res){
    
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
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password + "nbut").digest('base64');
   // var password = req.body.password;

    var newUser = new User({
        name: req.body.username,
        password: password
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
