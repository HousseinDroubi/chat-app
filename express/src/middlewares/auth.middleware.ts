import { Request, Response, NextFunction } from "express";
import { getIdFromToken } from "../functions/id";
import User from "../models/user.model";
import { userModelInterface } from "../interfaces/model";
declare module "express-serve-static-core" {
  interface Request {
    _id?: string;
    user?: userModelInterface;
  }
}

const getIdAndStop = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const _id = getIdFromToken(req.headers.authorization);
  if (!_id) return res.status(401).json({ error: "invalid_id" });
  req._id = _id;
  next();
};

const getUserAndStop = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const _id = req._id;
  const user = await User.findById(_id);
  if (!user) return res.status(404).json({ error: "invalid_user" });
  req.user = user;
  next();
};

export { getIdAndStop, getUserAndStop };
