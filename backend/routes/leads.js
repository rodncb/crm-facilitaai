import express from 'express';
import {
    getLeads,
    getLead,
    createLead,
    updateLead,
    deleteLead,
    convertLead
} from '../controllers/leadController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(protect);

router.route('/')
    .get(getLeads)
    .post(createLead);

router.route('/:id')
    .get(getLead)
    .put(updateLead)
    .delete(deleteLead);

router.post('/:id/convert', convertLead);

export default router;
