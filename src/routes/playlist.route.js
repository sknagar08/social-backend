import { Router } from "express";
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller.js";
import { verifyAccessToken } from "../middlewares/auth.middleware.js";

export const playlistRouter = Router();

playlistRouter.use(verifyAccessToken);
playlistRouter.route("/").post(createPlaylist);
playlistRouter
  .route("/:playlistId")
  .get(getPlaylistById)
  .patch(updatePlaylist)
  .delete(deletePlaylist);
playlistRouter.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist);
playlistRouter
  .route("/remove/:videoId/:playlistId")
  .patch(removeVideoFromPlaylist);
playlistRouter.route("/user/:userId").get(getUserPlaylists);
