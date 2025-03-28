import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaExclamationTriangle } from "react-icons/fa";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se já existe um usuário administrador
    const adminExists = localStorage.getItem("adminUser");

    if (!adminExists) {
      // Criar usuário administrador padrão
      const adminUser = {
        email: "rodrigo@facilitaai.com.br",
        password: "FacilitaAI@2023", // Senha gerada
        nome: "Rodrigo Bezerra",
        role: "admin",
        lastLogin: null,
      };

      localStorage.setItem("adminUser", JSON.stringify(adminUser));
    }

    // Adicionar um segundo administrador
    const adminTales = localStorage.getItem("adminTales");
    if (!adminTales) {
      // Criar senha segura para o novo administrador
      const senhaSegura = "123456";

      // Criar segundo usuário administrador
      const talesUser = {
        email: "talesrocha@facilitaai.com.br",
        password: senhaSegura,
        nome: "Tales Rocha",
        role: "admin",
        lastLogin: null,
      };

      localStorage.setItem("adminTales", JSON.stringify(talesUser));

      // Armazenar a senha em um local visível para recuperação
      localStorage.setItem("senhaTemporariaTales", senhaSegura);
    } else {
      // Atualizar a senha do Tales para 123456
      const talesUser = JSON.parse(adminTales);
      talesUser.password = "123456";
      localStorage.setItem("adminTales", JSON.stringify(talesUser));
    }

    // Verificar se o usuário já está logado
    const isAuthenticated = localStorage.getItem("auth_token");
    if (isAuthenticated) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulando uma chamada de API com setTimeout
    setTimeout(() => {
      const adminUser = JSON.parse(localStorage.getItem("adminUser") || "{}");
      const adminTales = JSON.parse(localStorage.getItem("adminTales") || "{}");

      let usuarioAutenticado = null;

      // Verificar se as credenciais correspondem a qualquer um dos administradores
      if (email === adminUser.email && password === adminUser.password) {
        usuarioAutenticado = adminUser;
      } else if (
        email === adminTales.email &&
        password === adminTales.password
      ) {
        usuarioAutenticado = adminTales;
      }

      if (usuarioAutenticado) {
        // Login bem-sucedido
        const authToken = `token_${Date.now()}`;
        localStorage.setItem("auth_token", authToken);

        // Salvar informações do usuário no formato esperado pelo Sidebar
        const userInfoData = {
          name: usuarioAutenticado.nome,
          email: usuarioAutenticado.email,
          role: usuarioAutenticado.role,
          lastLogin: new Date().toISOString(),
        };

        localStorage.setItem("userInfo", JSON.stringify(userInfoData));

        // Atualizar último login
        usuarioAutenticado.lastLogin = new Date().toISOString();

        if (email === adminUser.email) {
          localStorage.setItem("adminUser", JSON.stringify(usuarioAutenticado));
        } else {
          localStorage.setItem(
            "adminTales",
            JSON.stringify(usuarioAutenticado)
          );
        }

        // Redirecionar para o dashboard explicitamente
        navigate("/");
      } else {
        // Login falhou
        setError("Email ou senha inválidos. Tente novamente.");
      }

      setLoading(false);
    }, 1000);
  };

  return (
    <div className="login-container">
      <div className="animated-background">
        <div className="gradient-overlay"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-header">
            <img
              src={`${import.meta.env.BASE_URL}images/logo.png`}
              alt="Facilita AI CRM"
              className="login-logo"
            />
            <h1>
              Facilita<span>AI</span> CRM
            </h1>
          </div>

          {error && (
            <div className="login-error">
              <FaExclamationTriangle /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <div className="input-icon">
                <FaUser />
              </div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
              />
            </div>

            <div className="input-group">
              <div className="input-icon">
                <FaLock />
              </div>
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Autenticando..." : "Entrar"}
            </button>
          </form>
        </div>

        <div className="slogan-right">
          <div className="slogan-text">
            <h2>SOLUÇÕES INTELIGENTES QUE FACILITAM O SEU DIA A DIA.</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
