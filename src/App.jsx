import React, { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Clientes from "./pages/Clientes";
import Leads from "./pages/Leads";
import Dashboard from "./pages/Dashboard";
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
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirecionar para login se não estiver autenticado
    return <Navigate to="/login" state={{ from: location }} replace />;
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  // Verificar autenticação ao carregar
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      setIsAuthenticated(true);
    }
  }, []);

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
      <div className="app">
        <Routes>
          {/* Rota de login (pública) */}
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/" />
              ) : (
                <Login setIsAuthenticated={setIsAuthenticated} />
              )
            }
          />

          {/* Rota pública para cliente visualizar proposta */}
          <Route path="/proposta/:id" element={<PropostaCliente />} />

          {/* Rota pública para agradecimento */}
          <Route path="/agradecimento" element={<Agradecimento />} />

          {/* Rotas protegidas (requerem autenticação) */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <>
                  {/* Mostra a sidebar apenas para rotas que não sejam de clientes */}
                  {!isClientRoute(window.location.pathname) && <Sidebar />}
                  <div
                    className={
                      isClientRoute(window.location.pathname)
                        ? "client-view"
                        : `main-content ${
                            isSidebarCollapsed ? "sidebar-collapsed" : ""
                          }`
                    }
                  >
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/clientes" element={<Clientes />} />
                      <Route path="/leads" element={<Leads />} />
                      <Route path="/contratos" element={<Contratos />} />
                      <Route path="/propostas" element={<Propostas />} />
                      <Route path="/pagamentos" element={<Pagamentos />} />
                      <Route path="/agenda" element={<Agenda />} />
                      <Route
                        path="/configuracoes"
                        element={<Configuracoes />}
                      />
                      <Route
                        path="/proposta/validacao/:id"
                        element={<PropostaCliente />}
                      />
                      <Route
                        path="/admin"
                        element={<Navigate to="/configuracoes" replace />}
                      />
                      <Route
                        path="/relatorios"
                        element={<Navigate to="/" replace />}
                      />

                      {/* Redirecionar qualquer outra rota não conhecida para o Dashboard */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </div>
                </>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
