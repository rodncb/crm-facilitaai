import React from "react";
import {
  FaUsers,
  FaUserPlus,
  FaChartLine,
  FaCalendarCheck,
} from "react-icons/fa";
import "./Dashboard.css";

const Dashboard = () => {
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
            <span className="metric-value">3</span>
            <span className="metric-label">Total de Clientes</span>
            <span className="metric-change positive">+33% este mês</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon leads">
            <FaUserPlus />
          </div>
          <div className="metric-info">
            <span className="metric-value">6</span>
            <span className="metric-label">Novos Leads</span>
            <span className="metric-change positive">+50% este mês</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon conversion">
            <FaChartLine />
          </div>
          <div className="metric-info">
            <span className="metric-value">50%</span>
            <span className="metric-label">Taxa de Conversão</span>
            <span className="metric-change positive">+10% este mês</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon meetings">
            <FaCalendarCheck />
          </div>
          <div className="metric-info">
            <span className="metric-value">12</span>
            <span className="metric-label">Eventos Agendados</span>
            <span className="metric-change positive">+20% este mês</span>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Leads por Origem</h3>
          <div className="chart-content">
            <div className="chart-legend">
              <div className="legend-item">
                <div
                  className="legend-color"
                  style={{ backgroundColor: "#4CAF50" }}
                ></div>
                <span>Indicação (33%)</span>
              </div>
              <div className="legend-item">
                <div
                  className="legend-color"
                  style={{ backgroundColor: "#2196F3" }}
                ></div>
                <span>Site (33%)</span>
              </div>
              <div className="legend-item">
                <div
                  className="legend-color"
                  style={{ backgroundColor: "#FFC107" }}
                ></div>
                <span>LinkedIn (33%)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h3>Status dos Leads</h3>
          <div className="chart-content">
            <div className="chart-legend">
              <div className="legend-item">
                <div
                  className="legend-color"
                  style={{ backgroundColor: "#2196F3" }}
                ></div>
                <span>Novo (50%)</span>
              </div>
              <div className="legend-item">
                <div
                  className="legend-color"
                  style={{ backgroundColor: "#FFC107" }}
                ></div>
                <span>Contatado (33%)</span>
              </div>
              <div className="legend-item">
                <div
                  className="legend-color"
                  style={{ backgroundColor: "#4CAF50" }}
                ></div>
                <span>Qualificado (17%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="activities-section">
        <h3>Atividades Recentes</h3>
        <div className="activities-list">
          <div className="activity-item">
            <div className="activity-dot"></div>
            <div className="activity-content">
              <span className="activity-title">Novo Lead Cadastrado</span>
              <span className="activity-description">
                TechCorp - João Silva
              </span>
              <span className="activity-time">Há 2 horas</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-dot"></div>
            <div className="activity-content">
              <span className="activity-title">Reunião Agendada</span>
              <span className="activity-description">
                Anahata Home - Leandro Marques
              </span>
              <span className="activity-time">Há 4 horas</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-dot"></div>
            <div className="activity-content">
              <span className="activity-title">Lead Qualificado</span>
              <span className="activity-description">
                Inovação Ltda - Maria Santos
              </span>
              <span className="activity-time">Há 6 horas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
