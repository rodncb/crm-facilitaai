import express from 'express';
import { getPagamentos, getPagamento, createPagamento, updatePagamento, deletePagamento, marcarComoPago } from '../controllers/pagamentoController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.route('/').get(getPagamentos).post(createPagamento);
router.route('/:id').get(getPagamento).put(updatePagamento).delete(deletePagamento);
router.post('/:id/pagar', marcarComoPago);

export default router;
