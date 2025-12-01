import mongoose from 'mongoose';

// Modelo para armazenar histórico de transações do Stripe
const transactionSchema = new mongoose.Schema({
    clienteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
    },
    pagamentoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pagamento'
    },
    stripePaymentIntentId: {
        type: String,
        required: true
    },
    stripeChargeId: {
        type: String
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        default: 'brl',
        uppercase: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'succeeded', 'failed', 'canceled', 'refunded'],
        default: 'pending'
    },
    paymentMethod: {
        type: String
    },
    description: {
        type: String
    },
    metadata: {
        type: Map,
        of: String
    },
    errorMessage: {
        type: String
    },
    refundedAmount: {
        type: Number,
        default: 0
    },
    refundedAt: {
        type: Date
    }
}, {
    timestamps: true
});

transactionSchema.index({ clienteId: 1 });
transactionSchema.index({ pagamentoId: 1 });
transactionSchema.index({ stripePaymentIntentId: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ createdAt: -1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
