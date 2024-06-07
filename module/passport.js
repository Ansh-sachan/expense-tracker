var passport = require('passport');

var GithubStrategy = require('passport-github2').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;

var User = require('../model/user');

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: '/auth/github/callback',
    },
    (acesstoken, refreshtoken, profile, done) => {
      console.log(profile);
      var userProfile = {
        email: profile._json.email,
        name: profile.displayName,
        gthub: {
          photo: profile._json.avatar_url,
        },
      };
      User.findOne({ email: profile._json.email })
        .then((user) => {
          if (!user) {
            User.create(userProfile)
              .then((newUser) => done(null, newUser))
              .catch((err) => done(err));
          } else {
            if (user.providers.includes('google') && user.google) {
              return done({
                code: 503,
                message: 'Your account already linked with google',
              });
            } else {
              (user.name = profile.displayName),
                (user.github = {
                  image: profile._json.avatar_url,
                });
              user.providers.push('github');
              User.findByIdAndUpdate(user.id, user).then((existUser) =>
                done(null, existUser)
              );
            }
            return done(null, user);
          }
        })
        .catch((err) => done(err));
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    (acesstoken, refreshtoken, profile, done) => {
      console.log(profile);
      var userProfile = {
        email: profile._json.email,
        name: profile.displayName,
        google: {
          photo: profile._json.picture,
        },
      };
      User.findOne({ email: profile._json.email })
        .then((user) => {
          if (!user) {
            User.create(userProfile)
              .then((newUser) => done(null, newUser))
              .catch((err) => done(err));
          } else {
            if (user.providers.includes('github') && user.github) {
              return done({
                code: 503,
                message: 'Your account is already linked with github',
              });
            } else {
              (user.name = profile.displayName),
                (user.google = {
                  photo: profile._json.picture,
                });
              user.providers.push('google');
              User.findByIdAndUpdate(user.id, user).then((existUser) =>
                done(null, existUser)
              );
            }
            return done(null, user);
          }
        })
        .catch((err) => done(err));
    }
  )
);

passport.serializeUser(function (user, done) {
  return done(null, user);
});
passport.deserializeUser(function (id, done) {
  User.findById(id)
    .then((user) => done(null, user))
    .catch((err) => done(err));
});
