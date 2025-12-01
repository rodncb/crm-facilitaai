import Contrato from '../models/Contrato.js';

export const getContratos = async (req, res, next) => {
    try {
        const { status } = req.query;
        const query = status ? { status } : {};
        const contratos = await Contrato.find(query).populate('responsavel', 'nome email').sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: contratos.length, data: contratos });
    } catch (error) {
        next(error);
    }
};

export const getContrato = async (req, res, next) => {
    try {
        const contrato = await Contrato.findById(req.params.id).populate('responsavel', 'nome email');
        if (!contrato) return res.status(404).json({ success: false, error: 'Contrato não encontrado' });
        res.status(200).json({ success: true, data: contrato });
    } catch (error) {
        next(error);
    }
};

export const createContrato = async (req, res, next) => {
    try {
        req.body.responsavel = req.user._id;
        const contrato = await Contrato.create(req.body);
        res.status(201).json({ success: true, data: contrato });
    } catch (error) {
        next(error);
    }
};

export const updateContrato = async (req, res, next) => {
    try {
        const contrato = await Contrato.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!contrato) return res.status(404).json({ success: false, error: 'Contrato não encontrado' });
        res.status(200).json({ success: true, data: contrato });
    } catch (error) {
        next(error);
    }
};

export const deleteContrato = async (req, res, next) => {
    try {
        const contrato = await Contrato.findById(req.params.id);
        if (!contrato) return res.status(404).json({ success: false, error: 'Contrato não encontrado' });
        await contrato.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};
