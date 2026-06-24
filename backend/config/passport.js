import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.js';
import dotenv from 'dotenv';

// 1. Force load environment variables right here, before anything else runs
dotenv.config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// ==========================================
// Google Strategy
// ==========================================
// 2. Only initialize if the environment variables actually exist
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        // Added fallback just in case CALLBACK_URL is missing
        callbackURL: `${process.env.CALLBACK_URL || 'http://localhost:5001'}/api/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
              user.googleId = profile.id;
              user.avatar = user.avatar || profile.photos[0]?.value;
              await user.save();
            } else {
              user = await User.create({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                avatar: profile.photos[0]?.value,
                isVerified: true,
              });
            }
          }

          done(null, user);
        } catch (err) {
          done(err, null);
        }
      }
    )
  );
  console.log('✅ Google OAuth configured');
} else {
  console.warn('⚠️ Google OAuth skipped: Missing GOOGLE_CLIENT_ID in .env');
}


// ==========================================
// GitHub Strategy
// ==========================================
// Check if GitHub is configured AND that it's not the default placeholder text
const isGithubConfigured = 
  process.env.GITHUB_CLIENT_ID && 
  process.env.GITHUB_CLIENT_ID !== 'your_github_client_id' && 
  process.env.GITHUB_CLIENT_SECRET;

if (isGithubConfigured) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${process.env.CALLBACK_URL || 'http://localhost:5001'}/api/auth/github/callback`,
        scope: ['user:email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ githubId: profile.id });

          if (!user) {
            const email =
              profile.emails && profile.emails[0]
                ? profile.emails[0].value
                : `${profile.username}@github.placeholder`;

            user = await User.findOne({ email });

            if (user) {
              user.githubId = profile.id;
              user.avatar = user.avatar || profile.photos[0]?.value;
              await user.save();
            } else {
              user = await User.create({
                githubId: profile.id,
                name: profile.displayName || profile.username,
                email,
                avatar: profile.photos[0]?.value,
                isVerified: true,
              });
            }
          }

          done(null, user);
        } catch (err) {
          done(err, null);
        }
      }
    )
  );
  console.log('✅ GitHub OAuth configured');
} else {
  console.warn('⚠️ GitHub OAuth skipped: Missing or placeholder GITHUB_CLIENT_ID');
}

export default passport;