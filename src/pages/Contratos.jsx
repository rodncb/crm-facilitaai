import React, { useState, useEffect } from "react";
import { FaSearch, FaTimes, FaPlus } from "react-icons/fa";
import "./Contratos.css";

const Contratos = () => {
  const [activeTab, setActiveTab] = useState("contratos");
  const [showNovoContrato, setShowNovoContrato] = useState(false);
  const [showNovoServico, setShowNovoServico] = useState(false);
  const [contratos, setContratos] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [servicosSelecionados, setServicosSelecionados] = useState([]);
  const [valorTotal, setValorTotal] = useState(0);
  const [clientesAtivos, setClientesAtivos] = useState([]);

  // Carregar dados iniciais do localStorage
  useEffect(() => {
    carregarContratosLocalStorage();
    carregarServicosLocalStorage();
    carregarClientesLocalStorage();
  }, []);

  // Salvar contratos no localStorage sempre que a lista mudar
  useEffect(() => {
    try {
      localStorage.setItem("contratos", JSON.stringify(contratos));
      console.log("Contratos salvos no localStorage:", contratos);
    } catch (error) {
      console.error("Erro ao salvar contratos no localStorage:", error);
    }
  }, [contratos]);

  // Salvar serviços no localStorage sempre que a lista mudar
  useEffect(() => {
    try {
      localStorage.setItem("servicos", JSON.stringify(servicos));
      console.log("Serviços salvos no localStorage:", servicos);
    } catch (error) {
      console.error("Erro ao salvar serviços no localStorage:", error);
    }
  }, [servicos]);

  // Função para carregar contratos do localStorage
  const carregarContratosLocalStorage = () => {
    try {
      const contratosSalvos = localStorage.getItem("contratos");
      if (contratosSalvos) {
        const contratosData = JSON.parse(contratosSalvos);
        if (
          contratosData &&
          Array.isArray(contratosData) &&
          contratosData.length > 0
        ) {
          setContratos(contratosData);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar contratos do localStorage:", error);
    }
  };

  // Função para carregar serviços do localStorage
  const carregarServicosLocalStorage = () => {
    try {
      const servicosSalvos = localStorage.getItem("servicos");
      if (servicosSalvos) {
        const servicosData = JSON.parse(servicosSalvos);
        if (
          servicosData &&
          Array.isArray(servicosData) &&
          servicosData.length > 0
        ) {
          setServicos(servicosData);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar serviços do localStorage:", error);
    }
  };

  // Função para carregar clientes ativos do localStorage
  const carregarClientesLocalStorage = () => {
    try {
      const clientesSalvos = localStorage.getItem("clientes");
      if (clientesSalvos) {
        const clientesData = JSON.parse(clientesSalvos);
        if (
          clientesData &&
          Array.isArray(clientesData) &&
          clientesData.length > 0
        ) {
          // Filtra apenas clientes ativos
          const ativos = clientesData.filter(
            (cliente) => cliente.status === "ativo"
          );
          setClientesAtivos(ativos);
        } else {
          carregarClientesPadrao();
        }
      } else {
        carregarClientesPadrao();
      }
    } catch (error) {
      console.error("Erro ao carregar clientes do localStorage:", error);
      carregarClientesPadrao();
    }
  };

  // Função para carregar dados padrão de clientes
  const carregarClientesPadrao = () => {
    setClientesAtivos([
      { id: 1, nome: "João Silva", empresa: "TechCorp" },
      { id: 2, nome: "Maria Santos", empresa: "Inovação Ltda" },
      { id: 3, nome: "Pedro Oliveira", empresa: "ConsultaTech" },
    ]);
  };

  const handleNovoContrato = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const novoContrato = {
      id: Date.now(),
      numero: formData.get("numeroContrato"),
      cliente: clientesAtivos.find(
        (c) => c.id === parseInt(formData.get("cliente"))
      ),
      dataInicio: formData.get("dataInicio"),
      dataTermino: formData.get("dataTermino"),
      status: formData.get("status"),
      condicoesPagamento: formData.get("condicoesPagamento"),
      servicos: servicosSelecionados,
      valorTotal,
      termos: formData.get("termos"),
      observacoes: formData.get("observacoes"),
    };

    setContratos([...contratos, novoContrato]);
    setShowNovoContrato(false);
    setServicosSelecionados([]);
    setValorTotal(0);
  };

  const handleNovoServico = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const novoServico = {
      id: Date.now(),
      nome: formData.get("nomeServico"),
      descricao: formData.get("descricao"),
      precoBase: parseFloat(formData.get("precoBase")),
      recorrente: formData.get("recorrente") === "on",
    };

    setServicos([...servicos, novoServico]);
    setShowNovoServico(false);
  };

  const handleAdicionarServico = (servico) => {
    setServicosSelecionados([...servicosSelecionados, servico]);
    setValorTotal(valorTotal + servico.precoBase);
  };

  const handleRemoverServico = (servico) => {
    setServicosSelecionados(
      servicosSelecionados.filter((s) => s.id !== servico.id)
    );
    setValorTotal(valorTotal - servico.precoBase);
  };

  return (
    <div className="contratos-container">
      <div className="contratos-header">
        <h1>Contratos e Serviços</h1>
        <div className="header-buttons">
          <button
            className="btn-novo-servico"
            onClick={() => setShowNovoServico(true)}
          >
            <FaPlus /> Novo Serviço
          </button>
          <button
            className="btn-novo-contrato"
            onClick={() => setShowNovoContrato(true)}
          >
            <FaPlus /> Novo Contrato
          </button>
        </div>
      </div>

      <div className="contratos-tabs">
        <button
          className={`tab ${activeTab === "contratos" ? "active" : ""}`}
          onClick={() => setActiveTab("contratos")}
        >
          Contratos
        </button>
        <button
          className={`tab ${activeTab === "servicos" ? "active" : ""}`}
          onClick={() => setActiveTab("servicos")}
        >
          Serviços
        </button>
      </div>

      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder={
            activeTab === "contratos"
              ? "Buscar contratos..."
              : "Buscar serviços..."
          }
          className="search-input"
        />
      </div>

      {activeTab === "contratos" ? (
        <div className="contratos-table">
          <div className="table-header">
            <div>Número</div>
            <div>Cliente</div>
            <div>Período</div>
            <div>Valor</div>
            <div>Status</div>
            <div>Ações</div>
          </div>
          {contratos.length === 0 ? (
            <div className="empty-state">
              Nenhum contrato encontrado. Crie um novo contrato clicando no
              botão acima.
            </div>
          ) : (
            contratos.map((contrato) => (
              <div key={contrato.id} className="table-row">
                <div>{contrato.numero}</div>
                <div>{contrato.cliente.nome}</div>
                <div>{`${contrato.dataInicio} - ${contrato.dataTermino}`}</div>
                <div>R$ {contrato.valorTotal.toFixed(2)}</div>
                <div>
                  <span className={`status-badge ${contrato.status}`}>
                    {contrato.status}
                  </span>
                </div>
                <div className="actions">{/* Ações do contrato */}</div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="servicos-table">
          <div className="table-header">
            <div>Nome</div>
            <div>Descrição</div>
            <div>Preço Base</div>
            <div>Recorrente</div>
            <div>Ações</div>
          </div>
          {servicos.length === 0 ? (
            <div className="empty-state">
              Nenhum serviço encontrado. Crie um novo serviço clicando no botão
              acima.
            </div>
          ) : (
            servicos.map((servico) => (
              <div key={servico.id} className="table-row">
                <div>{servico.nome}</div>
                <div>{servico.descricao}</div>
                <div>R$ {servico.precoBase.toFixed(2)}</div>
                <div>{servico.recorrente ? "Sim" : "Não"}</div>
                <div className="actions">{/* Ações do serviço */}</div>
              </div>
            ))
          )}
        </div>
      )}

      {showNovoContrato && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Novo Contrato</h2>
              <button
                className="close-button"
                onClick={() => setShowNovoContrato(false)}
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleNovoContrato}>
              <div className="form-group">
                <label htmlFor="cliente">Cliente</label>
                <select id="cliente" name="cliente" required>
                  <option value="">Selecione um cliente</option>
                  {clientesAtivos.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nome} - {cliente.empresa}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="numeroContrato">Número do Contrato</label>
                <input
                  type="text"
                  id="numeroContrato"
                  name="numeroContrato"
                  defaultValue={`CONT-${new Date()
                    .toISOString()
                    .slice(2, 10)
                    .replace(/-/g, "")}-${Math.floor(Math.random() * 1000)
                    .toString()
                    .padStart(3, "0")}`}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="dataInicio">Data de Início</label>
                  <input
                    type="date"
                    id="dataInicio"
                    name="dataInicio"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="dataTermino">Data de Término</label>
                  <input
                    type="date"
                    id="dataTermino"
                    name="dataTermino"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select id="status" name="status" required>
                    <option value="rascunho">Rascunho</option>
                    <option value="ativo">Ativo</option>
                    <option value="suspenso">Suspenso</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="condicoesPagamento">
                    Condições de Pagamento
                  </label>
                  <input
                    type="text"
                    id="condicoesPagamento"
                    name="condicoesPagamento"
                    placeholder="Ex: 30 dias após emissão"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Serviços</label>
                <div className="servicos-container">
                  <div className="servicos-disponiveis">
                    <h4>Serviços Disponíveis</h4>
                    {servicos
                      .filter(
                        (s) =>
                          !servicosSelecionados.find((ss) => ss.id === s.id)
                      )
                      .map((servico) => (
                        <div key={servico.id} className="servico-item">
                          <div>
                            <strong>{servico.nome}</strong>
                            <p>R$ {servico.precoBase.toFixed(2)}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleAdicionarServico(servico)}
                          >
                            <FaPlus />
                          </button>
                        </div>
                      ))}
                  </div>
                  <div className="servicos-selecionados">
                    <h4>Serviços Selecionados</h4>
                    {servicosSelecionados.map((servico) => (
                      <div key={servico.id} className="servico-item">
                        <div>
                          <strong>{servico.nome}</strong>
                          <p>R$ {servico.precoBase.toFixed(2)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoverServico(servico)}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                    <div className="valor-total">
                      Valor Total: R$ {valorTotal.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="termos">Termos do Contrato</label>
                <textarea
                  id="termos"
                  name="termos"
                  rows="4"
                  placeholder="Defina os termos e condições do contrato..."
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="observacoes">Observações</label>
                <textarea
                  id="observacoes"
                  name="observacoes"
                  rows="3"
                  placeholder="Observações adicionais..."
                ></textarea>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() => setShowNovoContrato(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-salvar">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showNovoServico && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Novo Serviço</h2>
              <button
                className="close-button"
                onClick={() => setShowNovoServico(false)}
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleNovoServico}>
              <div className="form-group">
                <label htmlFor="nomeServico">Nome do Serviço</label>
                <input
                  type="text"
                  id="nomeServico"
                  name="nomeServico"
                  placeholder="Ex: Desenvolvimento de Website"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="descricao">Descrição</label>
                <textarea
                  id="descricao"
                  name="descricao"
                  rows="4"
                  placeholder="Descreva os detalhes do serviço"
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="precoBase">Preço Base (R$)</label>
                <input
                  type="number"
                  id="precoBase"
                  name="precoBase"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input type="checkbox" name="recorrente" />
                  Serviço Recorrente
                </label>
                <span className="helper-text">
                  Marque se o serviço é cobrado periodicamente
                </span>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() => setShowNovoServico(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-salvar">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contratos;
