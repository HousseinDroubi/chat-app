import { Request } from "express";
import fs_promises from "fs/promises";
import mongoose from "mongoose";
import multer, { FileFilterCallback } from "multer";
import path from "path";

const readFile = async (path: string) => {
  return fs_promises.readFile(path, "utf-8");
};

const createFolderForNewUser = async (
  _id: mongoose.Types.ObjectId
): Promise<void> => {
  fs_promises.mkdir(path.join(__dirname, `../public/${String(_id)}`), "0777");
};

const getMulterConfigurations = (is_image: boolean): multer.Multer => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../temp"));
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}.${file.mimetype.split("/")[1]}`);
    },
  });

  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    const file_extension = file.mimetype.split("/")[1];

    if (is_image) {
      if (["jpg", "png", "jpeg"].includes(file_extension)) cb(null, true);
      else cb(new Error("invalid_image"));
    } else {
      if (["mp4", "mkv"].includes(file_extension)) cb(null, true);
      else cb(new Error("invalid_video"));
    }
  };

  return multer({ storage, fileFilter });
};

const deleteFile = async (path: string): Promise<void> => {
  await fs_promises.unlink(path);
};

const moveFile = async (old_path: string, new_path: string): Promise<void> => {
  await fs_promises.rename(old_path, new_path);
};

const checkFileExistence = async (path: string): Promise<boolean> => {
  try {
    await fs_promises.access(path);
    return true;
  } catch (error) {
    return false;
  }
};

export {
  readFile,
  createFolderForNewUser,
  getMulterConfigurations,
  deleteFile,
  moveFile,
  checkFileExistence,
};
