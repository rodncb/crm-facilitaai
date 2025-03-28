import React, { useEffect, useState } from "react";
import { FaCheck, FaEnvelope, FaHome, FaArrowRight } from "react-icons/fa";
import "./Agradecimento.css";

const Agradecimento = () => {
  const [countdown, setCountdown] = useState(8);

  useEffect(() => {
    // Redirecionar para o site principal após 8 segundos
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = "https://facilitaai.com.br";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleHomeClick = () => {
    window.location.href = "https://facilitaai.com.br";
  };

  return (
    <div className="agradecimento-container">
      <div className="agradecimento-content">
        <div className="agradecimento-icon">
          <FaCheck />
        </div>
        <h1>Obrigado!</h1>
        <p>
          Sua ação foi registrada com sucesso. Nossa equipe irá analisar e
          entrar em contato em breve.
        </p>

        <div className="agradecimento-buttons">
          <button className="btn-voltar-home" onClick={handleHomeClick}>
            <FaHome /> Visitar Site Principal
          </button>

          <button
            className="btn-contato"
            onClick={() =>
              (window.location.href = "mailto:contato@facilitaai.com")
            }
          >
            <FaEnvelope /> Enviar Email para Contato
          </button>
        </div>

        <button className="btn-site-principal" onClick={handleHomeClick}>
          <FaArrowRight /> Continuar para facilitaai.com.br
        </button>

        <p className="agradecimento-redirect">
          Você será redirecionado automaticamente em {countdown} segundos...
        </p>
      </div>
    </div>
  );
};

export default Agradecimento;
