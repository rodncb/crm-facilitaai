import express from 'express';
import { receiveLeadFromWebsite, receiveWhatsAppMessage } from '../controllers/webhookController.js';

const router = express.Router();

// Rotas públicas (sem autenticação)
router.post('/lead', receiveLeadFromWebsite);
router.post('/whatsapp', receiveWhatsAppMessage);

export default router;
