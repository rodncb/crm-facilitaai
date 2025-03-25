import React, { useState, useEffect, useRef } from "react";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
  FaPlus,
  FaFileExport,
  FaFilePdf,
  FaCheck,
  FaShareAlt,
  FaCopy,
} from "react-icons/fa";
import "./Propostas.css";

const Propostas = () => {
  const [propostas, setPropostas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProposta, setEditingProposta] = useState(null);
  const [origem, setOrigem] = useState("cliente");
  const [clientes, setClientes] = useState([]);
  const [leads, setLeads] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [currentProposta, setCurrentProposta] = useState(null);
  const [itens, setItens] = useState([
    { id: Date.now(), descricao: "", quantidade: 1, valorUnitario: 0 },
  ]);
  const [showShareLink, setShowShareLink] = useState(false);
  const [currentShareUrl, setCurrentShareUrl] = useState("");
  const [linkCopiado, setLinkCopiado] = useState(false);

  const previewRef = useRef();

  useEffect(() => {
    // Carregar dados de exemplo
    carregarClientesSalvos();
    carregarLeadsSalvos();
    carregarPropostasSalvas();
  }, []);

  // Salvar propostas no localStorage sempre que a lista mudar
  useEffect(() => {
    try {
      localStorage.setItem("propostas", JSON.stringify(propostas));
      console.log("Propostas salvas no localStorage:", propostas);
    } catch (error) {
      console.error("Erro ao salvar propostas no localStorage:", error);
    }
  }, [propostas]);

  // Função para carregar clientes do localStorage
  const carregarClientesSalvos = () => {
    try {
      const clientesSalvos = localStorage.getItem("clientes");
      if (clientesSalvos) {
        const clientesData = JSON.parse(clientesSalvos);
        if (
          clientesData &&
          Array.isArray(clientesData) &&
          clientesData.length > 0
        ) {
          setClientes(clientesData);
          return;
        }
      }
      // Se não houver dados salvos ou se forem inválidos, carrega os dados padrão
      setClientes([
        {
          id: 1,
          nome: "João Silva",
          empresa: "TechCorp",
          email: "joao@techcorp.com",
          telefone: "(11) 98765-4321",
        },
        {
          id: 2,
          nome: "Maria Santos",
          empresa: "Inovação Ltda",
          email: "maria@inovacao.com",
          telefone: "(11) 91234-5678",
        },
        {
          id: 3,
          nome: "Pedro Oliveira",
          empresa: "ConsultaTech",
          email: "pedro@consultatech.com",
          telefone: "(11) 99876-5432",
        },
      ]);
    } catch (error) {
      console.error("Erro ao carregar clientes do localStorage:", error);
      // Em caso de erro, carrega os dados padrão
      setClientes([
        {
          id: 1,
          nome: "João Silva",
          empresa: "TechCorp",
          email: "joao@techcorp.com",
          telefone: "(11) 98765-4321",
        },
        {
          id: 2,
          nome: "Maria Santos",
          empresa: "Inovação Ltda",
          email: "maria@inovacao.com",
          telefone: "(11) 91234-5678",
        },
        {
          id: 3,
          nome: "Pedro Oliveira",
          empresa: "ConsultaTech",
          email: "pedro@consultatech.com",
          telefone: "(11) 99876-5432",
        },
      ]);
    }
  };

  // Função para carregar propostas do localStorage
  const carregarPropostasSalvas = () => {
    try {
      const propostasSalvas = localStorage.getItem("propostas");
      if (propostasSalvas) {
        const propostasData = JSON.parse(propostasSalvas);
        if (
          propostasData &&
          Array.isArray(propostasData) &&
          propostasData.length > 0
        ) {
          setPropostas(propostasData);
          return;
        }
      }
      // Se não houver dados salvos ou se forem inválidos, carrega os dados padrão
      carregarPropostasPadrao();
    } catch (error) {
      console.error("Erro ao carregar propostas do localStorage:", error);
      // Em caso de erro, carrega os dados padrão
      carregarPropostasPadrao();
    }
  };

  // Função para carregar dados padrão de propostas
  const carregarPropostasPadrao = () => {
    setPropostas([
      {
        id: 1,
        numero: "PROP-2023-001",
        cliente: "João Silva - TechCorp",
        clienteId: 1,
        data: "2023-06-10",
        validade: "2023-06-25",
        valorTotal: 15000.0,
        status: "aprovada",
        contratoGerado: true,
        itens: [
          {
            id: 1,
            descricao: "Desenvolvimento de website",
            quantidade: 1,
            valorUnitario: 8000.0,
          },
          {
            id: 2,
            descricao: "Hospedagem anual",
            quantidade: 1,
            valorUnitario: 2000.0,
          },
          {
            id: 3,
            descricao: "Manutenção mensal",
            quantidade: 5,
            valorUnitario: 1000.0,
          },
        ],
      },
      {
        id: 2,
        numero: "PROP-2023-002",
        cliente: "Maria Santos - Inovação Ltda",
        clienteId: 2,
        data: "2023-06-15",
        validade: "2023-06-30",
        valorTotal: 20000.0,
        status: "pendente",
        contratoGerado: false,
        itens: [
          {
            id: 1,
            descricao: "Consultoria em marketing digital",
            quantidade: 10,
            valorUnitario: 1000.0,
          },
          {
            id: 2,
            descricao: "Criação de conteúdo",
            quantidade: 5,
            valorUnitario: 2000.0,
          },
        ],
      },
      {
        id: 3,
        numero: "PROP-2023-003",
        origem: "lead",
        cliente: "Carlos Mendes - Startup XYZ",
        clienteId: 1,
        data: "2023-06-18",
        validade: "2023-07-02",
        valorTotal: 8000.0,
        status: "recusada",
        contratoGerado: false,
        itens: [
          {
            id: 1,
            descricao: "Plano de marketing inicial",
            quantidade: 1,
            valorUnitario: 5000.0,
          },
          {
            id: 2,
            descricao: "Gestão de redes sociais",
            quantidade: 3,
            valorUnitario: 1000.0,
          },
        ],
      },
    ]);
  };

  // Função para carregar leads do localStorage
  const carregarLeadsSalvos = () => {
    // Carregar leads do localStorage ou usar os dados de exemplo
    try {
      const leadsString = localStorage.getItem("leads");
      console.log("Dados brutos do localStorage:", leadsString);

      if (leadsString) {
        const leadsSalvos = JSON.parse(leadsString);
        console.log("Leads carregados do localStorage:", leadsSalvos);

        if (
          leadsSalvos &&
          Array.isArray(leadsSalvos) &&
          leadsSalvos.length > 0
        ) {
          setLeads(leadsSalvos);
        } else {
          console.log(
            "Usando leads padrão porque os dados do localStorage estão vazios ou inválidos"
          );
          carregarLeadsPadrao();
        }
      } else {
        console.log(
          "Nenhum dado de leads no localStorage, usando leads padrão"
        );
        carregarLeadsPadrao();
      }
    } catch (error) {
      console.error("Erro ao processar leads do localStorage:", error);
      carregarLeadsPadrao();
    }
  };

  const formatarData = (data) => {
    if (!data) return "";
    const date = new Date(data);
    return date.toLocaleDateString("pt-BR");
  };

  const formatarValor = (valor) => {
    return `R$ ${Number(valor || 0)
      .toFixed(2)
      .replace(".", ",")}`;
  };

  const formatarValorMonetario = (valor) => {
    return `R$ ${Number(valor || 0)
      .toFixed(2)
      .replace(".", ",")}`;
  };

  const handleEditProposta = (proposta) => {
    setEditingProposta(proposta);
    setItens(proposta.itens);
    setOrigem(proposta.origem || "cliente");
    setShowForm(true);
  };

  const handleDeleteProposta = (propostaId) => {
    if (window.confirm("Tem certeza que deseja excluir esta proposta?")) {
      setPropostas(propostas.filter((p) => p.id !== propostaId));
    }
  };

  const handleAdicionarItem = () => {
    setItens([
      ...itens,
      { id: Date.now(), descricao: "", quantidade: 1, valorUnitario: 0 },
    ]);
  };

  const handleRemoverItem = (index) => {
    if (itens.length > 1) {
      setItens(itens.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index, campo, valor) => {
    setItens(
      itens.map((item, i) => {
        if (i === index) {
          return { ...item, [campo]: valor };
        }
        return item;
      })
    );
  };

  const calcularTotal = () => {
    return itens.reduce((total, item) => {
      return total + item.quantidade * item.valorUnitario;
    }, 0);
  };

  const handleViewProposta = (proposta) => {
    setCurrentProposta(proposta);
    setShowPreview(true);
  };

  const handleSaveProposta = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Obter e converter para número o ID da pessoa selecionada
    const pessoaIdStr = formData.get("pessoaId");
    const pessoaId = pessoaIdStr ? parseInt(pessoaIdStr, 10) : 0;

    console.log("Pessoa ID selecionada:", pessoaId, "Tipo:", typeof pessoaId);
    console.log("Leads disponíveis:", leads);

    // Encontrar a pessoa selecionada nos dados
    const pessoaSelecionada =
      origem === "cliente"
        ? clientes.find((c) => c.id === pessoaId)
        : leads.find((l) => l.id === pessoaId);

    console.log("Pessoa selecionada:", pessoaSelecionada);

    if (!pessoaSelecionada) {
      alert(
        `O ${
          origem === "cliente" ? "cliente" : "lead"
        } selecionado não foi encontrado. Por favor, selecione novamente.`
      );
      return;
    }

    // Gerar número sequencial para nova proposta
    const numeroProposta = editingProposta
      ? editingProposta.numero
      : `PROP-${new Date().getFullYear()}-${String(
          propostas.length + 1
        ).padStart(3, "0")}`;

    const novaProposta = {
      numero: numeroProposta,
      origem: origem,
      cliente: `${pessoaSelecionada.nome} - ${pessoaSelecionada.empresa}`,
      clienteId: pessoaId,
      data: formData.get("data"),
      validade: formData.get("validade"),
      valorTotal: calcularTotal(),
      status: formData.get("status"),
      contratoGerado: editingProposta ? editingProposta.contratoGerado : false,
      itens: [...itens],
      observacoes: formData.get("observacoes") || "",
      condicoesEntrega: formData.get("condicoesEntrega") || "",
    };

    if (editingProposta) {
      setPropostas(
        propostas.map((p) =>
          p.id === editingProposta.id ? { ...novaProposta, id: p.id } : p
        )
      );
    } else {
      setPropostas([...propostas, { ...novaProposta, id: Date.now() }]);
    }

    setShowForm(false);
    setEditingProposta(null);
    setItens([
      { id: Date.now(), descricao: "", quantidade: 1, valorUnitario: 0 },
    ]);
  };

  const handleGerarContrato = (proposta) => {
    // Simulação de geração de contrato
    setPropostas(
      propostas.map((p) =>
        p.id === proposta.id ? { ...p, contratoGerado: true } : p
      )
    );
    alert(`Contrato gerado com sucesso para a proposta ${proposta.numero}`);
  };

  const handleStatusChange = (proposta, novoStatus) => {
    setPropostas(
      propostas.map((p) =>
        p.id === proposta.id ? { ...p, status: novoStatus } : p
      )
    );
  };

  const handlePrint = () => {
    // Verificar se há referência válida
    if (!previewRef || !previewRef.current) {
      console.error("Referência do preview não encontrada");
      alert("Erro ao preparar a impressão. Tente novamente.");
      return;
    }

    // Criar uma janela temporária para imprimir apenas o conteúdo da proposta
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert(
        "Por favor, permita que o navegador abra popups para imprimir o PDF"
      );
      return;
    }

    // Obtém o conteúdo HTML do elemento de visualização
    const propostaHTML = previewRef.current.innerHTML;

    // CSS para impressão
    const printStyles = `
      <style>
        body { 
          font-family: Arial, sans-serif;
          color: #333;
          margin: 0;
          padding: 20px;
        }
        .proposta-preview {
          max-width: 21cm;
          margin: 0 auto;
          padding: 20px;
        }
        .proposta-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 40px;
          border-bottom: 2px solid #fd7e14;
          padding-bottom: 20px;
        }
        .proposta-logo img {
          max-width: 120px;
          height: auto;
        }
        .proposta-info h1 {
          font-size: 24px;
          color: #3a416f;
          margin: 0 0 10px 0;
        }
        .proposta-numero {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #fd7e14;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        table th, table td {
          padding: 8px;
          border: 1px solid #ddd;
          text-align: left;
        }
        table th {
          background-color: #f3f5f9;
        }
        .total-label {
          text-align: right;
          font-weight: bold;
        }
        .total-value {
          font-weight: bold;
        }
        @media print {
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      </style>
    `;

    // Escrever o conteúdo HTML na nova janela
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Proposta ${currentProposta.numero}</title>
          ${printStyles}
        </head>
        <body>
          <div class="proposta-preview">${propostaHTML}</div>
          <script>
            // Imprimir automaticamente e fechar a janela depois
            window.onload = function() {
              setTimeout(function() {
                window.print();
                setTimeout(function() {
                  window.close();
                }, 500);
              }, 300);
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  const handleShareProposta = (proposta) => {
    // Obter o nome do cliente (primeiro nome ou nome da empresa)
    let clienteNome = "";

    if (proposta.origem === "cliente") {
      const cliente = clientes.find((c) => c.id === proposta.clienteId);
      if (cliente) {
        // Pegar o primeiro nome ou nome da empresa
        clienteNome =
          cliente.tipo === "pessoa_fisica"
            ? cliente.nome.split(" ")[0]
            : cliente.empresa.split(" ")[0];
      }
    } else if (proposta.origem === "lead") {
      const lead = leads.find((l) => l.id === proposta.clienteId);
      if (lead) {
        // Pegar o primeiro nome ou nome da empresa
        clienteNome = lead.nome.split(" ")[0] || lead.empresa.split(" ")[0];
      }
    }

    // Remover acentos e caracteres especiais do nome
    clienteNome = clienteNome
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

    // Extrair o número da proposta sem o prefixo
    const numeroSemPrefixo = proposta.numero.replace("PROP-", "");

    // Criar URL amigável
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/proposta/${clienteNome}${numeroSemPrefixo}`;

    setCurrentShareUrl(shareUrl);
    setShowShareLink(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentShareUrl);
    setLinkCopiado(true);

    // Extrair o slug de nome + código
    const urlParts = currentShareUrl.split("/");
    const nomeComCodigo = urlParts[urlParts.length - 1];

    // Mostrar uma mensagem mais informativa
    alert(`Link copiado com sucesso!\nFormato personalizado: ${nomeComCodigo}`);

    setTimeout(() => setLinkCopiado(false), 2000);
  };

  // Função para carregar leads padrão
  const carregarLeadsPadrao = () => {
    setLeads([
      {
        id: 1,
        nome: "Carlos Mendes",
        empresa: "Startup XYZ",
        email: "carlos@startupxyz.com",
        telefone: "(11) 94567-8912",
      },
      {
        id: 2,
        nome: "Ana Ferreira",
        empresa: "Nova Empresa",
        email: "ana@novaempresa.com",
        telefone: "(11) 93456-7890",
      },
      {
        id: 3,
        nome: "Roberto Santos",
        empresa: "TechSoft",
        email: "roberto@techsoft.com",
        telefone: "(11) 92345-6789",
      },
    ]);
  };

  const PropostaPreview = ({ proposta }) => {
    if (!proposta) return null;

    // Dados da empresa Facilita AI
    const empresaFacilitaAI = {
      nome: "Facilita AI",
      endereco: "Praça Antonio Calado, 85 - Barra da Tijuca",
      cidade: "Rio de Janeiro",
      estado: "RJ",
      cep: "22793-084",
      cnpj: "28.894.664/0001-60",
    };

    return (
      <div className="proposta-preview" ref={previewRef}>
        <div className="proposta-header">
          <div className="proposta-logo">
            <img src="/images/logo.png" alt="Logo Facilita AI" />
          </div>
          <div className="proposta-info">
            <h1>Proposta Comercial</h1>
            <div className="proposta-numero">Nº {proposta.numero}</div>
            <div className="proposta-datas">
              <p>
                <strong>Data:</strong> {formatarData(proposta.data)}
              </p>
              <p>
                <strong>Validade:</strong> {formatarData(proposta.validade)}
              </p>
            </div>
          </div>
        </div>

        <div className="proposta-empresa">
          <h2>Empresa</h2>
          <p>
            <strong>{empresaFacilitaAI.nome}</strong>
          </p>
          <p>{empresaFacilitaAI.endereco}</p>
          <p>
            {empresaFacilitaAI.cidade} {empresaFacilitaAI.estado}
          </p>
          <p>CNPJ: {empresaFacilitaAI.cnpj}</p>
        </div>

        <div className="proposta-cliente">
          <h2>Cliente</h2>
          <p>{proposta.cliente}</p>
        </div>

        <div className="proposta-itens">
          <h2>Serviços e Produtos</h2>
          <table>
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Qtd</th>
                <th>Valor Unitário</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {proposta.itens.map((item) => (
                <tr key={item.id}>
                  <td>{item.descricao}</td>
                  <td>{item.quantidade}</td>
                  <td>{formatarValor(item.valorUnitario)}</td>
                  <td>{formatarValor(item.quantidade * item.valorUnitario)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="total-label">
                  VALOR TOTAL
                </td>
                <td className="total-value">
                  {formatarValor(proposta.valorTotal)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {proposta.observacoes && (
          <div className="proposta-observacoes">
            <h2>Observações</h2>
            <p>{proposta.observacoes}</p>
          </div>
        )}

        {proposta.condicoesEntrega && (
          <div className="proposta-condicoes">
            <h2>Condições de Entrega</h2>
            <p>{proposta.condicoesEntrega}</p>
          </div>
        )}

        <div className="proposta-assinaturas">
          <div className="assinatura">
            <p className="nome-empresa">Facilita AI</p>
          </div>
          <div className="assinatura">
            <p className="nome-cliente">{proposta.cliente.split(" - ")[0]}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="propostas-container">
      <div className="propostas-header">
        <h1>Propostas</h1>
        <button className="btn-nova-proposta" onClick={() => setShowForm(true)}>
          <span>+</span>
          Nova Proposta
        </button>
      </div>

      <div className="propostas-actions">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar propostas..."
            className="search-input"
          />
        </div>
        <div className="filtro-status">
          <select>
            <option value="todos">Todos os status</option>
            <option value="pendente">Pendentes</option>
            <option value="aprovada">Aprovadas</option>
            <option value="recusada">Recusadas</option>
          </select>
        </div>
      </div>

      <div className="propostas-table">
        <div className="table-header">
          <div>Número</div>
          <div>Cliente</div>
          <div>Data</div>
          <div>Validade</div>
          <div>Valor Total</div>
          <div>Status</div>
          <div>Ações</div>
        </div>

        {propostas.length === 0 ? (
          <div className="empty-state">
            Nenhuma proposta encontrada. Crie uma nova proposta clicando no
            botão acima.
          </div>
        ) : (
          propostas.map((proposta) => (
            <div key={proposta.id} className="table-row">
              <div>{proposta.numero}</div>
              <div>{proposta.cliente}</div>
              <div>{formatarData(proposta.data)}</div>
              <div>{formatarData(proposta.validade)}</div>
              <div>{formatarValor(proposta.valorTotal)}</div>
              <div>
                <span className={`status-badge ${proposta.status}`}>
                  {proposta.status === "aprovada"
                    ? "Aprovada"
                    : proposta.status === "recusada"
                    ? "Recusada"
                    : "Pendente"}
                </span>
              </div>
              <div className="actions">
                <button
                  className="btn-view"
                  title="Visualizar proposta"
                  onClick={() => handleViewProposta(proposta)}
                >
                  <FaFilePdf />
                </button>
                <button
                  className="btn-share"
                  title="Compartilhar proposta"
                  onClick={() => handleShareProposta(proposta)}
                >
                  <FaShareAlt />
                </button>
                <button
                  className="btn-edit"
                  title="Editar proposta"
                  onClick={() => handleEditProposta(proposta)}
                >
                  <FaEdit />
                </button>
                {proposta.status === "pendente" && (
                  <>
                    <button
                      className="btn-approve"
                      title="Aprovar proposta"
                      onClick={() => handleStatusChange(proposta, "aprovada")}
                    >
                      <FaCheck />
                    </button>
                    <button
                      className="btn-reject"
                      title="Recusar proposta"
                      onClick={() => handleStatusChange(proposta, "recusada")}
                    >
                      <FaTimes />
                    </button>
                  </>
                )}
                {proposta.status === "aprovada" && !proposta.contratoGerado && (
                  <button
                    className="btn-contract"
                    title="Gerar contrato"
                    onClick={() => handleGerarContrato(proposta)}
                  >
                    <FaFileExport />
                  </button>
                )}
                <button
                  className="btn-delete"
                  title="Excluir proposta"
                  onClick={() => handleDeleteProposta(proposta.id)}
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
          <div className="modal-content modal-lg">
            <div className="modal-header">
              <h2>{editingProposta ? "Editar Proposta" : "Nova Proposta"}</h2>
              <button
                className="close-button"
                onClick={() => {
                  setShowForm(false);
                  setEditingProposta(null);
                  setItens([
                    {
                      id: Date.now(),
                      descricao: "",
                      quantidade: 1,
                      valorUnitario: 0,
                    },
                  ]);
                }}
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSaveProposta}>
              <div className="form-section">
                <h3>Informações Gerais</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Origem</label>
                    <div className="radio-group">
                      <label>
                        <input
                          type="radio"
                          name="origem"
                          value="cliente"
                          checked={origem === "cliente"}
                          onChange={() => setOrigem("cliente")}
                        />
                        Cliente
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="origem"
                          value="lead"
                          checked={origem === "lead"}
                          onChange={() => setOrigem("lead")}
                        />
                        Lead
                      </label>
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="pessoaId">
                      {origem === "cliente" ? "Cliente" : "Lead"}
                    </label>
                    <select
                      id="pessoaId"
                      name="pessoaId"
                      defaultValue={editingProposta?.clienteId || ""}
                      required
                    >
                      <option value="">
                        Selecione um {origem === "cliente" ? "cliente" : "lead"}
                      </option>
                      {(origem === "cliente" ? clientes : leads).map(
                        (pessoa) => {
                          console.log(
                            `Opção: ${pessoa.nome}, ID: ${
                              pessoa.id
                            }, Tipo ID: ${typeof pessoa.id}`
                          );
                          return (
                            <option key={pessoa.id} value={pessoa.id}>
                              {pessoa.nome} - {pessoa.empresa}
                            </option>
                          );
                        }
                      )}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="data">Data da Proposta</label>
                    <input
                      type="date"
                      id="data"
                      name="data"
                      defaultValue={
                        editingProposta?.data ||
                        new Date().toISOString().split("T")[0]
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="validade">Validade</label>
                    <input
                      type="date"
                      id="validade"
                      name="validade"
                      defaultValue={editingProposta?.validade || ""}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select
                      id="status"
                      name="status"
                      defaultValue={editingProposta?.status || "pendente"}
                    >
                      <option value="pendente">Pendente</option>
                      <option value="aprovada">Aprovada</option>
                      <option value="recusada">Recusada</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Itens da Proposta</h3>
                <div className="itens-list">
                  {itens.map((item, index) => (
                    <div className="item-row" key={index}>
                      <div className="form-group item-descricao">
                        <label>Descrição</label>
                        <input
                          type="text"
                          value={item.descricao}
                          onChange={(e) =>
                            handleItemChange(index, "descricao", e.target.value)
                          }
                          placeholder="Digite a descrição do item"
                        />
                      </div>
                      <div className="form-group item-quantidade">
                        <label>Qtd</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantidade}
                          onChange={(e) => {
                            const valor = e.target.value
                              ? parseInt(e.target.value)
                              : 1;
                            handleItemChange(index, "quantidade", valor);
                          }}
                        />
                      </div>
                      <div className="form-group item-valor">
                        <label>Valor Un.</label>
                        <div className="input-valor-container">
                          <span className="input-valor-prefix">R$</span>
                          <input
                            type="text"
                            value={
                              item.valorUnitario !== undefined
                                ? Number(item.valorUnitario)
                                    .toFixed(2)
                                    .replace(".", ",")
                                : ""
                            }
                            onChange={(e) => {
                              const valorLimpo = e.target.value
                                .replace(/[^\d,]/g, "")
                                .replace(",", ".");
                              handleItemChange(
                                index,
                                "valorUnitario",
                                valorLimpo
                              );
                            }}
                            placeholder="0,00"
                          />
                        </div>
                      </div>
                      <div className="form-group item-total">
                        <label>Total</label>
                        <div className="valor-somente-leitura">
                          {formatarValorMonetario(
                            item.quantidade * item.valorUnitario
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn-remover-item"
                        onClick={() => handleRemoverItem(index)}
                        disabled={itens.length === 1}
                        title={
                          itens.length === 1
                            ? "Proposta deve ter pelo menos um item"
                            : "Remover item"
                        }
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="btn-adicionar-item"
                  onClick={handleAdicionarItem}
                >
                  <FaPlus /> Adicionar Item
                </button>
                <div className="total-proposta">
                  <div className="total-label">Valor Total:</div>
                  <div className="total-value">
                    {formatarValorMonetario(calcularTotal())}
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Observações e Condições</h3>
                <div className="form-group">
                  <label htmlFor="observacoes">Observações</label>
                  <textarea
                    id="observacoes"
                    name="observacoes"
                    rows="3"
                    defaultValue={editingProposta?.observacoes || ""}
                  ></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="condicoesEntrega">Condições de Entrega</label>
                  <textarea
                    id="condicoesEntrega"
                    name="condicoesEntrega"
                    rows="3"
                    defaultValue={editingProposta?.condicoesEntrega || ""}
                  ></textarea>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() => {
                    setShowForm(false);
                    setEditingProposta(null);
                  }}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-salvar">
                  {editingProposta ? "Atualizar" : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPreview && currentProposta && (
        <div className="modal">
          <div className="modal-content modal-xl">
            <div className="modal-header">
              <h2>Visualizar Proposta</h2>
              <div className="modal-actions">
                <button
                  className="btn-pdf"
                  onClick={handlePrint}
                  title="Exportar como PDF"
                >
                  <FaFilePdf /> Salvar PDF
                </button>
                <button
                  className="close-button"
                  onClick={() => setShowPreview(false)}
                >
                  <FaTimes />
                </button>
              </div>
            </div>
            <div className="proposta-preview-container">
              <PropostaPreview proposta={currentProposta} />
            </div>
          </div>
        </div>
      )}

      {showShareLink && (
        <div className="modal">
          <div className="modal-content modal-sm">
            <div className="modal-header">
              <h2>Compartilhar Proposta</h2>
              <button
                className="close-button"
                onClick={() => setShowShareLink(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="share-link-container">
              <p>
                Compartilhe este link com o cliente para visualizar a proposta:
              </p>
              <div className="link-input-group">
                <input
                  type="text"
                  value={currentShareUrl}
                  readOnly
                  className="share-link-input"
                />
                <button
                  className="btn-copy"
                  onClick={handleCopyLink}
                  title="Copiar link"
                >
                  <FaCopy />
                  {linkCopiado ? "Copiado!" : "Copiar"}
                </button>
              </div>
              <div className="share-info">
                <p>
                  <small>
                    O cliente poderá visualizar, baixar, aceitar ou declinar a
                    proposta. O link contém o nome do cliente e o código da
                    proposta.
                  </small>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Propostas;
