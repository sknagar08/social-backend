import { Router } from "express";
import {
  getChannelStats,
  getChannelVideos,
} from "../controllers/dashboard.controller.js";
import { verifyAccessToken } from "../middlewares/auth.middleware.js";

export const dashboardRouter = Router();

dashboardRouter.use(verifyAccessToken);

dashboardRouter.route("/stats").get(getChannelStats);
dashboardRouter.route("/videos").get(getChannelVideos);
