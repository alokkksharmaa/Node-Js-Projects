import mongoose from "mongoose";

const clickSchema = new mongoose.Schema({
  shortCode: {
    type: String,
    required: true,
    index: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  ip: { type: String },
  userAgent: { type: String },
  referer: { type: String },
  country: { type: String }
});

const Click = mongoose.model("Click", clickSchema);
export default Click;
