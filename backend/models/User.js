import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
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
    senha: {
        type: String,
        required: [true, 'Senha é obrigatória'],
        minlength: [6, 'Senha deve ter no mínimo 6 caracteres'],
        select: false
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'viewer'],
        default: 'user'
    },
    avatar: {
        type: String,
        default: ''
    },
    ativo: {
        type: Boolean,
        default: true
    },
    ultimoLogin: {
        type: Date
    }
}, {
    timestamps: true
});

// Hash password antes de salvar
userSchema.pre('save', async function (next) {
    if (!this.isModified('senha')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
});

// Método para comparar senha
userSchema.methods.compararSenha = async function (senhaInformada) {
    return await bcrypt.compare(senhaInformada, this.senha);
};

const User = mongoose.model('User', userSchema);

export default User;
