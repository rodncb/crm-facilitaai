import mongoose from 'mongoose';

const clienteSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'Nome é obrigatório'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email é obrigatório'],
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Email inválido']
    },
    telefone: {
        type: String,
        required: [true, 'Telefone é obrigatório'],
        trim: true
    },
    empresa: {
        type: String,
        trim: true
    },
    cnpj: {
        type: String,
        trim: true
    },
    cpf: {
        type: String,
        trim: true
    },
    tipo: {
        type: String,
        enum: ['PF', 'PJ'],
        required: [true, 'Tipo é obrigatório']
    },
    status: {
        type: String,
        enum: ['ativo', 'inativo', 'prospecto'],
        default: 'prospecto'
    },
    endereco: {
        rua: String,
        numero: String,
        complemento: String,
        bairro: String,
        cidade: String,
        estado: String,
        cep: String
    },
    observacoes: {
        type: String,
        default: ''
    },
    criadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Índices para melhor performance
clienteSchema.index({ email: 1 });
clienteSchema.index({ status: 1 });
clienteSchema.index({ tipo: 1 });

const Cliente = mongoose.model('Cliente', clienteSchema);

export default Cliente;
