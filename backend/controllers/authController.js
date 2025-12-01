import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';

// @desc    Registrar novo usuário
// @route   POST /api/auth/register
// @access  Public (mas pode ser restrito a admin apenas)
export const register = async (req, res, next) => {
    try {
        const { nome, email, senha, role } = req.body;

        // Verificar se usuário já existe
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                error: 'Email já cadastrado'
            });
        }

        // Criar usuário
        const user = await User.create({
            nome,
            email,
            senha,
            role: role || 'user'
        });

        // Gerar token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            data: {
                _id: user._id,
                nome: user.nome,
                email: user.email,
                role: user.role,
                ativo: user.ativo,
                token
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login de usuário
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
    try {
        const { email, senha } = req.body;

        // Validar email e senha
        if (!email || !senha) {
            return res.status(400).json({
                success: false,
                error: 'Por favor, forneça email e senha'
            });
        }

        // Buscar usuário com senha
        const user = await User.findOne({ email }).select('+senha');

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Credenciais inválidas'
            });
        }

        // Verificar senha
        const isMatch = await user.compararSenha(senha);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Credenciais inválidas'
            });
        }

        // Verificar se usuário está ativo
        if (!user.ativo) {
            return res.status(401).json({
                success: false,
                error: 'Usuário inativo. Entre em contato com o administrador'
            });
        }

        // Atualizar último login
        user.ultimoLogin = new Date();
        await user.save();

        // Gerar token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                nome: user.nome,
                email: user.email,
                role: user.role,
                ativo: user.ativo,
                avatar: user.avatar,
                token
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Obter dados do usuário logado
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Atualizar perfil do usuário logado
// @route   PUT /api/auth/me
// @access  Private
export const updateMe = async (req, res, next) => {
    try {
        const fieldsToUpdate = {
            nome: req.body.nome,
            email: req.body.email,
            avatar: req.body.avatar
        };

        const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Alterar senha do usuário logado
// @route   PUT /api/auth/password
// @access  Private
export const updatePassword = async (req, res, next) => {
    try {
        const { senhaAtual, novaSenha } = req.body;

        if (!senhaAtual || !novaSenha) {
            return res.status(400).json({
                success: false,
                error: 'Por favor, forneça a senha atual e a nova senha'
            });
        }

        const user = await User.findById(req.user._id).select('+senha');

        // Verificar senha atual
        const isMatch = await user.compararSenha(senhaAtual);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Senha atual incorreta'
            });
        }

        // Atualizar senha
        user.senha = novaSenha;
        await user.save();

        // Gerar novo token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            data: {
                message: 'Senha atualizada com sucesso',
                token
            }
        });
    } catch (error) {
        next(error);
    }
};
