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
  
  app.schema.User.validatePassword = function(password, hashInDB, done) {
    var bcrypt = require('bcryptjs');
    
    bcrypt.compare(password, hashInDB, function(err, res) {
      done(err, res);
    });
  };
  
  app.schema.User.getOne = function(dynamo, conditions, callback) {
    if (!conditions) {
      return callback(null, null);
    }
    
    var userIdRequest = {};

    var retrievedUserId;
    
    if (conditions.id) {
      getUserWithId(conditions.id, callback);
    } else {
      if (conditions.username) {
        userIdRequest = {
          TableName: "AudiverisUsers",
          IndexName: "username-index",
          ProjectionExpression: "id",
          KeyConditions: {
            "username" : {
              "ComparisonOperator": "EQ",
              "AttributeValueList": [
                {
                  "S": conditions.username
                }
              ]
            }
          }
        };
      } else if (conditions.email) {
        userIdRequest = {
          TableName: "AudiverisUsers",
          IndexName: "email-index",
          ProjectionExpression: "id",
          KeyConditions: {
            "email" : {
              "ComparisonOperator": "EQ",
              "AttributeValueList": [
                {
                  "S": conditions.email
                }
              ]
            }
          }
        };
      } else {
        return callback(null, null);
      }
      
      dynamo.query(userIdRequest, function(err, data) {
        if (err || !data || !data.Items[0]) {
          console.log(err);
          return callback(null, null);
        }
        
        console.log(data);
        
        retrievedUserId = data.Items[0].id.N;
        
        return getUserWithId(retrievedUserId, callback);
      });
    }
  };
  
  app.schema.User.validate = function(user) {
    var validate = require('jsonschema').validate;
    
    var userSchema = {
      "id": "/User",
      "type": "object",
      "properties": {
        "id": {"type": "string"},
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
    return '/account';
  };
  
  var getUserWithId = function(id, callback) {
    var userRequest = {
        TableName: "AudiverisUsers",
        ProjectionExpression: "id, username, email, passwordHash",
        Key: {
          "id":
            {
              "N": id
            }
          }
        };
    
    app.dynamodb.getItem(userRequest, function(err, userData) {
      if (err || !userData) {
        console.log(err);
        return callback(null, null);
      }

      var retrievedUser = {};
      
      retrievedUser.id = userData.Item.id.N;
      retrievedUser.username = userData.Item.username.S;
      retrievedUser.email = userData.Item.email.S;
      retrievedUser.password = userData.Item.passwordHash.S;
      
      retrievedUser.defaultReturnUrl = function() {
        return "/account";
      };
      
      return callback(null, retrievedUser);
    });
  };
};
