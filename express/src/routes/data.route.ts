import { Router } from "express";
import { getFile, uploadFile } from "../controllers/data.controller";
import { multerMiddleware } from "../middlewares/general.middleware";
import { getIdAndStop, getUserAndStop } from "../middlewares/auth.middleware";

const router = Router();

router.post(
  "/upload_file/:file_type",
  (req, res, next) =>
    multerMiddleware(req.params.file_type === "image", true, req, res, next),
  getIdAndStop,
  getUserAndStop,
  uploadFile
);
router.get("/get_file/:message_id", getIdAndStop, getUserAndStop, getFile);

export default router;
