require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('./models/User');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
      });
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

  passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: '/api/auth/github/callback',
  scope: ['user:email'],
},async (accessToken, refreshToken, profile, done) => {
  try {
    // Safely get the email
    const email = profile.emails && profile.emails[0] ? profile.emails[0].value : "";

    // Declare user ONCE
    let user = await User.findOne({ githubId: profile.id });

    if (!user && email) {
      // Try to find by email if not found by githubId
      user = await User.findOne({ email });
      if (user) {
        user.githubId = profile.id;
        await user.save();
      }
    }

    if (!user) {
      user = await User.create({
        name: profile.displayName || profile.username,
        email,
        githubId: profile.id,
      });
    }

    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

module.exports = passport;