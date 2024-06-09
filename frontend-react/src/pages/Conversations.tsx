import { useNavigate, useParams } from "react-router-dom";
import { useGetUser } from "../cache/react-query/user/user.query";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  otherUserInterface,
  messageInterface,
} from "../interfaces/general.interface";
import { useSelector } from "react-redux";
import { RootState } from "../cache/redux-toolkit/store/store";
import SideBar from "../components/SideBar";
import ChatOuter from "../components/ChatOuter";

import AttachLight from "../assets/icons/conversation/attach_light.svg";
import AttachDark from "../assets/icons/conversation/attach_dark.svg";
import SendLight from "../assets/icons/conversation/send_light.svg";
import SendDark from "../assets/icons/conversation/send_dark.svg";
import Message from "../components/Mesasge";
import Singleton from "../singleton/Singleton";
import Popup from "../components/Popup";
import {
  isFileExtensionAllowed,
  isImageExtensionAllowed,
} from "../functions/file-manager";
import axios, { AxiosError } from "axios";
import { useCheckUnseenMessages } from "../cache/react-query/user/user.mutation";

const Conversation = () => {
  const is_light = useSelector((state: RootState) => state.theme.isLight);
  const { username } = useParams();
  const { data: user_data } = useGetUser();
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState<otherUserInterface>();
  const navigate = useNavigate();
  const [text, setText] = useState<string>("");
  const [popuptext, setPopupText] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const useM = useCheckUnseenMessages();
  useEffect(() => {
    if (user_data) {
      const other_user: otherUserInterface = user_data.users.find(
        (user: otherUserInterface) => user.username === username
      )!;
      if (!other_user) navigate("/home");
      setOtherUser(other_user);
      setMessages(
        user_data.messages.filter(
          (message: messageInterface) =>
            (message.from === user_data._id && message.to === other_user._id) ||
            (message.from === other_user._id && message.to === user_data._id)
        )
      );
      if (containerRef) {
        scrollToEnd();
      }
      const unseen_messages_exist = user_data.messages.some(
        (message: messageInterface) =>
          message.from === other_user._id && !message.seen
      );
      if (unseen_messages_exist) {
        Singleton.sendMessage({
          of: other_user._id,
        });
        useM.mutate({ other_user_id: other_user._id, is_other_user: false });
      }
    }
  }, [user_data]);

  useEffect(() => {
    if (file) {
      if (isFileExtensionAllowed(file)) {
        const url = `${process.env.REACT_APP_BASE_URL}/data/upload_file/${
          isImageExtensionAllowed(file) ? "image" : "video"
        }`;

        const formData = new FormData();
        formData.append(
          isImageExtensionAllowed(file) ? "image" : "video",
          file
        );

        axios
          .post(url, formData, {
            headers: {
              Authorization: `Bearer ${user_data.token}`,
              Accept: "application/json",
            },
          })
          .then((response) => {
            sendMessage(response.data.file_name, false);
          })
          .catch((error) => {
            if (error instanceof AxiosError) {
              const res = error.response;
              if (res?.status === 406) showPopup("File required");
              else if (res?.status === 400) showPopup("Invalid file");
              else if (res?.status === 500)
                showPopup("Error while uploading file");
              else showPopup("Something went wrong");
            } else showPopup("Something went wrong");
          });
      } else {
        showPopup("File type not supported");
      }
    }
  }, [file]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendMessage(text);
    }
  };

  const showPopup = (text: string) => {
    setPopupText(text);
    setIsVisible(true);
  };

  const sendMessage = (content: string, is_text: boolean = true) => {
    if (content.length === 0 || content.length > 101) {
      showPopup("Message text must be between 1 and 100");
      return;
    }
    Singleton.sendMessage({
      to: otherUser?._id!,
      is_text,
      content,
    });
    setText("");
  };

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0])
      setFile(event.target.files[0]);
  };

  const scrollToEnd = (): void => {
    if (containerRef.current) {
      const element: HTMLDivElement = containerRef.current;
      setTimeout(() => {
        element.scrollTo({
          top: element.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  };

  return (
    <article
      className={`h-screen flex flex-col justify-between pl-24 pr-2 pt-4
      ${is_light ? "bg-light_gray-300" : "bg-purple_gray-500"}`}
    >
      <SideBar page_name="home" />
      {otherUser && (
        <ChatOuter
          user_id={user_data._id}
          _id={otherUser._id}
          last_seen={otherUser.last_seen}
          is_online={otherUser.is_online}
          username={otherUser.username}
          profile_url={otherUser.profile_url}
          deep={true}
        />
      )}
      <section
        onResize={() => {
          scrollToEnd();
        }}
        ref={containerRef}
        className="h-3/4 flex flex-col overflow-x-hidden overflow-y-auto mb-2 pr-2 messges"
      >
        {messages.map((message: messageInterface) => (
          <Message
            token={user_data.token!}
            seen={message.seen}
            key={message._id}
            className={`${
              message.from === user_data._id
                ? `self-end ${
                    is_light ? "bg-light_gray-500" : "bg-orange_shade"
                  }`
                : "bg-green_shade self-start"
            }`}
            date={message.date}
            _id={message._id}
            from={message.from}
            to={message.to}
            is_text={message.is_text}
            content={message.content}
          />
        ))}
      </section>
      <section className="w-full flex flex-row items-center justify-center mb-5">
        <input
          value={text}
          onKeyDown={handleKeyPress}
          type="text"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setText(event.target.value);
          }}
          placeholder="Enter your message"
          className={`focus:border-none focus:outline-none w-full h-12 rounded-lg p-4 grow mr-5
         placeholder:text-gray-400
         ${
           is_light
             ? "bg-light_gray-100 text-black"
             : "bg-purple_gray-300 text-white"
         }
        `}
        />
        {text === "" && (
          <label htmlFor="file">
            <img
              src={is_light ? AttachLight : AttachDark}
              className="w-10 h-10 cursor-pointer"
            />
            <input
              onChange={handleFile}
              type="file"
              id="file"
              className="hidden"
            />
          </label>
        )}
        {text !== "" && (
          <img
            onClick={() => {
              sendMessage(text);
            }}
            src={is_light ? SendLight : SendDark}
            className="w-10 h-10 cursor-pointer"
          />
        )}
      </section>
      <Popup
        text={popuptext}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
      />
    </article>
  );
};
export default Conversation;
