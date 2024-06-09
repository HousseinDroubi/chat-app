import Joi from "joi";
import {
  continueWithGoogleInterface,
  createAccountInterface,
  loginInterface,
  sendPinInterface,
  verifyUserInterface,
  changeForgottenPasswordInterface,
  changePasswordInterface,
  updateInfoInterface,
} from "../interfaces/controller-validation";

const validateLogin = (data: loginInterface) => {
  const schema = Joi.object({
    email: Joi.string().required().label("Email").email().messages({
      "string.email": "invalid_email",
    }),
    password: Joi.string().required().label("Password").min(5).max(20),
  });
  return schema.validate(data);
};

const validateContinueWithGoogle = (data: continueWithGoogleInterface) => {
  const schema = Joi.object({
    uid: Joi.string().required().label("Uid"),
  });
  return schema.validate(data);
};

const validateCreateAccount = (data: createAccountInterface) => {
  const schema = Joi.object({
    email: Joi.string().required().label("Email").email().messages({
      "string.email": "invalid_email",
    }),
    password: Joi.string().required().label("Password").min(5).max(20),
    username: Joi.string().required().label("Username").min(3).max(10),
  });
  return schema.validate(data);
};

const validateVerifyUser = (data: verifyUserInterface) => {
  const schema = Joi.object({
    token: Joi.string().required().label("Token").length(64),
  });
  return schema.validate(data);
};

const validateSendPin = (data: sendPinInterface) => {
  const schema = Joi.object({
    email: Joi.string().required().label("Email").email().messages({
      "string.email": "invalid_email",
    }),
  });
  return schema.validate(data);
};

const validateChangeForgottenPassword = (
  data: changeForgottenPasswordInterface
) => {
  const schema = Joi.object({
    email: Joi.string().required().label("Email").email().messages({
      "string.email": "invalid_email",
    }),
    pin: Joi.string().required().label("Pin").length(6),
    password: Joi.string().required().label("Password").min(5).max(20),
  });
  return schema.validate(data);
};

const validateChangePassword = (data: changePasswordInterface) => {
  const schema = Joi.object({
    old_password: Joi.string().required().label("Old Password").min(5).max(20),
    new_password: Joi.string().required().label("New Password").min(5).max(20),
  });
  return schema.validate(data);
};

const validateUpdateInfo = (data: updateInfoInterface) => {
  const schema = Joi.object({
    username: Joi.string().label("Username").min(3).max(10),
  });
  return schema.validate(data);
};

export {
  validateLogin,
  validateContinueWithGoogle,
  validateCreateAccount,
  validateVerifyUser,
  validateSendPin,
  validateChangeForgottenPassword,
  validateChangePassword,
  validateUpdateInfo,
};
