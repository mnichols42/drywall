var sys = require('sys');
var my_http = require('http');
var path = require('path');
var url = require('url');
var filesys = require('fs');
var express = require('express');
var multer = require('multer');
var aws = require('aws-sdk');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var app = express();
var done = false;

var credentials = new aws.SharedIniFileCredentials({profile: 'default'});
aws.config.credentials = credentials;

var users = [ {
  id : 1,
  username : 'bob',
  password : 'secret',
  email : 'bob@example.com'
}, {
  id : 2,
  username : 'joe',
  password : 'birthday',
  email : 'joe@example.com'
} ];

function findById(id, fn) {
  var idx = id - 1;
  if (users[idx]) {
    fn(null, users[idx]);
  } else {
    fn(new Error('User ' + id + ' does not exist'));
  }
}

function findByUsername(username, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done) {
  // asynchronous verification, for effect...
  process.nextTick(function() {

    // Find the user by username. If there is no user with the given
    // username, or the password is not correct, set the user to `false` to
    // indicate failure and set a flash message. Otherwise, return the
    // authenticated `user`.
    findByUsername(username, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {
          message : 'Unknown user ' + username
        });
      }
      if (user.password != password) {
        return done(null, false, {
          message : 'Invalid password'
        });
      }
      return done(null, user);
    })
  });
}));

var s3 = new aws.S3();
var dynamo = new aws.DynamoDB();

app.use(multer({
  inMemory : true,
  rename : function(fieldname, filename) {
    return filename + Date.now();
  },
  onFileUploadStart : function(file) {
    console.log(file.originalname + ' is starting ...');
  },
  onFileUploadComplete : function(file) {
    console.log(file.fieldname + ' uploaded to audiveris-uploads-ca');

    var params = {
      Bucket : 'audiveris-uploads-ca',
      Key : file.name,
      Body : file.buffer
    };

//    s3.putObject(params, function(err, data) {
//      if (err) {
//        console.log(err);
//      } else {
//        console.log('Successfully uploaded data to audiveris-uploads-ca/' + file.name);
//      }
//    });

    done = true;
  }
}));

app.get('/', passport.authenticate('local'), function(req, res) {
  res.sendfile('index.html');
});

app.post('/login', passport.authenticate('local', {
  failureRedirect : '/login',
  failureFlash : true
}), function(req, res) {
  res.redirect('/');
});

// app.put('/upload-sha', function(req, res) {
//  var params = {
//    'ComparisonOperator': 'NULL',
//    'Item': {
//      req
//    }
//  };
//  
//  dynamo.putItem(params, );
//});

app.post('/api/photo', function(req, res) {
  if (done == true) {
    console.log(req.files);
    res.end('File uploaded.');
  }
});

app.get('/client_scripts/:filename', function(req, res) {
  res.sendfile('client_scripts/' + req.params.filename);
});

app.listen(8080, function() {
  console.log('Server Running on 8080');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}
