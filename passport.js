'use strict';

exports = module.exports = function(app, passport) {
  var LocalStrategy = require('passport-local').Strategy,
      TwitterStrategy = require('passport-twitter').Strategy,
      GitHubStrategy = require('passport-github').Strategy,
      FacebookStrategy = require('passport-facebook').Strategy,
      GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
      TumblrStrategy = require('passport-tumblr').Strategy;
  
  var simpleUser = {
      username: "bob",
      password: "secret",
      email: "test@test.com",
      roles: {
        admin: {
          user: {
            id: "bob",
            name: "bob"
          },
          name: {
            full: "a",
            first: "b",
            middle: "c",
            last: "d",
          },
          groups: ["Admin"],
          permissions: [{
            name: "admin",
            permit: true
          }],
          timeCreated: Date.now,
          search: []
        },
        account: {
          user: {
            id: "bob",
            name: "bob"
          },
          isVerified: '',
          verificationToken: '',
          name: {
            full: "a",
            first: "b",
            middle: "c",
            last: "d",
          },
          company: '',
          phone: '',
          zip: '',
          status: {
            id: '1',
            name: '',
            userCreated: {
              id: "bob",
              name: "bob",
              time: Date.now
            }
          },
          statusLog: [],
          notes: [],
          search: []
        }
      },
      isActive: "true",
      timeCreated: Date.now,
      resetPasswordToken: "12345",
      resetPasswordExpires: new Date("2016", "4", "20"),
      twitter: {},
      github: {},
      facebook: {},
      google: {},
      tumblr: {},
      search: []
    };
  simpleUser.defaultReturnUrl = function() {
    return "/account/";
  };

  passport.use(new LocalStrategy(
    function(username, password, done) {
      var conditions = { isActive: 'yes' };
      if (username.indexOf('@') === -1) {
        conditions.username = username;
      }
      else {
        conditions.email = username.toLowerCase();
      }
      
      return done(null, simpleUser);

//      app.db.models.User.findOne(conditions, function(err, user) {
//        if (err) {
//          return done(err);
//        }
//
//        if (!user) {
//          return done(null, false, { message: 'Unknown user' });
//        }
//
//        app.db.models.User.validatePassword(password, user.password, function(err, isValid) {
//          if (err) {
//            return done(err);
//          }
//
//          if (!isValid) {
//            return done(null, false, { message: 'Invalid password' });
//          }
//
//          return done(null, user);
//        });
//      });
    }
  ));

  if (app.config.oauth.twitter.key) {
    passport.use(new TwitterStrategy({
        consumerKey: app.config.oauth.twitter.key,
        consumerSecret: app.config.oauth.twitter.secret
      },
      function(token, tokenSecret, profile, done) {
        done(null, false, {
          token: token,
          tokenSecret: tokenSecret,
          profile: profile
        });
      }
    ));
  }

  if (app.config.oauth.github.key) {
    passport.use(new GitHubStrategy({
        clientID: app.config.oauth.github.key,
        clientSecret: app.config.oauth.github.secret,
        customHeaders: { "User-Agent": app.config.projectName }
      },
      function(accessToken, refreshToken, profile, done) {
        done(null, false, {
          accessToken: accessToken,
          refreshToken: refreshToken,
          profile: profile
        });
      }
    ));
  }

  if (app.config.oauth.facebook.key) {
    passport.use(new FacebookStrategy({
        clientID: app.config.oauth.facebook.key,
        clientSecret: app.config.oauth.facebook.secret
      },
      function(accessToken, refreshToken, profile, done) {
        done(null, false, {
          accessToken: accessToken,
          refreshToken: refreshToken,
          profile: profile
        });
      }
    ));
  }

  if (app.config.oauth.google.key) {
    passport.use(new GoogleStrategy({
        clientID: app.config.oauth.google.key,
        clientSecret: app.config.oauth.google.secret
      },
      function(accessToken, refreshToken, profile, done) {
        done(null, false, {
          accessToken: accessToken,
          refreshToken: refreshToken,
          profile: profile
        });
      }
    ));
  }

  if (app.config.oauth.tumblr.key) {
    passport.use(new TumblrStrategy({
        consumerKey: app.config.oauth.tumblr.key,
        consumerSecret: app.config.oauth.tumblr.secret
      },
      function(token, tokenSecret, profile, done) {
        done(null, false, {
          token: token,
          tokenSecret: tokenSecret,
          profile: profile
        });
      }
    ));
  }

  passport.serializeUser(function(user, done) {
    done(null, simpleUser.username);
  });

  passport.deserializeUser(function(id, done) {
    done(null, simpleUser);
//    app.db.models.User.findOne({ _id: id }).populate('roles.admin').populate('roles.account').exec(function(err, user) {
//      if (user && user.roles && user.roles.admin) {
//        user.roles.admin.populate("groups", function(err, admin) {
//          done(err, user);
//        });
//      }
//      else {
//        done(err, user);
//      }
//    });
  });
};
