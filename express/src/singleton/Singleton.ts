import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import {
  checkFileExistence,
  moveFile,
  readFile,
} from "../functions/file-manager";
dotenv.config();
import admin from "firebase-admin";
import WebSocket from "ws";
import {
  checkUser,
  createMessage,
  event,
  getTokenFromParams,
  launchMiddleware,
  saveWebSocket,
  sendMessage,
  toggleUserStatus,
  toggleUserStatusForOthers,
} from "../functions/websocket";
import User from "../models/user.model";
import {
  newMessageInterface,
  seeMessagesInterface,
  validateSeeMessages,
  validateNewMessage,
} from "../validations/websocket.validation";
import { checkObjectIdIfValid } from "../functions/id";
import { Message } from "../models/message.model";

class Singleton {
  private static instance: Singleton;
  private static websockets: Map<string, WebSocket>;
  private constructor() {
    this.launchWebSocket();
  }

  private launchWebSocket = () => {
    if (process.env.WS_PORT) {
      Singleton.websockets = new Map();
      const wss = new WebSocket.Server({ port: Number(process.env.WS_PORT) });

      wss.on("connection", async (ws, request) => {
        let websocket_id: string;
        const token = getTokenFromParams(request.url);
        const _id = launchMiddleware(token);
        if (!_id) return;

        const user = await User.findById(_id);

        if (!user || (user && !user.is_verified)) return;
        await toggleUserStatus(user, true);

        websocket_id = saveWebSocket(_id, ws, Singleton.websockets);
        toggleUserStatusForOthers(websocket_id, true, Singleton.websockets);

        ws.on("message", async (data) => {
          try {
            let is_new_message = false;
            let parsed_data: any = JSON.parse(data.toString());
            const { error } = validateNewMessage(
              parsed_data as newMessageInterface
            );

            if (error) {
              const { error } = validateSeeMessages(
                parsed_data as seeMessagesInterface
              );
              if (error) return;
            } else is_new_message = true;
            if (is_new_message) {
              if (!checkObjectIdIfValid(parsed_data.to)) return;

              if (!(await checkUser(parsed_data.to))) return;

              if (!parsed_data.is_text) {
                if (
                  !(await checkFileExistence(
                    path.join(__dirname, `../temp/${parsed_data.content}`)
                  ))
                )
                  return;
              }

              const message = await createMessage(
                websocket_id,
                parsed_data.to,
                parsed_data.is_text,
                parsed_data.content
              );

              if (!parsed_data.is_text) {
                const extension =
                  parsed_data.content.split(".")[
                    parsed_data.content.split(".").length - 1
                  ];

                await moveFile(
                  path.join(__dirname, `../temp/${parsed_data.content}`),
                  path.join(
                    __dirname,
                    `../conversations/${message._id}.${extension}`
                  )
                );
                message.content = `${message._id}.${extension}`;
                await message.save();
              }

              const event: event = {
                event_name: "new_message",
                from: websocket_id,
                message: {
                  _id: message._id,
                  to: String(message.to),
                  is_text: message.is_text,
                  content: message.content,
                },
              };

              sendMessage(ws, event);
              if (Singleton.websockets.get(parsed_data.to)) {
                sendMessage(Singleton.websockets.get(parsed_data.to)!, event);
              }
            } else {
              if (!checkObjectIdIfValid(parsed_data.of)) return;
              if (!(await checkUser(parsed_data.of))) return;

              await Message.updateMany(
                {
                  from: parsed_data.of,
                  to: websocket_id,
                  seen: false,
                },
                { seen: true }
              );

              if (Singleton.websockets.get(parsed_data.of)) {
                const event: event = {
                  event_name: "see_messages",
                  from: websocket_id,
                };
                sendMessage(Singleton.websockets.get(parsed_data.of)!, event);
              }
            }
          } catch (error) {
            console.log(error);
            return;
          }
        });

        ws.on("close", async () => {
          const user = await User.findById(websocket_id);
          if (user) {
            await toggleUserStatus(user, false);
            toggleUserStatusForOthers(
              websocket_id,
              false,
              Singleton.websockets
            );
            Singleton.websockets.delete(websocket_id);
          }
        });
      });
    }
  };

  public static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }

  public connectToDB = (): void => {
    if (process.env.DATABASE_URL)
      mongoose
        .connect(process.env.DATABASE_URL)
        .then(() => {
          console.log("Database connected successfully");
        })
        .catch((err) => {
          console.log(`Error database ${err.message}`);
        });
    else process.exit(1);
  };

  public initializeFirebaseAdminApp = async () => {
    const path_to_service_account_key = path.join(
      __dirname,
      "../../service-account-key.json"
    );
    const serviceAccount = JSON.parse(
      await readFile(path_to_service_account_key)
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  };

  public getUser = async (uid: string) => {
    let userRecord;
    try {
      userRecord = await admin.auth().getUser(uid);
      return userRecord;
    } catch (error) {
      return null;
    }
  };
}

export default Singleton;
