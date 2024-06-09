import React from "react";

const isImageExtensionAllowed = (file: File): boolean => {
  return file && /\.(jpg|png|jpeg)$/i.test(file.name);
};

const isFileExtensionAllowed = (file: File): boolean => {
  return file && /\.(jpg|png|jpeg|mp4|mkv)$/i.test(file.name);
};

const handleImageChange = (
  file: File,
  setImageSource: React.Dispatch<React.SetStateAction<string>>
): void => {
  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === "string") setImageSource(reader.result);
  };
  reader.readAsDataURL(file);
};

export { isImageExtensionAllowed, handleImageChange, isFileExtensionAllowed };
