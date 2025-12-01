import { useState, useEffect } from 'react';
import { clientesAPI, tarefasAPI } from '../services/api';
import './ClientesAdmin.css';

const ClientesAdmin = () => {
    const [clientes, setClientes] = useState([]);
    const [tarefas, setTarefas] = useState([]);
    const [clienteSelecionado, setClienteSelecionado] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState('todos');
    const [busca, setBusca] = useState('');
    const [showNovaTarefa, setShowNovaTarefa] = useState(false);
    const [novaTarefa, setNovaTarefa] = useState({
        titulo: '',
        descricao: '',
        prioridade: 'media',
        dataVencimento: '',
        status: 'pendente'
    });

    useEffect(() => {
        loadClientes();
    }, [filtro]);

    useEffect(() => {
        if (clienteSelecionado) {
            loadTarefasCliente(clienteSelecionado._id);
        }
    }, [clienteSelecionado]);

    const loadClientes = async () => {
        try {
            setLoading(true);
            const filters = filtro === 'ativos' ? { status: 'ativo' } : {};
            if (busca) filters.search = busca;

            const response = await clientesAPI.getAll(filters);
            setClientes(response.data || []);
        } catch (error) {
            
        } finally {
            setLoading(false);
        }
    };

    const loadTarefasCliente = async (clienteId) => {
        try {
            const response = await tarefasAPI.getByCliente(clienteId);
            setTarefas(response.data || []);
        } catch (error) {
            
        }
    };

    const handleCriarTarefa = async (e) => {
        e.preventDefault();
        if (!clienteSelecionado) return;

        try {
            await tarefasAPI.create({
                ...novaTarefa,
                clienteId: clienteSelecionado._id
            });

            setNovaTarefa({
                titulo: '',
                descricao: '',
                prioridade: 'media',
                dataVencimento: '',
                status: 'pendente'
            });
            setShowNovaTarefa(false);
            loadTarefasCliente(clienteSelecionado._id);
        } catch (error) {
            
            alert('Erro ao criar tarefa');
        }
    };

    const handleAtualizarStatusTarefa = async (tarefaId, novoStatus) => {
        try {
            await tarefasAPI.updateStatus(tarefaId, novoStatus);
            loadTarefasCliente(clienteSelecionado._id);
        } catch (error) {
            
        }
    };

    const handleDeletarTarefa = async (tarefaId) => {
        if (!confirm('Deseja realmente deletar esta tarefa?')) return;

        try {
            await tarefasAPI.delete(tarefaId);
            loadTarefasCliente(clienteSelecionado._id);
        } catch (error) {
            
        }
    };

    const getPrioridadeColor = (prioridade) => {
        const colors = {
            baixa: '#10b981',
            media: '#f59e0b',
            alta: '#ef4444'
        };
        return colors[prioridade] || '#6b7280';
    };

    const getStatusIcon = (status) => {
        const icons = {
            pendente: '⏳',
            em_andamento: '🔄',
            concluida: '✅',
            cancelada: '❌'
        };
        return icons[status] || '📋';
    };

    if (loading) {
        return (
            <div className="clientes-admin-loading">
                <div className="spinner"></div>
                <p>Carregando clientes...</p>
            </div>
        );
    }

    return (
        <div className="clientes-admin">
            <div className="admin-header">
                <h1>Administração de Clientes</h1>
                <p>Gerencie seus clientes ativos e suas tarefas</p>
            </div>

            <div className="admin-filters">
                <div className="filter-buttons">
                    <button
                        className={filtro === 'todos' ? 'active' : ''}
                        onClick={() => setFiltro('todos')}
                    >
                        Todos
                    </button>
                    <button
                        className={filtro === 'ativos' ? 'active' : ''}
                        onClick={() => setFiltro('ativos')}
                    >
                        Ativos
                    </button>
                </div>
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Buscar cliente..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && loadClientes()}
                    />
                    <button onClick={loadClientes}>🔍</button>
                </div>
            </div>

            <div className="admin-content">
                {/* Lista de Clientes */}
                <div className="clientes-list">
                    <h2>Clientes ({clientes.length})</h2>
                    {clientes.length > 0 ? (
                        clientes.map(cliente => (
                            <div
                                key={cliente._id}
                                className={`cliente-card ${clienteSelecionado?._id === cliente._id ? 'selected' : ''}`}
                                onClick={() => setClienteSelecionado(cliente)}
                            >
                                <div className="cliente-info">
                                    <div className="cliente-nome">{cliente.nome}</div>
                                    <div className="cliente-empresa">{cliente.empresa || cliente.email}</div>
                                    <div className="cliente-meta">
                                        <span className={`status-badge status-${cliente.status}`}>
                                            {cliente.status}
                                        </span>
                                        <span className="cliente-tipo">{cliente.tipo}</span>
                                    </div>
                                </div>
                                <div className="cliente-arrow">→</div>
                            </div>
                        ))
                    ) : (
                        <p className="empty-state">Nenhum cliente encontrado</p>
                    )}
                </div>

                {/* Tarefas do Cliente Selecionado */}
                <div className="tarefas-panel">
                    {clienteSelecionado ? (
                        <>
                            <div className="panel-header">
                                <div>
                                    <h2>{clienteSelecionado.nome}</h2>
                                    <p>{clienteSelecionado.email} • {clienteSelecionado.telefone}</p>
                                </div>
                                <button
                                    className="btn-nova-tarefa"
                                    onClick={() => setShowNovaTarefa(!showNovaTarefa)}
                                >
                                    + Nova Tarefa
                                </button>
                            </div>

                            {showNovaTarefa && (
                                <form className="nova-tarefa-form" onSubmit={handleCriarTarefa}>
                                    <input
                                        type="text"
                                        placeholder="Título da tarefa"
                                        value={novaTarefa.titulo}
                                        onChange={(e) => setNovaTarefa({ ...novaTarefa, titulo: e.target.value })}
                                        required
                                    />
                                    <textarea
                                        placeholder="Descrição"
                                        value={novaTarefa.descricao}
                                        onChange={(e) => setNovaTarefa({ ...novaTarefa, descricao: e.target.value })}
                                        rows="3"
                                    />
                                    <div className="form-row">
                                        <select
                                            value={novaTarefa.prioridade}
                                            onChange={(e) => setNovaTarefa({ ...novaTarefa, prioridade: e.target.value })}
                                        >
                                            <option value="baixa">Baixa</option>
                                            <option value="media">Média</option>
                                            <option value="alta">Alta</option>
                                        </select>
                                        <input
                                            type="date"
                                            value={novaTarefa.dataVencimento}
                                            onChange={(e) => setNovaTarefa({ ...novaTarefa, dataVencimento: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-actions">
                                        <button type="submit" className="btn-salvar">Criar Tarefa</button>
                                        <button type="button" className="btn-cancelar" onClick={() => setShowNovaTarefa(false)}>
                                            Cancelar
                                        </button>
                                    </div>
                                </form>
                            )}

                            <div className="tarefas-list">
                                {tarefas.length > 0 ? (
                                    tarefas.map(tarefa => (
                                        <div key={tarefa._id} className="tarefa-card">
                                            <div className="tarefa-header">
                                                <div className="tarefa-status-icon">
                                                    {getStatusIcon(tarefa.status)}
                                                </div>
                                                <div className="tarefa-info">
                                                    <div className="tarefa-titulo">{tarefa.titulo}</div>
                                                    <div className="tarefa-descricao">{tarefa.descricao}</div>
                                                </div>
                                                <div
                                                    className="tarefa-prioridade"
                                                    style={{ backgroundColor: getPrioridadeColor(tarefa.prioridade) }}
                                                >
                                                    {tarefa.prioridade}
                                                </div>
                                            </div>
                                            <div className="tarefa-meta">
                                                {tarefa.dataVencimento && (
                                                    <span className="tarefa-data">
                                                        📅 {new Date(tarefa.dataVencimento).toLocaleDateString('pt-BR')}
                                                    </span>
                                                )}
                                                {tarefa.responsavel && (
                                                    <span className="tarefa-responsavel">
                                                        👤 {tarefa.responsavel.nome}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="tarefa-actions">
                                                {tarefa.status !== 'concluida' && (
                                                    <button
                                                        className="btn-concluir"
                                                        onClick={() => handleAtualizarStatusTarefa(tarefa._id, 'concluida')}
                                                    >
                                                        ✓ Concluir
                                                    </button>
                                                )}
                                                {tarefa.status === 'pendente' && (
                                                    <button
                                                        className="btn-iniciar"
                                                        onClick={() => handleAtualizarStatusTarefa(tarefa._id, 'em_andamento')}
                                                    >
                                                        ▶ Iniciar
                                                    </button>
                                                )}
                                                <button
                                                    className="btn-deletar"
                                                    onClick={() => handleDeletarTarefa(tarefa._id)}
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="empty-state">Nenhuma tarefa para este cliente</p>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="empty-selection">
                            <div className="empty-icon">👈</div>
                            <p>Selecione um cliente para ver suas tarefas</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientesAdmin;
