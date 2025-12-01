import mongoose from 'mongoose';

const contratoSchema = new mongoose.Schema({
    numero: {
        type: String,
        required: true,
        unique: true
    },
    cliente: {
        nome: { type: String, required: true },
        empresa: String,
        email: { type: String, required: true },
        documento: String
    },
    clienteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente'
    },
    propostaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proposta'
    },
    titulo: {
        type: String,
        required: true
    },
    descricao: String,
    valor: {
        type: Number,
        required: true
    },
    dataInicio: {
        type: Date,
        required: true
    },
    dataFim: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['ativo', 'finalizado', 'cancelado', 'suspenso'],
        default: 'ativo'
    },
    renovacaoAutomatica: {
        type: Boolean,
        default: false
    },
    observacoes: String,
    responsavel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

contratoSchema.index({ numero: 1 });
contratoSchema.index({ status: 1 });

const Contrato = mongoose.model('Contrato', contratoSchema);

export default Contrato;
