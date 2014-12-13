var express = require('express'),
		ejs 		= require('ejs'),
		app			= express(),
		path		= require('path'),
		bodyParser 	  = require('body-parser'),
		cookieParser  = require('cookie-parser'),
		session       = require('express-session'),
		LocalStrategy = require('passport-local').Strategy,
		passport      = require('passport'),
		db						= require('./db.js'),
		methodOverride = require('method-override');

app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':true}));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	db.query('SELECT * FROM users WHERE id = $1', [id], function(err, dbRes) {
		if (!err) {
			done(err, dbRes.rows[0]);
		}
	});
});

app.listen(3000, function() {
	console.log('Server is up!');
});

var localStrategy = new LocalStrategy(
  function(username, password, done) {
    db.query('SELECT * FROM users WHERE username = $1', [username], function(err, dbRes) {

    	console.log(dbRes);
    	var user = dbRes.rows[0];
    	console.log(username)

    	console.log(user);


      if (err) { return done(err); }
      if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
      if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
      return done(null, user);
    })
  }
);

passport.use(localStrategy);

app.get('/', function(req, res) {
	res.render('index', { user: req.user });
});

// User routes
app.get('/users/new', function(req, res) {
	res.render('users/new');
});

app.post('/users', function(req, res) {
	db.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [req.body.username, req.body.email, req.body.password], function(err, dbRes) {

		console.log(err)
			if (!err) {
				res.redirect('/sessions/new');
			}
	});
});

// Session routes
app.get('/sessions/new', function(req, res) {
	res.render('sessions/new');
});

app.post('/sessions', passport.authenticate('local', 
  {failureRedirect: '/sessions/new'}), function(req, res) {
    res.redirect('/');
});

app.delete('/sessions', function(req, res) {
	req.logout();
	res.redirect('/');
});

// Post routes
app.get('/posts/new', function(req, res) {
	res.render('posts/new');
});

app.post('/posts', function(req, res) {
	db.query('INSERT INTO posts (title, mainbody, user_id) VALUES ($1, $2, $3)', [req.body.title, req.body.mainbody, req.user.id], function (err, dbRes) {
		if (!err) {
			res.redirect('/posts');
		}
	});
});

app.get('/posts', function(req, res) {
	db.query('SELECT * FROM posts', function(err, dbRes) {
		res.render('posts/index', { posts: dbRes.rows });
	});
});

app.get('/posts/:id', function(req, res) {
	db.query('SELECT * FROM posts WHERE id = $1', [req.params.id], function(err, dbRes) {
		if (!err) {
			res.render('posts/show', { post: dbRes.rows[0] });
		}
	});
});

app.get('/posts/:id/edit', function(req, res) {
	db.query('SELECT * FROM posts WHERE id = $1', [req.params.id], function(err, dbRes) {
		if (!err) {
			res.render('posts/edit', { post: dbRes.rows[0] });
		}
	});
});

app.patch('/posts/:id', function(req, res) {
	db.query('UPDATE posts SET title = $1, mainbody = $2 WHERE id = $3', [req.body.title, req.body.mainbody, req.params.id], function(err, dbRes) {
		if (!err) {
			res.redirect('/posts/' + req.params.id);
		}
	});
});

app.delete('/posts/:id', function(req, res) {
	db.query('DELETE FROM posts WHERE id = $1', [req.params.id], function(err, dbRes) {
		if (!err) {
			res.redirect('/posts');
		}
	})
});
