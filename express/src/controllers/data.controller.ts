import { Request, Response } from "express";
import { checkObjectIdIfValid } from "../functions/id";
import { Message } from "../models/message.model";
import { checkFileExistence } from "../functions/file-manager";
import path from "path";

const uploadFile = (req: Request, res: Response) => {
  return res
    .status(201)
    .json({ result: "file_uploaded", file_name: req.file?.filename });
};

const getFile = async (req: Request, res: Response) => {
  if (!checkObjectIdIfValid(req.params.message_id))
    return res.status(406).json({
      error: "invalid_message_id",
    });

  const message = await Message.findById(req.params.message_id);
  if (!message)
    return res.status(404).json({
      error: "message_not_found",
    });

  const file_path = path.join(__dirname, `../conversations/${message.content}`);

  if (!(await checkFileExistence(file_path)))
    return res.status(404).json({ error: "file_not_found" });

  if (
    String(message.from) === req.user!._id ||
    String(message.to) === req.user!._id
  )
    return res.status(401).json({
      error: "getting_file_is_not_allowed",
    });

  return res.sendFile(file_path);
};

export { uploadFile, getFile };
