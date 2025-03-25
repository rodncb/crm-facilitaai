import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaUserTie,
  FaFileContract,
  FaFileInvoiceDollar,
  FaCalendarAlt,
  FaCog,
  FaFileAlt,
  FaBars,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Obter informações do usuário logado
  const userInfo = JSON.parse(localStorage.getItem("user_info") || "{}");
  const userName = userInfo.nome || "Usuário";

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    // Remover token de autenticação
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_info");

    // Redirecionar para a página de login
    navigate("/login");
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <Link to="/" className="logo-container">
          <img
            src={`${import.meta.env.BASE_URL}images/logo.png`}
            alt="Logo"
            className="logo"
          />
          {!collapsed && (
            <span className="logo-text">
              Facilita<span className="highlight">AI</span> CRM
            </span>
          )}
        </Link>
        <button className="toggle-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>
              <FaHome className="nav-icon" />
              {!collapsed && <span>Dashboard</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/leads"
              className={location.pathname === "/leads" ? "active" : ""}
            >
              <FaUsers className="nav-icon" />
              {!collapsed && <span>Leads</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/clientes"
              className={location.pathname === "/clientes" ? "active" : ""}
            >
              <FaUserTie className="nav-icon" />
              {!collapsed && <span>Clientes</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/propostas"
              className={location.pathname === "/propostas" ? "active" : ""}
            >
              <FaFileAlt className="nav-icon" />
              {!collapsed && <span>Propostas</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/contratos"
              className={location.pathname === "/contratos" ? "active" : ""}
            >
              <FaFileContract className="nav-icon" />
              {!collapsed && <span>Contratos</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/pagamentos"
              className={location.pathname === "/pagamentos" ? "active" : ""}
            >
              <FaFileInvoiceDollar className="nav-icon" />
              {!collapsed && <span>Pagamentos</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/agenda"
              className={location.pathname === "/agenda" ? "active" : ""}
            >
              <FaCalendarAlt className="nav-icon" />
              {!collapsed && <span>Agenda</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/configuracoes"
              className={location.pathname === "/configuracoes" ? "active" : ""}
            >
              <FaCog className="nav-icon" />
              {!collapsed && <span>Configurações</span>}
            </Link>
          </li>
        </ul>
      </nav>

      <div className="user-section">
        <div
          className={`user-info ${collapsed ? "collapsed" : ""}`}
          onClick={!collapsed ? toggleUserMenu : undefined}
        >
          <div className="user-avatar">
            <FaUser />
          </div>
          {!collapsed && (
            <>
              <div className="user-details">
                <div className="user-name">{userName}</div>
                <div className="user-role">Administrador</div>
              </div>
              <div className={`user-dropdown ${userMenuOpen ? "open" : ""}`}>
                <button onClick={handleLogout} className="logout-button">
                  <FaSignOutAlt /> Sair
                </button>
              </div>
            </>
          )}
        </div>
        {collapsed && (
          <button onClick={handleLogout} className="logout-button-collapsed">
            <FaSignOutAlt />
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
