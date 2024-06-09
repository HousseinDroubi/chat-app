import { useSelector } from "react-redux";
import { RootState } from "../cache/redux-toolkit/store/store";
import BoxTitle from "../components/BoxTitle";
import InputText from "../components/InputText";
import { ChangeEvent, useState } from "react";
import Box from "../components/Box";
import Button from "../components/Button";
import Image from "../components/Image";
import {
  handleImageChange,
  isImageExtensionAllowed,
} from "../functions/file-manager";
import Popup from "../components/Popup";
import axios, { AxiosError } from "axios";

const CreateAccount = () => {
  const is_light = useSelector((state: RootState) => state.theme.isLight);
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rePassword, setRePassword] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const showPopup = (text: string) => {
    setText(text);
    setIsVisible(true);
  };

  const hanldeImage = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && isImageExtensionAllowed(files[0])) {
      setFile(files[0]);
      handleImageChange(files[0], setImageSrc);
    } else {
      showPopup("Invalid type");
    }
  };

  const createAccount = async () => {
    if (!file || imageSrc === "") showPopup("Please choose an image");
    else if (email.length === 0 || email.indexOf("@") == -1)
      showPopup("Invalid email");
    else if (username.length < 3 || username.length > 10)
      showPopup("Username characters must be between 3 and 10");
    else if (username.indexOf(" ") !== -1)
      showPopup("Username cannot contain spaces");
    else if (password.length < 5 || password.length > 20)
      showPopup("Password characters must be between 5 and 20");
    else if (password !== rePassword) showPopup("Passwords must match");
    else {
      try {
        const url = `${process.env.REACT_APP_BASE_URL}/auth/create_account`;
        const formdata = new FormData();
        formdata.append("image", file);
        formdata.append("email", email);
        formdata.append("username", username);
        formdata.append("password", password);

        await axios.post(url, formdata, {
          headers: { Accept: "application/json" },
        });
        showPopup(
          "An email has been sent to this email, please activate your account."
        );
        setEmail("");
        setUsername("");
        setPassword("");
        setRePassword("");
        setFile(null);
        setImageSrc("");
      } catch (error) {
        if (error instanceof AxiosError) {
          const res = error.response;
          if (res?.status === 400) {
            if (res?.data.error === "invalid_email") showPopup("Invalid email");
          } else if (res?.status === 409) {
            if (res.data.error === "user_existed") showPopup("User existed");
            else showPopup("Username taken");
          } else showPopup("Something went wrong");
        } else showPopup("Something went wrong");
      }
    }
  };

  return (
    <article
      className={`${
        is_light ? "bg-light_gray-300" : "bg-purple_gray-500"
      } min-h-screen flex flex-col justify-center items-center`}
    >
      <BoxTitle title="Create Account" />
      <Box>
        <Image
          className="mt-4"
          onChange={hanldeImage}
          src={imageSrc !== "" ? imageSrc : undefined}
        />
        <InputText
          value={email}
          setValue={setEmail}
          type="text"
          label="Enter your email"
          placeholder="Email"
          className="mt-6"
        />
        <InputText
          value={username}
          setValue={setUsername}
          type="text"
          label="Enter your username"
          placeholder="Username"
          className="mt-6"
        />
        <InputText
          value={password}
          setValue={setPassword}
          type="password"
          label="Enter your password"
          placeholder="Password"
          className="mt-6"
        />
        <InputText
          value={rePassword}
          setValue={setRePassword}
          type="password"
          label="Re-enter your password"
          placeholder="Re-password"
          className="mt-6"
        />
        <Button
          className="mt-6 mb-10"
          title="Create Account"
          fun={() => createAccount()}
        />
      </Box>
      <Popup text={text} isVisible={isVisible} setIsVisible={setIsVisible} />
    </article>
  );
};
export default CreateAccount;
