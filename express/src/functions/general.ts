import jsonwebtoken from "jsonwebtoken";
import mongoose from "mongoose";

const generateToken = (_id: mongoose.Types.ObjectId) => {
  return jsonwebtoken.sign(
    {
      _id: String(_id),
    },
    process.env.PRIVATE_KEY as string,
    {
      expiresIn: "7d",
    }
  );
};

export { generateToken };
