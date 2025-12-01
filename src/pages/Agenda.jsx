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
  const [historico, setHistorico] = useState([]);
  const [abaAtiva, setAbaAtiva] = useState("calendario"); // calendario ou historico
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [modoVisualizacao, setModoVisualizacao] = useState("lista");
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth());
  const [anoSelecionado, setAnoSelecionado] = useState(
    new Date().getFullYear()
  );
  const [termoBusca, setTermoBusca] = useState("");
  const [eventosFiltrados, setEventosFiltrados] = useState([]);

  // Carregar dados reais do sistema
  useEffect(() => {
    carregarEventos();
    carregarHistorico();
  }, []);

  // Função para carregar os eventos (simulados e reais)
  const carregarEventos = () => {
    try {
      let proximoId = 1;
      let todosEventos = [];

      // 1. Carregar propostas reais
      const propostasStr = localStorage.getItem("propostas");
      if (propostasStr) {
        const propostas = JSON.parse(propostasStr);
        if (Array.isArray(propostas) && propostas.length > 0) {
          const eventosPropostas = propostas.map((proposta) => ({
            id: proximoId++,
            tipo: "proposta",
            titulo: "Validade de proposta",
            descricao: `${proposta.numero} - ${proposta.cliente.nome} (${proposta.cliente.empresa})`,
            data: proposta.dataValidade,
            status:
              proposta.status === "aprovada"
                ? "concluido"
                : proposta.status === "recusada"
                ? "atrasado"
                : "pendente",
            link: "/propostas",
            icone: <FaFileSignature />,
            isReal: true,
          }));
          todosEventos = todosEventos.concat(eventosPropostas);
        }
      }

      // 2. Carregar pagamentos reais
      const pagamentosStr = localStorage.getItem("pagamentos");
      if (pagamentosStr) {
        const pagamentos = JSON.parse(pagamentosStr);
        if (Array.isArray(pagamentos) && pagamentos.length > 0) {
          const eventosPagamentos = pagamentos.map((pagamento) => ({
            id: proximoId++,
            tipo: "pagamento",
            titulo: "Pagamento de contrato",
            descricao: pagamento.contrato,
            data: pagamento.dataVencimento,
            status:
              pagamento.status === "pago"
                ? "concluido"
                : new Date(pagamento.dataVencimento) < new Date()
                ? "atrasado"
                : "pendente",
            valor: pagamento.valor,
            link: "/pagamentos",
            icone: <FaFileInvoiceDollar />,
            isReal: true,
          }));
          todosEventos = todosEventos.concat(eventosPagamentos);
        }
      }

      // 3. Verificar leads para follow-up
      const leadsStr = localStorage.getItem("leads");
      if (leadsStr) {
        const leads = JSON.parse(leadsStr);
        if (Array.isArray(leads) && leads.length > 0) {
          // Encontrar Marco Fernandes ou outro lead qualificado
          const lead =
            leads.find(
              (l) => l.nome === "Marco Fernandes" && l.empresa === "Iron House"
            ) || leads.find((l) => l.status === "qualificado");

          if (lead) {
            const eventoLead = {
              id: proximoId++,
              tipo: "reuniao",
              titulo: "Follow-up com lead",
              descricao: `${lead.nome} - ${lead.empresa}`,
              data: lead.proximoFollowup || "2025-03-27",
              hora: "10:00",
              status: "pendente",
              link: "/leads",
              icone: <FaUserFriends />,
              isReal: true,
            };
            todosEventos.push(eventoLead);
          }
        }
      }

      // 4. Adicionar a proposta de exemplo do Marco (Startup XYZ) para demonstração
      const propostaMarco = {
        id: proximoId++,
        tipo: "proposta",
        titulo: "Validade de proposta",
        descricao: "PROP-2025-004 - Marco (Startup XYZ)",
        data: "2025-03-26",
        status: "pendente",
        link: "/propostas",
        icone: <FaFileSignature />,
        isDemo: true, // Marcado como demonstração, não como dado real
      };
      todosEventos.push(propostaMarco);

      // Definir estado com eventos
      setEventos(todosEventos);
      setEventosFiltrados(todosEventos);
    } catch (error) {
      // Em caso de erro, use dados de exemplo
      const proximoId = 1;

      // Lead de Marco Fernandes
      const leadMarco = {
        id: proximoId,
        tipo: "reuniao",
        titulo: "Follow-up com lead",
        descricao: "Marco Fernandes - Iron House",
        data: "2025-03-27",
        hora: "10:00",
        status: "pendente",
        link: "/leads",
        icone: <FaUserFriends />,
        isReal: true,
      };

      // Proposta de exemplo do Marco (Startup XYZ)
      const propostaMarco = {
        id: proximoId + 1,
        tipo: "proposta",
        titulo: "Validade de proposta",
        descricao: "PROP-2025-004 - Marco (Startup XYZ)",
        data: "2025-03-26",
        status: "pendente",
        link: "/propostas",
        icone: <FaFileSignature />,
        isDemo: true,
      };

      setEventos([leadMarco, propostaMarco]);
      setEventosFiltrados([leadMarco, propostaMarco]);
    }
  };

  // Função para carregar histórico de atividades
  const carregarHistorico = () => {
    try {
      let atividades = [];
      let idAtividade = 1;

      // Carregar leads criados
      const leadsStr = localStorage.getItem("leads");
      if (leadsStr) {
        const leads = JSON.parse(leadsStr);
        leads.forEach(lead => {
          atividades.push({
            id: idAtividade++,
            tipo: "lead_criado",
            icone: "👤",
            titulo: "Lead criado",
            descricao: `${lead.nome} - ${lead.empresa || 'Sem empresa'}`,
            data: new Date(lead.dataCriacao || Date.now()),
            cor: "#3b82f6"
          });
        });
      }

      // Carregar clientes criados
      const clientesStr = localStorage.getItem("clientes");
      if (clientesStr) {
        const clientes = JSON.parse(clientesStr);
        clientes.forEach(cliente => {
          atividades.push({
            id: idAtividade++,
            tipo: "cliente_criado",
            icone: "✅",
            titulo: "Cliente convertido",
            descricao: `${cliente.nome} - ${cliente.empresa || cliente.email}`,
            data: new Date(cliente.dataCadastro || Date.now()),
            cor: "#10b981"
          });
        });
      }

      // Carregar propostas enviadas
      const propostasStr = localStorage.getItem("propostas");
      if (propostasStr) {
        const propostas = JSON.parse(propostasStr);
        propostas.forEach(proposta => {
          atividades.push({
            id: idAtividade++,
            tipo: "proposta_enviada",
            icone: "📄",
            titulo: "Proposta enviada",
            descricao: `${proposta.numero} para ${proposta.cliente?.nome}`,
            data: new Date(proposta.dataCriacao || Date.now()),
            cor: "#8b5cf6"
          });
        });
      }

      // Ordenar por data (mais recente primeiro)
      atividades.sort((a, b) => b.data - a.data);

      setHistorico(atividades);
    } catch (error) {
      setHistorico([]);
    }
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

  const formatarDataHora = (data) => {
    if (!data) return "";
    const d = new Date(data);
    return d.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const tempoRelativo = (data) => {
    const agora = new Date();
    const diff = agora - new Date(data);
    const minutos = Math.floor(diff / 60000);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (dias > 0) return `Há ${dias} dia${dias > 1 ? 's' : ''}`;
    if (horas > 0) return `Há ${horas} hora${horas > 1 ? 's' : ''}`;
    if (minutos > 0) return `Há ${minutos} minuto${minutos > 1 ? 's' : ''}`;
    return 'Agora mesmo';
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
  useEffect(() => {
    const filtrados = eventos.filter((evento) => {
      // Filtrar por tipo
      const matchTipo = filtroTipo === "todos" || evento.tipo === filtroTipo;

      // Filtrar por termo de busca
      const matchBusca =
        termoBusca === "" ||
        evento.titulo.toLowerCase().includes(termoBusca.toLowerCase()) ||
        evento.descricao.toLowerCase().includes(termoBusca.toLowerCase());

      return matchTipo && matchBusca;
    });

    setEventosFiltrados(filtrados);
  }, [eventos, filtroTipo, termoBusca]);

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
        <div className="abas-toggle">
          <button
            className={`aba-button ${abaAtiva === "calendario" ? "active" : ""}`}
            onClick={() => setAbaAtiva("calendario")}
          >
            📅 Calendário
          </button>
          <button
            className={`aba-button ${abaAtiva === "historico" ? "active" : ""}`}
            onClick={() => setAbaAtiva("historico")}
          >
            📜 Histórico
          </button>
        </div>
      </div>

      {abaAtiva === "calendario" && (
      <>
      <div className="agenda-subheader">
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
      </>
      )}

      {abaAtiva === "historico" && (
        <div className="historico-container">
          <div className="historico-header">
            <h2>Histórico de Atividades</h2>
            <p>Todas as ações realizadas no CRM</p>
          </div>
          <div className="historico-timeline">
            {historico.length > 0 ? (
              historico.map(atividade => (
                <div key={atividade.id} className="historico-item">
                  <div className="historico-icone" style={{ backgroundColor: atividade.cor }}>
                    {atividade.icone}
                  </div>
                  <div className="historico-content">
                    <div className="historico-titulo">{atividade.titulo}</div>
                    <div className="historico-descricao">{atividade.descricao}</div>
                    <div className="historico-data">
                      {tempoRelativo(atividade.data)} • {formatarDataHora(atividade.data)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="historico-vazio">
                <p>Nenhuma atividade registrada ainda</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Agenda;
