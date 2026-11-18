import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const myCustomLabels = {
    totalDocs: "totalCommentsCount",
    docs: "commnetsList",
    limit: "commentPerPage",
    page: "currentPage",
    nextPage: "next",
    prevPage: "prev",
    totalPages: "totalPagesCount",
    hasPrevPage: "hasPrev",
    hasNextPage: "hasNext",
    pagingCounter: "pageCounter",
    meta: "paginator",
  };
  const paginationOptions = {
    page,
    limit,
    customLabels: myCustomLabels,
  };

  if (!videoId) {
    throw new ApiError(
      400,
      "Please provide a video id to which comment should be added"
    );
  }

  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Please provide a valid video id");
  }

  if (!(await Video.exists({ _id: videoId }))) {
    throw new ApiError(404, "Video not found");
  }

  const comments = Comment.aggregate([
    { $match: { video: new mongoose.Types.ObjectId(videoId) } },
  ]);
  const pagedComments = await Comment.aggregatePaginate(
    comments,
    paginationOptions
  );

  res
    .status(200)
    .json(new ApiResponse(200, pagedComments, "Comments fetched successfully"));
});

export const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(
      400,
      "Please provide a video id to which comment should be added"
    );
  }

  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Please provide a valid video id");
  }

  if (!(await Video.exists({ _id: videoId }))) {
    throw new ApiError(404, "Video not found");
  }

  const { content } = req.body;

  if (!content?.trim()) {
    throw new ApiError(
      400,
      "Please provide some content. What will we add if there is no content in a comment :)"
    );
  }

  const comment = await Comment.create({
    content: content.trim(),
    video: videoId,
    owner: req.user?._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment added successfully"));
});

export const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!mongoose.isValidObjectId(commentId)) {
    throw new ApiError(400, "Please provide a valid comment id");
  }

  if (!(await Video.exists({ _id: commentId }))) {
    throw new ApiError(404, "Video not found");
  }

  const comment = await Comment.findById(commentId);

  if (!comment.owner.equals(req.user._id)) {
    throw new ApiError(401, "You can not edit this comment");
  }

  const { content } = req.body;
  if (!content?.trim()) {
    throw new ApiError(
      400,
      "Please provide some content. What will we update if there is no content in a comment :)"
    );
  }

  if (content.trim() !== comment.content) {
    comment.content = content.trim();
    const updatedComment = await comment.save({ validateBeforeSave: false });
    res
      .status(200)
      .json(
        new ApiResponse(200, updatedComment, "Comment updated successfully")
      );
  }

  res
    .status(200)
    .json(new ApiResponse(200, comment, "Content is same as previous"));
});

export const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!mongoose.isValidObjectId(commentId)) {
    throw new ApiError(400, "Please provide a valid comment id");
  }

  if (!(await Video.exists({ _id: commentId }))) {
    throw new ApiError(404, "Video not found");
  }

  const comment = await Comment.findById(commentId);

  if (!comment.owner.equals(req.user._id)) {
    throw new ApiError(401, "You can not delete this comment");
  }

  await Comment.deleteOne({ _id: comment._id });

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});
