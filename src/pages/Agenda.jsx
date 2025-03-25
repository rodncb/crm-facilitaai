import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaCalendarAlt,
  FaFileInvoiceDollar,
  FaUserFriends,
  FaFilter,
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

  // Simula dados de várias partes do sistema
  useEffect(() => {
    // Dados fictícios para demonstração
    const mockEventos = [
      // Eventos de pagamento
      {
        id: 1,
        tipo: "pagamento",
        titulo: "Pagamento de contrato",
        descricao: "CONT-230401-123 - João Silva (TechCorp)",
        data: "2023-06-15",
        status: "concluido",
        valorAssociado: "R$ 1.500,00",
        link: "/pagamentos",
        icone: <FaFileInvoiceDollar />,
      },
      {
        id: 2,
        tipo: "pagamento",
        titulo: "Pagamento de contrato",
        descricao: "CONT-230401-123 - João Silva (TechCorp)",
        data: "2023-07-15",
        status: "pendente",
        valorAssociado: "R$ 1.500,00",
        link: "/pagamentos",
        icone: <FaFileInvoiceDollar />,
      },
      {
        id: 3,
        tipo: "pagamento",
        titulo: "Pagamento de contrato",
        descricao: "CONT-230402-456 - Maria Santos (Inovação Ltda)",
        data: "2023-05-30",
        status: "atrasado",
        valorAssociado: "R$ 3.000,00",
        link: "/pagamentos",
        icone: <FaFileInvoiceDollar />,
      },
      {
        id: 4,
        tipo: "pagamento",
        titulo: "Pagamento de contrato",
        descricao: "CONT-230403-789 - Pedro Oliveira (ConsultaTech)",
        data: "2023-08-10",
        status: "pendente",
        valorAssociado: "R$ 2.500,00",
        link: "/pagamentos",
        icone: <FaFileInvoiceDollar />,
      },

      // Eventos de reunião com leads/clientes
      {
        id: 5,
        tipo: "reuniao",
        titulo: "Reunião com cliente",
        descricao: "João Silva - TechCorp",
        data: "2023-06-20",
        hora: "14:30",
        status: "pendente",
        link: "/clientes",
        icone: <FaUserFriends />,
      },
      {
        id: 6,
        tipo: "reuniao",
        titulo: "Apresentação para lead",
        descricao: "Carlos Mendes - Startup XYZ",
        data: "2023-06-18",
        hora: "10:00",
        status: "pendente",
        link: "/leads",
        icone: <FaUserFriends />,
      },
      {
        id: 7,
        tipo: "reuniao",
        titulo: "Follow-up com cliente",
        descricao: "Maria Santos - Inovação Ltda",
        data: "2023-06-10",
        hora: "15:45",
        status: "concluido",
        link: "/clientes",
        icone: <FaUserFriends />,
      },

      // Eventos de vencimento de contrato
      {
        id: 8,
        tipo: "contrato",
        titulo: "Vencimento de contrato",
        descricao: "CONT-230401-123 - João Silva (TechCorp)",
        data: "2023-09-30",
        status: "pendente",
        link: "/contratos",
        icone: <FaCalendarAlt />,
      },
      {
        id: 9,
        tipo: "contrato",
        titulo: "Renovação de contrato",
        descricao: "CONT-230402-456 - Maria Santos (Inovação Ltda)",
        data: "2023-07-25",
        status: "pendente",
        link: "/contratos",
        icone: <FaCalendarAlt />,
      },
    ];

    setEventos(mockEventos);
  }, []);

  // Formatar data para exibição
  const formatarData = (dataStr) => {
    const data = new Date(dataStr);
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Gerar classe CSS baseada no status
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

  // Filtrar eventos por tipo
  const eventosFiltrados = eventos.filter((evento) => {
    if (filtroTipo === "todos") {
      return true;
    }
    return evento.tipo === filtroTipo;
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
              {eventosNoDia.map((evento) => (
                <div
                  key={`event-${evento.id}`}
                  className={`calendar-event ${getStatusClass(evento.status)}`}
                  title={`${evento.titulo}: ${evento.descricao}`}
                >
                  <span className="event-icon">{evento.icone}</span>
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
          </select>
        </div>
      </div>

      {modoVisualizacao === "lista" ? (
        <div className="eventos-lista">
          {eventosOrdenados.length === 0 ? (
            <div className="empty-state">
              Nenhum evento encontrado. Crie novos eventos nos módulos de
              Pagamentos, Contratos ou Leads.
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
