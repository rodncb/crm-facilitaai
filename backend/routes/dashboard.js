import express from 'express';
import {
    getDashboardStats,
    getLeadsRecentes,
    getAtividadesRecentes,
    getConversoes
} from '../controllers/dashboardController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/leads-recentes', getLeadsRecentes);
router.get('/atividades', getAtividadesRecentes);
router.get('/conversoes', getConversoes);

export default router;
