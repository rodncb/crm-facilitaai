import express from 'express';
import { getContratos, getContrato, createContrato, updateContrato, deleteContrato } from '../controllers/contratoController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.route('/').get(getContratos).post(createContrato);
router.route('/:id').get(getContrato).put(updateContrato).delete(deleteContrato);

export default router;
