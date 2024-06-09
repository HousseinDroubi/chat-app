import { useSelector } from "react-redux";
import { RootState } from "../cache/redux-toolkit/store/store";
import { useEffect, useState } from "react";
import WrongIcon from "../assets/icons/verify-account/wrong.svg";
import VerifiedIcon from "../assets/icons/verify-account/verified.svg";
import WaitingIcon from "../assets/icons/verify-account/waiting.svg";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
import Button from "../components/Button";

const VerifyAccount = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  interface status {
    request_status: "loading" | "success" | "error";
    result_text:
      | "Requesting..."
      | "Invalid Token"
      | "Wrong Token"
      | "Invalid User"
      | "Already Verified"
      | "Account verified"
      | "Something went wrong";
  }

  const is_light = useSelector((state: RootState) => state.theme.isLight);
  const [status, setStatus] = useState<status>({
    request_status: "loading",
    result_text: "Requesting...",
  });

  const updateStatus = (
    new_status: status["request_status"],
    text: status["result_text"]
  ) => {
    setStatus({
      request_status: new_status,
      result_text: text,
    });
  };

  useEffect(() => {
    const url = `${process.env.REACT_APP_BASE_URL}/auth/verify_account/${token}`;
    axios
      .get(url)
      .then(() => {
        updateStatus("success", "Account verified");
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          const res = error.response;
          if (res?.status === 400) updateStatus("error", "Invalid Token");
          else if (res?.status === 404) updateStatus("error", "Wrong Token");
          else if (res?.status === 401) updateStatus("error", "Invalid User");
          else if (res?.status === 405)
            updateStatus("error", "Already Verified");
          else updateStatus("error", "Something went wrong");
        } else {
          updateStatus("error", "Something went wrong");
        }
      });
  }, []);

  return (
    <article
      className={`
        ${
          is_light ? "bg-light_gray-300" : "bg-purple_gray-500"
        }   flex flex-col items-center justify-center min-h-screen`}
    >
      <section className="flex flex-row items-center">
        <img
          src={
            status.request_status === "loading"
              ? WaitingIcon
              : status.request_status === "success"
              ? VerifiedIcon
              : WrongIcon
          }
          className="w-16 h-16"
        />
        <p
          className={`text-4xl ml-4 ${is_light ? "text-black" : "text-white"}`}
        >
          {status.result_text}
        </p>
      </section>
      {status.request_status === "success" && (
        <Button
          className="mt-4"
          title="Login Now"
          fun={() => {
            navigate("/");
          }}
        />
      )}
    </article>
  );
};
export default VerifyAccount;
