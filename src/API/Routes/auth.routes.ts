import express from "express";
import passport from "passport";
import { FRONTEND_ORIGIN } from "../../utils/utils";
import * as dotenv from "dotenv";
dotenv.config();

const authRouter = express.Router();

// Initiate Google authentication
authRouter.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Google callback route
authRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login", // or wherever you want to redirect on failure
    session: false, // since you're using JWT
  }),
  (req, res) => {
    // Successful authentication, redirect or send tokens
    const { accessToken, refreshToken, user, isNewUser } = req.user as any;

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    // res.cookie("NewUser", isNewUser, {
    //   maxAge: 60_000,
    //   httpOnly: false,
    //   sameSite: "none",
    //   // secure: process.env.NODE_ENV === "production",
    //   secure: true,
    // });

    res.redirect(`${process.env.FRONTEND_ORIGIN}/dashboard/home`);
  }
);

authRouter.get("/auth/google/failure", (req, res) => {
  res.send(`
    <html>
      <script>
        window.opener.postMessage({
          type: 'AUTH_ERROR',
          error: 'Google authentication failed'
        }, '${process.env.FRONTEND_ORIGIN}');
        window.close();
      </script>
    </html>
  `);
});

// Optional: Route to get current user
authRouter.get("/auth/current", (req, res) => {
  // Verify token and return user data
});

export default authRouter;

// Google callback route - Modified for popup flow
// authRouter.get(
//   "/auth/google/callback",
//   passport.authenticate("google", {
//     failureRedirect: "/login",
//     session: false,
//   }),
//   (req, res) => {
//     const { accessToken, refreshToken, user } = req.user as any;

//     // Send HTML that posts message back to opener and closes
//     res.send(`
//       <html>
//         <head>
//           <title>Authentication Successful</title>
//         </head>
//         <body>
//           <script>
//             // Send message to parent window
//             window.opener.postMessage({
//               type: 'AUTH_SUCCESS',
//               accessToken: '${accessToken}',
//               refreshToken: '${refreshToken}',
//               user: ${JSON.stringify(user)}
//             }, '${process.env.FRONTEND_ORIGIN || "http://localhost:3000"}');

//             // Close the popup
//             window.close();
//           </script>
//           <p>Authentication successful. You can close this window.</p>
//         </body>
//       </html>
//     `);
//   }
// );
