import SideBar from "../components/SideBar";
import { useSelector } from "react-redux";
import { RootState } from "../cache/redux-toolkit/store/store";
import { useGetUser } from "../cache/react-query/user/user.query";
import { otherUserInterface } from "../interfaces/general.interface";
import ChatOuter from "../components/ChatOuter";
import { useEffect, useState } from "react";
import Singleton from "../singleton/Singleton";
import {
  useAddNewMessage,
  useToggleUserStatus,
  useCheckUnseenMessages,
} from "../cache/react-query/user/user.mutation";
import NewConversationPopup from "../components/NewConversationPopup";
import Popup from "../components/Popup";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const is_light = useSelector((state: RootState) => state.theme.isLight);
  const { data: user_data } = useGetUser();
  const useToggleUserStatusMutation = useToggleUserStatus();
  const useAddNewMessageMutation = useAddNewMessage();
  const useCheckUnseenMessagesMutation = useCheckUnseenMessages();
  const [isAddNewConversationPopupVisible, setAddNewConversationPopupVisible] =
    useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [variable, setVariable] = useState<string>("");

  useEffect(() => {
    if (user_data && user_data.token) {
      Singleton.getInstance(
        user_data.token,
        useToggleUserStatusMutation,
        useAddNewMessageMutation,
        useCheckUnseenMessagesMutation
      );
    }
  }, [user_data]);

  const showAddNewConversationPopup = () => {
    setAddNewConversationPopupVisible(true);
  };

  const showPopup = (text: string) => {
    setText(text);
    setIsVisible(true);
  };

  const checkUser = (): void => {
    if (variable === "") showPopup("Username should not be empty!");
    const user = user_data.users.find(
      (user: otherUserInterface) => user.username === variable
    );
    if (!user) {
      showPopup("Couldn't find user");
      return;
    }
    navigate(`/conversation/${variable}`);
  };

  return (
    <section
      className={`min-h-screen pl-24 pr-4 pt-4
    ${is_light ? "bg-light_gray-300" : "bg-purple_gray-500"}
    ${
      user_data.users.findIndex(
        (user: otherUserInterface) => user.last_message
      ) === -1
        ? "flex items-center justify-center"
        : "flex flex-col"
    }
    `}
    >
      <SideBar page_name="home" />
      {user_data.users.findIndex(
        (user: otherUserInterface) => user.last_message
      ) === -1 ? (
        <>
          <button
            onClick={() => {
              showAddNewConversationPopup();
            }}
            className="absolute right-20 top-12 w-44 h-14 rounded-md bg-green_shade text-lg text-white font-bold transition-all hover:scale-95"
          >
            New Conversation
          </button>
          <p
            className={`text-4xl absolute ${
              is_light ? "text-black" : "text-white"
            }`}
          >
            No conversations yet.
          </p>
        </>
      ) : (
        user_data.users.map(
          (user: otherUserInterface) =>
            user.last_message && (
              <ChatOuter
                user_id={user_data._id}
                key={user._id}
                _id={user._id}
                is_online={user.is_online}
                username={user.username}
                profile_url={user.profile_url}
                last_message={user.last_message}
                last_seen={user.last_seen}
                deep={false}
              />
            )
        )
      )}
      <NewConversationPopup
        variable={variable}
        setVariable={setVariable}
        isVisible={isAddNewConversationPopupVisible}
        setIsVisible={setAddNewConversationPopupVisible}
        checkUser={checkUser}
      />
      <Popup text={text} isVisible={isVisible} setIsVisible={setIsVisible} />
    </section>
  );
};

export default Home;
