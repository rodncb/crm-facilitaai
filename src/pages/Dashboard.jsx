import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaUserPlus,
  FaChartLine,
  FaCalendarCheck,
  FaFileContract,
} from "react-icons/fa";
import "./Dashboard.css";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalClientes: 0,
    novosClientes: 0,
    totalLeads: 0,
    novosLeads: 0,
    taxaConversao: 0,
    eventosAgendados: 0,
    propostas: 0,
    propostasPendentes: 0,
    propostasAprovadas: 0,
    leadsOrigem: {},
    leadsStatus: {},
    atividadesRecentes: [],
  });

  useEffect(() => {
    carregarDadosDashboard();
  }, []);

  const carregarDadosDashboard = () => {
    try {
      // Carregando dados do localStorage
      const clientes = JSON.parse(localStorage.getItem("clientes") || "[]");
      const leads = JSON.parse(localStorage.getItem("leads") || "[]");
      const propostas = JSON.parse(localStorage.getItem("propostas") || "[]");
      const eventos = JSON.parse(localStorage.getItem("eventos") || "[]");

      // Calculando métricas
      const dataAtual = new Date();
      const primeiroDiaMes = new Date(
        dataAtual.getFullYear(),
        dataAtual.getMonth(),
        1
      );

      // Contagem de clientes
      const totalClientes = clientes.length;
      const novosClientes = clientes.filter(
        (cliente) => new Date(cliente.dataCadastro) >= primeiroDiaMes
      ).length;

      // Contagem de leads
      const totalLeads = leads.length;
      const novosLeads = leads.filter(
        (lead) => new Date(lead.dataCadastro) >= primeiroDiaMes
      ).length;

      // Taxa de conversão (leads para clientes)
      const taxaConversao =
        totalLeads > 0 ? Math.round((totalClientes / totalLeads) * 100) : 0;

      // Contagem de eventos agendados
      const eventosAgendados = eventos.length;

      // Contagem de propostas
      const totalPropostas = propostas.length;
      const propostasPendentes = propostas.filter(
        (p) => p.status === "pendente"
      ).length;
      const propostasAprovadas = propostas.filter(
        (p) => p.status === "aprovada"
      ).length;

      // Distribuição de leads por origem
      const leadsOrigem = {};
      leads.forEach((lead) => {
        const origem = lead.origem || "Desconhecido";
        leadsOrigem[origem] = (leadsOrigem[origem] || 0) + 1;
      });

      // Distribuição de leads por status
      const leadsStatus = {};
      leads.forEach((lead) => {
        const status = lead.status || "Novo";
        leadsStatus[status] = (leadsStatus[status] || 0) + 1;
      });

      // Atividades recentes (combinando leads, clientes e propostas recentes)
      let atividades = [];

      // Adicionar leads recentes (últimos 10 dias)
      const dezDiasAtras = new Date(dataAtual);
      dezDiasAtras.setDate(dataAtual.getDate() - 10);

      leads
        .filter((lead) => new Date(lead.dataCadastro) >= dezDiasAtras)
        .forEach((lead) => {
          atividades.push({
            tipo: "lead",
            titulo: "Novo Lead Cadastrado",
            descricao: `${lead.empresa || ""} - ${lead.nome}`,
            data: new Date(lead.dataCadastro || Date.now()),
          });
        });

      // Adicionar clientes recentes
      clientes
        .filter((cliente) => new Date(cliente.dataCadastro) >= dezDiasAtras)
        .forEach((cliente) => {
          atividades.push({
            tipo: "cliente",
            titulo: "Novo Cliente Cadastrado",
            descricao: `${cliente.empresa || ""} - ${cliente.nome}`,
            data: new Date(cliente.dataCadastro || Date.now()),
          });
        });

      // Adicionar propostas recentes
      propostas
        .filter((proposta) => new Date(proposta.data) >= dezDiasAtras)
        .forEach((proposta) => {
          atividades.push({
            tipo: "proposta",
            titulo: "Nova Proposta Criada",
            descricao: `${proposta.numero} - ${proposta.cliente || "Cliente"}`,
            data: new Date(proposta.data || Date.now()),
          });
        });

      // Ordenar atividades por data (mais recentes primeiro)
      atividades.sort((a, b) => b.data - a.data);

      // Pegar apenas as 5 mais recentes
      atividades = atividades.slice(0, 5);

      // Atualizar estado com todos os dados calculados
      setDashboardData({
        totalClientes,
        novosClientes,
        totalLeads,
        novosLeads,
        taxaConversao,
        eventosAgendados,
        propostas: totalPropostas,
        propostasPendentes,
        propostasAprovadas,
        leadsOrigem,
        leadsStatus,
        atividadesRecentes: atividades,
      });
    } catch (error) {
      // Erro ao carregar dados do dashboard
    }
  };

  // Calcular percentual de crescimento (para simulação)
  const calcularCrescimento = (valor) => {
    // Simulando crescimento baseado no valor
    return `+${Math.round(valor > 0 ? (1 / valor) * 100 : 20)}% este mês`;
  };

  // Formatação de tempo relativo para atividades
  const formatarTempoRelativo = (data) => {
    const agora = new Date();
    const diff = agora - data;

    const minutos = Math.floor(diff / 60000);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (dias > 0) return `Há ${dias} ${dias === 1 ? "dia" : "dias"}`;
    if (horas > 0) return `Há ${horas} ${horas === 1 ? "hora" : "horas"}`;
    if (minutos > 0)
      return `Há ${minutos} ${minutos === 1 ? "minuto" : "minutos"}`;
    return "Agora mesmo";
  };

  // Transformar dados de origem em percentuais para exibição
  const calcularPercentuais = (dados) => {
    const total = Object.values(dados).reduce((acc, val) => acc + val, 0);
    const resultado = {};

    for (const [chave, valor] of Object.entries(dados)) {
      resultado[chave] = {
        valor,
        percentual: total > 0 ? Math.round((valor / total) * 100) : 0,
      };
    }

    return resultado;
  };

  // Mapear cores para gráficos
  const cores = {
    principal: [
      "#4CAF50",
      "#2196F3",
      "#FFC107",
      "#FF5722",
      "#9C27B0",
      "#607D8B",
    ],
    status: {
      Novo: "#2196F3",
      Contatado: "#FFC107",
      Qualificado: "#4CAF50",
      Desqualificado: "#F44336",
    },
    origem: {
      Site: "#2196F3",
      Indicação: "#4CAF50",
      LinkedIn: "#FFC107",
      Evento: "#FF5722",
      Desconhecido: "#607D8B",
    },
  };

  // Processar dados de origem para exibição
  const origensProcessadas = calcularPercentuais(dashboardData.leadsOrigem);
  const statusProcessados = calcularPercentuais(dashboardData.leadsStatus);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon clients">
            <FaUsers />
          </div>
          <div className="metric-info">
            <span className="metric-value">{dashboardData.totalClientes}</span>
            <span className="metric-label">Total de Clientes</span>
            <span className="metric-change positive">
              {calcularCrescimento(dashboardData.novosClientes)}
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon leads">
            <FaUserPlus />
          </div>
          <div className="metric-info">
            <span className="metric-value">{dashboardData.totalLeads}</span>
            <span className="metric-label">Total de Leads</span>
            <span className="metric-change positive">
              {calcularCrescimento(dashboardData.novosLeads)}
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon conversion">
            <FaChartLine />
          </div>
          <div className="metric-info">
            <span className="metric-value">{dashboardData.taxaConversao}%</span>
            <span className="metric-label">Taxa de Conversão</span>
            <span className="metric-change positive">
              +{Math.round(dashboardData.taxaConversao / 10)}% este mês
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon meetings">
            <FaFileContract />
          </div>
          <div className="metric-info">
            <span className="metric-value">{dashboardData.propostas}</span>
            <span className="metric-label">Propostas</span>
            <span className="metric-change positive">
              {calcularCrescimento(dashboardData.propostas)}
            </span>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Leads por Origem</h3>
          <div className="chart-content">
            <div className="chart-legend">
              {Object.keys(origensProcessadas).length > 0 ? (
                Object.entries(origensProcessadas).map(
                  ([origem, dados], index) => (
                    <div className="legend-item" key={origem}>
                      <div
                        className="legend-color"
                        style={{
                          backgroundColor:
                            cores.origem[origem] ||
                            cores.principal[index % cores.principal.length],
                        }}
                      ></div>
                      <span>
                        {origem} ({dados.percentual}%)
                      </span>
                    </div>
                  )
                )
              ) : (
                <div className="empty-data">Nenhum dado disponível</div>
              )}
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h3>Status dos Leads</h3>
          <div className="chart-content">
            <div className="chart-legend">
              {Object.keys(statusProcessados).length > 0 ? (
                Object.entries(statusProcessados).map(
                  ([status, dados], index) => (
                    <div className="legend-item" key={status}>
                      <div
                        className="legend-color"
                        style={{
                          backgroundColor:
                            cores.status[status] ||
                            cores.principal[index % cores.principal.length],
                        }}
                      ></div>
                      <span>
                        {status} ({dados.percentual}%)
                      </span>
                    </div>
                  )
                )
              ) : (
                <div className="empty-data">Nenhum dado disponível</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="activities-section">
        <h3>Atividades Recentes</h3>
        <div className="activities-list">
          {dashboardData.atividadesRecentes.length > 0 ? (
            dashboardData.atividadesRecentes.map((atividade, index) => (
              <div className="activity-item" key={index}>
                <div className="activity-dot"></div>
                <div className="activity-content">
                  <span className="activity-title">{atividade.titulo}</span>
                  <span className="activity-description">
                    {atividade.descricao}
                  </span>
                  <span className="activity-time">
                    {formatarTempoRelativo(atividade.data)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-activities">Nenhuma atividade recente</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
