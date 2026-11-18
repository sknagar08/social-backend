import { Schema, model } from "mongoose";

const likeSchema = new Schema(
  {
    likedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tweet: {
      type: Schema.Types.ObjectId,
      ref: "Tweet",
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  },
  { timestamps: true }
);

// A user can like a given video, comment, or tweet only once.
likeSchema.index(
  { likedBy: 1, video: 1 },
  { unique: true, partialFilterExpression: { video: { $type: "objectId" } } }
);
likeSchema.index(
  { likedBy: 1, comment: 1 },
  { unique: true, partialFilterExpression: { comment: { $type: "objectId" } } }
);
likeSchema.index(
  { likedBy: 1, tweet: 1 },
  { unique: true, partialFilterExpression: { tweet: { $type: "objectId" } } }
);

// Every Like document must point to exactly one target.
likeSchema.pre("validate", function () {
  const targetCount = [this.video, this.comment, this.tweet].filter(
    (target) => target != null
  ).length;

  if (targetCount !== 1) {
    this.invalidate(
      "video",
      "A like must target exactly one video, comment, or tweet"
    );
  }
});

export const Like = model("Like", likeSchema);
