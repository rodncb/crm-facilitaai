import mongoose from 'mongoose';

const propostaSchema = new mongoose.Schema({
    numero: {
        type: String,
        required: true,
        unique: true
    },
    cliente: {
        nome: { type: String, required: true },
        empresa: String,
        email: { type: String, required: true },
        telefone: String,
        documento: String
    },
    clienteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente'
    },
    leadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lead'
    },
    itens: [{
        descricao: String,
        quantidade: Number,
        valorUnitario: Number,
        valorTotal: Number
    }],
    valorTotal: {
        type: Number,
        required: true,
        default: 0
    },
    desconto: {
        type: Number,
        default: 0
    },
    valorFinal: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pendente', 'enviada', 'aprovada', 'recusada', 'expirada'],
        default: 'pendente'
    },
    dataValidade: {
        type: Date,
        required: true
    },
    condicoesPagamento: {
        type: String
    },
    observacoes: {
        type: String
    },
    responsavel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dataAprovacao: Date,
    dataRecusa: Date,
    motivoRecusa: String
}, {
    timestamps: true
});

propostaSchema.index({ numero: 1 });
propostaSchema.index({ status: 1 });

const Proposta = mongoose.model('Proposta', propostaSchema);

export default Proposta;
