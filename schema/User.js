'use strict';

//  userSchema.methods.canPlayRoleOf = function(role) {
//    if (role === "admin" && this.roles.admin) {
//      return true;
//    }
//
//    if (role === "account" && this.roles.account) {
//      return true;
//    }
//
//    return false;
//  };
//  userSchema.methods.defaultReturnUrl = function() {
//    var returnUrl = '/';
//    if (this.canPlayRoleOf('account')) {
//      returnUrl = '/account/';
//    }
//
//    if (this.canPlayRoleOf('admin')) {
//      returnUrl = '/admin/';
//    }
//
//    return returnUrl;
//  };
//var encryptPassword = function(password, done) {
//  var bcrypt = require('bcryptjs');
//  bcrypt.genSalt(10, function(err, salt) {
//    if (err) {
//      return done(err);
//    }
//
//    bcrypt.hash(password, salt, function(err, hash) {
//      done(err, hash);
//    });
//  });
//};

exports.validatePassword = function(password, hash, done) {
//  var bcrypt = require('bcryptjs');
  console.log(password);
  console.log(hash);
  
  done(null, password === hash);
//  encryptPassword(hash, done);
//  
//  bcrypt.compare(password, , function(err, res) {
//    done(err, res);
//  });
};
//  app.db.model('User', userSchema);
//};

exports.getOne = function(dynamo, conditions, callback) {
  var user = {
    username: "bob",
    password: "secret",
    email: "test@test.com"
  };
  
  console.log("User.js line 61");
  
  user.defaultReturnUrl = function() {
    return "/account/";
  };
  
  callback(null, user);
};

exports.validate = function(user) {
  var validate = require('jsonschema').validate;
  
  var userSchema = {
    "id": "/User",
    "type": "object",
    "properties": {
      "username": {"type": "string"},
      "password": {"type": "string"},
      "email": {"type": "string"},
//      "roles": {
//        "type": "object",
//        "elements": {
//          "admin": {"$ref": "/Admin"},
//          "account": {"$ref": "/Account"}
//        }
//      }
    }
  };
  
  validate(user, userSchema);
};

exports.defaultReturnUrl = function() {
  return '/account/';
};
