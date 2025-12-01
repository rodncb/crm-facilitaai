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
    // Verificar se o usuário já está logado
    const isAuthenticated = localStorage.getItem("token") || localStorage.getItem("auth_token");
    if (isAuthenticated) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Chamar API de login
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          senha: password
        })
      });

      const data = await response.json();

      if (data.success && data.data) {
        // Login bem-sucedido
        const { token, nome, email: userEmail, role } = data.data;

        // Salvar token
        localStorage.setItem('token', token);

        // Salvar informações do usuário
        const userInfo = {
          name: nome,
          nome: nome,
          email: userEmail,
          role: role
        };
        localStorage.setItem('userInfo', JSON.stringify(userInfo));

        // Manter compatibilidade com código antigo
        localStorage.setItem('auth_token', token);

        // Trigger auth state update in App.jsx
        window.dispatchEvent(new Event('auth-change'));

        // Redirecionar para o dashboard
        navigate("/");
      } else {
        // Login falhou
        setError(data.error || "Email ou senha inválidos. Tente novamente.");
      }
    } catch (error) {
      setError("Erro ao conectar com o servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
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
          {error && (
            <div className="login-actions">
              <button className="secondary-button" onClick={() => navigate("/")}>Voltar para Home</button>
              <button className="outline-button" onClick={() => navigate('/?create-account=true')}>Criar Conta</button>
            </div>
          )}
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
