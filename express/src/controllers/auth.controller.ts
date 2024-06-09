import { Request, Response, response } from "express";
import {
  validateChangeForgottenPassword,
  validateChangePassword,
  validateContinueWithGoogle,
  validateCreateAccount,
  validateLogin,
  validateSendPin,
  validateUpdateInfo,
  validateVerifyUser,
} from "../validations/auth.validation";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import Singleton from "../singleton/Singleton";
import { generateToken } from "../functions/general";
import {
  createFolderForNewUser,
  deleteFile,
  moveFile,
} from "../functions/file-manager";
import {
  changeForgottenPasswordInterface,
  changePasswordInterface,
  createAccountInterface,
  loginInterface,
  sendPinInterface,
  updateInfoInterface,
} from "../interfaces/controller-validation";
import path from "path";
import { Token } from "../models/token.model";
import crypto from "crypto";
import sendEmail from "../emails/scripts/email";
import { Pin } from "../models/pin.model";
import { Message } from "../models/message.model";
dotenv.config();

const login = async (req: Request, res: Response) => {
  const { error } = validateLogin(req.body);

  if (error) return res.status(400).json({ error: error.details[0].message });

  const body: loginInterface = req.body;

  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(401).json({ error: "wrong_email_or_password" });

  if (!user.password)
    return res.status(405).json({ error: "email_registered_with_google" });

  const compare_result = await bcrypt.compare(body.password, user.password);
  if (!compare_result)
    return res.status(401).json({ error: "wrong_email_or_password" });

  if (!user.is_verified)
    return res.status(405).json({ error: "user_not_verified" });

  const token = generateToken(user._id);

  const users = await User.find(
    {
      _id: { $ne: user._id },
      is_verified: true,
    },
    "_id username profile_url is_online last_seen"
  );

  const messages = await Message.find({
    $or: [{ from: user._id }, { to: user._id }],
  });

  return res.status(200).json({
    result: "logged_in",
    _id: user._id,
    username: user.username,
    profile_url: `http://localhost:${process.env.PORT}/${user._id}/${user.profile_url}`,
    messages,
    users,
    token,
  });
};

const continueWithGoogle = async (req: Request, res: Response) => {
  const { error } = validateContinueWithGoogle({
    uid: req.params.uid,
  });

  if (error) return res.status(400).json({ error: error.details[0].message });

  const singleton = Singleton.getInstance();

  const user_record = await singleton.getUser(req.params.uid);
  if (!user_record) return res.status(401).json({ error: "wrong_uid" });

  let user, token;

  user = await User.findOne({ email: user_record.email });

  if (user) {
    // User existed before
    token = generateToken(user._id);

    const messages = await Message.find({
      $or: [{ from: user._id }, { to: user._id }],
    });

    const users = await User.find(
      {
        _id: { $ne: user._id },
        is_verified: true,
      },
      "_id username profile_url is_online last_seen"
    );

    return res.status(200).json({
      result: "logged_in",
      _id: user._id,
      username: user.username,
      profile_url: !user.profile_url
        ? null
        : user.profile_url.includes("googleusercontent")
        ? user.profile_url
        : `http://localhost:${process.env.PORT}/${user._id}/${user.profile_url}`,
      messages,
      users,
      token,
    });
  }

  user = await User.create({
    username: user_record.displayName?.toLowerCase().replace(" ", "_"),
    email: user_record.email,
    profile_url: user_record.photoURL,
    is_verified: true,
  });

  await createFolderForNewUser(user._id);

  token = generateToken(user._id);

  const users = await User.find(
    {
      _id: { $ne: user._id },
      is_verified: true,
    },
    "_id username profile_url is_online last_seen"
  );

  return res.status(201).json({
    result: "logged_in",
    _id: user._id,
    username: user.username,
    profile_url: user.profile_url,
    messages: [],
    users,
    token,
  });
};

const createAccount = async (req: Request, res: Response) => {
  const { error } = validateCreateAccount(req.body);

  if (error) return res.status(400).json({ error: error.details[0].message });

  const body: createAccountInterface = req.body;

  const user_existed = await User.findOne({ email: body.email });
  if (user_existed) {
    await deleteFile(path.join(req.file?.path!));
    return res.status(409).json({ error: "user_existed" });
  }

  const username_taken = await User.findOne({ username: body.username });

  if (username_taken) {
    await deleteFile(path.join(req.file?.path!));
    return res.status(409).json({ error: "username_taken" });
  }

  const salt = await bcrypt.genSalt(Number(process.env.SALT_NUMBER));

  const hashed_password = await bcrypt.hash(body.password, salt);

  const user = await User.create({
    email: body.email,
    username: body.username,
    password: hashed_password,
  });

  await createFolderForNewUser(user._id);

  await moveFile(
    req.file?.path!,
    path.join(__dirname, `../public/${String(user._id)}/${req.file?.filename}`)
  );

  user.profile_url = req.file?.filename as string;
  await user.save();

  const token = await Token.create({
    user_id: user._id,
    token: crypto.randomBytes(32).toString("hex"),
  });

  const text = `${process.env.FRONTEND_URL}/verify_account/${token.token}`;

  await sendEmail(user.email, "Activate Account", text, false);

  return res.status(201).json({
    result: "user_created",
  });
};

const verifyAccount = async (req: Request, res: Response) => {
  const { error } = validateVerifyUser({ token: req.params.token as string });
  if (error) return res.status(400).json({ error: error.details[0].message });

  const token = await Token.findOne({ token: req.params.token });

  if (!token)
    return res.status(404).json({
      error: "wrong_token",
    });

  const user = await User.findById(token.user_id);
  if (!user) return res.status(401).json({ error: "invalid_user" });

  if (user.is_verified)
    return res.status(405).json({ error: "user_already_verified" });

  user.is_verified = true;
  await user.save();

  await token.deleteOne();

  return res.status(202).json({
    result: "verified",
  });
};

const sendPin = async (req: Request, res: Response) => {
  const { error } = validateSendPin({
    email: req.params.email,
  });

  if (error) return res.status(400).json({ error: error.details[0].message });

  const body: sendPinInterface = { email: req.params.email };

  const user = await User.findOne({ email: body.email });
  if (!user) return res.status(404).json({ error: "invalid_user" });

  const pin_existed = await Pin.findOne({ user_id: user._id });
  if (pin_existed) return res.status(404).json({ error: "pin_existed" });

  const random_number = Math.floor(Math.random() * 900000) + 100000;
  const salt = await bcrypt.genSalt(Number(process.env.SALT_NUMBER));
  const hashed_pin = await bcrypt.hash(String(random_number), salt);

  await Pin.create({ user_id: user._id, pin: hashed_pin });

  await sendEmail(user.email, "Reset Password", String(random_number), true);

  return res.status(201).json({
    result: "pin_sent",
  });
};

const changeForgottenPassword = async (req: Request, res: Response) => {
  const { error } = validateChangeForgottenPassword(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const body: changeForgottenPasswordInterface = req.body;

  const user = await User.findOne({ email: body.email });
  if (!user) return res.status(404).json({ error: "invalid_user" });

  const pin = await Pin.findOne({ user_id: user._id });
  if (!pin) return res.status(404).json({ error: "pin_not_found" });

  const valid_pin = await bcrypt.compare(body.pin, pin.pin);
  if (!valid_pin) return res.status(401).json({ error: "wrong_pin" });

  const salt = await bcrypt.genSalt(Number(process.env.SALT_NUMBER));
  const hashed_password = await bcrypt.hash(body.password, salt);

  user.password = hashed_password;
  await user.save();

  await pin.deleteOne();

  return res.status(202).json({
    result: "password_updated",
  });
};

const changePassword = async (req: Request, res: Response) => {
  if (!req.user?.password)
    return res.status(405).json({
      error: "account_created_with_google",
    });

  const { error } = validateChangePassword(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const body: changePasswordInterface = req.body;

  const old_password_valid = await bcrypt.compare(
    body.old_password,
    req.user?.password as string
  );

  if (!old_password_valid)
    return res.status(406).json({
      error: "old_password_wrong",
    });

  const salt = await bcrypt.genSalt(Number(process.env.SALT_NUMBER));
  const hashed_password = await bcrypt.hash(body.new_password, salt);

  req.user.password = hashed_password;
  await req.user.save();

  return res.status(200).json({
    result: "password_changed",
  });
};

const updateInfo = async (req: Request, res: Response) => {
  const body: updateInfoInterface = req.body;
  const user = req.user!;

  if (!req.file && !body.username)
    return res.status(406).json({ error: "username_or_image_required" });

  if (body.username) {
    const { error } = validateUpdateInfo(body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const is_username_taken = await User.exists({ username: body.username });
    if (is_username_taken)
      return res.status(409).json({
        result: "username_taken",
      });

    user.username = body.username;
  }
  if (req.file) {
    await moveFile(
      req.file?.path!,
      path.join(
        __dirname,
        `../public/${String(user._id)}/${req.file?.filename}`
      )
    );

    if (user.password) {
      await deleteFile(
        path.join(__dirname, `../public/${user._id}/${user.profile_url}`)
      );
    }

    user.profile_url = req.file?.filename as string;
  }
  await user.save();
  return res.status(200).json({
    result: "info_updated",
    new_profile_url: `http://localhost:${process.env.PORT}/${user._id}/${user.profile_url}`,
  });
};

export {
  login,
  continueWithGoogle,
  createAccount,
  verifyAccount,
  sendPin,
  changeForgottenPassword,
  changePassword,
  updateInfo,
};
