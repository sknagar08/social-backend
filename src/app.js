import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { V1_API_ROUTE } from "./constants.js";
import { userRouter } from "./routes/user.route.js";
import { healthcheckRouter } from "./routes/healthcheck.route.js";
import { tweetRouter } from "./routes/tweet.route.js";
import { subscriptionRouter } from "./routes/subscription.route.js";
import { videoRouter } from "./routes/video.route.js";
import { commentRouter } from "./routes/comment.route.js";
import { likeRouter } from "./routes/like.route.js";
import { playlistRouter } from "./routes/playlist.route.js";
import { dashboardRouter } from "./routes/dashboard.route.js";
import { ApiError } from "./utils/ApiError.js";

export const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use(`${V1_API_ROUTE}/healthcheck`, healthcheckRouter);
app.use(`${V1_API_ROUTE}/users`, userRouter);
app.use(`${V1_API_ROUTE}/tweets`, tweetRouter);
app.use(`${V1_API_ROUTE}/subscriptions`, subscriptionRouter);
app.use(`${V1_API_ROUTE}/videos`, videoRouter);
app.use(`${V1_API_ROUTE}/comments`, commentRouter);
app.use(`${V1_API_ROUTE}/likes`, likeRouter);
app.use(`${V1_API_ROUTE}/playlist`, playlistRouter);
app.use(`${V1_API_ROUTE}/dashboard`, dashboardRouter);

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(err);
  }

  console.error(err);
  const statusCode =
    Number.isInteger(err.status) && err.status >= 400 && err.status < 600
      ? err.status
      : 500;

  return res.status(statusCode).json({
    statusCode,
    data: null,
    message:
      statusCode >= 500
        ? "Internal server error"
        : err.message || "Request failed",
    success: false,
    errors: [],
  });
});
