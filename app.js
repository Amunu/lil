
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var MongoStore = require('connect-mongo')(express);
var settings = require('./settings');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
  secret: settings.cookieSecret,
  store: new MongoStore({
	db: settings.db
  })
}));
app.use(function(req, res, next){
	res.locals.user = req.session.user;
	var err = req.session.error;
	var suc = req.session.success;
	delete req.session.error;
	delete req.session.success;
	res.locals.message = '';
	if (err){res.locals.message = '<div class="alert alert-danger">' + err + '</div>';} 
	if (suc){res.locals.message = '<div class="alert alert-success">' + suc + '</div>';}
	next();
});

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.post('/',routes.doIndex);

app.get('/user', routes.checkLogin);
app.get('/user', routes.user)
app.get('/u/:user', routes.user);

app.get('/reg', routes.checkNotLogin);
app.get('/reg', routes.reg);

app.post('/reg', routes.checkNotLogin);
app.post('/reg', routes.doReg);

//app.get('/regi',routes.checkNotReg);
app.get('/regi',routes.regi);

//app.post('/regi', routes.checkNotReg);
app.post('/regi', routes.doRegi);

app.get('/change', routes.checkLogin);
app.get('/change',routes.change);

app.post('/change', routes.checkLogin);
app.post('/change',routes.doChange);

app.get('/logout', routes.checkLogin);
app.get('/logout', routes.logout);
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
