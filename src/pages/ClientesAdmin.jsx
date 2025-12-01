import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
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

            // Se não houver clientes no backend, carregar do localStorage
            if (!response.data || response.data.length === 0) {
                const clientesLocal = JSON.parse(localStorage.getItem('clientes') || '[]');
                const clientesFiltrados = filtro === 'ativos'
                    ? clientesLocal.filter(c => c.status === 'ativo')
                    : clientesLocal;
                setClientes(clientesFiltrados.map(c => ({ ...c, _id: c.id || c._id })));
            } else {
                setClientes(response.data || []);
            }
        } catch (error) {
            // Fallback para localStorage se API falhar
            const clientesLocal = JSON.parse(localStorage.getItem('clientes') || '[]');
            const clientesFiltrados = filtro === 'ativos'
                ? clientesLocal.filter(c => c.status === 'ativo')
                : clientesLocal;
            setClientes(clientesFiltrados.map(c => ({ ...c, _id: c.id || c._id })));
        } finally {
            setLoading(false);
        }
    };

    const loadTarefasCliente = async (clienteId) => {
        try {
            const response = await tarefasAPI.getByCliente(clienteId);

            // Se não houver tarefas no backend, carregar do localStorage
            if (!response.data || response.data.length === 0) {
                const tarefasLocal = JSON.parse(localStorage.getItem('tarefas') || '[]');
                const tarefasCliente = tarefasLocal.filter(t => t.clienteId === clienteId || t.clienteId === clienteId.toString());
                setTarefas(tarefasCliente.map(t => ({ ...t, _id: t.id || t._id })));
            } else {
                setTarefas(response.data || []);
            }
        } catch (error) {
            // Fallback para localStorage
            const tarefasLocal = JSON.parse(localStorage.getItem('tarefas') || '[]');
            const tarefasCliente = tarefasLocal.filter(t => t.clienteId === clienteId || t.clienteId === clienteId.toString());
            setTarefas(tarefasCliente.map(t => ({ ...t, _id: t.id || t._id })));
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

    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const { source, destination } = result;
        if (source.droppableId === destination.droppableId) return;

        const tarefaId = result.draggableId;
        const novoStatus = destination.droppableId;

        try {
            await tarefasAPI.updateStatus(tarefaId, novoStatus);
            loadTarefasCliente(clienteSelecionado._id);
        } catch (error) {
            alert('Erro ao atualizar status da tarefa');
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

                            <DragDropContext onDragEnd={handleDragEnd}>
                                <div className="kanban-board">
                                    {['pendente', 'em_andamento', 'concluida'].map(status => (
                                        <Droppable key={status} droppableId={status}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.droppableProps}
                                                    className={`kanban-column ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                                                >
                                                    <div className="kanban-column-header">
                                                        <span className="column-icon">{getStatusIcon(status)}</span>
                                                        <h3>{status === 'pendente' ? 'A Fazer' : status === 'em_andamento' ? 'Em Andamento' : 'Concluída'}</h3>
                                                        <span className="column-count">
                                                            {tarefas.filter(t => t.status === status).length}
                                                        </span>
                                                    </div>
                                                    <div className="kanban-column-content">
                                                        {tarefas.filter(t => t.status === status).map((tarefa, index) => (
                                                            <Draggable key={tarefa._id} draggableId={tarefa._id} index={index}>
                                                                {(provided, snapshot) => (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        className={`tarefa-card ${snapshot.isDragging ? 'dragging' : ''}`}
                                                                    >
                                                                        <div className="tarefa-header">
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
                                                                        </div>
                                                                        <div className="tarefa-actions">
                                                                            <button
                                                                                className="btn-deletar-small"
                                                                                onClick={() => handleDeletarTarefa(tarefa._id)}
                                                                            >
                                                                                🗑️
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                        {tarefas.filter(t => t.status === status).length === 0 && (
                                                            <p className="empty-column">Nenhuma tarefa</p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </Droppable>
                                    ))}
                                </div>
                            </DragDropContext>
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
