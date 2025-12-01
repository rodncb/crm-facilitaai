import User from '../models/User.js';

// @desc    Listar todos os usuários
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-senha');

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Buscar usuário por ID
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-senha');

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'Usuário não encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Criar novo usuário
// @route   POST /api/users
// @access  Private/Admin
export const createUser = async (req, res, next) => {
    try {
        const user = await User.create(req.body);

        res.status(201).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Atualizar usuário
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req, res, next) => {
    try {
        // Não permitir atualizar senha por esta rota
        if (req.body.senha) {
            delete req.body.senha;
        }

        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).select('-senha');

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'Usuário não encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Deletar usuário
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'Usuário não encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Alterar role do usuário
// @route   PATCH /api/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;

        if (!['admin', 'user', 'viewer'].includes(role)) {
            return res.status(400).json({
                success: false,
                error: 'Role inválida. Use: admin, user ou viewer'
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true, runValidators: true }
        ).select('-senha');

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'Usuário não encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};
