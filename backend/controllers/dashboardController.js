import Lead from '../models/Lead.js';
import Cliente from '../models/Cliente.js';
import Tarefa from '../models/Tarefa.js';
import Proposta from '../models/Proposta.js';

// @desc    Obter estatísticas do dashboard
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = async (req, res, next) => {
    try {
        // Contar totais
        const totalLeads = await Lead.countDocuments();
        const totalClientes = await Cliente.countDocuments();
        const totalTarefas = await Tarefa.countDocuments();
        const totalPropostas = await Proposta.countDocuments();

        // Leads por status
        const leadsNovos = await Lead.countDocuments({ status: 'novo' });
        const leadsQualificados = await Lead.countDocuments({ status: 'qualificado' });
        const leadsConvertidos = await Lead.countDocuments({ status: 'ganho' });

        // Clientes ativos
        const clientesAtivos = await Cliente.countDocuments({ status: 'ativo' });

        // Tarefas pendentes
        const tarefasPendentes = await Tarefa.countDocuments({
            status: { $in: ['pendente', 'em_andamento'] }
        });

        // Taxa de conversão (leads ganhos / total de leads)
        const taxaConversao = totalLeads > 0
            ? ((leadsConvertidos / totalLeads) * 100).toFixed(2)
            : 0;

        // Leads dos últimos 30 dias
        const dataLimite = new Date();
        dataLimite.setDate(dataLimite.getDate() - 30);
        const leadsRecentes = await Lead.countDocuments({
            createdAt: { $gte: dataLimite }
        });

        res.status(200).json({
            success: true,
            data: {
                totais: {
                    leads: totalLeads,
                    clientes: totalClientes,
                    tarefas: totalTarefas,
                    propostas: totalPropostas
                },
                leads: {
                    novos: leadsNovos,
                    qualificados: leadsQualificados,
                    convertidos: leadsConvertidos,
                    ultimos30Dias: leadsRecentes
                },
                clientes: {
                    ativos: clientesAtivos
                },
                tarefas: {
                    pendentes: tarefasPendentes
                },
                metricas: {
                    taxaConversao: parseFloat(taxaConversao)
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Obter leads recentes
// @route   GET /api/dashboard/leads-recentes
// @access  Private
export const getLeadsRecentes = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        const leads = await Lead.find()
            .sort('-createdAt')
            .limit(limit)
            .populate('responsavel', 'nome email')
            .populate('criadoPor', 'nome email');

        res.status(200).json({
            success: true,
            count: leads.length,
            data: leads
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Obter atividades recentes
// @route   GET /api/dashboard/atividades
// @access  Private
export const getAtividadesRecentes = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 20;

        // Buscar tarefas recentes
        const tarefas = await Tarefa.find()
            .sort('-updatedAt')
            .limit(limit)
            .populate('clienteId', 'nome')
            .populate('responsavel', 'nome')
            .select('titulo status prioridade updatedAt clienteId responsavel');

        // Formatar atividades
        const atividades = tarefas.map(tarefa => ({
            tipo: 'tarefa',
            id: tarefa._id,
            titulo: tarefa.titulo,
            descricao: `Tarefa ${tarefa.status} - ${tarefa.clienteId?.nome || 'Cliente'}`,
            status: tarefa.status,
            prioridade: tarefa.prioridade,
            responsavel: tarefa.responsavel?.nome,
            data: tarefa.updatedAt
        }));

        res.status(200).json({
            success: true,
            count: atividades.length,
            data: atividades
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Obter dados de conversão
// @route   GET /api/dashboard/conversoes
// @access  Private
export const getConversoes = async (req, res, next) => {
    try {
        // Últimos 6 meses
        const meses = [];
        const hoje = new Date();

        for (let i = 5; i >= 0; i--) {
            const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
            const proximoMes = new Date(hoje.getFullYear(), hoje.getMonth() - i + 1, 1);

            const totalLeads = await Lead.countDocuments({
                createdAt: { $gte: data, $lt: proximoMes }
            });

            const leadsConvertidos = await Lead.countDocuments({
                createdAt: { $gte: data, $lt: proximoMes },
                status: 'ganho'
            });

            const taxa = totalLeads > 0
                ? ((leadsConvertidos / totalLeads) * 100).toFixed(2)
                : 0;

            meses.push({
                mes: data.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
                totalLeads,
                convertidos: leadsConvertidos,
                taxa: parseFloat(taxa)
            });
        }

        res.status(200).json({
            success: true,
            data: meses
        });
    } catch (error) {
        next(error);
    }
};
