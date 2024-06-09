import { Request, Response, NextFunction } from "express";
import { getMulterConfigurations } from "../functions/file-manager";

const multerMiddleware = async (
  is_image: boolean,
  is_required: boolean,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const upload = getMulterConfigurations(is_image);

  try {
    await new Promise<void>((resolve, reject) => {
      upload.single(is_image ? "image" : "video")(req, res, (err) => {
        if (is_required && !req.file)
          return res.status(406).json({ error: "file_required" });

        if (err) {
          if (
            err.message &&
            (err.message === "invalid_image" || err.message === "invalid_video")
          )
            reject("invalid_file");
          else reject("server_error");
        } else resolve();
      });
    });
  } catch (error) {
    if (error === "invalid_file")
      return res.status(400).json({ error: "invalid_file" });
    else return res.status(500).json({ error: "error_while_uploading_file" });
  }
  next();
};

export { multerMiddleware };
