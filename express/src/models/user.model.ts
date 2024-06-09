import mongoose from "mongoose";
import { userModelInterface } from "../interfaces/model";

const schema = new mongoose.Schema<userModelInterface>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String || null,
    required: false,
    default: null,
  },
  profile_url: {
    type: String,
    required: false,
    default: null,
  },
  is_verified: {
    type: Boolean,
    required: false,
    default: false,
  },
  is_online: {
    type: Boolean,
    required: false,
    default: false,
  },
  last_seen: {
    type: Date || null,
    required: false,
    default: Date.now(),
  },
});

const User = mongoose.model("users", schema);
export default User;
