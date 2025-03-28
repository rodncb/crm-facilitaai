import React, { useState } from "react";
import { FaChartBar, FaFileDownload, FaCalendarAlt } from "react-icons/fa";
import "./Relatorios.css";

const Relatorios = () => {
  const [reportType, setReportType] = useState("vendas");
  const [dateRange, setDateRange] = useState("thisMonth");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  // Dados de exemplo para os gráficos
  const vendasData = [
    { mes: "Jan", valor: 12000 },
    { mes: "Fev", valor: 15000 },
    { mes: "Mar", valor: 18000 },
    { mes: "Abr", valor: 14000 },
    { mes: "Mai", valor: 20000 },
    { mes: "Jun", valor: 22000 },
  ];

  const clientesData = [
    { mes: "Jan", total: 8 },
    { mes: "Fev", total: 12 },
    { mes: "Mar", total: 15 },
    { mes: "Abr", total: 10 },
    { mes: "Mai", total: 18 },
    { mes: "Jun", total: 20 },
  ];

  const propostasData = [
    { mes: "Jan", enviadas: 15, aceitas: 8 },
    { mes: "Fev", enviadas: 20, aceitas: 12 },
    { mes: "Mar", enviadas: 25, aceitas: 15 },
    { mes: "Abr", enviadas: 18, aceitas: 10 },
    { mes: "Mai", enviadas: 30, aceitas: 18 },
    { mes: "Jun", enviadas: 35, aceitas: 20 },
  ];

  const handleDateRangeChange = (e) => {
    setDateRange(e.target.value);
  };

  const generateReport = () => {
    alert("Relatório gerado com sucesso!");
  };

  const downloadReport = () => {
    alert("Download do relatório iniciado!");
  };

  // Calcular totais
  const calcularTotalVendas = () => {
    return vendasData.reduce((total, item) => total + item.valor, 0);
  };

  const calcularTaxaConversao = () => {
    const totalEnviadas = propostasData.reduce(
      (total, item) => total + item.enviadas,
      0
    );
    const totalAceitas = propostasData.reduce(
      (total, item) => total + item.aceitas,
      0
    );
    return totalEnviadas
      ? ((totalAceitas / totalEnviadas) * 100).toFixed(1)
      : 0;
  };

  return (
    <div className="relatorios-container">
      <h1 className="page-title">Relatórios</h1>

      <div className="report-controls card">
        <div className="form-row">
          <div className="form-group">
            <label>Tipo de Relatório</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="vendas">Vendas</option>
              <option value="clientes">Clientes</option>
              <option value="propostas">Propostas</option>
            </select>
          </div>

          <div className="form-group">
            <label>Período</label>
            <select value={dateRange} onChange={handleDateRangeChange}>
              <option value="thisMonth">Este Mês</option>
              <option value="lastMonth">Mês Passado</option>
              <option value="thisQuarter">Este Trimestre</option>
              <option value="thisYear">Este Ano</option>
              <option value="custom">Período Personalizado</option>
            </select>
          </div>

          {dateRange === "custom" && (
            <div className="custom-date-range">
              <div className="form-group">
                <label>Data Inicial</label>
                <div className="date-input-container">
                  <FaCalendarAlt className="calendar-icon" />
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Data Final</label>
                <div className="date-input-container">
                  <FaCalendarAlt className="calendar-icon" />
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="report-actions">
            <button className="btn btn-primary" onClick={generateReport}>
              <FaChartBar /> Gerar Relatório
            </button>
            <button className="btn btn-secondary" onClick={downloadReport}>
              <FaFileDownload /> Exportar
            </button>
          </div>
        </div>
      </div>

      <div className="report-summary">
        <div className="summary-card card">
          <h3>Total de Vendas</h3>
          <p className="summary-value">
            R$ {calcularTotalVendas().toLocaleString("pt-BR")}
          </p>
        </div>
        <div className="summary-card card">
          <h3>Clientes Novos</h3>
          <p className="summary-value">
            {clientesData.reduce((total, item) => total + item.total, 0)}
          </p>
        </div>
        <div className="summary-card card">
          <h3>Taxa de Conversão</h3>
          <p className="summary-value">{calcularTaxaConversao()}%</p>
        </div>
      </div>

      <div className="report-content card">
        <h2>{`Relatório de ${
          reportType === "vendas"
            ? "Vendas"
            : reportType === "clientes"
            ? "Clientes"
            : "Propostas"
        }`}</h2>

        <div className="chart-placeholder">
          <div className="chart-bar-container">
            {reportType === "vendas" &&
              vendasData.map((item, index) => (
                <div className="chart-bar-item" key={index}>
                  <div
                    className="chart-bar"
                    style={{ height: `${(item.valor / 25000) * 100}%` }}
                  >
                    <span className="chart-value">
                      R$ {item.valor.toLocaleString("pt-BR")}
                    </span>
                  </div>
                  <span className="chart-label">{item.mes}</span>
                </div>
              ))}

            {reportType === "clientes" &&
              clientesData.map((item, index) => (
                <div className="chart-bar-item" key={index}>
                  <div
                    className="chart-bar"
                    style={{ height: `${(item.total / 20) * 100}%` }}
                  >
                    <span className="chart-value">{item.total}</span>
                  </div>
                  <span className="chart-label">{item.mes}</span>
                </div>
              ))}

            {reportType === "propostas" &&
              propostasData.map((item, index) => (
                <div className="chart-bar-item" key={index}>
                  <div className="chart-bar-group">
                    <div
                      className="chart-bar sent"
                      style={{ height: `${(item.enviadas / 35) * 100}%` }}
                    >
                      <span className="chart-value">{item.enviadas}</span>
                    </div>
                    <div
                      className="chart-bar accepted"
                      style={{ height: `${(item.aceitas / 35) * 100}%` }}
                    >
                      <span className="chart-value">{item.aceitas}</span>
                    </div>
                  </div>
                  <span className="chart-label">{item.mes}</span>
                </div>
              ))}
          </div>

          {reportType === "propostas" && (
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-color sent"></span>
                <span>Enviadas</span>
              </div>
              <div className="legend-item">
                <span className="legend-color accepted"></span>
                <span>Aceitas</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Relatorios;
