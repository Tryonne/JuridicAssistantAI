import express from "express";
import assistantRoutes from "./routes/assistant";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());

app.use("/assistant", assistantRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Assistant API running at http://localhost:${PORT}`);
});
