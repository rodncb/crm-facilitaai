import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  FaSearch,
  FaTable,
  FaColumns,
  FaEdit,
  FaTrash,
  FaEnvelope,
  FaPhone,
  FaTimes,
} from "react-icons/fa";
import "./Leads.css";

const Leads = () => {
  const [viewMode, setViewMode] = useState("table");
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [leads, setLeads] = useState([
    {
      id: 1,
      nome: "Marco Fernandes",
      empresa: "Iron House",
      cargo: "Diretor",
      email: "marco@ironhouse.com.br",
      telefone: "(21) 98765-4321",
      status: "qualificado",
      origem: "Site",
      dataCriacao: "19/03/2025",
      proximoFollowup: "2025-03-27",
    },
    {
      id: 2,
      nome: "Leandro Marques",
      empresa: "Anahata Home",
      cargo: "Diretor",
      email: "contato@anahatahome.com.br",
      telefone: "+55 24 99943-0028",
      status: "contatado",
      origem: "Indicação",
      dataCriacao: "19/03/2025",
      proximoFollowup: "2025-03-28",
    },
    {
      id: 3,
      nome: "João Silva",
      empresa: "TechCorp",
      cargo: "Gerente de TI",
      email: "joao@techcorp.com",
      telefone: "(11) 98765-4321",
      status: "novo",
      origem: "LinkedIn",
      dataCriacao: "19/03/2025",
      proximoFollowup: "2025-03-31",
    },
    {
      id: 4,
      nome: "Maria Santos",
      empresa: "Inovação Ltda",
      cargo: "CEO",
      email: "maria@inovacao.com",
      telefone: "(11) 91234-5678",
      status: "novo",
      origem: "Site",
      dataCriacao: "19/03/2025",
      proximoFollowup: "2025-04-24",
    },
  ]);

  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Carregar leads do localStorage ao iniciar
  useEffect(() => {
    const leadsSalvos = localStorage.getItem("leads");
    if (leadsSalvos) {
      try {
        setLeads(JSON.parse(leadsSalvos));
      } catch (error) {
        console.error("Erro ao carregar leads do localStorage:", error);
      }
    }
  }, []);

  // Salvar leads no localStorage sempre que a lista mudar
  useEffect(() => {
    if (leads.length > 0) {
      try {
        localStorage.setItem("leads", JSON.stringify(leads));

        // Verificar imediatamente se os dados foram salvos corretamente
        const verificarLeadsSalvos = localStorage.getItem("leads");
        if (verificarLeadsSalvos) {
          // dados verificados com sucesso
        }
      } catch (error) {
        console.error("Erro ao salvar leads no localStorage:", error);
      }
    }
  }, [leads]);

  const formatarData = (data) => {
    if (!data) return "";
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const handleEditLead = (lead) => {
    setEditingLead(lead);
    setShowForm(true);
  };

  const handleDeleteLead = (leadId) => {
    if (window.confirm("Tem certeza que deseja excluir este lead?")) {
      const leadsAtualizados = leads.filter((lead) => lead.id !== leadId);
      setLeads(leadsAtualizados);
    }
  };

  const handleSaveLead = (e) => {
    e.preventDefault();

    // Obter os valores diretamente dos inputs (método alternativo à FormData)
    const nome = e.target.elements.nome?.value || "";
    const empresa = e.target.elements.empresa?.value || "";
    const cargo = e.target.elements.cargo?.value || "";
    const email = e.target.elements.email?.value || "";
    const telefone = e.target.elements.telefone?.value || "";
    const status = e.target.elements.status?.value || "novo"; // Default para novo
    const origem = e.target.elements.origem?.value || "";
    const proximoFollowup = e.target.elements.proximoFollowup?.value || "";

    // Criar o objeto lead
    const newLead = {
      nome,
      empresa,
      cargo,
      email,
      telefone,
      status,
      origem,
      dataCriacao: new Date().toLocaleDateString(),
      proximoFollowup,
    };

    // Verificar se os campos obrigatórios estão preenchidos
    if (!nome || !empresa || !email) {
      alert("Por favor, preencha pelo menos o nome, empresa e email do lead.");
      return;
    }

    let leadsAtualizados;
    // Adicionar ou atualizar o lead
    if (editingLead) {
      // Atualização
      leadsAtualizados = leads.map((lead) =>
        lead.id === editingLead.id ? { ...newLead, id: lead.id } : lead
      );
    } else {
      // Novo lead
      const id = Date.now();
      leadsAtualizados = [...leads, { ...newLead, id }];
    }

    setLeads(leadsAtualizados);
    setShowForm(false);
    setEditingLead(null);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { destination } = result;
    const leadId = parseInt(result.draggableId);
    const lead = leads.find((l) => l.id === leadId);

    if (lead) {
      const updatedLead = { ...lead, status: destination.droppableId };
      const leadsAtualizados = leads.map((l) =>
        l.id === leadId ? updatedLead : l
      );
      setLeads(leadsAtualizados);
    }
  };

  const kanbanColumns = [
    { id: "novo", title: "Novo" },
    { id: "contatado", title: "Contatado" },
    { id: "qualificado", title: "Qualificado" },
    { id: "espera", title: "Em Espera (90 dias)" },
  ];

  const filteredLeads = leads.filter((lead) => {
    if (searchTerm.trim() === "") return true;

    const searchTermLower = searchTerm.toLowerCase();
    return (
      (lead.nome && lead.nome.toLowerCase().includes(searchTermLower)) ||
      (lead.empresa && lead.empresa.toLowerCase().includes(searchTermLower)) ||
      (lead.email && lead.email.toLowerCase().includes(searchTermLower))
    );
  });

  return (
    <div className="leads-container">
      <div className="leads-header">
        <h1>Leads</h1>
        <button className="btn-novo-lead" onClick={() => setShowForm(true)}>
          <span>+</span>
          Novo Lead
        </button>
      </div>

      <div className="leads-actions">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar leads..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="view-toggle">
          <button
            className={`view-button ${viewMode === "table" ? "active" : ""}`}
            onClick={() => setViewMode("table")}
          >
            <FaTable />
            <span>Tabela</span>
          </button>
          <button
            className={`view-button ${viewMode === "kanban" ? "active" : ""}`}
            onClick={() => setViewMode("kanban")}
          >
            <FaColumns />
            <span>Kanban</span>
          </button>
        </div>
      </div>

      {viewMode === "table" ? (
        <div className="leads-table">
          <div className="leads-table-container">
            <div className="table-header">
              <div>Nome</div>
              <div>Contato</div>
              <div>Status</div>
              <div>Origem</div>
              <div>Data Criação</div>
              <div>Ações</div>
              <div>Próximo Followup</div>
            </div>
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="table-row">
                <div className="nome-column">
                  <span className="lead-name">{lead.nome}</span>
                  <span className="lead-company">{lead.empresa}</span>
                </div>
                <div className="contato-column">
                  <div className="contato-email">
                    <FaEnvelope className="icon" />
                    <span>{lead.email}</span>
                  </div>
                  <div className="contato-telefone">
                    <FaPhone className="icon" />
                    <span>{lead.telefone}</span>
                  </div>
                  {lead.cargo && <div className="lead-cargo">{lead.cargo}</div>}
                </div>
                <div className="status-cell">
                  <span className={`status-badge ${lead.status}`}>
                    {lead.status === "espera" ? "Em Espera" : lead.status}
                  </span>
                </div>
                <div>{lead.origem}</div>
                <div>{lead.dataCriacao}</div>
                <div className="actions">
                  <button
                    className="btn-edit"
                    onClick={() => handleEditLead(lead)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteLead(lead.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
                <div>{formatarData(lead.proximoFollowup)}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="kanban-board">
            {kanbanColumns.map((column) => (
              <Droppable key={column.id} droppableId={column.id}>
                {(provided) => (
                  <div
                    className="kanban-column"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <h3>{column.title}</h3>
                    {(column.id === "espera" ? leads : filteredLeads)
                      .filter((lead) => lead.status === column.id)
                      .map((lead, index) => (
                        <Draggable
                          key={lead.id}
                          draggableId={lead.id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              className="kanban-card"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <div className="card-header">
                                <h4>{lead.nome}</h4>
                                <button
                                  className="btn-card-delete"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteLead(lead.id);
                                  }}
                                >
                                  <FaTrash />
                                </button>
                              </div>
                              <div className="card-company">{lead.empresa}</div>
                              {lead.cargo && (
                                <div className="card-cargo">{lead.cargo}</div>
                              )}
                              <div className="card-contact">
                                <div className="contato-email">
                                  <FaEnvelope className="icon" />
                                  <span>{lead.email}</span>
                                </div>
                                <div className="contato-telefone">
                                  <FaPhone className="icon" />
                                  <span>{lead.telefone}</span>
                                </div>
                              </div>
                              <div className="card-footer">
                                <div className="card-date">
                                  Próximo: {formatarData(lead.proximoFollowup)}
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      )}

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingLead ? "Editar Lead" : "Novo Lead"}</h2>
              <button
                className="close-button"
                onClick={() => {
                  setShowForm(false);
                  setEditingLead(null);
                }}
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSaveLead}>
              <div className="form-group">
                <label htmlFor="nome">Nome</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  defaultValue={editingLead?.nome || ""}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="empresa">Empresa</label>
                <input
                  type="text"
                  id="empresa"
                  name="empresa"
                  defaultValue={editingLead?.empresa || ""}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="cargo">Cargo</label>
                <input
                  type="text"
                  id="cargo"
                  name="cargo"
                  defaultValue={editingLead?.cargo || ""}
                  placeholder="Ex: Diretor, Gerente, CEO, etc."
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  defaultValue={editingLead?.email || ""}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="telefone">Telefone</label>
                <input
                  type="tel"
                  id="telefone"
                  name="telefone"
                  defaultValue={editingLead?.telefone || ""}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  defaultValue={editingLead?.status || "novo"}
                >
                  <option value="novo">Novo</option>
                  <option value="contatado">Contatado</option>
                  <option value="qualificado">Qualificado</option>
                  <option value="espera">Em Espera (90 dias)</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="origem">Origem</label>
                <select
                  id="origem"
                  name="origem"
                  defaultValue={editingLead?.origem || ""}
                >
                  <option value="Site">Site</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Indicação">Indicação</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="proximoFollowup">Próximo Followup</label>
                <input
                  type="date"
                  id="proximoFollowup"
                  name="proximoFollowup"
                  defaultValue={editingLead?.proximoFollowup || ""}
                  required
                />
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() => {
                    setShowForm(false);
                    setEditingLead(null);
                  }}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-salvar">
                  {editingLead ? "Atualizar" : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
