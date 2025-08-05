import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt"; // Adjust path if needed
import dotenv from "dotenv";
import USER_MODEL from "../API/Models/user.model";
import { BACKEND_ORIGIN } from "../utils/utils";
import { createRestaurantAndTemplateForGoogle } from "../API/Controllers/restaurant.controller";

import { Resend } from "resend";

dotenv.config();

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       callbackURL: "http://localhost:8080/auth/google/callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         console.log("Google Profile:", profile);
//         let user = await USER_MODEL.findOne({
//           email: profile.emails?.[0].value,
//         });

//         if (!user) {
//           user = new USER_MODEL({
//             googleId: profile.id,
//             userName: profile.name?.givenName,
//             email: profile.emails?.[0].value,
//             avatar: profile.photos?.[0].value,
//           });

//           await user.save();
//         }

//         console.log("User Found/Created:", user);
//         const accessTokenJWT = generateAccessToken({
//           id: user._id,
//           email: user.email,
//           userName: user.userName,
//         });
//         const refreshTokenJWT = generateRefreshToken({ id: user._id });

//         user.refreshTokens.push(refreshTokenJWT);
//         await user.save();

//         console.log("Generated Tokens:", { accessTokenJWT, refreshTokenJWT });

//         done(null, {
//           user,
//           accessToken: accessTokenJWT,
//           refreshToken: refreshTokenJWT,
//         });
//       } catch (error) {
//         console.error("Google Auth Error:", error);
//         done(error, false);
//       }
//     }
//   )
// );

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.BACKEND_ORIGIN}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await USER_MODEL.findOne({
          email: profile.emails?.[0].value,
        });

        let isNewUser = false;
        let user = existingUser;

        if (!user) {
          // user = await USER_MODEL.create({
          //   // googleId: profile.id,
          //   userName: profile.name?.givenName,
          //   email: profile.emails?.[0]?.value,
          //   authProvider: "google",
          //   // avatar: profile.photos?.[0].value,
          // });

          // try {
          //   await user.save();
          // } catch (error) {
          //   console.error("Error saving new user:", error);
          //   return done(error, false);
          // }
          try {
            user = await USER_MODEL.create({
              // googleId: profile.id,
              userName: profile.name?.givenName || "New User",
              email: profile.emails?.[0].value,
              authProvider: "google",
              refreshTokens: [],
              managers: [],
              // avatar: profile.photos?.[0].value, // Uncomment if you want to save the avatar
            });

            await user.save();

            // Optionally, create a new restaurant and template for the user
            // Uncomment the following line if you have a function to create a restaurant and template

            await createRestaurantAndTemplateForGoogle({
              userId: user._id as any,
              templateName: "SimpleBites",
              restaurantName: "My First Restaurant",
            });

            // send welcome email or perform other actions for new users here
            const resend = new Resend(process.env.RESEND_API_KEY);
            await resend.emails.send({
              from: "Welcome <jelofyteam@send.jelofy.com>", // use verified sender in production
              to: user.email!,
              subject: "🎉 Welcome to Our Platform!",
              html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Welcome aboard, ${user.userName}!</h2>
          <p>We're excited to have you with us. If you have any questions, feel free to reach out anytime.</p>
          <p>Start exploring your dashboard and enjoy the experience!</p>
          <p>– The Team</p>
        </div>
      `,
            });

            // const createNewRestaurantAndTemplate = await createRestaurantAndTemplateForGoogle({})
          } catch (error) {
            console.error("Error creating new user:", error);
            return done(error, false);
          }
          isNewUser = true;
        }

        const tokenData = {
          id: user._id,
          email: user.email,
          userName: user.userName,
          authProvider: user.authProvider || "google",
        };
        const accessToken = generateAccessToken(tokenData);
        const refreshToken = generateRefreshToken(tokenData);

        // const accessTokenJWT = generateAccessToken({
        //   id: user._id,
        //   email: user.email,
        //   userName: user.userName,
        // });

        // const refreshTokenJWT = generateRefreshToken({ id: user._id });

        user.refreshTokens.push(refreshToken);
        await user.save();

        // Pass everything needed to the route
        done(null, {
          user,
          accessToken: accessToken,
          refreshToken: refreshToken,
          // isNewUser,
        });
      } catch (error) {
        console.error("Google Auth Error:", error);
        done(error, false);
      }
    }
  )
);

// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((user, done) => {
//   done(null, user);
// });
