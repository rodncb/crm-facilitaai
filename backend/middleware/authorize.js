// Middleware para autorização baseada em roles
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Não autorizado'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: `Acesso negado. Role '${req.user.role}' não tem permissão para acessar esta rota`
            });
        }

        next();
    };
};

// Verificar se usuário pode modificar recurso (apenas admin ou dono do recurso)
export const canModify = (resourceUserId) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Não autorizado'
            });
        }

        // Admin pode modificar qualquer coisa
        if (req.user.role === 'admin') {
            return next();
        }

        // Verificar se é o dono do recurso
        if (resourceUserId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                error: 'Você não tem permissão para modificar este recurso'
            });
        }

        next();
    };
};
