import { Router } from "express";
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
} from "../controllers/subscription.controller.js";
import { verifyAccessToken } from "../middlewares/auth.middleware.js";

export const subscriptionRouter = Router();

subscriptionRouter.use(verifyAccessToken);

subscriptionRouter
  .route("/c/:channelId")
  .get(getSubscribedChannels)
  .post(toggleSubscription);
subscriptionRouter.route("/u/:subscriberId").get(getUserChannelSubscribers);
