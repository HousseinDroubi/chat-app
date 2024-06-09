import { Router } from "express";
import {
  changeForgottenPassword,
  changePassword,
  continueWithGoogle,
  createAccount,
  login,
  sendPin,
  updateInfo,
  verifyAccount,
} from "../controllers/auth.controller";
import { multerMiddleware } from "../middlewares/general.middleware";
import { getIdAndStop, getUserAndStop } from "../middlewares/auth.middleware";

const router = Router();

router.post("/login", login);
router.get("/continue_with_google/:uid", continueWithGoogle);

router.post(
  "/create_account",
  (req, res, next) => multerMiddleware(true, true, req, res, next),
  createAccount
);
router.get("/verify_account/:token", verifyAccount);

router.get("/send_pin/:email", sendPin);
router.post("/change_forgotten_password", changeForgottenPassword);

router.put("/change_password", getIdAndStop, getUserAndStop, changePassword);
router.put(
  "/update_info",
  getIdAndStop,
  getUserAndStop,
  (req, res, next) => multerMiddleware(true, false, req, res, next),

  updateInfo
);

export default router;
