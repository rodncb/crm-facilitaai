import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'Nome é obrigatório'],
        trim: true
    },
    empresa: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email é obrigatório'],
        trim: true,
        lowercase: true
    },
    telefone: {
        type: String,
        required: [true, 'Telefone é obrigatório'],
        trim: true
    },
    origem: {
        type: String,
        enum: ['Site', 'Indicação', 'LinkedIn', 'Instagram', 'Facebook', 'Google', 'Evento', 'Outro'],
        default: 'Site'
    },
    status: {
        type: String,
        enum: ['novo', 'contatado', 'qualificado', 'negociacao', 'convertido', 'perdido'],
        default: 'novo'
    },
    interesse: {
        type: String,
        trim: true
    },
    observacoes: {
        type: String,
        trim: true
    },
    proximoFollowup: {
        type: Date
    },
    valorEstimado: {
        type: Number,
        default: 0
    },
    tags: [{
        type: String,
        trim: true
    }],
    responsavel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dataConversao: {
        type: Date
    },
    clienteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente'
    }
}, {
    timestamps: true
});

// Índices para melhor performance
leadSchema.index({ email: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ origem: 1 });
leadSchema.index({ responsavel: 1 });

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;
