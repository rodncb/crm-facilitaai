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
      console.log("Usuário administrador criado com sucesso!");
      console.log("Email: rodrigo@facilitaai.com.br");
      console.log("Senha: FacilitaAI@2023");
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

      if (email === adminUser.email && password === adminUser.password) {
        // Login bem-sucedido
        const authToken = `token_${Date.now()}`;
        localStorage.setItem("auth_token", authToken);
        localStorage.setItem(
          "user_info",
          JSON.stringify({
            email: adminUser.email,
            nome: adminUser.nome,
            role: adminUser.role,
            lastLogin: new Date().toISOString(),
          })
        );

        // Atualizar último login
        adminUser.lastLogin = new Date().toISOString();
        localStorage.setItem("adminUser", JSON.stringify(adminUser));

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
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Autenticando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
