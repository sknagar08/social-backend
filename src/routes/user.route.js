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
userRouter.route("/login").post(loginUser);
userRouter.route("/refresh-token").post(refreshAccessToken);

userRouter.use(verifyAccessToken);

userRouter.route("/").get(getCurrentUser);
userRouter.route("/logout").post(logoutUser);
userRouter.route("/change-password").post(changeCurrentPassword);
userRouter.route("/update-details").patch(updateUserDetails);
userRouter
  .route("/update-avatar")
  .patch(upload.single("avatar"), updateUserAvatar);
userRouter
  .route("/update-cover-image")
  .patch(upload.single("coverImage"), updateUserCoverImage);
userRouter.route("/c/:username").get(getUserChannelDetails);
userRouter.route("/history").get(getWatchHistory);
