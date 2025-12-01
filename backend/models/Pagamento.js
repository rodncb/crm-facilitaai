import mongoose from 'mongoose';

const pagamentoSchema = new mongoose.Schema({
    numero: {
        type: String,
        required: true,
        unique: true
    },
    cliente: {
        nome: { type: String, required: true },
        empresa: String,
        email: String
    },
    clienteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente'
    },
    contratoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contrato'
    },
    valor: {
        type: Number,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    dataVencimento: {
        type: Date,
        required: true
    },
    dataPagamento: Date,
    status: {
        type: String,
        enum: ['pendente', 'pago', 'atrasado', 'cancelado'],
        default: 'pendente'
    },
    metodoPagamento: {
        type: String,
        enum: ['dinheiro', 'pix', 'cartao_credito', 'cartao_debito', 'transferencia', 'boleto'],
        default: 'pix'
    },
    comprovante: String,
    observacoes: String,
    responsavel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // Integração Stripe
    stripePaymentIntentId: String,
    stripeStatus: String,
    stripeClientSecret: String,
    // Integração Abacate API (PIX)
    abacatePixId: String,
    abacatePixQrCode: String,
    abacatePixQrCodeText: String,
    abacatePixStatus: String,
    abacatePixExpiresAt: Date
}, {
    timestamps: true
});

pagamentoSchema.index({ numero: 1 });
pagamentoSchema.index({ status: 1 });
pagamentoSchema.index({ dataVencimento: 1 });

const Pagamento = mongoose.model('Pagamento', pagamentoSchema);

export default Pagamento;
