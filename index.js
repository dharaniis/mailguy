import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs");
  });


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });