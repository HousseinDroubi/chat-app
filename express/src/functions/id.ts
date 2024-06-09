import jsonwebtoken, { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";

const getIdFromToken = (token: string | undefined): null | string => {
  if (!token || !process.env.PRIVATE_KEY) return null;

  try {
    const { _id } = jsonwebtoken.verify(
      token.split(" ")[1],
      process.env.PRIVATE_KEY
    ) as JwtPayload;

    return _id;
  } catch (err) {
    return null;
  }
};

const checkObjectIdIfValid = (_id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(_id);
};

export { getIdFromToken, checkObjectIdIfValid };
