import Tarefa from '../models/Tarefa.js';

// @desc    Listar todas as tarefas
// @route   GET /api/tarefas
// @access  Private
export const getTarefas = async (req, res, next) => {
    try {
        const { status, prioridade, clienteId, responsavel } = req.query;

        let query = {};

        if (status) query.status = status;
        if (prioridade) query.prioridade = prioridade;
        if (clienteId) query.clienteId = clienteId;
        if (responsavel) query.responsavel = responsavel;

        const tarefas = await Tarefa.find(query)
            .populate('clienteId', 'nome email empresa')
            .populate('responsavel', 'nome email')
            .populate('criadoPor', 'nome email')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: tarefas.length,
            data: tarefas
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Listar tarefas de um cliente específico
// @route   GET /api/tarefas/cliente/:clienteId
// @access  Private
export const getTarefasByCliente = async (req, res, next) => {
    try {
        const tarefas = await Tarefa.find({ clienteId: req.params.clienteId })
            .populate('responsavel', 'nome email')
            .populate('criadoPor', 'nome email')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: tarefas.length,
            data: tarefas
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Buscar tarefa por ID
// @route   GET /api/tarefas/:id
// @access  Private
export const getTarefa = async (req, res, next) => {
    try {
        const tarefa = await Tarefa.findById(req.params.id)
            .populate('clienteId', 'nome email empresa')
            .populate('responsavel', 'nome email')
            .populate('criadoPor', 'nome email');

        if (!tarefa) {
            return res.status(404).json({
                success: false,
                error: 'Tarefa não encontrada'
            });
        }

        res.status(200).json({
            success: true,
            data: tarefa
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Criar nova tarefa
// @route   POST /api/tarefas
// @access  Private
export const createTarefa = async (req, res, next) => {
    try {
        req.body.criadoPor = req.user._id;

        // Se não especificar responsável, usar o próprio usuário
        if (!req.body.responsavel) {
            req.body.responsavel = req.user._id;
        }

        const tarefa = await Tarefa.create(req.body);

        // Popular os campos antes de retornar
        await tarefa.populate('clienteId', 'nome email empresa');
        await tarefa.populate('responsavel', 'nome email');
        await tarefa.populate('criadoPor', 'nome email');

        res.status(201).json({
            success: true,
            data: tarefa
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Atualizar tarefa
// @route   PUT /api/tarefas/:id
// @access  Private
export const updateTarefa = async (req, res, next) => {
    try {
        let tarefa = await Tarefa.findById(req.params.id);

        if (!tarefa) {
            return res.status(404).json({
                success: false,
                error: 'Tarefa não encontrada'
            });
        }

        // Verificar permissão
        if (
            req.user.role !== 'admin' &&
            tarefa.criadoPor.toString() !== req.user._id.toString() &&
            tarefa.responsavel.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                error: 'Não autorizado a atualizar esta tarefa'
            });
        }

        tarefa = await Tarefa.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
            .populate('clienteId', 'nome email empresa')
            .populate('responsavel', 'nome email')
            .populate('criadoPor', 'nome email');

        res.status(200).json({
            success: true,
            data: tarefa
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Atualizar apenas status da tarefa
// @route   PATCH /api/tarefas/:id/status
// @access  Private
export const updateTarefaStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        if (!['pendente', 'em_andamento', 'concluida', 'cancelada'].includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Status inválido'
            });
        }

        const tarefa = await Tarefa.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        )
            .populate('clienteId', 'nome email empresa')
            .populate('responsavel', 'nome email')
            .populate('criadoPor', 'nome email');

        if (!tarefa) {
            return res.status(404).json({
                success: false,
                error: 'Tarefa não encontrada'
            });
        }

        res.status(200).json({
            success: true,
            data: tarefa
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Deletar tarefa
// @route   DELETE /api/tarefas/:id
// @access  Private
export const deleteTarefa = async (req, res, next) => {
    try {
        const tarefa = await Tarefa.findById(req.params.id);

        if (!tarefa) {
            return res.status(404).json({
                success: false,
                error: 'Tarefa não encontrada'
            });
        }

        // Verificar permissão
        if (req.user.role !== 'admin' && tarefa.criadoPor.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                error: 'Não autorizado a deletar esta tarefa'
            });
        }

        await tarefa.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};
