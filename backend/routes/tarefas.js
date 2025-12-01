import express from 'express';
import {
    getTarefas,
    getTarefasByCliente,
    getTarefa,
    createTarefa,
    updateTarefa,
    updateTarefaStatus,
    deleteTarefa
} from '../controllers/tarefaController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(protect);

router.route('/')
    .get(getTarefas)
    .post(authorize('admin', 'user'), createTarefa);

router.get('/cliente/:clienteId', getTarefasByCliente);

router.route('/:id')
    .get(getTarefa)
    .put(authorize('admin', 'user'), updateTarefa)
    .delete(authorize('admin', 'user'), deleteTarefa);

router.patch('/:id/status', authorize('admin', 'user'), updateTarefaStatus);

export default router;
