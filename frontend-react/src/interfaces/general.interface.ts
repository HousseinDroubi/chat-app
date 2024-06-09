interface messageInterface {
  _id?: string;
  from: string;
  to: string;
  is_text: boolean;
  content: string;
  date: Date;
  seen: boolean;
}

interface otherUserInterface {
  _id: string;
  username: string;
  profile_url: string;
  is_online: boolean;
  last_seen: Date | null;
  last_message?: messageInterface;
  deep: boolean;
}

interface sendMessageInterface {
  to: string;
  is_text: boolean;
  content: string;
}

interface seeMessageInterface {
  of: string;
}

interface receivedEvent {
  event_name: "toggle_user_status" | "new_message" | "see_messages";
  from: string;
  is_online?: boolean;
  message?: messageInterface;
}

export {
  messageInterface,
  otherUserInterface,
  sendMessageInterface,
  receivedEvent,
  seeMessageInterface,
};
