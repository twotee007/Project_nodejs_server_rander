import express from "express";
import { router as login } from "./api/login";
import bodyParser from "body-parser";
export const app = express();

app.use(bodyParser.text());
app.use(bodyParser.json());

app.use("/login", login);