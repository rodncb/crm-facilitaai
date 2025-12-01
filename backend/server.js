import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/database.js';
import errorHandler from './middleware/errorHandler.js';

// Importar rotas
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import clienteRoutes from './routes/clientes.js';
import leadRoutes from './routes/leads.js';
import tarefaRoutes from './routes/tarefas.js';
import propostaRoutes from './routes/propostas.js';
import contratoRoutes from './routes/contratos.js';
import pagamentoRoutes from './routes/pagamentos.js';
import stripeRoutes from './routes/stripe.js';
import webhookRoutes from './routes/webhooks.js';
import dashboardRoutes from './routes/dashboard.js';
import waitlistRoutes from './routes/waitlist.js';

// Carregar variáveis de ambiente
dotenv.config();

// Conectar ao banco de dados
connectDB();

const app = express();

// Middlewares de segurança e parsing
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger (apenas em desenvolvimento)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Rota de health check
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'CRM FacilitaAI API está rodando! 🚀',
        timestamp: new Date().toISOString()
    });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/tarefas', tarefaRoutes);
app.use('/api/propostas', propostaRoutes);
app.use('/api/contratos', contratoRoutes);
app.use('/api/pagamentos', pagamentoRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/waitlist', waitlistRoutes);

// Rota 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Rota não encontrada'
    });
});

// Error handler (deve ser o último middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em modo ${process.env.NODE_ENV} na porta ${PORT}`);
});

export default app;
