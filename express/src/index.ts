import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import Singleton from "./singleton/Singleton";

dotenv.config();

const app: express.Application = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

import authRoutes from "./routes/auth.route";
app.use("/auth", authRoutes);

import dataRoutes from "./routes/data.route";
app.use("/data", dataRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});

const singleton: Singleton = Singleton.getInstance();

singleton.connectToDB();
singleton.initializeFirebaseAdminApp();
