import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../services/api';
import MetricCard from '../components/MetricCard';
import './DashboardHome.css';

const DashboardHome = () => {
    const [stats, setStats] = useState(null);
    const [leadsRecentes, setLeadsRecentes] = useState([]);
    const [atividades, setAtividades] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const [statsData, leadsData, atividadesData] = await Promise.all([
                dashboardAPI.getStats(),
                dashboardAPI.getLeadsRecentes(5),
                dashboardAPI.getAtividades(10)
            ]);

            setStats(statsData.data);
            setLeadsRecentes(leadsData.data);
            setAtividades(atividadesData.data);
        } catch (error) {
            // Erro ao carregar dashboard
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner"></div>
                <p>Carregando dashboard...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-home">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <p>Visão geral do seu CRM</p>
            </div>

            {/* Métricas Principais */}
            <div className="metrics-grid">
                <MetricCard
                    icon="📊"
                    title="Total de Leads"
                    value={stats?.totais.leads || 0}
                    change={`+${stats?.leads.ultimos30Dias || 0} este mês`}
                    changeType="positive"
                />
                <MetricCard
                    icon="👥"
                    title="Clientes Ativos"
                    value={stats?.clientes.ativos || 0}
                    change={`${stats?.totais.clientes || 0} total`}
                    changeType="neutral"
                />
                <MetricCard
                    icon="✅"
                    title="Tarefas Pendentes"
                    value={stats?.tarefas.pendentes || 0}
                    change={`${stats?.totais.tarefas || 0} total`}
                    changeType="neutral"
                />
                <MetricCard
                    icon="💰"
                    title="Taxa de Conversão"
                    value={`${stats?.metricas.taxaConversao || 0}%`}
                    change={`${stats?.leads.convertidos || 0} convertidos`}
                    changeType="positive"
                />
            </div>

            {/* Leads Recentes e Atividades */}
            <div className="dashboard-content">
                {/* Leads Recentes */}
                <div className="dashboard-section">
                    <div className="section-header">
                        <h2>Leads Recentes</h2>
                        <Link to="/leads" className="view-all">Ver todos →</Link>
                    </div>
                    <div className="leads-list">
                        {leadsRecentes.length > 0 ? (
                            leadsRecentes.map(lead => (
                                <div key={lead._id} className="lead-item">
                                    <div className="lead-info">
                                        <div className="lead-name">{lead.nome}</div>
                                        <div className="lead-details">
                                            {lead.email} • {lead.telefone}
                                        </div>
                                        <div className="lead-meta">
                                            <span className={`status-badge status-${lead.status}`}>
                                                {lead.status}
                                            </span>
                                            <span className="lead-origem">
                                                {lead.origem}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="lead-date">
                                        {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="empty-state">Nenhum lead recente</p>
                        )}
                    </div>
                </div>

                {/* Atividades Recentes */}
                <div className="dashboard-section">
                    <div className="section-header">
                        <h2>Atividades Recentes</h2>
                    </div>
                    <div className="atividades-list">
                        {atividades.length > 0 ? (
                            atividades.map((atividade, index) => (
                                <div key={index} className="atividade-item">
                                    <div className={`atividade-icon prioridade-${atividade.prioridade}`}>
                                        {atividade.tipo === 'tarefa' ? '📋' : '📌'}
                                    </div>
                                    <div className="atividade-info">
                                        <div className="atividade-titulo">{atividade.titulo}</div>
                                        <div className="atividade-descricao">{atividade.descricao}</div>
                                        <div className="atividade-meta">
                                            {atividade.responsavel && (
                                                <span className="responsavel">👤 {atividade.responsavel}</span>
                                            )}
                                            <span className="atividade-data">
                                                {new Date(atividade.data).toLocaleDateString('pt-BR')}
                                            </span>
                                        </div>
                                    </div>
                                    <span className={`status-badge status-${atividade.status}`}>
                                        {atividade.status}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="empty-state">Nenhuma atividade recente</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
