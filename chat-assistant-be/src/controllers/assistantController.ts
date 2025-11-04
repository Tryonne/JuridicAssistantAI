import { Request, Response } from 'express';
import { askAssistant as askSvc } from '../services/assistantService';

export const askAssistant = async (req: Request, res: Response) => {
  try {
    const { message } = req.body || {};
    if (typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Parâmetro "message" é obrigatório.' });
    }

    const { answer, citations } = await askSvc(message);
    return res.json({ answer, citations });
  } catch (err: any) {
    if (err?.message === 'RUN_TIMEOUT') {
      return res.status(504).json({ error: 'Assistant não respondeu a tempo.' });
    }
    return res.status(500).json({ error: err?.message || 'Erro interno' });
  }
};

