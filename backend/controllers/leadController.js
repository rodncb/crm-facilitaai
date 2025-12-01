import Lead from '../models/Lead.js';

// @desc    Listar todos os leads
// @route   GET /api/leads
// @access  Private
export const getLeads = async (req, res, next) => {
    try {
        const { status, origem, search } = req.query;
        
        let query = {};
        
        if (status) query.status = status;
        if (origem) query.origem = origem;
        if (search) {
            query.$or = [
                { nome: { $regex: search, $options: 'i' } },
                { empresa: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        
        const leads = await Lead.find(query)
            .populate('responsavel', 'nome email')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: leads.length,
            data: leads
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Buscar lead por ID
// @route   GET /api/leads/:id
// @access  Private
export const getLead = async (req, res, next) => {
    try {
        const lead = await Lead.findById(req.params.id)
            .populate('responsavel', 'nome email');
        
        if (!lead) {
            return res.status(404).json({
                success: false,
                error: 'Lead não encontrado'
            });
        }
        
        res.status(200).json({
            success: true,
            data: lead
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Criar novo lead
// @route   POST /api/leads
// @access  Private
export const createLead = async (req, res, next) => {
    try {
        // Adicionar responsavel automaticamente (usuário logado)
        req.body.responsavel = req.user._id;
        
        const lead = await Lead.create(req.body);
        
        res.status(201).json({
            success: true,
            data: lead
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Atualizar lead
// @route   PUT /api/leads/:id
// @access  Private
export const updateLead = async (req, res, next) => {
    try {
        let lead = await Lead.findById(req.params.id);
        
        if (!lead) {
            return res.status(404).json({
                success: false,
                error: 'Lead não encontrado'
            });
        }
        
        lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        
        res.status(200).json({
            success: true,
            data: lead
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Deletar lead
// @route   DELETE /api/leads/:id
// @access  Private
export const deleteLead = async (req, res, next) => {
    try {
        const lead = await Lead.findById(req.params.id);
        
        if (!lead) {
            return res.status(404).json({
                success: false,
                error: 'Lead não encontrado'
            });
        }
        
        await lead.deleteOne();
        
        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Converter lead em cliente
// @route   POST /api/leads/:id/convert
// @access  Private
export const convertLead = async (req, res, next) => {
    try {
        const lead = await Lead.findById(req.params.id);
        
        if (!lead) {
            return res.status(404).json({
                success: false,
                error: 'Lead não encontrado'
            });
        }
        
        if (lead.status === 'convertido') {
            return res.status(400).json({
                success: false,
                error: 'Lead já foi convertido'
            });
        }
        
        lead.status = 'convertido';
        lead.dataConversao = new Date();
        if (req.body.clienteId) {
            lead.clienteId = req.body.clienteId;
        }
        
        await lead.save();
        
        res.status(200).json({
            success: true,
            data: lead
        });
    } catch (error) {
        next(error);
    }
};
