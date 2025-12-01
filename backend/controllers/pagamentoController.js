import Pagamento from '../models/Pagamento.js';

export const getPagamentos = async (req, res, next) => {
    try {
        const { status } = req.query;
        const query = status ? { status } : {};
        const pagamentos = await Pagamento.find(query).populate('responsavel', 'nome email').sort({ dataVencimento: -1 });
        res.status(200).json({ success: true, count: pagamentos.length, data: pagamentos });
    } catch (error) {
        next(error);
    }
};

export const getPagamento = async (req, res, next) => {
    try {
        const pagamento = await Pagamento.findById(req.params.id).populate('responsavel', 'nome email');
        if (!pagamento) return res.status(404).json({ success: false, error: 'Pagamento não encontrado' });
        res.status(200).json({ success: true, data: pagamento });
    } catch (error) {
        next(error);
    }
};

export const createPagamento = async (req, res, next) => {
    try {
        req.body.responsavel = req.user._id;
        const pagamento = await Pagamento.create(req.body);
        res.status(201).json({ success: true, data: pagamento });
    } catch (error) {
        next(error);
    }
};

export const updatePagamento = async (req, res, next) => {
    try {
        const pagamento = await Pagamento.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!pagamento) return res.status(404).json({ success: false, error: 'Pagamento não encontrado' });
        res.status(200).json({ success: true, data: pagamento });
    } catch (error) {
        next(error);
    }
};

export const deletePagamento = async (req, res, next) => {
    try {
        const pagamento = await Pagamento.findById(req.params.id);
        if (!pagamento) return res.status(404).json({ success: false, error: 'Pagamento não encontrado' });
        await pagamento.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

export const marcarComoPago = async (req, res, next) => {
    try {
        const pagamento = await Pagamento.findById(req.params.id);
        if (!pagamento) return res.status(404).json({ success: false, error: 'Pagamento não encontrado' });
        pagamento.status = 'pago';
        pagamento.dataPagamento = new Date();
        await pagamento.save();
        res.status(200).json({ success: true, data: pagamento });
    } catch (error) {
        next(error);
    }
};
