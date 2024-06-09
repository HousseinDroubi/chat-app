import { UseMutationResult } from "@tanstack/react-query";

import {
  receivedEvent,
  seeMessageInterface,
  sendMessageInterface,
} from "../interfaces/general.interface";
import { checkUnseenMessagesInterface } from "../cache/react-query/user/user.mutation";

class Singleton {
  private static instance: Singleton;
  private static websocket: WebSocket | undefined;
  useToggleUserStatusMutation:
    | UseMutationResult<void, Error, receivedEvent, unknown>
    | undefined;

  useAddNewMessageMutation:
    | UseMutationResult<void, Error, receivedEvent, unknown>
    | undefined;

  useCheckUnseenMessagesMutation:
    | UseMutationResult<void, Error, checkUnseenMessagesInterface, unknown>
    | undefined;

  private constructor(
    token: string,
    useToggleUserStatusMutation: UseMutationResult<
      void,
      Error,
      receivedEvent,
      unknown
    >,
    useAddNewMessageMutation: UseMutationResult<
      void,
      Error,
      receivedEvent,
      unknown
    >,
    useCheckUnseenMessagesMutation: UseMutationResult<
      void,
      Error,
      checkUnseenMessagesInterface,
      unknown
    >
  ) {
    this.launchWebSocketConnection(token);
    this.launchWebSocketListeners();
    this.useToggleUserStatusMutation = useToggleUserStatusMutation;
    this.useAddNewMessageMutation = useAddNewMessageMutation;
    this.useCheckUnseenMessagesMutation = useCheckUnseenMessagesMutation;
  }

  public static getInstance(
    token: string,
    useToggleUserStatusMutation: UseMutationResult<
      void,
      Error,
      receivedEvent,
      unknown
    >,
    useAddNewMessageMutation: UseMutationResult<
      void,
      Error,
      receivedEvent,
      unknown
    >,
    useCheckUnseenMessagesMutation: UseMutationResult<
      void,
      Error,
      checkUnseenMessagesInterface,
      unknown
    >
  ): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton(
        token,
        useToggleUserStatusMutation,
        useAddNewMessageMutation,
        useCheckUnseenMessagesMutation
      );
    }
    return Singleton.instance;
  }

  private launchWebSocketConnection(token: string): void {
    Singleton.websocket = new WebSocket(
      `${process.env.REACT_APP_WS_URL}?token=${token}`
    );
  }

  private launchWebSocketListeners = (): void => {
    if (Singleton.websocket) {
      Singleton.websocket.onmessage = ({ data }) => {
        const receivedEvent: receivedEvent = JSON.parse(data);
        if (receivedEvent.event_name === "toggle_user_status")
          this.useToggleUserStatusMutation?.mutate(receivedEvent);
        else if (receivedEvent.event_name === "new_message")
          this.useAddNewMessageMutation?.mutate(receivedEvent);
        else
          this.useCheckUnseenMessagesMutation?.mutate({
            other_user_id: receivedEvent.from,
            is_other_user: true,
          });
      };
    }
  };

  public static sendMessage = (
    message: sendMessageInterface | seeMessageInterface
  ): void => {
    this.websocket?.send(JSON.stringify(message));
  };
}

export default Singleton;
