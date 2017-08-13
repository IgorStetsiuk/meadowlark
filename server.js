var express = require('express');
var exphbs = require('express-handlebars');
const  fortune = require('./lib/fortunes.js');
var credentials = require('./credentials.js');


var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

app.use(require('cookie-parser')(credentials.cookieSecret));

app.use(require('express-session')({
    resave: false,
    saveUninitialized: false,
    secret: credentials.cookieSecret,
}));

app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next){
    res.locals.showTests = app.get('env') !== 'production' &&
        req.query.test === '1';
    next();
});

app.get('/', function (req, res) {
    res.render('home');
});
app.get('/about', function(req, res) {
    res.render('about', {
        fortune: fortune.getForunes(),
        pageTestScript: '/qa/tests-about.js'
    } );
});

app.get('/tours/hood-river', function(req, res){
    res.render('tours/hood-river');
});
app.get('/tours/request-group-rate', function(req, res){
    res.render('tours/request-group-rate');
});

app.get('/headers', function(req,res){
    res.set('Content-Type','text/plain');
    var s = '';
    for(var name in req.headers)
        s += name + ': ' + req.headers[name] + '\n';
    res.send(s);
});
// 404 catch-all handler (middleware)
app.use(function (req, res, next) {
    res.status(404);
    res.render('404');
});

// 500 error handler (middleware)
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.');
});