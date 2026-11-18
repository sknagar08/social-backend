import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { Like } from "../models/like.model.js";
import { Tweet } from "../models/tweet.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Please provide a video id");
  }
  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Please provide a valid video id");
  }

  if (!(await Video.exists({ _id: videoId }))) {
    throw new ApiError(404, "Video not found");
  }

  const like = await Like.findOne({ video: videoId, likedBy: req.user._id });
  if (like) {
    await Like.deleteOne({ _id: like._id });
    res
      .status(200)
      .json(
        new ApiResponse(200, { liked: false }, "Unliked video successfully")
      );
  } else {
    try {
      await Like.create({ video: videoId, likedBy: req.user._id });
      res
        .status(200)
        .json(
          new ApiResponse(200, { liked: true }, "Liked video successfully")
        );
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        throw new ApiError(
          400,
          "Invalid like data",
          Object.values(error.errors).map(
            (validationError) => validationError.message
          )
        );
      }

      if (error.code === 11000) {
        throw new ApiError(409, "You have already liked this video");
      }

      throw new ApiError(500, "Some error occured when liking the video");
    }
  }
});

export const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!commentId) {
    throw new ApiError(400, "Please provide a comment id");
  }
  if (!mongoose.isValidObjectId(commentId)) {
    throw new ApiError(400, "Please provide a valid comment id");
  }

  if (!(await Comment.exists({ _id: commentId }))) {
    throw new ApiError(404, "Comment not found");
  }

  const like = await Like.findOne({
    comment: commentId,
    likedBy: req.user._id,
  });
  if (like) {
    await Like.deleteOne({ _id: like._id });
    res
      .status(200)
      .json(
        new ApiResponse(200, { liked: false }, "Unliked comment successfully")
      );
  } else {
    try {
      await Like.create({ comment: commentId, likedBy: req.user._id });
      res
        .status(200)
        .json(
          new ApiResponse(200, { liked: true }, "Liked comment successfully")
        );
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        throw new ApiError(
          400,
          "Invalid like data",
          Object.values(error.errors).map(
            (validationError) => validationError.message
          )
        );
      }

      if (error.code === 11000) {
        throw new ApiError(409, "You have already liked this comment");
      }

      throw new ApiError(500, "Some error occured when liking the comment");
    }
  }
});

export const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!tweetId) {
    throw new ApiError(400, "Please provide a tweet id");
  }
  if (!mongoose.isValidObjectId(tweetId)) {
    throw new ApiError(400, "Please provide a valid tweet id");
  }

  if (!(await Tweet.exists({ _id: tweetId }))) {
    throw new ApiError(404, "Tweet not found");
  }

  const like = await Like.findOne({
    tweet: tweetId,
    likedBy: req.user._id,
  });
  if (like) {
    await Like.deleteOne({ _id: like._id });
    res
      .status(200)
      .json(
        new ApiResponse(200, { liked: false }, "Unliked tweet successfully")
      );
  } else {
    try {
      await Like.create({ tweet: tweetId, likedBy: req.user._id });
      res
        .status(200)
        .json(
          new ApiResponse(200, { liked: true }, "Liked tweet successfully")
        );
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        throw new ApiError(
          400,
          "Invalid like data",
          Object.values(error.errors).map(
            (validationError) => validationError.message
          )
        );
      }

      if (error.code === 11000) {
        throw new ApiError(409, "You have already liked this tweet");
      }

      throw new ApiError(500, "Some error occured when liking the tweet");
    }
  }
});

export const getLikedVideos = asyncHandler(async (req, res) => {
  const videos = await Like.find(
    {
      likedBy: req.user._id,
      video: { $exists: true, $ne: null },
    },
    "video"
  ).populate("video", "thumbnail title owner");

  res
    .status(200)
    .json(new ApiResponse(200, videos, "Liked videos fetched successfully"));
});

export const getLikedCommets = asyncHandler(async (req, res) => {
  const comments = await Like.find(
    {
      likedBy: req.user._id,
      comment: { $exists: true, $ne: null },
    },
    "comment"
  ).populate("comment", "content owner");

  res
    .status(200)
    .json(
      new ApiResponse(200, comments, "Liked comments fetched successfully")
    );
});

export const getLikedTweets = asyncHandler(async (req, res) => {
  const tweets = await Like.find(
    {
      likedBy: req.user._id,
      tweet: { $exists: true, $ne: null },
    },
    "tweet"
  ).populate("tweet");

  res
    .status(200)
    .json(new ApiResponse(200, tweets, "Liked tweets fetched successfully"));
});
