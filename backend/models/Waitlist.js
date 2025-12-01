import mongoose from 'mongoose';

const waitlistSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'Nome é obrigatório'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email é obrigatório'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Email inválido']
    },
    empresa: {
        type: String,
        trim: true
    },
    telefone: {
        type: String,
        required: [true, 'Telefone é obrigatório'],
        trim: true
    },
    planoInteresse: {
        type: String,
        enum: ['free', 'starter', 'pro', 'combo'],
        default: 'free'
    },
    posicao: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['aguardando', 'aprovado', 'rejeitado'],
        default: 'aguardando'
    },
    aprovadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    aprovadoEm: {
        type: Date
    },
    observacoes: {
        type: String
    }
}, {
    timestamps: true
});

// Índice para busca rápida
waitlistSchema.index({ email: 1 });
waitlistSchema.index({ status: 1 });
waitlistSchema.index({ posicao: 1 });

const Waitlist = mongoose.model('Waitlist', waitlistSchema);

export default Waitlist;
