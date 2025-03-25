import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUserFriends,
  FaUsers,
  FaFileContract,
  FaCalendarAlt,
  FaCog,
  FaMoneyBillWave,
  FaFileAlt,
  FaAngleLeft,
  FaAngleRight,
  FaEllipsisH,
} from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = ({ onCollapse }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileView, setMobileView] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      setMobileView(isMobile);

      // Auto collapse on mobile
      if (isMobile && !collapsed) {
        toggleSidebar();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [collapsed]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
    if (onCollapse) {
      onCollapse(!collapsed);
    }
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

  const Logo = ({ collapsed }) => (
    <div className="logo-container">
      <div className="logo-wrapper">
        <img src="/images/logo.png" alt="Logo" className="logo-image" />
        <div className="logo-text">
          <span className="facilita">Facilita</span>
          <span className="ai">AI</span>
          <span className="crm">CRM</span>
        </div>
      </div>
      <button className="toggle-button" onClick={() => toggleSidebar()}>
        {collapsed ? <FaAngleRight /> : <FaAngleLeft />}
      </button>
    </div>
  );

  return (
    <>
      {mobileView && collapsed && (
        <button className="mobile-toggle-button" onClick={toggleSidebar}>
          <FaEllipsisH />
        </button>
      )}
      <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <Logo collapsed={collapsed} />
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
      </div>
      {!collapsed && mobileView && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}
    </>
  );
};

export default Sidebar;
