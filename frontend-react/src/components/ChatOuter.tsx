import { otherUserInterface } from "../interfaces/general.interface";
import NullIconWhite from "../assets/icons/side-bar/profile-filed.svg";
import NullIconBlack from "../assets/icons/chat-outer/profile-filed-black.svg";
import OnlineBubble from "../assets/icons/chat-outer/online-bubble.svg";
import OfflineBubble from "../assets/icons/chat-outer/offline-bubble.svg";

import { useSelector } from "react-redux";
import { RootState } from "../cache/redux-toolkit/store/store";
import { useNavigate } from "react-router-dom";

import SentIcon from "../assets/icons/chat-outer/sent.svg";
import NewMessageIcon from "../assets/icons/chat-outer/new_message.svg";

interface props extends otherUserInterface {
  user_id: string;
}

const ChatOuter = (props: props) => {
  const is_light = useSelector((state: RootState) => state.theme.isLight);
  const navigate = useNavigate();
  return (
    <article
      onClick={() => {
        if (!props.deep) navigate(`/conversation/${props.username}`);
      }}
      className={`w-full h-24 flex flex-row items-center justify-start mb-2 cursor-pointer rounded-md ${
        is_light ? "bg-light_gray-100" : "bg-purple_gray-300"
      }`}
    >
      <section className="relative">
        <img
          src={
            props.profile_url
              ? props.profile_url
              : is_light
              ? NullIconBlack
              : NullIconWhite
          }
          className="w-14 h-14 ml-10 rounded-full"
        />
        <img
          src={props.is_online ? OnlineBubble : OfflineBubble}
          className="absolute right-0 bottom-1"
        />
      </section>
      <section className="flex flex-col justify-evenly h-full ml-4 w-full pr-10">
        <p className={`${is_light ? "text-black" : "text-white"} text-2xl`}>
          {props.username}
        </p>
        <section className="flex justify-between">
          <p
            className={`${is_light ? "text-black" : "text-white"} text-base
        ${
          !props.deep &&
          props.last_message?.from !== props.user_id &&
          !props.last_message?.seen
            ? "font-extrabold"
            : "font-normal"
        }
        `}
          >
            {props.deep
              ? props.is_online
                ? "Online"
                : new Date(props.last_seen!).toLocaleString()
              : props.last_message?.is_text
              ? props.last_message.content.length > 90
                ? `${props.last_message.content.substring(0, 90)}...`
                : props.last_message.content
              : "Photo"}
          </p>
          {props.last_message &&
            (props.last_message?.from === props.user_id
              ? (!props.last_message.seen && (
                  <img src={SentIcon} className="w-8 h-8" />
                )) ||
                (props.last_message.seen && (
                  <img
                    src={props.profile_url}
                    className="w-8 h-8 rounded-full"
                  />
                ))
              : !props.last_message.seen && (
                  <img src={NewMessageIcon} className="w-8 h-8" />
                ))}
        </section>
      </section>
    </article>
  );
};

export default ChatOuter;
