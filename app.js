/* Blog requirements

2 tables, 2 data sets we're dealing with
users table
posts table


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

*/

//express is a layer on top of node that allows us to use ...err...serveerr? uh. research this.
var express = require('express');
//function runs to instantiate express
var app     = express();
//ejs is templating engine to render our pages
var ejs     = require('ejs');


//express knows we want to use ejs
app.set('view engine', 'ejs');

// app.get('/', function(req, res) {
// 	res.send("root hi!");
// });

app.get('/', function(req, res) {
	res.render('index'); //shows index landing page on root
})





app.listen(3000, function() {
	console.log("Listening on 3000!")
});























