import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
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
import Configuracoes from "./pages/Configuracoes";
import Login from "./pages/Login";
import "./App.css";

// Componente para rotas protegidas
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("auth_token");
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirecionar para login se não estiver autenticado
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Componente para rota de login
const LoginRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("auth_token");

  if (isAuthenticated) {
    // Redirecionar para dashboard se já estiver autenticado
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  // isMobile é usado para ajustes responsivos em toda a aplicação
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);

      // Auto-colapsar sidebar em dispositivos móveis
      if (window.innerWidth <= 768 && !isSidebarCollapsed) {
        setIsSidebarCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebarCollapsed]);

  // Inicialização do LocalStorage para armazenamento de dados
  useEffect(() => {
    // Verificar se é a primeira vez que o app é executado
    const appInicializado = localStorage.getItem("app_inicializado");

    if (!appInicializado) {
      // Inicializar o app com dados padrão
      console.log("Inicializando o armazenamento local para o CRM...");

      // Marcar o app como inicializado para evitar reinicialização dos dados
      localStorage.setItem("app_inicializado", "true");
      localStorage.setItem("app_version", "1.0.0");

      // Verificar se já existem dados nas coleções
      const verificarEInicializar = (chave, dadosPadrao) => {
        if (!localStorage.getItem(chave)) {
          localStorage.setItem(chave, JSON.stringify(dadosPadrao));
          console.log(`Coleção ${chave} inicializada com dados padrão`);
        } else {
          console.log(`Coleção ${chave} já existente, preservando dados`);
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
    // Verifica se a rota começa com /proposta/ seguido por qualquer combinação de letras e números
    return /^\/proposta\/[a-zA-Z0-9]+/.test(pathname);
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Rota de login (pública) */}
          <Route
            path="/login"
            element={
              <LoginRoute>
                <Login />
              </LoginRoute>
            }
          />

          {/* Rota pública para cliente visualizar proposta */}
          <Route path="/proposta/:id" element={<PropostaCliente />} />

          {/* Rota alternativa para compatibilidade com GitHub Pages */}
          <Route
            path="/crm-facilitaai/proposta/:id"
            element={<PropostaCliente />}
          />

          {/* Rota para compatibilidade com acesso direto no GitHub Pages */}
          <Route path="*/proposta/:id" element={<PropostaCliente />} />

          {/* Rotas protegidas (requerem autenticação) */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <>
                  {/* Mostra a sidebar apenas para rotas que não sejam de clientes */}
                  {!isClientRoute(window.location.pathname) && (
                    <Sidebar
                      collapsed={isSidebarCollapsed}
                      setCollapsed={setIsSidebarCollapsed}
                    />
                  )}
                  <div
                    className={
                      isClientRoute(window.location.pathname)
                        ? "client-view"
                        : isSidebarCollapsed
                        ? "content-collapsed"
                        : "content"
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
