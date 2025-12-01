import express from 'express';
import {
    getClientes,
    getClientesAtivos,
    getCliente,
    createCliente,
    updateCliente,
    deleteCliente
} from '../controllers/clienteController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(protect);

router.route('/')
    .get(getClientes)
    .post(authorize('admin', 'user'), createCliente);

router.get('/ativos', getClientesAtivos);

router.route('/:id')
    .get(getCliente)
    .put(authorize('admin', 'user'), updateCliente)
    .delete(authorize('admin'), deleteCliente);

export default router;
