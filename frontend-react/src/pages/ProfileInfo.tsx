import SideBar from "../components/SideBar";
import { useSelector } from "react-redux";
import { RootState } from "../cache/redux-toolkit/store/store";
import { useGetUser } from "../cache/react-query/user/user.query";
import Image from "../components/Image";
import { ChangeEvent, useEffect, useState } from "react";
import {
  handleImageChange,
  isImageExtensionAllowed,
} from "../functions/file-manager";
import Popup from "../components/Popup";
import InputText from "../components/InputText";
import BoxTitle from "../components/BoxTitle";
import Button from "../components/Button";
import More from "../components/More";
import { useUpdateInfo } from "../cache/react-query/user/user.mutation";
import Theme from "../components/Theme";

const ProfileInfo = () => {
  const is_light = useSelector((state: RootState) => state.theme.isLight);
  const { data: user_data } = useGetUser();
  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const useUpdateInfoMutation = useUpdateInfo();

  useEffect(() => {
    if (user_data.profile_url) setImageSrc(user_data.profile_url);
    setUsername(user_data.username);
  }, [user_data]);

  const showPopup = (text: string) => {
    setText(text);
    setIsVisible(true);
  };

  const updateInfo = async (): Promise<void> => {
    if (username.length < 3 || username.length > 10)
      showPopup("Username characters must be between 3 and 10");
    else if (username.indexOf(" ") !== -1)
      showPopup("Username cannot contain spaces");
    else if (!file && username === user_data.username)
      showPopup("Please change username or profile");
    else {
      const result = await useUpdateInfoMutation.mutateAsync({
        username,
        file,
        username_cache: user_data.username,
        token: user_data.token!,
      });
      if (result === 200) {
        showPopup("Updated");
        setFile(null);
      } else if (result === 406) showPopup("Username or image required");
      else if (result === 409) showPopup("Username is taken");
      else showPopup("Something went wrong");
    }
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

  return (
    <section
      className={`min-h-screen pl-20 flex flex-col items-center justify-center
    ${is_light ? "bg-light_gray-300" : "bg-purple_gray-500"}
    `}
    >
      <SideBar page_name="profile" />
      <BoxTitle title="General Info" />
      <Image
        src={imageSrc ? imageSrc : undefined}
        onChange={hanldeImage}
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
      <Button title="Update Info" fun={updateInfo} className="mt-8" />
      <Theme />
      <More is_to_right={true} />
      <Popup text={text} isVisible={isVisible} setIsVisible={setIsVisible} />
    </section>
  );
};

export default ProfileInfo;
