interface loginInterface {
  email: string;
  password: string;
}

interface continueWithGoogleInterface {
  uid: string;
}

interface createAccountInterface extends loginInterface {
  username: string;
}

interface verifyUserInterface {
  token: string;
}

interface sendPinInterface {
  email: string;
}

interface changeForgottenPasswordInterface {
  email: string;
  pin: string;
  password: string;
}

interface changePasswordInterface {
  old_password: string;
  new_password: string;
}

interface updateInfoInterface {
  username?: string;
}

export {
  loginInterface,
  continueWithGoogleInterface,
  createAccountInterface,
  verifyUserInterface,
  sendPinInterface,
  changeForgottenPasswordInterface,
  changePasswordInterface,
  updateInfoInterface,
};
