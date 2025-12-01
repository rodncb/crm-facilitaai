import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('🔌 Conectado ao MongoDB');

        const adminExists = await User.findOne({ email: 'admin@facilitaai.com' });

        if (adminExists) {
            console.log('⚠️  Usuário admin já existe!');
            console.log('Email: admin@facilitaai.com');
            console.log('Se você não sabe a senha, delete este usuário no banco ou altere o script para criar outro.');
            process.exit(0);
        }

        const user = await User.create({
            nome: 'Admin FacilitaAI',
            email: 'admin@facilitaai.com',
            senha: 'admin123456', // Senha padrão mais forte
            role: 'admin',
            ativo: true
        });

        console.log('✅ Usuário Admin criado com sucesso!');
        console.log('-----------------------------------');
        console.log('Email: admin@facilitaai.com');
        console.log('Senha: admin123456');
        console.log('-----------------------------------');

        process.exit(0);
    } catch (error) {
        console.error('❌ Erro ao criar admin:', error);
        process.exit(1);
    }
};

createAdmin();
