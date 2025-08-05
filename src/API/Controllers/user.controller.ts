import USER_MODEL from "../Models/user.model";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";
import serverError from "../../utils/errorMessage";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { mealTemplates } from "../../utils/mealTemplates";
import startupMeals from "../../utils/startupMeals";
import MEAL_MODEL from "../Models/meals.model";
import RESTAURANT_MODEL from "../Models/restaurant.model";
import TEMPLATE_MODEL from "../Models/template.model";
import Manager_MODEL from "../Models/manager.model";
import cloudinary from "../../utils/cloudinary";
import { Resend } from "resend";
import { isSimpleStrongPassword } from "../../utils/password-strength-generator";
dotenv.config();

// const createNewUser = async (req: Request, res: Response) => {
//   try {
//     const { userName, email, password } = req.body;

//     // Check if user already exists
//     const existingUser = await USER_MODEL.findOne({ email });
//     if (existingUser) {
//       res.status(400).json({ message: "User already exists" });
//       return;
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 12);

//     // Create new user
//     const newUser = new USER_MODEL({
//       userName,
//       email,
//       password: hashedPassword,
//       refreshTokens: [],
//     });

//     await newUser.save();

//     // Create a new restaurant for the user
//     const newRestaurant = new RESTAURANT_MODEL({
//       name: `${newUser.userName}'s Restaurant`,
//       owner: newUser._id,
//       businessUrl: "burger-shark",
//     });

//     await newRestaurant.save();

//     // Generate startup user meals
//     const mealsToCreate = startupMeals;

//     // Map meals to associate them with the new restaurant
//     const meals = mealsToCreate.map((meal) => ({
//       ...meal,
//       restaurant: newRestaurant._id,
//     }));

//     await MEAL_MODEL.insertMany(meals);

//     // create a template for the user
//     const newTemplate = new TEMPLATE_MODEL({
//       name: "SimpleBites",
//       restaurantId: newRestaurant._id,
//       logoUrl:
//         "https://res.cloudinary.com/dvvm7u4dh/image/upload/v1742410284/startup-meals/bqpk4jfvmvwdidstmj9y.png",
//       logoText: { name: newRestaurant.restaurantName, color: "#F9F9F9" },
//       backgroundColor: "#252323",
//       contact: {
//         name: "call-us",
//         phone: "000000000",
//         color: "#F9F9F9",
//         iconColor: "#D84040",
//       },
//       categoryTextColor: {
//         color: "#F9F9F9",
//       },
//       categoryBgColor: "#D84040",
//     });

//     await newTemplate.save();

//     // Generate tokens
//     const tokenData = {
//       id: newUser._id,
//       userName: newUser.userName,
//       email: newUser.email,
//     };
//     const accessToken = generateAccessToken(tokenData);
//     const refreshToken = generateRefreshToken(tokenData);

//     // Store refresh token in the database
//     newUser.refreshTokens.push(refreshToken);
//     await newUser.save();

//     res.status(201).json({
//       message: "User created successfully",
//       accessToken,
//       refreshToken,
//       // user: {
//       //   id: newUser._id,
//       //   userName: newUser.userName,
//       //   email: newUser.email,
//       // },
//     });
//   } catch (error) {
//     serverError(error, res);
//   }
// };

const createNewUser = async (req: Request, res: Response) => {
  try {
    const { email, emailConfirm, password, passwordConfirm } = req.body;

    if (!email || !emailConfirm || !password || !passwordConfirm) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    // Check if user already exists
    const existingUser = await USER_MODEL.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Check if emails match
    if (email !== emailConfirm) {
      res.status(400).json({ message: "Emails do not match" });
      return;
    }

    // Check if passwords match
    if (password !== passwordConfirm) {
      res.status(400).json({ message: "Passwords do not match" });
      return;
    }

    if (!isSimpleStrongPassword(password)) {
      res.status(400).json({
        message:
          "Password must be at least 8 characters long and include at least one letter and one number.",
      });
      return;
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = await USER_MODEL.create({
      email,
      userName: email.split("@")[0] || "user",
      password: hashedPassword,
    });

    await newUser.save();

    // generate tokens and store them in the database and cookies
    const tokenData = {
      id: newUser._id,
      email: newUser.email,
      userName: newUser.userName,
      authProvider: newUser.authProvider || "email"
    };
    const accessToken = generateAccessToken(tokenData);
    const refreshToken = generateRefreshToken(tokenData);

    // Store refresh token in the database
    newUser.refreshTokens.push(refreshToken);
    await newUser.save();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 15, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    // Send welcome email
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Welcome <jelofyteam@send.jelofy.com>", // use verified sender in production
      to: newUser.email!,
      subject: "🎉 Welcome to Our Platform!",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Welcome aboard, ${newUser.userName}!</h2>
          <p>We're excited to have you with us. If you have any questions, feel free to reach out anytime.</p>
          <p>Start exploring your dashboard and enjoy the experience!</p>
          <p>– The Team</p>
        </div>
      `,
    });

    res.status(201).json({
      success: true,
      user: { user: { userName: newUser.userName }, email: newUser.email },
      message: "User created successfully",
    });
  } catch (error) {
    serverError(error, res);
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const token = req.cookies.accessToken; // Get the token from cookies
    console.log("Token from cookies:", token);

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    // Check if user exists
    const user = await USER_MODEL.findOne({ email });
    if (!user || !user.password) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    // Generate tokens
    const tokenData = {
      id: user._id,
      userName: user.userName,
      email: user.email,
      authProvider: user.authProvider || "email"
    };
    const accessToken = generateAccessToken(tokenData);
    const refreshToken = generateRefreshToken(tokenData);

    // Store refresh token in DB
    user.refreshTokens.push(refreshToken);
    await user.save();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true, // Only over HTTPS
      sameSite: "none", // or 'Lax' if you're calling from a subdomain

      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",

      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ success: true, message: "Login successful" });
  } catch (error) {
    serverError(error, res);
  }
};

// const loginUser = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       res.status(400).json({ message: "Email and password are required" });
//       return;
//     }

//     // Check if user exists
//     const user = await USER_MODEL.findOne({ email });
//     if (!user) {
//       res.status(400).json({ message: "Invalid email or password" });
//       return;
//     }

//     // Compare password
//     if (!user.password) {
//       res.status(400).json({ message: "Invalid email or password" });
//       return;
//     }
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       res.status(400).json({ message: "Invalid email or password" });
//       return;
//     }

//     // Generate tokens
//     const tokenData = {
//       id: user._id,
//       userName: user.userName,
//       email: user.email,
//     };
//     const accessToken = generateAccessToken(tokenData);
//     const refreshToken = generateRefreshToken(tokenData);

//     console.log("refreshToken", refreshToken);
//     console.log("user", user);

//     // Store refresh token in the database
//     user.refreshTokens.push(refreshToken);
//     await user.save();

//     res.status(200).json({
//       message: "Login successful",
//       accessToken,
//       refreshToken,
//       // user: {
//       //   id: user._id,
//       //   userName: user.userName,
//       //   email: user.email,
//       // },
//     });
//   } catch (error) {
//     serverError(error, res);
//   }
// };

// const refreshToken = async (req: Request, res: Response) => {
//   try {
//     const { refreshToken } = req.body;

//     if (!refreshToken) {
//       res.status(401).json({ message: "No refresh token provided" });
//       return;
//     }

//     // Verify the refresh token
//     const decoded = jwt.verify(
//       refreshToken,
//       process.env.REFRESH_TOKEN_SECRET!
//     ) as {
//       id: string;
//     };

//     // Find the user
//     const user = await USER_MODEL.findById(decoded.id);
//     if (!user || !user.refreshTokens.includes(refreshToken)) {
//       res.status(403).json({ message: "Invalid refresh token" });
//       return;
//     }

//     // Generate a new access token
//     const tokenData = {
//       id: user._id,
//       userName: user.userName,
//       email: user.email,
//     };
//     const newAccessToken = generateAccessToken(tokenData);

//     res.status(200).json({
//       accessToken: newAccessToken,
//     });
//   } catch (error) {
//     serverError(error, res);
//   }
// };
// test railway

const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken; // Get the refresh token from cookies

  if (!refreshToken) {
    res.status(401).json({ message: "Refresh token is required" });
    return;
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);

    // Generate a new access token
    // const newAccessToken = jwt.sign(
    //   { userId: decoded.userId },
    //   process.env.ACCESS_TOKEN_SECRET!,
    //   { expiresIn: "15m" }
    // );

    // Find user
    const payload = decoded as jwt.JwtPayload & { id: string };
    const user = await USER_MODEL.findOne({ _id: payload.id });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Check if refresh token exists in DB
    if (!user.refreshTokens.includes(refreshToken)) {
      res.status(403).json({ message: "Refresh token not recognized" });
      return;
    }

    const newAccessToken = jwt.sign(
      {
        id: user._id,
        userName: user.userName,
        email: user.email,
      },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: "15m" }
    );

    // Set the new access token as HttpOnly cookie
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000, // 15 minutes for access token expiration
    });

    res.status(200).json({ message: "Access token refreshed" });
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

// const refreshToken = async (req: Request, res: Response) => {
//   try {
//     const { refreshToken } = req.body;

//     if (!refreshToken) {
//       res.status(401).json({ message: "No refresh token provided" });
//       return;
//     }

//     let decoded: any;
//     try {
//       decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
//     } catch (err: any) {
//       // If token is expired, remove it from DB
//       if (err.name === "TokenExpiredError") {
//         await USER_MODEL.updateOne(
//           { refreshTokens: refreshToken },
//           { $pull: { refreshTokens: refreshToken } }
//         );
//         res.status(403).json({ message: "Refresh token expired" });
//         return;
//       }
//       res.status(403).json({ message: "Invalid refresh token" });
//       return;
//     }

//     const user = await USER_MODEL.findById(decoded.id);
//     if (!user || !user.refreshTokens.includes(refreshToken)) {
//       res.status(403).json({ message: "Invalid refresh token" });
//       return;
//     }

//     // Optional: Rotate the refresh token
//     const newRefreshToken = generateRefreshToken({ id: user._id });

//     // First remove the old token
//     await USER_MODEL.updateOne(
//       { _id: user._id },
//       { $pull: { refreshTokens: refreshToken } }
//     );

//     // Then add the new token
//     await USER_MODEL.updateOne(
//       { _id: user._id },
//       { $push: { refreshTokens: newRefreshToken } }
//     );
//     // // Remove old and add new token
//     // await USER_MODEL.updateOne(
//     //   { _id: user._id },
//     //   {
//     //     $pull: { refreshTokens: refreshToken },
//     //     $push: { refreshTokens: newRefreshToken },
//     //   }
//     // );

//     // Generate new access token
//     const tokenData = {
//       id: user._id,
//       userName: user.userName,
//       email: user.email,
//     };
//     const newAccessToken = generateAccessToken(tokenData);

//     res.status(200).json({
//       accessToken: newAccessToken,
//       refreshToken: newRefreshToken,
//     });
//   } catch (error) {
//     serverError(error, res);
//   }
// };

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // Retrieve the token from cookies
  const token = req.cookies.accessToken; // accessToken is the name of the cookie you set

  if (!token) {
    res.status(403).json({ message: "Access token is required" });
    return;
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err: any, user: any) => {
    if (err) {
      res.status(403).json({ message: "Invalid or expired token" });
      return;
    }
    // Attach the user to the request object
    (req as any).user = user;
    next(); // Proceed to the next middleware or route handler
  });
};

// const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

//   if (!token) {
//     res.status(401).json({ message: "Access token is required" });
//     return;
//   }

//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, user) => {
//     console.log("user", user);

//     if (err) {
//       res.status(403).json({ message: "Invalid or expired token" });
//       return;
//     }
//     (req as any).user = user;
//     next();
//   });
// };

const createManagerAccount = async (req: Request, res: Response) => {
  try {
    const { userName, password, restaurantId, firstName, lastName } = req.body;
    const userId = req.user.id;

    if (!userName || !password || !restaurantId || !firstName || !lastName) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const admin = await USER_MODEL.findById(userId);
    if (!admin) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    if (admin.role !== "admin") {
      res.status(401).json({ message: "You are not authorized" });
      return;
    }

    const managerLimits: Record<string, number> = {
      starter: 0,
      business: 3,
      pro: 9,
      ultimate: Infinity,
    };

    const currentManagerCount = await USER_MODEL.countDocuments({
      parentId: admin._id,
    });
    const maxAllowed = managerLimits[admin.plan];

    if (currentManagerCount >= maxAllowed) {
      res.status(401).json({
        message:
          `You have reached the maximum number of managers for this plan ("${admin.plan}") plan.` +
          ` Please upgrade your plan to add more managers.`,
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // const newManager = await USER_MODEL.create({
    //   userName,
    //   password: hashedPassword,
    //   role: "manager",
    //   parentId: admin._id,
    //   restaurantId: restaurantId,
    // });

    const newManager = await Manager_MODEL.create({
      userName,
      firstName,
      lastName,
      password: hashedPassword,
      role: "manager",
      parentId: admin._id,
      restaurantId: restaurantId,
    });

    const updatedAdmin = await USER_MODEL.findByIdAndUpdate(
      admin._id,
      { $push: { managers: newManager._id } },
      { new: true }
    );

    if (!updatedAdmin) {
      res.status(404).json({ message: "Admin not found" });
      return;
    }

    res.status(201).json({
      message: "Manager account created successfully",
      manager: newManager,
    });
  } catch (error) {
    serverError(error, res);
  }
};

// try {
//   const userId = req.user.id;
//   const user = await USER_MODEL.findById(userId).select(
//     "userName email plan role purchasedTemplates"
//   );
//   if (!user) {
//     res.status(404).json({ message: "User not found" });
//     return;
//   }
//   res.status(200).json(user);
// } catch (error) {
//   serverError(error, res);
// }

const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userName = req.user;

    res.status(200).json(userName);
  } catch (error) {
    serverError(error, res);
  }
};

const getCurrentUserSubscriptionPlan = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const user = await USER_MODEL.findById(userId).select("plan");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({ success: true, plan: user.plan });
  } catch (error) {
    serverError(error, res);
  }
};

const getOwnerManagers = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const user = await USER_MODEL.findById(userId).select("managers");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const managers = await Manager_MODEL.find({
      _id: { $in: user.managers },
    }).select("userName role firstName lastName restaurantId");
    res.status(200).json(managers);
  } catch (error) {
    serverError(error, res);
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    // const { refreshToken } = req.body;
    // if (!refreshToken) {
    //   res.status(400).json({ message: "No refresh token provided" });
    //   return;
    // }

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(400).json({ message: "No refresh token provided" });
      return;
    }

    // Decode the token to find the user

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as { id: string };

    // Remove the refresh token from DB
    await USER_MODEL.updateOne(
      { _id: decoded.id },
      { $pull: { refreshTokens: refreshToken } }
    );

    // Clear the cookies
    res.clearCookie("accessToken", {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      secure: true,
      sameSite: "none",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error during logout", error });
  }
};

const updateUserName = async (req: Request, res: Response) => {
  try {
    const { userName } = req.body;
    const userId = req.user.id;

    if (!userName) {
      res.status(400).json({ message: "User name is required" });
      return;
    }

    const updatedUser = await USER_MODEL.findByIdAndUpdate(
      userId,
      { userName },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // update the access token with the new userName
    const tokenData = {
      id: updatedUser._id,
      userName: updatedUser.userName,
      email: updatedUser.email,
      authProvider: updatedUser.authProvider || "email"
    };
    const newAccessToken = generateAccessToken(tokenData);
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 15, // 15 minutes
    });

    res.status(200).json({
      message: "User name updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    serverError(error, res);
  }
};

const checkIfRefreshTokenIsValidAndAvailableInDatabase = async (
  req: Request,
  res: Response
) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res
      .status(401)
      .json({ success: false, message: "Refresh token is required" });
    return;
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as { id: string };

    const user = await USER_MODEL.findById(decoded.id);
    if (!user || !user.refreshTokens.includes(refreshToken)) {
      res
        .status(403)
        .json({ success: false, message: "Invalid or expired refresh token" });
      return;
    }

    res.status(200).json({ success: true, message: "Valid refresh token" });
  } catch (error) {
    res
      .status(403)
      .json({ success: false, message: "Invalid or expired refresh token" });
  }
};

const removeManager = async (req: Request, res: Response) => {
  try {
    const { managerId } = req.params;
    const userId = req.user.id;

    if (!managerId) {
      res.status(400).json({ message: "Manager ID is required" });
      return;
    }

    const admin = await USER_MODEL.findById(userId);
    if (!admin || admin.role !== "admin") {
      res.status(401).json({ message: "You are not authorized" });
      return;
    }

    const manager = await Manager_MODEL.findById(managerId);
    if (!manager || manager.parentId.toString() !== admin._id.toString()) {
      res.status(404).json({ message: "Manager not found" });
      return;
    }

    // Remove the manager from the admin's managers list
    admin.managers = admin.managers.filter(
      (id) => id.toString() !== managerId.toString()
    );
    await admin.save();

    // Delete the manager account
    await Manager_MODEL.findByIdAndDelete(managerId);

    res
      .status(200)
      .json({ success: true, message: "Manager removed successfully" });
  } catch (error) {
    serverError(error, res);
  }
};

const editManagerDetails = async (req: Request, res: Response) => {
  try {
    const { managerId } = req.params;
    const { userName, password, firstName, lastName } = req.body;
    const userId = req.user.id;

    console.log("managerId", managerId);

    if (!managerId) {
      res.status(400).json({ message: "Manager ID is required" });
      return;
    }

    const admin = await USER_MODEL.findById(userId);
    if (!admin || admin.role !== "admin") {
      res.status(401).json({ message: "You are not authorized" });
      return;
    }

    const manager = await Manager_MODEL.findById(managerId);
    if (!manager || manager.parentId.toString() !== admin._id.toString()) {
      res.status(404).json({ message: "Manager not found" });
      return;
    }

    manager.userName = userName || manager.userName;

    manager.firstName = firstName || manager.firstName;

    manager.lastName = lastName || manager.lastName;

    if (password) {
      manager.password = (await bcrypt.hash(password, 10)) || manager.password;
    }

    await manager.save();

    res.status(200).json({
      success: true,
      message: "Manager details updated successfully",
      manager,
    });
  } catch (error) {
    serverError(error, res);
  }
};

const loginManagerAccount = async (req: Request, res: Response) => {
  try {
    const { userName, password } = req.body;
    if (!userName || !password) {
      res.status(400).json({ message: "Username and password are required" });
      return;
    }
    // Find the manager by username
    const manager = await Manager_MODEL.findOne({ userName, role: "manager" });

    if (!manager) {
      res.status(404).json({ message: "username or password are invalid!" });
      return;
    }

    // Check if the manager has a password set
    if (!manager.password) {
      res.status(400).json({ message: "Manager account has no password set" });
      return;
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, manager.password);
    if (!isMatch) {
      res.status(400).json({ message: "username or password are invalid!" });
      return;
    }

    // Check if the manager is linked to an admin
    if (!manager.parentId) {
      res
        .status(400)
        .json({ message: "Manager account is not linked to an admin" });
      return;
    }

    // Check if the manager's parent admin exists
    const admin = await USER_MODEL.findById(manager.parentId);
    if (!admin) {
      res.status(404).json({ message: "Admin not found" });
      return;
    }

    // get all the restaurant meals for the manager based on manager restaurantId
    const meals = await MEAL_MODEL.find({
      restaurant: manager.restaurantId,
    }).populate("category", "name");
    if (!meals) {
      res.status(404).json({ message: "No meals found for this manager" });
      return;
    }

    // Generate tokens
    // const tokenData = {
    //   id: manager._id,
    //   userName: manager.userName,
    //   email: manager.email,

    // };
    // const accessToken = generateAccessToken(tokenData);
    // const refreshToken = generateRefreshToken(tokenData);
    // Store refresh token in DB
    // manager.refreshTokens.push(refreshToken);

    // await manager.save();
    // res.cookie("accessToken", accessToken, {
    //   httpOnly: true,
    //   // secure: process.env.NODE_ENV === "production",
    //   secure: true,
    //   sameSite: "none",

    //   maxAge: 15 * 60 * 1000, // 15 minutes
    // });
    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   // secure: process.env.NODE_ENV === "production",
    //   secure: true,
    //   sameSite: "none",
    //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    // });
    res.status(200).json({ success: true, meals, message: "Login successful" });
  } catch (error) {
    serverError(error, res);
  }
};

const updateUserInfo = async (req: Request, res: Response) => {
  try {
    const { userName, email } = req.body;
    const userId = req.user.id;

    const user = await USER_MODEL.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    user.userName = userName || user.userName;
    user.email = email || user.email;
    await user.save();
    // generate access token cookie
    res.cookie(
      "accessToken",
      generateAccessToken({
        id: user._id,
        userName: user.userName,
        email: user.email,
        authProvider: user.authProvider || "email"
      }),
      {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        secure: true,
        sameSite: "none",
        maxAge: 15 * 60 * 1000, // 15 minutes
      }
    );

    res.status(200).json({
      message: "User information updated successfully",
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
      },
    });
  } catch (error) {
    serverError(error, res);
  }
};

const changeUserPassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const userId = req.user.id;
    const user = await USER_MODEL.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    // if (!user.password) {
    //   res.status(400).json({ message: "User has no password set" });
    //   return;
    // }
    // Check if current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password || "");
    if (!isMatch) {
      res.status(400).json({ message: "Current password is incorrect" });
      return;
    }

    // Check if new password and confirm password match
    if (newPassword !== confirmNewPassword) {
      res
        .status(400)
        .json({ message: "New password and confirm password do not match" });
      return;
    }

    // Validate new password strength
    if (!isSimpleStrongPassword(newPassword)) {
      res.status(400).json({
        message:
          "Password must be at least 8 characters long and include at least one letter and one number.",
      });
      return;
    }
    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    // Update the user's password
    user.password = hashedNewPassword;
    await user.save();
    // generate access token cookie
    // res.cookie(
    //   "accessToken",
    //   generateAccessToken({
    //     id: user._id,
    //     userName: user.userName,
    //     email: user.email,
    //   }),
    //   {
    //     httpOnly: true,
    //     // secure: process.env.NODE_ENV === "production",
    //     secure: true,
    //     sameSite: "none",
    //     maxAge: 15 * 60 * 1000, // 15 minutes
    //   }
    // );

    res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    serverError(error, res);
  }
};

function extractPublicIdFromUrl(imageUrl: string): string | null {
  try {
    const parts = imageUrl.split("/upload/");
    if (parts.length < 2) return null;

    // Remove the version (e.g., "v1746601109") and extension
    const pathSegments = parts[1].split("/");
    pathSegments.shift(); // remove version
    const publicIdWithExt = pathSegments.join("/");
    const publicId = publicIdWithExt.split(".")[0];

    return publicId;
  } catch (error) {
    return null;
  }
}

const deleteUserAccount = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    const userId = req.user.id;
    const user = await USER_MODEL.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.authProvider === "email" && !password) {
      res.status(400).json({ message: "Password is required for email users" });
      return;
    }

    // If the user has a password, verify it
    if (user.authProvider === "email") {
      const isMatch = await bcrypt.compare(password, user.password || "");
      if (!isMatch) {
        res.status(400).json({ message: "Password is incorrect" });
        return;
      }
    }

    // if (user.authProvider === "google" && !user?.password) {
    //   res.status(400).json({
    //     message:
    //       "You must create a password to delete your account. Please set a password in your account settings.",
    //   });
    //   return;
    // }

    // if (user.authProvider === "google" && password) {
    //   const isMatch = await bcrypt.compare(password, user.password || "");
    //   if (!isMatch) {
    //     res
    //       .status(400)
    //       .json({ message: "Password is incorrect please try again." });
    //     return;
    //   }
    // }

    // Delete the user account
    await USER_MODEL.findByIdAndDelete(userId);

    const restaurants = await RESTAURANT_MODEL.find({ owner: userId });

    // Optionally, you can also delete related data like meals, templates, etc.

    await Manager_MODEL.deleteMany({ parentId: userId });

    // delete the cloudinary images associated with the user
    try {
      for (const restaurant of restaurants) {
        // Delete QR Code
        if (!restaurant.qrCodeUrl) continue;
        const qrId = extractPublicIdFromUrl(restaurant.qrCodeUrl);
        if (qrId) await cloudinary.uploader.destroy(qrId);

        // Delete meal images
        const meals = await MEAL_MODEL.find({ restaurant: restaurant._id });
        for (const meal of meals) {
          if (!meal.imageUrl) continue;
          const mealId = extractPublicIdFromUrl(meal.imageUrl);
          if (mealId) await cloudinary.uploader.destroy(mealId);
        }

        // TODO: If you store other assets (icons, banners, etc.), delete here
        //delete restaurant languages icons
        if (restaurant.languages && restaurant.languages.length > 0) {
          for (const lang of restaurant.languages) {
            if (!lang.iconUrl) continue;
            const langIconId = extractPublicIdFromUrl(lang.iconUrl);
            if (langIconId) await cloudinary.uploader.destroy(langIconId);
          }
        }
      }
    } catch (cloudErr) {
      console.error("Error deleting Cloudinary images:", cloudErr);
    }

    const restaurantIds = restaurants.map((r) => r._id);
    await MEAL_MODEL.deleteMany({ restaurant: { $in: restaurantIds } });

    await TEMPLATE_MODEL.deleteMany({ restaurantId: { $in: restaurantIds } });
    // delete user restaurant
    await RESTAURANT_MODEL.findByIdAndDelete(restaurants[0]._id);

    // Clear cookies
    res.clearCookie("accessToken", {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      secure: true,
      sameSite: "none",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      secure: true,
      sameSite: "none",
    });
    res.status(200).json({
      success: true,
      message: "User account deleted successfully",
    });
  } catch (error) {
    serverError(error, res);
  }
};

export {
  createNewUser,
  loginUser,
  refreshToken,
  authenticateToken,
  createManagerAccount,
  getCurrentUser,
  getCurrentUserSubscriptionPlan,
  getOwnerManagers,
  logout,
  updateUserName,
  checkIfRefreshTokenIsValidAndAvailableInDatabase,
  removeManager,
  editManagerDetails,
  loginManagerAccount,
  updateUserInfo,
  changeUserPassword,
  deleteUserAccount,
};
