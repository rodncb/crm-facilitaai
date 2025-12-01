import express from 'express';
import {
    cadastrarNaLista,
    listarLista,
    aprovarPessoa,
    rejeitarPessoa,
    deletarPessoa
} from '../controllers/waitlistController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

// Rota pública
router.post('/', cadastrarNaLista);

// Rotas protegidas (Admin apenas)
router.get('/', protect, authorize('admin'), listarLista);
router.put('/:id/aprovar', protect, authorize('admin'), aprovarPessoa);
router.put('/:id/rejeitar', protect, authorize('admin'), rejeitarPessoa);
router.delete('/:id', protect, authorize('admin'), deletarPessoa);

export default router;
