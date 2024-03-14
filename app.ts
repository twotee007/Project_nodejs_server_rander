import express from "express";
import { router as login } from "./api/login";
import { router as img } from "./api/img";
import { router as vote } from "./api/vote";
import { router as rank } from "./api/rank";
import { router as upload } from "./api/upload";
import bodyParser from "body-parser";
import cors from "cors";
export const app = express();
app.use(
    cors({
      origin: "*",
    })
  );
app.use(bodyParser.text());
app.use(bodyParser.json());

app.use("/login", login);
app.use("/img", img);
app.use("/vote", vote);
app.use("/rank", rank);
app.use("/upload",upload);
app.use("/uploads", express.static("uploads"));