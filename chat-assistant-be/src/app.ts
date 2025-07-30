import express from "express";
import chatbotRoutes from "./routes/chatbotRoutes";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());
app.use("/api", chatbotRoutes);

export default app;
