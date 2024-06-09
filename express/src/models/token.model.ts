import mongoose from "mongoose";
import { tokenModelInterface } from "../interfaces/model";

const schema = new mongoose.Schema<tokenModelInterface>({
  user_id: {
    required: true,
    unique: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  created_at: { type: Date, default: Date.now(), index: { expires: "1h" } },
  token: { type: String, required: true },
});

const Token = mongoose.model("tokens", schema);
export { Token };
