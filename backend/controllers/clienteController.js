import Cliente from '../models/Cliente.js';

// @desc    Listar todos os clientes
// @route   GET /api/clientes
// @access  Private
export const getClientes = async (req, res, next) => {
    try {
        const { status, tipo, search } = req.query;

        let query = {};

        // Filtros
        if (status) query.status = status;
        if (tipo) query.tipo = tipo;
        if (search) {
            query.$or = [
                { nome: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { empresa: { $regex: search, $options: 'i' } }
            ];
        }

        const clientes = await Cliente.find(query)
            .populate('criadoPor', 'nome email')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: clientes.length,
            data: clientes
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Listar apenas clientes ativos
// @route   GET /api/clientes/ativos
// @access  Private
export const getClientesAtivos = async (req, res, next) => {
    try {
        const clientes = await Cliente.find({ status: 'ativo' })
            .populate('criadoPor', 'nome email')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: clientes.length,
            data: clientes
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Buscar cliente por ID
// @route   GET /api/clientes/:id
// @access  Private
export const getCliente = async (req, res, next) => {
    try {
        const cliente = await Cliente.findById(req.params.id)
            .populate('criadoPor', 'nome email');

        if (!cliente) {
            return res.status(404).json({
                success: false,
                error: 'Cliente não encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: cliente
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Criar novo cliente
// @route   POST /api/clientes
// @access  Private
export const createCliente = async (req, res, next) => {
    try {
        // Adicionar usuário que criou
        req.body.criadoPor = req.user._id;

        const cliente = await Cliente.create(req.body);

        res.status(201).json({
            success: true,
            data: cliente
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Atualizar cliente
// @route   PUT /api/clientes/:id
// @access  Private
export const updateCliente = async (req, res, next) => {
    try {
        let cliente = await Cliente.findById(req.params.id);

        if (!cliente) {
            return res.status(404).json({
                success: false,
                error: 'Cliente não encontrado'
            });
        }

        // Verificar permissão (admin ou criador)
        if (req.user.role !== 'admin' && cliente.criadoPor.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                error: 'Não autorizado a atualizar este cliente'
            });
        }

        cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: cliente
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Deletar cliente
// @route   DELETE /api/clientes/:id
// @access  Private/Admin
export const deleteCliente = async (req, res, next) => {
    try {
        const cliente = await Cliente.findById(req.params.id);

        if (!cliente) {
            return res.status(404).json({
                success: false,
                error: 'Cliente não encontrado'
            });
        }

        await cliente.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};
