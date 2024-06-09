import mongoose, { Document } from "mongoose";

interface userModelInterface extends Document {
  email: string;
  username: string;
  password?: string | null;
  profile_url: string;
  is_verified: boolean;
  is_online: boolean;
  last_seen: Date | null;
}

interface pinModelInterface extends Document {
  user_id: mongoose.Schema.Types.ObjectId;
  pin: string;
  created_at: Date;
}

interface tokenModelInterface extends Document {
  user_id: mongoose.Schema.Types.ObjectId;
  token: string;
  created_at: Date;
}

interface messageModelInterface extends Document {
  from: mongoose.Schema.Types.ObjectId;
  to: mongoose.Schema.Types.ObjectId;
  is_text: boolean;
  content: string;
  date: Date;
  seen: boolean;
}

export {
  userModelInterface,
  pinModelInterface,
  tokenModelInterface,
  messageModelInterface,
};
