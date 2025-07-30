import { Router } from "express";
import { chatWithAssistant } from "../controllers/chatbotController";

const router = Router();

router.post("/chat", chatWithAssistant);

export default router;
