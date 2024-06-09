import SideBar from "../components/SideBar";
import { useSelector } from "react-redux";
import { RootState } from "../cache/redux-toolkit/store/store";
import BoxTitle from "../components/BoxTitle";
import InputText from "../components/InputText";
import { useState } from "react";
import Button from "../components/Button";
import More from "../components/More";
import Popup from "../components/Popup";
import { useGetUser } from "../cache/react-query/user/user.query";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import Theme from "../components/Theme";

const ProfilePassword = () => {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [resetPassword, setResetPassword] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const is_light = useSelector((state: RootState) => state.theme.isLight);
  const { data: user_data } = useGetUser();

  const showPopup = (text: string) => {
    setText(text);
    setIsVisible(true);
  };

  const changePassword = async (): Promise<void> => {
    if (
      oldPassword.length < 5 ||
      oldPassword.length > 20 ||
      newPassword.length < 5 ||
      newPassword.length > 20 ||
      resetPassword.length < 5 ||
      resetPassword.length > 20
    )
      showPopup("Password characters must be between 5 and 20");
    else if (newPassword !== resetPassword) {
      showPopup("New password and reset password must match");
    } else {
      try {
        const url = `${process.env.REACT_APP_BASE_URL}/auth/change_password`;
        const body = {
          old_password: oldPassword,
          new_password: newPassword,
        };
        await axios.put(url, body, {
          headers: {
            Authorization: `Bearer ${user_data.token}`,
            Accept: "application/json",
          },
        });
        showPopup("Password changed");
        setOldPassword("");
        setNewPassword("");
        setResetPassword("");
      } catch (error) {
        if (error instanceof AxiosError) {
          const res = error.response;
          if (res?.status === 405) navigate("/profile-info");
          else if (res?.status === 406) showPopup("Old password is wrong");
          else showPopup("Something went wrong");
        } else showPopup("Something went wrong");
      }
    }
  };

  return (
    <section
      className={`min-h-screen pl-20 flex flex-col items-center justify-center
    ${is_light ? "bg-light_gray-300" : "bg-purple_gray-500"}
    `}
    >
      <SideBar page_name="profile" />
      <BoxTitle title="Change Password" classname="mt-6" />
      <InputText
        value={oldPassword}
        setValue={setOldPassword}
        type="password"
        label="Enter old password"
        placeholder="Old Password"
        className="mt-6"
      />
      <InputText
        value={newPassword}
        setValue={setNewPassword}
        type="password"
        label="Enter new password"
        placeholder="New Password"
        className="mt-6"
      />
      <InputText
        value={resetPassword}
        setValue={setResetPassword}
        type="password"
        label="Re-enter new password"
        placeholder="Reset Password"
        className="mt-6"
      />
      <Button title="Change Password" fun={changePassword} className="mt-8" />
      <Theme />
      <More is_to_right={false} />
      <Popup text={text} isVisible={isVisible} setIsVisible={setIsVisible} />
    </section>
  );
};

export default ProfilePassword;
