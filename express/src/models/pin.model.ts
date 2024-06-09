import mongoose from "mongoose";
import { pinModelInterface } from "../interfaces/model";

const schema = new mongoose.Schema<pinModelInterface>({
  user_id: {
    required: true,
    unique: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  pin: { type: String, required: true },
  created_at: { type: Date, default: Date.now, index: { expires: "1h" } },
});

const Pin = mongoose.model("pins", schema);
export { Pin };
