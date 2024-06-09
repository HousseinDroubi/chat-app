import { useState } from "react";
import Box from "../components/Box";
import BoxTitle from "../components/BoxTitle";
import InputText from "../components/InputText";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../cache/redux-toolkit/store/store";
import Popup from "../components/Popup";
import {
  useLoginParams,
  useLoginWithGoogle,
} from "../cache/react-query/user/user.mutation";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { AxiosError } from "axios";

const Login = () => {
  const is_light = useSelector((state: RootState) => state.theme.isLight);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const [text, setText] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const useLoginParamsMutation = useLoginParams();
  const useLoginWithGoogleMutation = useLoginWithGoogle();

  const showPopup = (text: string) => {
    setText(text);
    setIsVisible(true);
  };

  const login = async () => {
    if (email.length === 0 || email.indexOf("@") == -1)
      showPopup("Invalid email");
    else if (password.length < 5 || password.length > 20)
      showPopup("Password characters must be between 5 and 20");
    else {
      try {
        const { data } = await useLoginParamsMutation.mutateAsync({
          email,
          password,
        });
        if (data.result === "logged_in") {
          navigate("/home");
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          const res = error.response;
          if (res?.status === 400) {
            if (res?.data.error === "invalid_email") showPopup("Invalid email");
          } else if (res?.status === 401) showPopup("Wrong email or password");
          else if (res?.status === 405) {
            if (res.data.error === "email_registered_with_google")
              showPopup("This account is created with google.");
            else showPopup("Please verify your account first");
          }
        } else {
          showPopup("Something went wrong");
        }
      }
    }
  };

  const continueWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const { data } = await useLoginWithGoogleMutation.mutateAsync({
        uid: result.user.uid,
      });
      if (data.result === "logged_in") navigate("/home");
    } catch (error) {
      if (error instanceof AxiosError) {
        const res = error.response;
        if (res?.status === 400) showPopup("Bad uid");
        else if (res?.status === 401) showPopup("Wronguid");
        else showPopup("Something went wrong");
      } else showPopup("Something went wrong");
    }
  };

  return (
    <article
      className={`${
        is_light ? "bg-light_gray-300" : "bg-purple_gray-500"
      } min-h-screen flex flex-col justify-center items-center`}
    >
      <BoxTitle title="Login" />
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
          value={password}
          setValue={setPassword}
          type="password"
          label="Enter your password"
          placeholder="Password"
          className="mt-6"
        />
        <Button
          className="mt-6"
          title="Login"
          fun={() => {
            login();
          }}
        />

        <Button
          className="mt-12"
          title="Continue with Google"
          is_google_btn
          fun={() => continueWithGoogle()}
        />
        <Button
          className="mt-6"
          title="Sign Up"
          is_orange
          fun={() => {
            navigate("/create-account");
          }}
        />
        <div className="flex justify-end mb-10 mt-6 w-full pr-11">
          <p
            className={`${
              is_light ? "text-black" : "text-white"
            } text-lg underline cursor-pointer`}
            onClick={() => {
              navigate("/forgot-password");
            }}
          >
            Forgot Password
          </p>
        </div>
      </Box>
      <Popup text={text} isVisible={isVisible} setIsVisible={setIsVisible} />
    </article>
  );
};

export default Login;
