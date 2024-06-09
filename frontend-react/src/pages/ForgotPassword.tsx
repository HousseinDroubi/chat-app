import { useSelector } from "react-redux";
import { RootState } from "../cache/redux-toolkit/store/store";
import BoxTitle from "../components/BoxTitle";
import InputText from "../components/InputText";
import Box from "../components/Box";
import { useRef, useState } from "react";
import Button from "../components/Button";
import Popup from "../components/Popup";
import axios, { AxiosError } from "axios";

const ForgotPassword = () => {
  const is_light = useSelector((state: RootState) => state.theme.isLight);

  const [email, setEmail] = useState<string>("");
  const [pin, setPin] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rePassword, setRePassword] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const pin_sent = useRef<boolean>(false);

  const showPopup = (text: string) => {
    setText(text);
    setIsVisible(true);
  };

  const forgotPassword = async () => {
    if (email.length === 0 || email.indexOf("@") === -1)
      showPopup("Invalid email");

    if (!pin_sent.current) {
      try {
        const url = `${process.env.REACT_APP_BASE_URL}/auth/send_pin/${email}`;
        await axios.get(url);
        pin_sent.current = true;
        showPopup("Pin has been sent, please enter it.");
      } catch (error) {
        if (error instanceof AxiosError) {
          const res = error.response;
          if (res?.status === 400) showPopup("Invalid email");
          else if (res?.status === 404) {
            if (res.data.error === "invalid_user")
              showPopup("This email is not existed");
            else showPopup("Pin Already sent");
            pin_sent.current = true;
          }
        } else showPopup("Something went wrong");
      }
    } else {
      if (pin.length !== 6) showPopup("Pin must be exactly 6 digits");
      else if (!/^\d+$/.test(pin)) showPopup("Pin must contains only digits");
      else if (password.length < 5 || password.length > 20)
        showPopup("Password characters must be between 5 and 20");
      else if (password !== rePassword)
        showPopup("Password and reset password must match");
      else {
        try {
          const url = `${process.env.REACT_APP_BASE_URL}/auth/change_forgotten_password`;

          const body = {
            email,
            pin,
            password,
          };
          await axios.post(url, body);
          showPopup("Password Updated");
          setEmail("");
          setPin("");
          setPassword("");
          setRePassword("");
        } catch (error) {
          if (error instanceof AxiosError) {
            const res = error.response;
            if (res?.status === 400) showPopup("Invalid email");
            else if (res?.status === 404) {
              if (res.data.error === "invalid_user")
                showPopup("This email is not existed");
              else showPopup("Pin not requested");
            } else if (res?.status === 401) showPopup("Wrong pin");
            else showPopup("Something went wrong");
          } else showPopup("Something went wrong");
        }
      }
    }
  };

  return (
    <article
      className={`${
        is_light ? "bg-light_gray-300" : "bg-purple_gray-500"
      } min-h-screen flex flex-col justify-center items-center`}
    >
      <BoxTitle title="Forgot Password" />
      <Box>
        <InputText
          value={email}
          setValue={setEmail}
          type="text"
          label="Enter your email"
          placeholder="Email"
          className="mt-6"
        />
        <InputText
          value={pin}
          setValue={setPin}
          type="text"
          label="Enter pin"
          placeholder="Pin"
          className="mt-6"
        />
        <InputText
          value={password}
          setValue={setPassword}
          type="password"
          label="Enter new password"
          placeholder="Password"
          className="mt-6"
        />
        <InputText
          value={rePassword}
          setValue={setRePassword}
          type="password"
          label="Re-enter new password"
          placeholder="Re-password"
          className="mt-6"
        />
        <Button
          className="mt-6 mb-10"
          title="Forgot Password"
          fun={() => forgotPassword()}
        />
      </Box>
      <Popup text={text} isVisible={isVisible} setIsVisible={setIsVisible} />
    </article>
  );
};

export default ForgotPassword;
