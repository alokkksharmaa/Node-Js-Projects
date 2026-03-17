import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortCode: {
    type: String,
    unique: true,
    index: true,
    required: true,
  },
  customAlias: {
    type: String,
    unique: true,
    sparse: true, // Allows nulls to not clash on uniqueness
  },
  expiresAt: {
    type: Date,
    index: { expires: 0 }, // TTL index
  },
  clickCount: {
    type: Number,
    default: 0,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  }
}, { timestamps: true });

const Url = mongoose.model("Url", urlSchema);
export default Url;
