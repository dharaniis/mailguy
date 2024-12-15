import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import bodyParser from "body-parser";
import mailtolink from "mailto-link";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs");
  });

app.post("/submit", async (req, res) => {
  const submission = req.body;
  const formArray = Object.entries(submission);
  const prompt = `Write an email requesting leave. The details are mentioned. Write 'sir/mam' as recipient name. dont use any []. don't make up details. write as a parent. dont assume gender of student. format date & time to human friendly.  ${formArray.toString()}`
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  const email = result.response.text();
  const position = email.search("Dear");
  const subjectRaw = email.slice(9,position);
  const subject = subjectRaw.trim();
  const body = email.slice(position,email.length);
  const mailto = mailtolink({
    to: "ponnidharani@gmail.com",
    subject: subject,
    body: body
  })
  res.render("index.ejs", {response: email, mailto: mailto});
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });