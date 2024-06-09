import mongoose from "mongoose";
import { messageModelInterface } from "../interfaces/model";

const schema = new mongoose.Schema<messageModelInterface>({
  from: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  to: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  is_text: {
    required: true,
    type: Boolean,
  },
  content: {
    required: true,
    type: String,
  },
  date: {
    required: false,
    type: Date,
    default: Date.now,
  },
  seen: {
    required: false,
    type: Boolean,
    default: false,
  },
});

const Message = mongoose.model("messages", schema);
export { Message };
