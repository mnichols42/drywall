'use strict';

exports = module.exports = function(app, dynamo) {
  app.schema.User = {};
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
  app.schema.User.encryptPassword = function(password, done) {
    var bcrypt = require('bcryptjs');
    bcrypt.genSalt(10, function(err, salt) {
      if (err) {
        return done(err);
      }
  
      bcrypt.hash(password, salt, function(err, hash) {
        done(err, hash);
      });
    });
  };
  
  app.schema.User.validatePassword = function(password, hash, done) {
    var bcrypt = require('bcryptjs');
    console.log(password);
    console.log(hash);
    
    app.schema.User.encryptPassword(hash, function(err, hashdone) {
      bcrypt.compare(password, hashdone, function(err, res) {
        done(err, res);
      });
    });
  };
  
  app.schema.User.getOne = function(dynamo, conditions, callback) {
    var user = {
      id: 1,
      username: "bob",
      password: "secret",
      email: "test@test.com"
    };
    
    console.log("User.js line 61");
    
    user.defaultReturnUrl = function() {
      return "/";
    };
    
    if (!conditions) {
      callback(null, null);
    } else if (conditions.id === user.id) {
      callback(null, user);
    } else if (conditions.username === user.username) {
      callback(null, user);
    } else if (conditions.email === user.email) {
      callback(null, user);
    } else {
      callback(null, null);
    }
  };
  
  app.schema.User.validate = function(user) {
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
  
  app.schema.User.defaultReturnUrl = function() {
    return '/';
  };
};
