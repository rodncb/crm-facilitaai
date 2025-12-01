import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Cliente from '../models/Cliente.js';
import Tarefa from '../models/Tarefa.js';
import connectDB from '../config/database.js';

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();

        // Limpar dados existentes (opcional - comentar se quiser manter dados)
        // await User.deleteMany({});
        // await Cliente.deleteMany({});
        // await Tarefa.deleteMany({});

        console.log('🔍 Verificando usuário admin...');

        // Buscar ou criar usuário admin
        let adminUser = await User.findOne({ email: 'admin@facilitaai.com.br' });

        if (!adminUser) {
            adminUser = await User.create({
                nome: 'Administrador',
                email: 'admin@facilitaai.com.br',
                senha: 'admin123',
                role: 'admin'
            });
            console.log('✅ Usuário admin criado');
        } else {
            console.log('✅ Usuário admin já existe');
        }

        console.log('🔍 Verificando clientes...');

        // Verificar se já existem clientes
        const clientesExistentes = await Cliente.countDocuments();

        if (clientesExistentes === 0) {
            // Criar clientes de exemplo
            const clientes = await Cliente.insertMany([
                {
                    nome: 'João Silva',
                    email: 'joao.silva@empresa.com',
                    telefone: '(11) 98765-4321',
                    empresa: 'Tech Solutions Ltda',
                    cnpj: '12.345.678/0001-90',
                    tipo: 'PJ',
                    status: 'ativo',
                    endereco: {
                        rua: 'Av. Paulista',
                        numero: '1000',
                        bairro: 'Bela Vista',
                        cidade: 'São Paulo',
                        estado: 'SP',
                        cep: '01310-100'
                    },
                    observacoes: 'Cliente desde 2023, sempre pontual nos pagamentos',
                    criadoPor: adminUser._id
                },
                {
                    nome: 'Maria Santos',
                    email: 'maria.santos@startup.com',
                    telefone: '(21) 91234-5678',
                    empresa: 'StartUp Inovadora',
                    cnpj: '98.765.432/0001-10',
                    tipo: 'PJ',
                    status: 'ativo',
                    endereco: {
                        rua: 'Rua do Ouvidor',
                        numero: '50',
                        bairro: 'Centro',
                        cidade: 'Rio de Janeiro',
                        estado: 'RJ',
                        cep: '20040-030'
                    },
                    observacoes: 'Startup em crescimento, interesse em planos premium',
                    criadoPor: adminUser._id
                },
                {
                    nome: 'Pedro Oliveira',
                    email: 'pedro.oliveira@gmail.com',
                    telefone: '(31) 99876-5432',
                    empresa: '',
                    cpf: '123.456.789-00',
                    tipo: 'PF',
                    status: 'ativo',
                    endereco: {
                        rua: 'Rua da Bahia',
                        numero: '1200',
                        bairro: 'Centro',
                        cidade: 'Belo Horizonte',
                        estado: 'MG',
                        cep: '30160-011'
                    },
                    observacoes: 'Profissional autônomo, consultor de TI',
                    criadoPor: adminUser._id
                },
                {
                    nome: 'Ana Costa',
                    email: 'ana.costa@design.com',
                    telefone: '(41) 98888-7777',
                    empresa: 'Design Criativo',
                    cnpj: '45.678.901/0001-23',
                    tipo: 'PJ',
                    status: 'ativo',
                    endereco: {
                        rua: 'Rua XV de Novembro',
                        numero: '300',
                        bairro: 'Centro',
                        cidade: 'Curitiba',
                        estado: 'PR',
                        cep: '80020-310'
                    },
                    observacoes: 'Agência de design, parceria de longo prazo',
                    criadoPor: adminUser._id
                },
                {
                    nome: 'Carlos Mendes',
                    email: 'carlos.mendes@comercio.com',
                    telefone: '(48) 97777-6666',
                    empresa: 'Comércio Sul',
                    cnpj: '23.456.789/0001-45',
                    tipo: 'PJ',
                    status: 'prospecto',
                    endereco: {
                        rua: 'Av. Beira Mar',
                        numero: '500',
                        bairro: 'Centro',
                        cidade: 'Florianópolis',
                        estado: 'SC',
                        cep: '88010-100'
                    },
                    observacoes: 'Em negociação, aguardando aprovação de proposta',
                    criadoPor: adminUser._id
                }
            ]);

            console.log(`✅ ${clientes.length} clientes criados`);

            console.log('🔍 Criando tarefas...');

            // Criar tarefas para cada cliente
            const tarefas = [];

            // Tarefas para João Silva
            tarefas.push(
                {
                    clienteId: clientes[0]._id,
                    titulo: 'Reunião de alinhamento mensal',
                    descricao: 'Revisar métricas e discutir próximos passos',
                    status: 'pendente',
                    prioridade: 'alta',
                    dataVencimento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    responsavel: adminUser._id,
                    criadoPor: adminUser._id,
                    tags: ['reunião', 'mensal']
                },
                {
                    clienteId: clientes[0]._id,
                    titulo: 'Enviar relatório trimestral',
                    descricao: 'Compilar dados e enviar relatório Q4',
                    status: 'em_andamento',
                    prioridade: 'media',
                    dataVencimento: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                    responsavel: adminUser._id,
                    criadoPor: adminUser._id,
                    tags: ['relatório']
                },
                {
                    clienteId: clientes[0]._id,
                    titulo: 'Renovação de contrato',
                    descricao: 'Preparar documentação para renovação anual',
                    status: 'concluida',
                    prioridade: 'alta',
                    responsavel: adminUser._id,
                    criadoPor: adminUser._id,
                    tags: ['contrato'],
                    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
                }
            );

            // Tarefas para Maria Santos
            tarefas.push(
                {
                    clienteId: clientes[1]._id,
                    titulo: 'Demo do novo produto',
                    descricao: 'Apresentar funcionalidades premium',
                    status: 'pendente',
                    prioridade: 'alta',
                    dataVencimento: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                    responsavel: adminUser._id,
                    criadoPor: adminUser._id,
                    tags: ['demo', 'vendas']
                },
                {
                    clienteId: clientes[1]._id,
                    titulo: 'Suporte técnico - integração',
                    descricao: 'Auxiliar na integração com sistema legado',
                    status: 'em_andamento',
                    prioridade: 'alta',
                    dataVencimento: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                    responsavel: adminUser._id,
                    criadoPor: adminUser._id,
                    tags: ['suporte', 'integração']
                }
            );

            // Tarefas para Pedro Oliveira
            tarefas.push(
                {
                    clienteId: clientes[2]._id,
                    titulo: 'Follow-up proposta',
                    descricao: 'Verificar interesse em consultoria adicional',
                    status: 'pendente',
                    prioridade: 'media',
                    dataVencimento: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                    responsavel: adminUser._id,
                    criadoPor: adminUser._id,
                    tags: ['follow-up']
                },
                {
                    clienteId: clientes[2]._id,
                    titulo: 'Verificar pagamento',
                    descricao: 'Confirmar recebimento do último pagamento',
                    status: 'concluida',
                    prioridade: 'baixa',
                    responsavel: adminUser._id,
                    criadoPor: adminUser._id,
                    tags: ['financeiro'],
                    completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
                }
            );

            // Tarefas para Ana Costa
            tarefas.push(
                {
                    clienteId: clientes[3]._id,
                    titulo: 'Revisar design do dashboard',
                    descricao: 'Analisar feedback e propor melhorias',
                    status: 'em_andamento',
                    prioridade: 'media',
                    dataVencimento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    responsavel: adminUser._id,
                    criadoPor: adminUser._id,
                    tags: ['design', 'feedback']
                },
                {
                    clienteId: clientes[3]._id,
                    titulo: 'Apresentação de novos recursos',
                    descricao: 'Agendar demo das novas funcionalidades',
                    status: 'pendente',
                    prioridade: 'baixa',
                    dataVencimento: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
                    responsavel: adminUser._id,
                    criadoPor: adminUser._id,
                    tags: ['demo']
                }
            );

            // Tarefas para Carlos Mendes
            tarefas.push(
                {
                    clienteId: clientes[4]._id,
                    titulo: 'Enviar proposta comercial',
                    descricao: 'Preparar e enviar proposta personalizada',
                    status: 'em_andamento',
                    prioridade: 'alta',
                    dataVencimento: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                    responsavel: adminUser._id,
                    criadoPor: adminUser._id,
                    tags: ['proposta', 'vendas']
                },
                {
                    clienteId: clientes[4]._id,
                    titulo: 'Ligação de follow-up',
                    descricao: 'Verificar se recebeu a proposta e esclarecer dúvidas',
                    status: 'pendente',
                    prioridade: 'alta',
                    dataVencimento: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
                    responsavel: adminUser._id,
                    criadoPor: adminUser._id,
                    tags: ['follow-up', 'ligação']
                }
            );

            await Tarefa.insertMany(tarefas);
            console.log(`✅ ${tarefas.length} tarefas criadas`);
        } else {
            console.log(`ℹ️  Banco já possui ${clientesExistentes} clientes - pulando seed de clientes`);
        }

        console.log('✅ Seed concluído com sucesso!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erro ao fazer seed:', error);
        process.exit(1);
    }
};

seedData();
