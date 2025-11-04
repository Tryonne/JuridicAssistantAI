import express from "express";
import assistantRoutes from "./routes/assistant";
import cors from "cors";
import { env } from "./config/env";



const app = express();

app.use(cors({
  origin: env.FRONTEND_ORIGIN ?? "http://localhost:3001", 
}));

app.use(express.json({ limit: '2mb'}));

//  http://localhost:3001/health para ver o status do server 

app.get('/health', (req, res) => 
  res.json({ status: 'ok' })
);

app.use("/assistant", assistantRoutes);


app.listen(env.PORT, () => console.log(`http://localhost:${env.PORT}`));


