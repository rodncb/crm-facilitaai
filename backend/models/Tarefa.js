import mongoose from 'mongoose';

const tarefaSchema = new mongoose.Schema({
    clienteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente',
        required: [true, 'Cliente é obrigatório']
    },
    titulo: {
        type: String,
        required: [true, 'Título é obrigatório'],
        trim: true
    },
    descricao: {
        type: String,
        trim: true,
        default: ''
    },
    status: {
        type: String,
        enum: ['pendente', 'em_andamento', 'concluida', 'cancelada'],
        default: 'pendente'
    },
    prioridade: {
        type: String,
        enum: ['baixa', 'media', 'alta'],
        default: 'media'
    },
    dataVencimento: {
        type: Date
    },
    responsavel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Responsável é obrigatório']
    },
    tags: [{
        type: String,
        trim: true
    }],
    completedAt: {
        type: Date
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
tarefaSchema.index({ clienteId: 1 });
tarefaSchema.index({ status: 1 });
tarefaSchema.index({ prioridade: 1 });
tarefaSchema.index({ responsavel: 1 });
tarefaSchema.index({ dataVencimento: 1 });

// Atualizar completedAt quando status mudar para concluida
tarefaSchema.pre('save', function (next) {
    if (this.isModified('status') && this.status === 'concluida' && !this.completedAt) {
        this.completedAt = new Date();
    }
    next();
});

const Tarefa = mongoose.model('Tarefa', tarefaSchema);

export default Tarefa;
