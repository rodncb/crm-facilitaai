import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUserFriends,
  FaUsers,
  FaFileContract,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaCog,
  FaFileAlt,
  FaAngleLeft,
  FaAngleRight,
  FaEllipsisH,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileView, setMobileView] = useState(window.innerWidth <= 768);

  // Obter informações do usuário logado
  const userInfo = JSON.parse(localStorage.getItem("user_info") || "{}");
  const userName = userInfo.nome || "Usuário";

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      setMobileView(isMobile);

      // Auto collapse on mobile
      if (isMobile && !collapsed) {
        setCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Executar imediatamente para configurar o estado correto na inicialização
    return () => window.removeEventListener("resize", handleResize);
  }, [collapsed, setCollapsed]);

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

  const menuItems = [
    { path: "/", icon: <FaHome />, text: "Dashboard" },
    { path: "/leads", icon: <FaUserFriends />, text: "Leads" },
    { path: "/clientes", icon: <FaUsers />, text: "Clientes" },
    { path: "/propostas", icon: <FaFileAlt />, text: "Propostas" },
    { path: "/contratos", icon: <FaFileContract />, text: "Contratos" },
    { path: "/pagamentos", icon: <FaMoneyBillWave />, text: "Pagamentos" },
    { path: "/agenda", icon: <FaCalendarAlt />, text: "Agenda" },
    { path: "/configuracoes", icon: <FaCog />, text: "Configurações" },
  ];

  return (
    <>
      {mobileView && collapsed && (
        <button className="mobile-toggle-button" onClick={toggleSidebar}>
          <FaEllipsisH />
        </button>
      )}
      <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="logo-container">
          <div className="logo-wrapper">
            <img
              src={`${import.meta.env.BASE_URL}images/logo.png`}
              alt="Logo"
              className="logo-image"
            />
            <div className="logo-text">
              <span className="facilita">Facilita</span>
              <span className="ai">AI</span>
              <span className="crm">CRM</span>
            </div>
          </div>
          <button className="toggle-button" onClick={toggleSidebar}>
            {collapsed ? <FaAngleRight /> : <FaAngleLeft />}
          </button>
        </div>

        <nav className="menu">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`menu-item ${
                location.pathname === item.path ? "active" : ""
              }`}
              onClick={() => mobileView && setCollapsed(true)}
            >
              {item.icon}
              <span>{item.text}</span>
            </Link>
          ))}
        </nav>

        <div className="admin-section">
          <div className="user-info">
            <div className="user-avatar">
              <FaUser />
            </div>
            <div className="user-details">
              <div className="user-name">{userName}</div>
              <div className="user-role">Administrador</div>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-menu-item">
            <FaSignOutAlt />
            <span>Sair</span>
          </button>
        </div>
      </div>
      {!collapsed && mobileView && (
        <div
          className="sidebar-overlay"
          onClick={() => setCollapsed(true)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
