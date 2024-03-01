import express from "express";
import { router as login } from "./api/login";
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