import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
  FaPlus,
  FaCalendarAlt,
  FaFileInvoiceDollar,
  FaCheck,
} from "react-icons/fa";
import "./Pagamentos.css";

const Pagamentos = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingPagamento, setEditingPagamento] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [contratos, setContratos] = useState([]);
  const [pagamentos, setPagamentos] = useState([]);
  const [showNovoPagamento, setShowNovoPagamento] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Carregar contratos do localStorage ao iniciar
  useEffect(() => {
    try {
      // Carregar contratos do localStorage
      const contratosArmazenados = localStorage.getItem("contratos");
      if (contratosArmazenados) {
        const contratosJSON = JSON.parse(contratosArmazenados);
        setContratos(contratosJSON);
      }

      // Carregar pagamentos do localStorage
      const pagamentosArmazenados = localStorage.getItem("pagamentos");
      if (pagamentosArmazenados) {
        const pagamentosJSON = JSON.parse(pagamentosArmazenados);
        setPagamentos(pagamentosJSON);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do localStorage:", error);
      carregarContratosPadrao();
      carregarPagamentosPadrao();
    }
  }, []);

  // Salvar contratos no localStorage sempre que a lista mudar
  useEffect(() => {
    if (contratos.length > 0) {
      try {
        localStorage.setItem("contratos", JSON.stringify(contratos));
      } catch (error) {
        console.error("Erro ao salvar contratos no localStorage:", error);
      }
    }
  }, [contratos]);

  // Salvar pagamentos no localStorage sempre que a lista mudar
  useEffect(() => {
    if (pagamentos.length > 0) {
      try {
        localStorage.setItem("pagamentos", JSON.stringify(pagamentos));
      } catch (error) {
        console.error("Erro ao salvar pagamentos no localStorage:", error);
      }
    }
  }, [pagamentos]);

  // Função para carregar dados padrão de contratos
  const carregarContratosPadrao = () => {
    setContratos([
      {
        id: 1,
        nome: "João Silva",
        empresa: "TechCorp",
        numero: "CONT-230401-123",
      },
      {
        id: 2,
        nome: "Maria Santos",
        empresa: "Inovação Ltda",
        numero: "CONT-230402-456",
      },
      {
        id: 3,
        nome: "Pedro Oliveira",
        empresa: "ConsultaTech",
        numero: "CONT-230403-789",
      },
    ]);
  };

  // Função para carregar dados padrão de pagamentos
  const carregarPagamentosPadrao = () => {
    setPagamentos([
      {
        id: 1,
        contratoId: 1,
        contrato: "CONT-230401-123",
        cliente: "João Silva - TechCorp",
        valor: 1500.0,
        dataVencimento: "2023-06-15",
        dataPagamento: "2023-06-14",
        status: "pago",
        formaPagamento: "Transferência",
        observacao: "Pagamento adiantado",
      },
      {
        id: 2,
        contratoId: 1,
        contrato: "CONT-230401-123",
        cliente: "João Silva - TechCorp",
        valor: 1500.0,
        dataVencimento: "2023-07-15",
        dataPagamento: null,
        status: "pendente",
        formaPagamento: "",
        observacao: "",
      },
      {
        id: 3,
        contratoId: 2,
        contrato: "CONT-230402-456",
        cliente: "Maria Santos - Inovação Ltda",
        valor: 3000.0,
        dataVencimento: "2023-05-30",
        dataPagamento: null,
        status: "atrasado",
        formaPagamento: "",
        observacao: "Cliente pediu prazo adicional",
      },
      {
        id: 4,
        contratoId: 3,
        contrato: "CONT-230403-789",
        cliente: "Pedro Oliveira - ConsultaTech",
        valor: 2500.0,
        dataVencimento: "2023-08-10",
        dataPagamento: null,
        status: "pendente",
        formaPagamento: "",
        observacao: "",
      },
    ]);
  };

  const formatarData = (data) => {
    if (!data) return "";
    const date = new Date(data);
    return date.toLocaleDateString("pt-BR");
  };

  const formatarValor = (valor) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleEditPagamento = (pagamento) => {
    setEditingPagamento(pagamento);
    setShowForm(true);
  };

  const handleDeletePagamento = (pagamentoId) => {
    if (window.confirm("Tem certeza que deseja excluir este pagamento?")) {
      setPagamentos(pagamentos.filter((p) => p.id !== pagamentoId));
    }
  };

  const handleSavePagamento = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const contratoSelecionado = contratos.find(
      (c) => c.id === parseInt(formData.get("contratoId"))
    );

    const novoPagamento = {
      contratoId: parseInt(formData.get("contratoId")),
      contrato: contratoSelecionado.numero,
      cliente: `${contratoSelecionado.nome} - ${contratoSelecionado.empresa}`,
      valor: parseFloat(formData.get("valor")),
      dataVencimento: formData.get("dataVencimento"),
      dataPagamento:
        formData.get("status") === "pago"
          ? formData.get("dataPagamento")
          : null,
      status: formData.get("status"),
      formaPagamento: formData.get("formaPagamento") || "",
      observacao: formData.get("observacao") || "",
    };

    if (editingPagamento) {
      setPagamentos(
        pagamentos.map((p) =>
          p.id === editingPagamento.id ? { ...novoPagamento, id: p.id } : p
        )
      );
    } else {
      setPagamentos([...pagamentos, { ...novoPagamento, id: Date.now() }]);
    }

    setShowForm(false);
    setEditingPagamento(null);
  };

  const handleConfirmarPagamento = (pagamento) => {
    const hoje = new Date().toISOString().split("T")[0];
    setPagamentos(
      pagamentos.map((p) =>
        p.id === pagamento.id
          ? { ...p, status: "pago", dataPagamento: hoje }
          : p
      )
    );
  };

  const verificarStatusPagamento = (pagamento) => {
    // Se já está pago, mantém
    if (pagamento.status === "pago") return "pago";

    // Verifica se está atrasado
    const hoje = new Date();
    const vencimento = new Date(pagamento.dataVencimento);

    if (vencimento < hoje) {
      return "atrasado";
    }

    return "pendente";
  };

  // Atualiza status dos pagamentos automaticamente
  const pagamentosFiltrados = pagamentos
    .map((p) => {
      if (p.status !== "pago") {
        const novoStatus = verificarStatusPagamento(p);
        return { ...p, status: novoStatus };
      }
      return p;
    })
    .filter((p) => {
      if (filtroStatus === "todos") return true;
      return p.status === filtroStatus;
    });

  // Adiciona evento ao calendário para cada pagamento
  const adicionarEventoCalendario = (pagamento) => {
    // Em um sistema real, você enviaria dados para a API do calendário
    alert(
      `Evento adicionado ao calendário: Pagamento ${
        pagamento.contrato
      } - ${formatarData(pagamento.dataVencimento)}`
    );
  };

  // Filtrar pagamentos de acordo com o termo de busca
  const filteredPagamentos = pagamentos.filter((pagamento) => {
    if (searchTerm.trim() === "") return true;

    const searchTermLower = searchTerm.toLowerCase();
    return (
      (pagamento.cliente &&
        pagamento.cliente.toLowerCase().includes(searchTermLower)) ||
      (pagamento.referencia &&
        pagamento.referencia.toLowerCase().includes(searchTermLower)) ||
      (pagamento.descricao &&
        pagamento.descricao.toLowerCase().includes(searchTermLower))
    );
  });

  return (
    <div className="pagamentos-container">
      <div className="pagamentos-header">
        <h1>Pagamentos</h1>
        <button
          className="btn-novo-pagamento"
          onClick={() => setShowForm(true)}
        >
          <span>+</span>
          Novo Pagamento
        </button>
      </div>

      <div className="pagamentos-actions">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar pagamentos..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filtro-status">
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="pendente">Pendentes</option>
            <option value="pago">Pagos</option>
            <option value="atrasado">Atrasados</option>
          </select>
        </div>
      </div>

      <div className="pagamentos-table">
        <div className="table-header">
          <div>Contrato</div>
          <div>Cliente</div>
          <div>Valor</div>
          <div>Vencimento</div>
          <div>Pagamento</div>
          <div>Status</div>
          <div>Ações</div>
        </div>

        {pagamentosFiltrados.length === 0 ? (
          <div className="empty-state">
            Nenhum pagamento encontrado. Crie um novo pagamento clicando no
            botão acima.
          </div>
        ) : (
          pagamentosFiltrados.map((pagamento) => (
            <div key={pagamento.id} className="table-row">
              <div>{pagamento.contrato}</div>
              <div>{pagamento.cliente}</div>
              <div>{formatarValor(pagamento.valor)}</div>
              <div>
                {formatarData(pagamento.dataVencimento)}
                <button
                  title="Adicionar ao calendário"
                  className="btn-add-calendar"
                  onClick={() => adicionarEventoCalendario(pagamento)}
                >
                  <FaCalendarAlt />
                </button>
              </div>
              <div>
                {pagamento.dataPagamento
                  ? formatarData(pagamento.dataPagamento)
                  : "-"}
              </div>
              <div>
                <span className={`status-badge ${pagamento.status}`}>
                  {pagamento.status === "pago"
                    ? "Pago"
                    : pagamento.status === "atrasado"
                    ? "Atrasado"
                    : "Pendente"}
                </span>
              </div>
              <div className="actions">
                {pagamento.status !== "pago" && (
                  <button
                    className="btn-confirm"
                    title="Confirmar pagamento"
                    onClick={() => handleConfirmarPagamento(pagamento)}
                  >
                    <FaCheck />
                  </button>
                )}
                <button
                  className="btn-edit"
                  onClick={() => handleEditPagamento(pagamento)}
                >
                  <FaEdit />
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDeletePagamento(pagamento.id)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>
                {editingPagamento ? "Editar Pagamento" : "Novo Pagamento"}
              </h2>
              <button
                className="close-button"
                onClick={() => {
                  setShowForm(false);
                  setEditingPagamento(null);
                }}
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSavePagamento}>
              <div className="form-group">
                <label htmlFor="contratoId">Contrato</label>
                <select
                  id="contratoId"
                  name="contratoId"
                  defaultValue={editingPagamento?.contratoId || ""}
                  required
                >
                  <option value="">Selecione um contrato</option>
                  {contratos.map((contrato) => (
                    <option key={contrato.id} value={contrato.id}>
                      {contrato.numero} - {contrato.nome} ({contrato.empresa})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="valor">Valor</label>
                <input
                  type="number"
                  id="valor"
                  name="valor"
                  step="0.01"
                  defaultValue={editingPagamento?.valor || ""}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="dataVencimento">Data de Vencimento</label>
                  <input
                    type="date"
                    id="dataVencimento"
                    name="dataVencimento"
                    defaultValue={editingPagamento?.dataVencimento || ""}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    defaultValue={editingPagamento?.status || "pendente"}
                  >
                    <option value="pendente">Pendente</option>
                    <option value="pago">Pago</option>
                    <option value="atrasado">Atrasado</option>
                  </select>
                </div>
              </div>
              <div
                className="form-group"
                id="pagamento-details"
                style={{
                  display:
                    editingPagamento?.status === "pago" ||
                    document.getElementById("status")?.value === "pago"
                      ? "block"
                      : "none",
                }}
              >
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="dataPagamento">Data de Pagamento</label>
                    <input
                      type="date"
                      id="dataPagamento"
                      name="dataPagamento"
                      defaultValue={
                        editingPagamento?.dataPagamento ||
                        new Date().toISOString().split("T")[0]
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="formaPagamento">Forma de Pagamento</label>
                    <select
                      id="formaPagamento"
                      name="formaPagamento"
                      defaultValue={editingPagamento?.formaPagamento || ""}
                    >
                      <option value="">Selecione</option>
                      <option value="Dinheiro">Dinheiro</option>
                      <option value="Transferência">Transferência</option>
                      <option value="Cartão de Crédito">
                        Cartão de Crédito
                      </option>
                      <option value="Boleto">Boleto</option>
                      <option value="Pix">Pix</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="observacao">Observação</label>
                <textarea
                  id="observacao"
                  name="observacao"
                  rows="3"
                  defaultValue={editingPagamento?.observacao || ""}
                ></textarea>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() => {
                    setShowForm(false);
                    setEditingPagamento(null);
                  }}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-salvar">
                  {editingPagamento ? "Atualizar" : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pagamentos;
