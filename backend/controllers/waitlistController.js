import Waitlist from '../models/Waitlist.js';
import User from '../models/User.js';

// @desc    Cadastrar na lista de espera
// @route   POST /api/waitlist
// @access  Public
export const cadastrarNaLista = async (req, res, next) => {
    try {
        const { nome, email, empresa, telefone, planoInteresse } = req.body;

        // Verificar se email já está na lista
        const existente = await Waitlist.findOne({ email });
        if (existente) {
            return res.status(400).json({
                success: false,
                error: 'Este email já está na lista de espera'
            });
        }

        // Calcular posição (última posição + 1)
        const ultimaPosicao = await Waitlist.findOne().sort('-posicao');
        const novaPosicao = ultimaPosicao ? ultimaPosicao.posicao + 1 : 1;

        // Criar registro
        const waitlist = await Waitlist.create({
            nome,
            email,
            empresa,
            telefone,
            planoInteresse,
            posicao: novaPosicao
        });

        res.status(201).json({
            success: true,
            data: {
                _id: waitlist._id,
                posicao: waitlist.posicao,
                planoInteresse: waitlist.planoInteresse
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Listar todos na lista de espera (Admin)
// @route   GET /api/waitlist
// @access  Private (Admin)
export const listarLista = async (req, res, next) => {
    try {
        const { status } = req.query;

        const filter = status ? { status } : {};

        const lista = await Waitlist.find(filter)
            .sort('posicao')
            .populate('aprovadoPor', 'nome email');

        const stats = {
            total: await Waitlist.countDocuments(),
            aguardando: await Waitlist.countDocuments({ status: 'aguardando' }),
            aprovados: await Waitlist.countDocuments({ status: 'aprovado' }),
            rejeitados: await Waitlist.countDocuments({ status: 'rejeitado' })
        };

        res.status(200).json({
            success: true,
            count: lista.length,
            stats,
            data: lista
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Aprovar pessoa da lista
// @route   PUT /api/waitlist/:id/aprovar
// @access  Private (Admin)
export const aprovarPessoa = async (req, res, next) => {
    try {
        const { observacoes } = req.body;

        const pessoa = await Waitlist.findById(req.params.id);

        if (!pessoa) {
            return res.status(404).json({
                success: false,
                error: 'Pessoa não encontrada na lista'
            });
        }

        if (pessoa.status === 'aprovado') {
            return res.status(400).json({
                success: false,
                error: 'Pessoa já foi aprovada'
            });
        }

        // Atualizar status
        pessoa.status = 'aprovado';
        pessoa.aprovadoPor = req.user.id;
        pessoa.aprovadoEm = new Date();
        if (observacoes) pessoa.observacoes = observacoes;

        await pessoa.save();

        // TODO: Criar usuário no sistema
        // TODO: Enviar email com credenciais

        res.status(200).json({
            success: true,
            data: pessoa
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Rejeitar pessoa da lista
// @route   PUT /api/waitlist/:id/rejeitar
// @access  Private (Admin)
export const rejeitarPessoa = async (req, res, next) => {
    try {
        const { observacoes } = req.body;

        const pessoa = await Waitlist.findById(req.params.id);

        if (!pessoa) {
            return res.status(404).json({
                success: false,
                error: 'Pessoa não encontrada na lista'
            });
        }

        pessoa.status = 'rejeitado';
        pessoa.aprovadoPor = req.user.id;
        pessoa.aprovadoEm = new Date();
        if (observacoes) pessoa.observacoes = observacoes;

        await pessoa.save();

        res.status(200).json({
            success: true,
            data: pessoa
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Deletar pessoa da lista
// @route   DELETE /api/waitlist/:id
// @access  Private (Admin)
export const deletarPessoa = async (req, res, next) => {
    try {
        const pessoa = await Waitlist.findById(req.params.id);

        if (!pessoa) {
            return res.status(404).json({
                success: false,
                error: 'Pessoa não encontrada na lista'
            });
        }

        await pessoa.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};
