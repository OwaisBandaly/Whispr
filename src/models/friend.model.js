import mongoose, { Schema } from "mongoose";

// creating schema.
const friendSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "accepted"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// creating model based on the above schema.
export const Friend = mongoose.model("Friend", friendSchema)