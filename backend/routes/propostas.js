import express from 'express';
import {
    getPropostas,
    getProposta,
    createProposta,
    updateProposta,
    deleteProposta,
    aprovarProposta,
    recusarProposta
} from '../controllers/propostaController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getPropostas)
    .post(createProposta);

router.route('/:id')
    .get(getProposta)
    .put(updateProposta)
    .delete(deleteProposta);

router.post('/:id/aprovar', aprovarProposta);
router.post('/:id/recusar', recusarProposta);

export default router;
