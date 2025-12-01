import express from 'express';
import {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    updateUserRole
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

// Todas as rotas requerem autenticação e role de admin
router.use(protect);
router.use(authorize('admin'));

router.route('/')
    .get(getUsers)
    .post(createUser);

router.route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);

router.patch('/:id/role', updateUserRole);

export default router;
