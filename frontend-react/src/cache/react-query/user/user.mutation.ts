import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { queryClient } from "../../../index.tsx";
import {
  otherUserInterface,
  messageInterface,
  receivedEvent,
} from "../../../interfaces/general.interface";

interface loginParams {
  email: string;
  password: string;
}

interface loginWithGoogle {
  uid: string;
}

interface updateInfo {
  file: File | null;
  username?: string;
  username_cache: string;
  token: string;
}

export interface checkUnseenMessagesInterface {
  other_user_id: string;
  is_other_user: boolean;
}

export const useLoginParams = () =>
  useMutation({
    gcTime: Infinity,
    mutationKey: ["User"],
    mutationFn: async (payload: loginParams) => {
      const url = `${process.env.REACT_APP_BASE_URL}/auth/login`;
      return await axios.post(url, payload, {
        headers: { Accept: "application/json" },
      });
    },

    onSuccess: ({ data }): void => {
      queryClient.setQueryData(["User"], {
        _id: data._id,
        username: data.username,
        token: data.token,
        profile_url: data.profile_url,
        messages: data.messages,
        users: data.users.map((user: otherUserInterface) => {
          let message_index = -1;

          for (let index = data.messages.length - 1; index >= 0; index--) {
            if (
              data.messages[index].from === user._id ||
              data.messages[index].to === user._id
            ) {
              message_index = index;
              break;
            }
          }

          return {
            ...user,
            profile_url: user.profile_url
              ? `${process.env.REACT_APP_BASE_URL}/${user._id}/${user.profile_url}`
              : null,
            last_message:
              message_index === -1 ? null : data.messages[message_index],
          };
        }),
      });
    },
  });

export const useLoginWithGoogle = () =>
  useMutation({
    gcTime: Infinity,
    mutationKey: ["User"],
    mutationFn: async (payload: loginWithGoogle) => {
      const url = `${process.env.REACT_APP_BASE_URL}/auth/continue_with_google/${payload.uid}`;
      return await axios.get(url, {
        headers: { Accept: "application/json" },
      });
    },
    onSuccess: ({ data }): void => {
      queryClient.setQueryData(["User"], {
        _id: data._id,
        username: data.username,
        token: data.token,
        profile_url: data.profile_url,
        messages: data.messages,
        users: data.users.map((user: otherUserInterface) => {
          console.warn(user);

          let message_index = -1;

          for (let index = data.messages.length - 1; index >= 0; index--) {
            if (
              data.messages[index].from === user._id ||
              data.messages[index].to === user._id
            ) {
              message_index = index;
              break;
            }
          }

          return {
            ...user,
            profile_url: user.profile_url
              ? `${process.env.REACT_APP_BASE_URL}/${user._id}/${user.profile_url}`
              : null,
            last_message:
              message_index === -1 ? null : data.messages[message_index],
          };
        }),
      });
    },
  });

export const useUpdateInfo = () =>
  useMutation({
    gcTime: Infinity,
    mutationKey: ["User"],
    mutationFn: async (payload: updateInfo): Promise<number | undefined> => {
      const url = `${process.env.REACT_APP_BASE_URL}/auth/update_info`;
      const formdata = new FormData();
      if (payload.file) formdata.append("image", payload.file);
      if (payload.username !== payload.username_cache)
        formdata.append("username", payload.username!);

      try {
        const { data } = await axios.put(url, formdata, {
          headers: {
            Authorization: `Bearer ${payload.token}`,
            Accept: "application/json",
          },
        });
        const user_data_copy = JSON.parse(
          JSON.stringify(queryClient.getQueryData(["User"]))
        );
        if (payload.file) user_data_copy.profile_url = data.new_profile_url;
        if (payload.username) user_data_copy.username = payload.username;
        queryClient.setQueryData(["User"], user_data_copy);
        return 200;
      } catch (error) {
        if (error instanceof AxiosError) {
          const res = error.response;
          return res?.status;
        }
      }
    },
  });

export const useToggleUserStatus = () =>
  useMutation({
    gcTime: Infinity,
    mutationKey: ["ToggleUserStory"],
    mutationFn: async (receivedEvent: receivedEvent): Promise<void> => {
      const user_data = JSON.parse(
        JSON.stringify(queryClient.getQueryData(["User"]))
      );

      const users_copy: [otherUserInterface] = user_data.users;
      users_copy[
        users_copy.findIndex(
          (user: otherUserInterface) => user._id === receivedEvent.from
        )
      ].is_online = receivedEvent.is_online as boolean;

      queryClient.setQueryData(["User"], {
        ...user_data,
        users: users_copy,
      });

      return Promise.resolve();
    },
  });

export const useAddNewMessage = () =>
  useMutation({
    gcTime: Infinity,
    mutationKey: ["AddNewMessage"],
    mutationFn: async (receivedEvent: receivedEvent): Promise<void> => {
      const user_data = JSON.parse(
        JSON.stringify(queryClient.getQueryData(["User"]))
      );

      const messages_copy: [messageInterface] = user_data.messages;

      const new_message = {
        _id: receivedEvent.message?._id!,
        from: receivedEvent.from,
        to: receivedEvent.message?.to!,
        is_text: receivedEvent.message?.is_text!,
        content: receivedEvent.message?.content!,
        date: new Date(),
        seen: false,
      };

      messages_copy.push(new_message);

      let index: number = -1;
      if (receivedEvent.from === user_data._id) {
        index = user_data.users.findIndex(
          (user: otherUserInterface) => user._id === receivedEvent.message?.to
        );
      } else {
        index = user_data.users.findIndex(
          (user: otherUserInterface) => user._id === receivedEvent.from
        );
      }

      const users_copy: Array<any> = user_data.users;
      const user_first = user_data.users[index];

      user_first.last_message = new_message;
      users_copy.splice(index, 1);
      users_copy.unshift(user_first);

      queryClient.setQueryData(["User"], {
        ...user_data,
        users: users_copy,
        messages: messages_copy,
      });

      return Promise.resolve();
    },
  });

export const useCheckUnseenMessages = () =>
  useMutation({
    gcTime: Infinity,
    mutationKey: ["CheckUnseenMessages"],
    mutationFn: async ({
      other_user_id,
      is_other_user,
    }: checkUnseenMessagesInterface): Promise<void> => {
      const user_data = JSON.parse(
        JSON.stringify(queryClient.getQueryData(["User"]))
      );

      const updated_messages = user_data.messages.map(
        (message: messageInterface) => {
          return (is_other_user
            ? message.to === other_user_id
            : message.from === other_user_id) && !message.seen
            ? { ...message, seen: true }
            : message;
        }
      );

      const index = user_data.users.findIndex((user: otherUserInterface) => {
        return user._id === other_user_id;
      });

      if (user_data.users[index].last_message) {
        if (
          is_other_user
            ? user_data.users[index].last_message.to === other_user_id
            : user_data.users[index].last_message.from === other_user_id
        ) {
          user_data.users[index].last_message = {
            ...user_data.users[index].last_message,
            seen: true,
          };
        }
      }
      user_data.messages = updated_messages;

      queryClient.setQueryData(["User"], user_data);
      return Promise.resolve();
    },
  });
