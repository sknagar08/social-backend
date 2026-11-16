import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentUser,
  getUserChannelDetails,
  getWatchHistory,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateUserAvatar,
  updateUserCoverImage,
  updateUserDetails,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyAccessToken } from "../middlewares/auth.middleware.js";

export const userRouter = Router();

userRouter.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

userRouter.route("/").get(verifyAccessToken, getCurrentUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(verifyAccessToken, logoutUser);
userRouter.route("/refresh-token").post(refreshAccessToken);
userRouter
  .route("/change-password")
  .post(verifyAccessToken, changeCurrentPassword);
userRouter.route("/update-details").post(verifyAccessToken, updateUserDetails);
userRouter
  .route("/update-avatar")
  .post(verifyAccessToken, upload.single("avatar"), updateUserAvatar);
userRouter
  .route("/update-cover-image")
  .post(verifyAccessToken, upload.single("coverImage"), updateUserCoverImage);
userRouter.route("/c/:username").get(verifyAccessToken, getUserChannelDetails);
userRouter.route("/history").get(verifyAccessToken, getWatchHistory);
