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
  FaBars,
  FaSignOutAlt,
  FaUser,
  FaTimes,
  FaClipboardList,
  FaUsersCog,
} from "react-icons/fa";
import { MdMenu, MdClose } from "react-icons/md";
import { RiDashboardLine } from "react-icons/ri";
import { TbReportAnalytics } from "react-icons/tb";
import "./Sidebar.css";

// Componente global para compartilhar o estado do colapso
const sidebarState = {
  collapsed: false,
  setCollapsed: null,
};

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Obter informações do usuário logado
  const userInfo =
    localStorage.getItem("userInfo") || localStorage.getItem("user_info");
  const userInfoObj = userInfo ? JSON.parse(userInfo) : null;
  const userName = userInfoObj ? userInfoObj.name || userInfoObj.nome : "Admin";

  // Obter o tipo de usuário
  const userRole = userInfoObj ? userInfoObj.role || "admin" : "admin";

  // Exibir no console para debug
  useEffect(() => {
    // Se auth_token existir, mas userInfo não, criar um userInfo básico
    const authToken = localStorage.getItem("auth_token");
    if (authToken && !userInfoObj) {
      const adminUser = JSON.parse(localStorage.getItem("adminUser") || "{}");
      const adminTales = JSON.parse(localStorage.getItem("adminTales") || "{}");

      if (adminUser.email) {
        localStorage.setItem(
          "userInfo",
          JSON.stringify({
            name: adminUser.nome,
            email: adminUser.email,
            role: adminUser.role || "admin",
          })
        );
      } else if (adminTales.email) {
        localStorage.setItem(
          "userInfo",
          JSON.stringify({
            name: adminTales.nome,
            email: adminTales.email,
            role: adminTales.role || "admin",
          })
        );
      }
    }
  }, [userInfoObj]);

  // Configurar o estado global na primeira renderização
  useEffect(() => {
    sidebarState.setCollapsed = setCollapsed;
  }, []);

  // Atualizar o estado global quando o estado local mudar
  useEffect(() => {
    sidebarState.collapsed = collapsed;

    // Adicionar ou remover a classe no elemento raiz do aplicativo
    const rootElement = document.documentElement;
    if (collapsed) {
      rootElement.classList.add("sidebar-collapsed");
    } else {
      rootElement.classList.remove("sidebar-collapsed");
    }
  }, [collapsed]);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  // Fechar o menu ao navegar em dispositivos móveis
  useEffect(() => {
    if (isMobile) {
      setShowMobileMenu(false);
    }
  }, [location.pathname, isMobile]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const openMobileMenu = () => {
    setShowMobileMenu(true);
  };

  const closeMobileMenu = () => {
    setShowMobileMenu(false);
  };

  const handleLogout = () => {
    // Remover todos os itens relacionados à autenticação
    localStorage.removeItem("userInfo");
    localStorage.removeItem("user_info");
    localStorage.removeItem("auth_token");

    // Redirecionar para a página de login
    navigate("/login");
  };

  const logoPath = `${import.meta.env.BASE_URL}images/logo.png`;

  const menuItems = [
    { path: "/", icon: <RiDashboardLine />, text: "Dashboard" },
    { path: "/leads", icon: <FaUserFriends />, text: "Leads" },
    { path: "/clientes", icon: <FaUsers />, text: "Clientes" },
    { path: "/clientes-admin", icon: <FaUsersCog />, text: "Admin Clientes" },
    { path: "/propostas", icon: <FaClipboardList />, text: "Propostas" },
    { path: "/contratos", icon: <FaFileContract />, text: "Contratos" },
    { path: "/pagamentos", icon: <FaMoneyBillWave />, text: "Pagamentos" },
    { path: "/agenda", icon: <FaCalendarAlt />, text: "Agenda" },
    { path: "/configuracoes", icon: <FaCog />, text: "Configurações" },
  ];

  const renderMenuItems = () => {
    return menuItems.map((item) => (
      <Link
        key={item.path}
        to={item.path}
        className={`menu-item ${location.pathname === item.path ? "active" : ""
          }`}
      >
        {item.icon}
        <span>{item.text}</span>
      </Link>
    ));
  };

  // Desktop Sidebar
  const renderDesktopSidebar = () => (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="logo-container">
        <div className="logo-wrapper">
          <img src={logoPath} alt="Logo" className="logo-image" />
          <div className="logo-text">
            <span className="facilita">Facilita</span>
            <span className="ai">AI</span>
            <span className="crm">CRM</span>
          </div>
        </div>
        <button className="toggle-button" onClick={toggleSidebar}>
          {collapsed ? <MdMenu /> : <MdClose />}
        </button>
      </div>

      <div className="menu">{renderMenuItems()}</div>

      <div className="admin-section">
        <h3>Usuário</h3>
        <div className="user-info">
          <div className="user-avatar">
            <FaUser />
          </div>
          <div className="user-details">
            <div className="user-name">{userName}</div>
            <div className="user-role">
              {userRole === "admin" ? "Administrador" : "Vendedor"}
            </div>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-menu-item">
          <FaSignOutAlt />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );

  // Mobile Menu
  const renderMobileMenu = () => (
    <>
      <button className="hamburger-button" onClick={openMobileMenu}>
        <FaBars />
      </button>

      {showMobileMenu && (
        <div className="menu-overlay" onClick={closeMobileMenu} />
      )}

      <div className={`mobile-menu ${!showMobileMenu ? "closed" : ""}`}>
        <div className="mobile-menu-header">
          <div className="logo-wrapper">
            <img src={logoPath} alt="Logo" className="logo-image" />
            <div className="logo-text">
              <span className="facilita">Facilita</span>
              <span className="ai">AI</span>
              <span className="crm">CRM</span>
            </div>
          </div>
          <button className="close-button" onClick={closeMobileMenu}>
            <FaTimes />
          </button>
        </div>

        <div className="menu">{renderMenuItems()}</div>

        <div className="admin-section">
          <h3>Usuário</h3>
          <div className="user-info">
            <div className="user-avatar">
              <FaUser />
            </div>
            <div className="user-details">
              <div className="user-name">{userName}</div>
              <div className="user-role">
                {userRole === "admin" ? "Administrador" : "Vendedor"}
              </div>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-menu-item">
            <FaSignOutAlt />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </>
  );

  return <>{isMobile ? renderMobileMenu() : renderDesktopSidebar()}</>;
};

// Exportar tanto o componente quanto o estado global
export default Sidebar;
export { sidebarState };
