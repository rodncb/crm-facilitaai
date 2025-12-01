import React, { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Clientes from "./pages/Clientes";
import ClientesAdmin from "./pages/ClientesAdmin";
import Leads from "./pages/Leads";
import Dashboard from "./pages/Dashboard";
import DashboardHome from "./pages/DashboardHome";
import LandingPage from "./pages/LandingPage";
import Contratos from "./pages/Contratos";
import Pagamentos from "./pages/Pagamentos";
import Agenda from "./pages/Agenda";
import Propostas from "./pages/Propostas";
import PropostaCliente from "./pages/PropostaCliente";
import Agradecimento from "./pages/Agradecimento";
import Configuracoes from "./pages/Configuracoes";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Relatorios from "./pages/Relatorios";
import "./App.css";

// Componente para rotas protegidas
const ProtectedRoute = ({ children }) => {
  const isAuthenticated =
    localStorage.getItem("auth_token") || localStorage.getItem("userInfo");

  if (!isAuthenticated) {
    // Redirecionar para login se não estiver autenticado
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Componente para rota de login
const LoginRoute = ({ children }) => {
  const isAuthenticated =
    localStorage.getItem("auth_token") || localStorage.getItem("userInfo");

  if (isAuthenticated) {
    // Redirecionar para dashboard se já estiver autenticado
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    window.innerWidth <= 768 ? true : false
  );

  // Use state for authentication to trigger re-renders
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("userInfo") || localStorage.getItem("auth_token"))
  );

  // Listen for storage changes (for cross-tab sync) and manual checks
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = Boolean(
        localStorage.getItem("userInfo") || localStorage.getItem("auth_token")
      );
      setIsAuthenticated(authStatus);
    };

    // Check auth on mount
    checkAuth();

    // Listen for storage events (cross-tab)
    window.addEventListener('storage', checkAuth);

    // Custom event for same-tab updates
    window.addEventListener('auth-change', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth-change', checkAuth);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;

      // Auto-colapsar sidebar em dispositivos móveis
      if (isMobile && !isSidebarCollapsed) {
        setIsSidebarCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Executar imediatamente para configurar o estado correto
    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebarCollapsed]);

  // isAuthenticated é derivado do localStorage para refletir mudanças imediatas

  // Inicialização do LocalStorage para armazenamento de dados
  useEffect(() => {
    // Verificar se é a primeira vez que o app é executado
    const appInicializado = localStorage.getItem("app_inicializado");

    if (!appInicializado) {
      // Inicializar o app com dados padrão
      // Marcar o app como inicializado para evitar reinicialização dos dados
      localStorage.setItem("app_inicializado", "true");
      localStorage.setItem("app_version", "1.0.0");

      // Verificar se já existem dados nas coleções
      const verificarEInicializar = (chave, dadosPadrao) => {
        if (!localStorage.getItem(chave)) {
          localStorage.setItem(chave, JSON.stringify(dadosPadrao));
        } else {
          // dados preservados
        }
      };

      // Inicializar coleções com arrays vazios, caso não existam ainda
      verificarEInicializar("clientes", []);
      verificarEInicializar("leads", []);
      verificarEInicializar("contratos", []);
      verificarEInicializar("pagamentos", []);
      verificarEInicializar("propostas", []);
      verificarEInicializar("agendamentos", []);
      verificarEInicializar("assinaturas", {});
    }
  }, []);

  // Verifica se deve mostrar a barra lateral baseado na rota
  const isClientRoute = (pathname) => {
    // Verifica se a rota contém /proposta/ ou é a página de agradecimento
    return (
      pathname.includes("/proposta/") || pathname.includes("/agradecimento")
    );
  };

  return (
    <Router>
      {!isAuthenticated ? (
        // Landing Page e rotas públicas (sem sidebar)
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/proposta/:id" element={<PropostaCliente />} />
          <Route path="/agradecimento" element={<Agradecimento />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      ) : (
        // Rotas autenticadas (com sidebar)
        <div className="app-container" style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f5f7fa" }}>
          <Sidebar />
          <div
            className="main-content"
            style={{
              flex: 1,
              marginLeft: isSidebarCollapsed ? "80px" : "280px",
              transition: "margin-left 0.3s ease",
              padding: "20px",
              overflowY: "auto",
            }}
          >
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/dashboard-old" element={<Dashboard />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/clientes-admin" element={<ClientesAdmin />} />
              <Route path="/leads" element={<Leads />} />
              <Route path="/contratos" element={<Contratos />} />
              <Route path="/propostas" element={<Propostas />} />
              <Route path="/pagamentos" element={<Pagamentos />} />
              <Route path="/agenda" element={<Agenda />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
              <Route path="/proposta/validacao/:id" element={<PropostaCliente />} />
              <Route path="/proposta/:id" element={<PropostaCliente />} />
              <Route path="/agradecimento" element={<Agradecimento />} />
              <Route path="/admin" element={<Navigate to="/configuracoes" replace />} />
              <Route path="/relatorios" element={<Relatorios />} />
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      )}
    </Router>
  );
};

export default App;
