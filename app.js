/* Blog requirements

2 tables, 2 data sets we're dealing with
users table - parent table
posts table - child table

first build users table + authentication



POST always has to do with creation of data
GET always has to do with editing data
PATCH updates db
edit just renders the form to allow you to update, happens in frontend
update updates the db. no one "edits" the db.

bad project uses GET for creating data. avoid!!!!

== STEPS TO MAKE BLOG WITH RESTFUL ROUTING ==
GET /users/:id 
GET /users/add
POST /users
GET /posts/:id
GET /posts/:id/edit
POST /posts - create a new post
PATCH /posts/:id
DELETE /posts/:id
GET /posts/new
GET /posts - views the post

DATABASE reviewblog
TABLE users
id         SERIAL PRIMARY KEY INT
username   VARCHAR()
email      VARCHAR()
password   VARCHAR()
TABLE posts
id         INT
title      VARCHAR()
mainbody   TEXT
refuser_id INT







*/






//express is a layer on top of node that allows us to use ...err...serveerr? uh. research this.
var express = require('express');
//function runs to instantiate express
var app     = express();
//ejs is templating engine to render our pages
var ejs           = require('ejs');
var path		      = require('path');
var bodyParser 	  = require('body-parser');
var cookieParser  = require('cookie-parser');
var session       = require('express-session');
var LocalStrategy = require('passport-local').Strategy;
var passport      = require('passport');
var db            = require('./db.js');

//express knows we want to use ejs
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':true}));
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true
}));

app.listen(3000, function() {
	console.log("Listening on 3000!")
});


app.get('/', function(req, res) {
	res.render('index'); //shows index landing page on root
});

//user goes to url /users/new and OUR FILE /new.ejs is rendered
app.get('/users/new', function(req, res) {
	res.render('users/new'); //file path we're rendering matches url, not something we can rely on. route has nothing to do with file or view we're rendering.
});

app.post('/users', function(req, res) {
	db.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [req.body.username, req.body.email, req.body.password], function(err, dbRes) { //callback with error and db response/result
		if (!err) {
		res.redirect('/sessions/new');
		}
	});
});

app.get('/sessions/new', function(req, res) {
	res.render('sessions/new');
});

app.post('/sessions', passport.authenticate('local', 
  {failureRedirect: '/sessions/new'}), function(req, res) {
    // res.redirect('/');
    db.query('SELECT * FROM users WHERE email = $1 AND password = $2', [], function() {

    });
});


















































 
