import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Proteger rotas - verificar se usuário está autenticado
export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Não autorizado - Token não fornecido'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select('-senha');

        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Usuário não encontrado'
            });
        }

        if (!req.user.ativo) {
            return res.status(401).json({
                success: false,
                error: 'Usuário inativo'
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            error: 'Não autorizado - Token inválido'
        });
    }
};

// Gerar JWT Token
export const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};
