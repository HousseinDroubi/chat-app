import { WebSocket } from "ws";
import { messageModelInterface, userModelInterface } from "../interfaces/model";
import { checkObjectIdIfValid, getIdFromToken } from "./id";
import User from "../models/user.model";
import { Message } from "../models/message.model";

const getTokenFromParams = (
  url: string | undefined
): string | null | undefined => {
  if (!url) return null;
  let key: string | undefined, value: string | undefined;
  const queryString = url.split("?")[1];
  if (queryString) {
    const keyValuePairs = queryString.split("&");
    if (keyValuePairs.length > 1) return null;
    [key, value] = keyValuePairs[0].split("=");
    if (!value || value === "") return null;
    if (key !== "token") return null;
  }
  return value;
};

const launchMiddleware = (token: string | null | undefined): string | null => {
  if (!token) return null;
  const _id = getIdFromToken(`Bearer ${token}`);
  if (!_id || !checkObjectIdIfValid(_id)) return null;
  return _id;
};

const toggleUserStatus = async (
  user: userModelInterface,
  is_online: boolean
): Promise<void> => {
  user.is_online = is_online;
  user.last_seen = user.is_online ? null : new Date();
  await user.save();
};

const saveWebSocket = (
  _id: string,
  ws: WebSocket,
  websockets: Map<string, WebSocket>
): string => {
  if (!websockets.get(_id)) {
    websockets.set(_id, ws);
  }
  return _id;
};

const toggleUserStatusForOthers = (
  websocket_id: string,
  is_online: boolean,
  websockets: Map<string, WebSocket>
): void => {
  websockets.forEach((ws: WebSocket, key: string) => {
    if (key !== websocket_id)
      sendMessage(ws, {
        event_name: "toggle_user_status",
        from: websocket_id,
        is_online,
      });
  });
};

interface message {
  _id: string;
  is_text: boolean;
  to: string;
  content: string;
}
export interface event {
  event_name: "toggle_user_status" | "new_message" | "see_messages";
  from: string;
  is_online?: boolean;
  message?: message;
}

const sendMessage = (ws: WebSocket, event: event) => {
  ws.send(JSON.stringify(event));
};

const checkUser = async (_id: string): Promise<boolean> => {
  return (await User.exists({ _id })) !== null;
};

const createMessage = async (
  from: string,
  to: string,
  is_text: boolean,
  content: string
): Promise<messageModelInterface> => {
  return await Message.create({ from, to, is_text, content });
};

export {
  getTokenFromParams,
  launchMiddleware,
  toggleUserStatus,
  saveWebSocket,
  toggleUserStatusForOthers,
  checkUser,
  createMessage,
  sendMessage,
};
