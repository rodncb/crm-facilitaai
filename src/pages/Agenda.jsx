import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaCalendarAlt,
  FaFileInvoiceDollar,
  FaUserFriends,
  FaFilter,
  FaFileContract,
  FaFileSignature,
} from "react-icons/fa";
import "./Agenda.css";

const Agenda = () => {
  const [eventos, setEventos] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [modoVisualizacao, setModoVisualizacao] = useState("lista");
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth());
  const [anoSelecionado, setAnoSelecionado] = useState(
    new Date().getFullYear()
  );
  const [termoBusca, setTermoBusca] = useState("");

  // Carregar dados reais do sistema
  useEffect(() => {
    carregarEventos();
  }, []);

  // Função para carregar eventos de todas as fontes
  const carregarEventos = () => {
    try {
      // Iniciar com array vazio
      let todosEventos = [];
      let proximoId = 1;

      // Adicionar a proposta real do Marco
      const propostaMarco = {
        id: proximoId++,
        tipo: "proposta",
        titulo: "Validade de proposta",
        descricao: "PROP-2025-004 - Marco (Startup XYZ)",
        data: "2025-03-27", // Data de validade da proposta
        status: "pendente",
        link: "/propostas",
        icone: <FaFileSignature />,
        isReal: true, // Flag para identificar dados reais
      };

      todosEventos.push(propostaMarco);

      // 1. Carregar pagamentos simulados para demonstração
      const pagamentosDemonstracao = [
        {
          id: proximoId++,
          tipo: "pagamento",
          titulo: "Pagamento de contrato",
          descricao: "CONT-230401-123 - João Silva (TechCorp)",
          data: "2025-04-15",
          status: "pendente",
          valorAssociado: "R$ 1.500,00",
          link: "/pagamentos",
          icone: <FaFileInvoiceDollar />,
          isDemo: true,
        },
        {
          id: proximoId++,
          tipo: "pagamento",
          titulo: "Pagamento de contrato",
          descricao: "CONT-230402-456 - Maria Santos (Inovação Ltda)",
          data: "2025-05-30",
          status: "atrasado",
          valorAssociado: "R$ 3.000,00",
          link: "/pagamentos",
          icone: <FaFileInvoiceDollar />,
          isDemo: true,
        },
      ];

      // 2. Adicionar reuniões simuladas para demonstração
      const reunioesDemonstracao = [
        {
          id: proximoId++,
          tipo: "reuniao",
          titulo: "Follow-up com lead",
          descricao: "Leandro Marques - Anahata Home",
          data: "2025-03-28",
          hora: "10:00",
          status: "pendente",
          link: "/leads",
          icone: <FaUserFriends />,
          isDemo: true,
        },
        {
          id: proximoId++,
          tipo: "reuniao",
          titulo: "Reunião com cliente",
          descricao: "João Silva - TechCorp",
          data: "2025-03-30",
          hora: "14:30",
          status: "pendente",
          link: "/clientes",
          icone: <FaUserFriends />,
          isDemo: true,
        },
      ];

      // 3. Adicionar contratos simulados para demonstração
      const contratosDemonstracao = [
        {
          id: proximoId++,
          tipo: "contrato",
          titulo: "Vencimento de contrato",
          descricao: "CONT-230401-123 - João Silva (TechCorp)",
          data: "2025-09-30",
          status: "pendente",
          link: "/contratos",
          icone: <FaFileContract />,
          isDemo: true,
        },
      ];

      // Adicionar todos os eventos de demonstração à lista
      todosEventos = todosEventos.concat(
        pagamentosDemonstracao,
        reunioesDemonstracao,
        contratosDemonstracao
      );

      // Verificar se há o filtro especial para mostrar apenas dados reais
      // (pode ser ativado depois, se necessário)
      const mostrarApenasReais = false;
      if (mostrarApenasReais) {
        todosEventos = todosEventos.filter((evento) => evento.isReal === true);
      }

      setEventos(todosEventos);
      console.log("Eventos carregados:", todosEventos);
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
      // Em caso de erro, usar dados de exemplo
      setEventos(gerarEventosExemplo());
    }
  };

  // Verificar status do evento baseado na data
  const verificarStatusEvento = (dataStr, statusOriginal = null) => {
    // Se já tiver um status definido como "concluído" ou "aprovado", manter
    if (statusOriginal === "aprovada" || statusOriginal === "pago") {
      return "concluido";
    }

    // Se já tiver status definido como "recusada", manter como "atrasado"
    if (statusOriginal === "recusada") {
      return "atrasado";
    }

    const hoje = new Date();
    const data = new Date(dataStr);

    // Se a data for anterior a hoje, está atrasado
    if (data < hoje) {
      return "atrasado";
    }

    // Se for dentro dos próximos 7 dias, é pendente
    const seteDiasDepois = new Date(hoje);
    seteDiasDepois.setDate(hoje.getDate() + 7);

    if (data <= seteDiasDepois) {
      return "pendente";
    }

    // Se for mais que 7 dias no futuro, também é pendente (mas poderia ser outro status)
    return "pendente";
  };

  // Função para gerar eventos de exemplo como fallback
  const gerarEventosExemplo = () => {
    const dataAtual = new Date();
    const ano = dataAtual.getFullYear();
    const mes = dataAtual.getMonth();

    return [
      {
        id: 1,
        tipo: "pagamento",
        titulo: "Pagamento de contrato",
        descricao: "CONT-230401-123 - João Silva (TechCorp)",
        data: `${ano}-${String(mes + 1).padStart(2, "0")}-15`,
        status: "pendente",
        valorAssociado: "R$ 1.500,00",
        link: "/pagamentos",
        icone: <FaFileInvoiceDollar />,
      },
      {
        id: 2,
        tipo: "reuniao",
        titulo: "Follow-up com cliente",
        descricao: "Maria Santos - Inovação Ltda",
        data: `${ano}-${String(mes + 1).padStart(2, "0")}-20`,
        hora: "15:45",
        status: "pendente",
        link: "/clientes",
        icone: <FaUserFriends />,
      },
      {
        id: 3,
        tipo: "contrato",
        titulo: "Vencimento de contrato",
        descricao: "CONT-230401-123 - João Silva (TechCorp)",
        data: `${ano}-${String(mes + 2).padStart(2, "0")}-10`,
        status: "pendente",
        link: "/contratos",
        icone: <FaFileContract />,
      },
    ];
  };

  const formatarData = (dataStr) => {
    if (!dataStr) return "";
    const data = new Date(dataStr);
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "concluido":
        return "status-concluido";
      case "pendente":
        return "status-pendente";
      case "atrasado":
        return "status-atrasado";
      default:
        return "";
    }
  };

  // Filtrar eventos por tipo e termo de busca
  const eventosFiltrados = eventos.filter((evento) => {
    // Filtrar por tipo
    const matchTipo = filtroTipo === "todos" || evento.tipo === filtroTipo;

    // Filtrar por termo de busca
    const matchBusca =
      termoBusca === "" ||
      evento.titulo.toLowerCase().includes(termoBusca.toLowerCase()) ||
      evento.descricao.toLowerCase().includes(termoBusca.toLowerCase());

    return matchTipo && matchBusca;
  });

  // Ordenar eventos por data
  const eventosOrdenados = [...eventosFiltrados].sort((a, b) => {
    const dataA = new Date(a.data + (a.hora ? "T" + a.hora : ""));
    const dataB = new Date(b.data + (b.hora ? "T" + b.hora : ""));
    return dataA - dataB;
  });

  // Funções para navegação do calendário
  const proximoMes = () => {
    if (mesSelecionado === 11) {
      setMesSelecionado(0);
      setAnoSelecionado(anoSelecionado + 1);
    } else {
      setMesSelecionado(mesSelecionado + 1);
    }
  };

  const mesPrevio = () => {
    if (mesSelecionado === 0) {
      setMesSelecionado(11);
      setAnoSelecionado(anoSelecionado - 1);
    } else {
      setMesSelecionado(mesSelecionado - 1);
    }
  };

  // Gerar calendário
  const gerarCalendario = () => {
    const diasNoMes = new Date(anoSelecionado, mesSelecionado + 1, 0).getDate();
    const primeiroDia = new Date(anoSelecionado, mesSelecionado, 1).getDay();

    const dias = [];
    // Preencher com espaços vazios para alinhar com o dia da semana
    for (let i = 0; i < primeiroDia; i++) {
      dias.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Preencher os dias do mês
    for (let dia = 1; dia <= diasNoMes; dia++) {
      const data = `${anoSelecionado}-${String(mesSelecionado + 1).padStart(
        2,
        "0"
      )}-${String(dia).padStart(2, "0")}`;
      const eventosNoDia = eventos.filter((evento) => evento.data === data);

      dias.push(
        <div
          key={`day-${dia}`}
          className={`calendar-day ${
            eventosNoDia.length > 0 ? "has-events" : ""
          } ${data === new Date().toISOString().split("T")[0] ? "today" : ""}`}
        >
          <div className="calendar-day-number">{dia}</div>
          {eventosNoDia.length > 0 && (
            <div className="calendar-day-events">
              {eventosNoDia.slice(0, 2).map((evento) => (
                <div
                  key={`event-${evento.id}`}
                  className={`calendar-event ${getStatusClass(evento.status)}`}
                  title={`${evento.titulo}: ${evento.descricao}`}
                >
                  <span className="event-icon">{evento.icone}</span>
                  <span className="event-title">{evento.tipo}</span>
                </div>
              ))}
              {eventosNoDia.length > 2 && (
                <div className="more-events">+{eventosNoDia.length - 2}</div>
              )}
            </div>
          )}
        </div>
      );
    }

    return dias;
  };

  const nomesMeses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  return (
    <div className="agenda-container">
      <div className="agenda-header">
        <h1>Agenda</h1>
        <div className="visualizacao-toggle">
          <button
            className={`view-button ${
              modoVisualizacao === "lista" ? "active" : ""
            }`}
            onClick={() => setModoVisualizacao("lista")}
          >
            Lista
          </button>
          <button
            className={`view-button ${
              modoVisualizacao === "calendario" ? "active" : ""
            }`}
            onClick={() => setModoVisualizacao("calendario")}
          >
            Calendário
          </button>
        </div>
      </div>

      <div className="agenda-actions">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar eventos..."
            className="search-input"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
          />
        </div>
        <div className="filtro-tipo">
          <FaFilter />
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
          >
            <option value="todos">Todos os eventos</option>
            <option value="pagamento">Pagamentos</option>
            <option value="reuniao">Reuniões</option>
            <option value="contrato">Contratos</option>
            <option value="proposta">Propostas</option>
          </select>
        </div>
      </div>

      {modoVisualizacao === "lista" ? (
        <div className="eventos-lista">
          {eventosOrdenados.length === 0 ? (
            <div className="empty-state">
              Nenhum evento encontrado. Crie novos eventos nos módulos de
              Pagamentos, Contratos, Propostas ou Leads.
            </div>
          ) : (
            eventosOrdenados.map((evento) => (
              <div
                key={evento.id}
                className={`evento-card ${getStatusClass(evento.status)}`}
              >
                <div className="evento-icon">{evento.icone}</div>
                <div className="evento-content">
                  <div className="evento-header">
                    <h3>{evento.titulo}</h3>
                    <div className="evento-data">
                      {formatarData(evento.data)}
                      {evento.hora && ` - ${evento.hora}`}
                    </div>
                  </div>
                  <div className="evento-descricao">{evento.descricao}</div>
                  {evento.valorAssociado && (
                    <div className="evento-valor">
                      Valor: {evento.valorAssociado}
                    </div>
                  )}
                </div>
                <div className="evento-status">
                  <span className={`status-badge ${evento.status}`}>
                    {evento.status === "concluido"
                      ? "Concluído"
                      : evento.status === "atrasado"
                      ? "Atrasado"
                      : "Pendente"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="agenda-calendario">
          <div className="calendario-header">
            <button className="mes-anterior" onClick={mesPrevio}>
              &lt;
            </button>
            <h2>
              {nomesMeses[mesSelecionado]} {anoSelecionado}
            </h2>
            <button className="proximo-mes" onClick={proximoMes}>
              &gt;
            </button>
          </div>
          <div className="dias-semana">
            <div>Dom</div>
            <div>Seg</div>
            <div>Ter</div>
            <div>Qua</div>
            <div>Qui</div>
            <div>Sex</div>
            <div>Sáb</div>
          </div>
          <div className="calendario-grid">{gerarCalendario()}</div>
        </div>
      )}
    </div>
  );
};

export default Agenda;
