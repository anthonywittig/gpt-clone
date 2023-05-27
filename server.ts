import express, { Request, Response } from "express";
import cors from "cors";
import { config } from "dotenv";

const PORT = 8000;
const app = express();
config();

app.use(express.json());
app.use(cors());

app.post("/completions", async (req: Request, res: Response) => {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: req.body.messages,
      max_tokens: 100,
    }),
  };
  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      options
    );
    const data = await response.json();
    res.send(data);
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}!`));
