import React, { useState, useEffect } from "react";
import "./Clientes.css";
import { FaSearch, FaEdit, FaTrash, FaTimes, FaUserPlus } from "react-icons/fa";

const Clientes = () => {
  const [showForm, setShowForm] = useState(false);
  const [showLeadSelector, setShowLeadSelector] = useState(false);
  const [editingCliente, setEditingCliente] = useState(null);
  const [tipoCliente, setTipoCliente] = useState("empresa");
  const [clientes, setClientes] = useState([]);

  // Carregar clientes do localStorage ao iniciar
  useEffect(() => {
    const clientesSalvos = localStorage.getItem("clientes");
    if (clientesSalvos) {
      try {
        const clientesData = JSON.parse(clientesSalvos);
        if (
          clientesData &&
          Array.isArray(clientesData) &&
          clientesData.length > 0
        ) {
          setClientes(clientesData);
        } else {
          carregarClientesPadrao();
        }
      } catch (error) {
        console.error("Erro ao carregar clientes do localStorage:", error);
        carregarClientesPadrao();
      }
    } else {
      carregarClientesPadrao();
    }
  }, []);

  // Salvar clientes no localStorage sempre que a lista mudar
  useEffect(() => {
    if (clientes.length > 0) {
      try {
        localStorage.setItem("clientes", JSON.stringify(clientes));
      } catch (error) {
        console.error("Erro ao salvar clientes no localStorage:", error);
      }
    }
  }, [clientes]);

  // Função para carregar dados padrão de clientes
  const carregarClientesPadrao = () => {
    setClientes([
      {
        id: 1,
        nome: "João Silva",
        empresa: "TechCorp",
        email: "joao@techcorp.com",
        telefone: "(11) 98765-4321",
        status: "ativo",
        tipo: "empresa",
        documento: "12.345.678/0001-90",
      },
      {
        id: 2,
        nome: "Maria Santos",
        empresa: "Inovação Ltda",
        email: "maria@inovacao.com",
        telefone: "(11) 91234-5678",
        status: "inativo",
        tipo: "empresa",
        documento: "98.765.432/0001-10",
      },
      {
        id: 3,
        nome: "Pedro Oliveira",
        tipo: "pessoa_fisica",
        documento: "123.456.789-00",
        empresa: "",
        email: "pedro@gmail.com",
        telefone: "(21) 98888-7777",
        status: "ativo",
      },
    ]);
  };

  // Carregar leads do localStorage
  const [leadsDisponiveis, setLeadsDisponiveis] = useState([]);

  useEffect(() => {
    const leadsSalvos = localStorage.getItem("leads");
    if (leadsSalvos) {
      try {
        const leadsData = JSON.parse(leadsSalvos);
        if (leadsData && Array.isArray(leadsData) && leadsData.length > 0) {
          setLeadsDisponiveis(leadsData);
        } else {
          carregarLeadsPadrao();
        }
      } catch (error) {
        console.error("Erro ao carregar leads do localStorage:", error);
        carregarLeadsPadrao();
      }
    } else {
      carregarLeadsPadrao();
    }
  }, []);

  // Função para carregar dados padrão de leads
  const carregarLeadsPadrao = () => {
    setLeadsDisponiveis([
      {
        id: 1,
        nome: "Leandro Marques",
        empresa: "Anahata Home",
        cargo: "Diretor",
        email: "contato@anahatahome.com.br",
        telefone: "+55 24 99943-0028",
        status: "contatado",
        origem: "Indicação",
      },
      {
        id: 2,
        nome: "Carlos Mendes",
        empresa: "Startup XYZ",
        cargo: "CEO",
        email: "carlos@startupxyz.com",
        telefone: "(11) 97654-3210",
        status: "qualificado",
        origem: "LinkedIn",
      },
      {
        id: 3,
        nome: "Ana Paula Costa",
        empresa: "Digital Solutions",
        cargo: "Gerente de Marketing",
        email: "ana@digitalsolutions.com",
        telefone: "(21) 95555-7777",
        status: "novo",
        origem: "Site",
      },
    ]);
  };

  const handleEditCliente = (cliente) => {
    setEditingCliente(cliente);
    setTipoCliente(cliente.tipo || "empresa");
    setShowForm(true);
  };

  const handleDeleteCliente = (clienteId) => {
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      // Remover o cliente do estado
      const clientesAtualizados = clientes.filter(
        (cliente) => cliente.id !== clienteId
      );
      setClientes(clientesAtualizados);
      // O useEffect cuidará de atualizar o localStorage
    }
  };

  const handleSaveCliente = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const novoCliente = {
      nome: formData.get("nome"),
      tipo: formData.get("tipo"),
      documento: formData.get("documento"),
      empresa:
        formData.get("tipo") === "empresa" ? formData.get("empresa") : "",
      email: formData.get("email"),
      telefone: formData.get("telefone"),
      status: formData.get("status"),
      cargo: formData.get("cargo") || "",
    };

    let clientesAtualizados;
    if (editingCliente) {
      clientesAtualizados = clientes.map((cliente) =>
        cliente.id === editingCliente.id
          ? { ...novoCliente, id: cliente.id }
          : cliente
      );
    } else {
      clientesAtualizados = [...clientes, { ...novoCliente, id: Date.now() }];
    }

    setClientes(clientesAtualizados);
    setShowForm(false);
    setEditingCliente(null);
  };

  const handleSelectLead = (lead) => {
    // Preencher o formulário com os dados do lead selecionado
    setEditingCliente({
      id: null,
      nome: lead.nome,
      empresa: lead.empresa,
      email: lead.email,
      telefone: lead.telefone,
      cargo: lead.cargo || "",
      tipo: "empresa", // Por padrão, leads são considerados empresas
      documento: "",
      status: "ativo", // Por padrão, novos clientes vindos de leads são ativos
    });
    setTipoCliente("empresa");
    setShowLeadSelector(false);
    setShowForm(true);
  };

  const handleTipoClienteChange = (e) => {
    setTipoCliente(e.target.value);
  };

  return (
    <div className="clientes-container">
      <div className="clientes-header">
        <h1>Clientes</h1>
        <button
          className="btn-novo-cliente btn-primary"
          onClick={() => setShowForm(true)}
        >
          <span>+</span>
          Novo Cliente
        </button>
      </div>

      <div className="clientes-actions">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar clientes..."
            className="search-input"
          />
        </div>
      </div>

      <div className="clientes-table card-shadow">
        <div className="table-header">
          <div>Nome</div>
          <div>Tipo</div>
          <div>Documento</div>
          <div>Email</div>
          <div>Telefone</div>
          <div>Status</div>
          <div>Ações</div>
        </div>

        {clientes.map((cliente) => (
          <div key={cliente.id} className="table-row hover-effect">
            <div className="nome-column">
              <span className="cliente-name">{cliente.nome}</span>
              {cliente.tipo === "empresa" && cliente.empresa && (
                <span className="cliente-empresa">{cliente.empresa}</span>
              )}
              {cliente.cargo && (
                <span className="cliente-cargo">{cliente.cargo}</span>
              )}
            </div>
            <div>
              {cliente.tipo === "empresa" ? "Empresa" : "Pessoa Física"}
            </div>
            <div>{cliente.documento}</div>
            <div className="contato-email">{cliente.email}</div>
            <div className="contato-telefone">{cliente.telefone}</div>
            <div>
              <span className={`status-badge ${cliente.status}`}>
                {cliente.status === "ativo" ? "Ativo" : "Inativo"}
              </span>
            </div>
            <div className="actions">
              <button
                className="btn-edit"
                onClick={() => handleEditCliente(cliente)}
              >
                <FaEdit />
              </button>
              <button
                className="btn-delete"
                onClick={() => handleDeleteCliente(cliente.id)}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingCliente ? "Editar Cliente" : "Novo Cliente"}</h2>
              <div className="modal-header-actions">
                {!editingCliente?.id && (
                  <button
                    className="btn-converter-lead"
                    onClick={() => {
                      setShowLeadSelector(true);
                      setShowForm(false);
                    }}
                  >
                    <FaUserPlus /> Converter Lead
                  </button>
                )}
                <button
                  className="close-button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingCliente(null);
                  }}
                >
                  <FaTimes />
                </button>
              </div>
            </div>
            <form onSubmit={handleSaveCliente}>
              <div className="form-group">
                <label>Tipo de Cliente</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="tipo"
                      value="empresa"
                      checked={tipoCliente === "empresa"}
                      onChange={handleTipoClienteChange}
                    />
                    Empresa
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="tipo"
                      value="pessoa_fisica"
                      checked={tipoCliente === "pessoa_fisica"}
                      onChange={handleTipoClienteChange}
                    />
                    Pessoa Física
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="nome">
                  Nome{" "}
                  {tipoCliente === "pessoa_fisica" ? "Completo" : "do Contato"}
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  defaultValue={editingCliente?.nome || ""}
                  required
                />
              </div>

              {tipoCliente === "empresa" ? (
                <>
                  <div className="form-group">
                    <label htmlFor="documento">CNPJ</label>
                    <input
                      type="text"
                      id="documento"
                      name="documento"
                      placeholder="XX.XXX.XXX/XXXX-XX"
                      defaultValue={editingCliente?.documento || ""}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="empresa">Nome da Empresa</label>
                    <input
                      type="text"
                      id="empresa"
                      name="empresa"
                      defaultValue={editingCliente?.empresa || ""}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cargo">Cargo do Contato</label>
                    <input
                      type="text"
                      id="cargo"
                      name="cargo"
                      placeholder="Ex: Diretor, Gerente, CEO"
                      defaultValue={editingCliente?.cargo || ""}
                    />
                  </div>
                </>
              ) : (
                <div className="form-group">
                  <label htmlFor="documento">CPF</label>
                  <input
                    type="text"
                    id="documento"
                    name="documento"
                    placeholder="XXX.XXX.XXX-XX"
                    defaultValue={editingCliente?.documento || ""}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  defaultValue={editingCliente?.email || ""}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="telefone">Telefone</label>
                <input
                  type="tel"
                  id="telefone"
                  name="telefone"
                  defaultValue={editingCliente?.telefone || ""}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  defaultValue={editingCliente?.status || "ativo"}
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() => {
                    setShowForm(false);
                    setEditingCliente(null);
                  }}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-salvar">
                  {editingCliente?.id ? "Atualizar" : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showLeadSelector && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Selecionar Lead</h2>
              <button
                className="close-button"
                onClick={() => {
                  setShowLeadSelector(false);
                }}
              >
                <FaTimes />
              </button>
            </div>
            <div className="lead-selector-container">
              <p className="lead-selector-info">
                Selecione um lead para converter em cliente. Os dados do lead
                serão importados automaticamente.
              </p>
              <div className="lead-list">
                {leadsDisponiveis.map((lead) => (
                  <div
                    key={lead.id}
                    className="lead-item"
                    onClick={() => handleSelectLead(lead)}
                  >
                    <div className="lead-item-header">
                      <h4>{lead.nome}</h4>
                      <span className={`lead-status ${lead.status}`}>
                        {lead.status}
                      </span>
                    </div>
                    <div className="lead-item-company">{lead.empresa}</div>
                    <div className="lead-item-details">
                      {lead.cargo && <div>Cargo: {lead.cargo}</div>}
                      <div>{lead.email}</div>
                      <div>{lead.telefone}</div>
                      <div>Origem: {lead.origem}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clientes;
