import Proposta from '../models/Proposta.js';

export const getPropostas = async (req, res, next) => {
    try {
        const { status, search } = req.query;
        let query = {};
        
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { numero: { $regex: search, $options: 'i' } },
                { 'cliente.nome': { $regex: search, $options: 'i' } },
                { 'cliente.empresa': { $regex: search, $options: 'i' } }
            ];
        }
        
        const propostas = await Proposta.find(query)
            .populate('responsavel', 'nome email')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: propostas.length,
            data: propostas
        });
    } catch (error) {
        next(error);
    }
};

export const getProposta = async (req, res, next) => {
    try {
        const proposta = await Proposta.findById(req.params.id)
            .populate('responsavel', 'nome email');
        
        if (!proposta) {
            return res.status(404).json({
                success: false,
                error: 'Proposta não encontrada'
            });
        }
        
        res.status(200).json({
            success: true,
            data: proposta
        });
    } catch (error) {
        next(error);
    }
};

export const createProposta = async (req, res, next) => {
    try {
        req.body.responsavel = req.user._id;
        
        const proposta = await Proposta.create(req.body);
        
        res.status(201).json({
            success: true,
            data: proposta
        });
    } catch (error) {
        next(error);
    }
};

export const updateProposta = async (req, res, next) => {
    try {
        let proposta = await Proposta.findById(req.params.id);
        
        if (!proposta) {
            return res.status(404).json({
                success: false,
                error: 'Proposta não encontrada'
            });
        }
        
        proposta = await Proposta.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        
        res.status(200).json({
            success: true,
            data: proposta
        });
    } catch (error) {
        next(error);
    }
};

export const deleteProposta = async (req, res, next) => {
    try {
        const proposta = await Proposta.findById(req.params.id);
        
        if (!proposta) {
            return res.status(404).json({
                success: false,
                error: 'Proposta não encontrada'
            });
        }
        
        await proposta.deleteOne();
        
        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

export const aprovarProposta = async (req, res, next) => {
    try {
        const proposta = await Proposta.findById(req.params.id);
        
        if (!proposta) {
            return res.status(404).json({
                success: false,
                error: 'Proposta não encontrada'
            });
        }
        
        proposta.status = 'aprovada';
        proposta.dataAprovacao = new Date();
        await proposta.save();
        
        res.status(200).json({
            success: true,
            data: proposta
        });
    } catch (error) {
        next(error);
    }
};

export const recusarProposta = async (req, res, next) => {
    try {
        const proposta = await Proposta.findById(req.params.id);
        
        if (!proposta) {
            return res.status(404).json({
                success: false,
                error: 'Proposta não encontrada'
            });
        }
        
        proposta.status = 'recusada';
        proposta.dataRecusa = new Date();
        proposta.motivoRecusa = req.body.motivo || '';
        await proposta.save();
        
        res.status(200).json({
            success: true,
            data: proposta
        });
    } catch (error) {
        next(error);
    }
};
