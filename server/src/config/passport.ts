import passport from "passport";
import { Strategy as GoogleStrategy, Profile as GoogleProfile } from "passport-google-oauth20";
import { Strategy as GitHubStrategy, Profile as GitHubProfile } from "passport-github2";
import { Strategy as JwtStrategy, ExtractJwt, VerifiedCallback } from "passport-jwt";
import User from "../models/User";
import { JwtPayload } from "../types";
import dotenv from "dotenv";
dotenv.config();



// ---------------- JWT STRATEGY ----------------
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || "fallback_secret_change_in_production",
    },
    async (payload: JwtPayload, done: VerifiedCallback) => {
      try {
        const user = await User.findById(payload.userId).select('-password');
        return user ? done(null, user) : done(null, false);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// ---------------- GOOGLE STRATEGY ----------------
const GoogleStrategyAny = GoogleStrategy as any;

passport.use(
  new GoogleStrategyAny(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: GoogleProfile,
      done: VerifiedCallback
    ) => {
      try {
        console.log('Google profile received:', profile);

        let user = await User.findOne({ 
          $or: [
            { googleId: profile.id },
            { email: profile.emails?.[0]?.value?.toLowerCase() }
          ]
        });

        if (user) {
          // Update existing user with Google info
          user.googleId = profile.id;
          user.authProvider = "google";
          user.avatar = profile.photos?.[0]?.value || user.avatar;
          user.isVerified = user.isVerified || true;
          await user.save();
          console.log('Existing user updated with Google:', user);
          return done(null, user);
        }

        // Create new user from Google
        const newUser = new User({
          name: profile.displayName,
          email: profile.emails?.[0]?.value?.toLowerCase() || "",
          googleId: profile.id,
          avatar: profile.photos?.[0]?.value,
          authProvider: "google",
          isVerified: true
        });

        await newUser.save();
        console.log('New user created from Google:', newUser);
        return done(null, newUser);
      } catch (error) {
        console.error('Google strategy error:', error);
        return done(error, false);
      }
    }
  )
);

// ---------------- GITHUB STRATEGY ----------------
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || "dummy_client_id",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "dummy_client_secret",
      callbackURL: process.env.GITHUB_CALLBACK_URL || "http://localhost:5000/api/auth/github/callback",
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: GitHubProfile,
      done: VerifiedCallback
    ) => {
      try {
        console.log('GitHub profile received:', profile);

        const email = profile.emails?.[0]?.value || `${profile.username}@users.noreply.github.com`;

        let user = await User.findOne({ 
          $or: [
            { githubId: profile.id },
            { email: email.toLowerCase() }
          ]
        });

        if (user) {
          // Update existing user with GitHub info
          user.githubId = profile.id;
          user.authProvider = "github";
          user.avatar = profile.photos?.[0]?.value || user.avatar;
          user.isVerified = user.isVerified || true;
          await user.save();
          console.log('Existing user updated with GitHub:', user);
          return done(null, user);
        }

        // Create new user from GitHub
        const newUser = new User({
          name: profile.displayName || profile.username,
          email: email.toLowerCase(),
          githubId: profile.id,
          avatar: profile.photos?.[0]?.value,
          authProvider: "github",
          isVerified: true
        });

        await newUser.save();
        console.log('New user created from GitHub:', newUser);
        return done(null, newUser);
      } catch (error) {
        console.error('GitHub strategy error:', error);
        return done(error, false);
      }
    }
  )
);

// ---------------- SERIALIZE / DESERIALIZE ----------------
passport.serializeUser((user: any, done: (err: any, id?: any) => void) => {
  done(null, user._id || user.id);
});

passport.deserializeUser(async (id: string, done: (err: any, user?: any) => void) => {
  try {
    const user = await User.findById(id).select('-password');
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;