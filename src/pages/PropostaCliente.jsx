import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaCheck, FaTimes, FaDownload, FaEraser } from "react-icons/fa";
import "./PropostaCliente.css";

const PropostaCliente = () => {
  const { id } = useParams();
  const [proposta, setProposta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sucesso, setSucesso] = useState(false);
  const [acao, setAcao] = useState(null);
  const [showAssinaturaModal, setShowAssinaturaModal] = useState(false);
  const [assinado, setAssinado] = useState(false);
  const previewRef = useRef();
  const canvasRef = useRef();
  const contextRef = useRef();
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    setLoading(true);

    // Extrair o ID da proposta da URL
    const propostaId = id;

    // Função para carregar dados da proposta
    const carregarProposta = async () => {
      try {
        // Verificar se a proposta já foi aprovada
        const propostas = JSON.parse(localStorage.getItem("propostas") || "[]");

        // Procurar proposta pelo ID ou código
        let propostaEncontrada = propostas.find(
          (p) => p.numero === `PROP-${propostaId}`
        );

        // Tentar match alternativo se não encontrou
        if (!propostaEncontrada) {
          // Tentar encontrar por ID sem o prefixo
          propostaEncontrada = propostas.find((p) => {
            const numeroSemPrefixo = p.numero.replace("PROP-", "");
            return numeroSemPrefixo.toLowerCase() === propostaId.toLowerCase();
          });
        }

        // Tentar match por número sem caracteres especiais
        if (!propostaEncontrada) {
          propostaEncontrada = propostas.find((p) => {
            const numeroLimpo = p.numero
              .replace(/[^a-zA-Z0-9]/g, "")
              .toLowerCase();
            const idLimpo = propostaId
              .replace(/[^a-zA-Z0-9]/g, "")
              .toLowerCase();
            return (
              numeroLimpo.includes(idLimpo) || idLimpo.includes(numeroLimpo)
            );
          });
        }

        let propostaProcessada = null;

        if (propostaEncontrada) {
          // Preparar informações do cliente se não estiverem presentes
          if (!propostaEncontrada.cliente_info) {
            // Buscar cliente associado
            const clienteInfo = {};

            if (propostaEncontrada.origem === "cliente") {
              const clientes = JSON.parse(
                localStorage.getItem("clientes") || "[]"
              );
              const cliente = clientes.find(
                (c) => c.id === propostaEncontrada.clienteId
              );

              if (cliente) {
                clienteInfo.nome = cliente.nome || "Cliente";
                clienteInfo.empresa = cliente.empresa || "";
                clienteInfo.email = cliente.email || "";
                clienteInfo.telefone = cliente.telefone || "";
                clienteInfo.cnpj = cliente.cnpj || "00.000.000/0001-00";
                clienteInfo.endereco =
                  cliente.endereco || "Endereço não informado";
                clienteInfo.cidade = cliente.cidade || "Cidade";
                clienteInfo.estado = cliente.estado || "Estado";
              }
            } else {
              // Se for lead
              const leads = JSON.parse(localStorage.getItem("leads") || "[]");
              const lead = leads.find(
                (l) => l.id === propostaEncontrada.clienteId
              );

              if (lead) {
                clienteInfo.nome = lead.nome || "Lead";
                clienteInfo.empresa = lead.empresa || "";
                clienteInfo.email = lead.email || "";
                clienteInfo.telefone = lead.telefone || "";
              }
            }

            // Adicionar informações do cliente à proposta
            propostaProcessada = {
              ...propostaEncontrada,
              cliente_info: clienteInfo,
            };
          } else {
            propostaProcessada = propostaEncontrada;
          }

          setProposta(propostaProcessada);
          setLoading(false);
        } else {
          // Se não encontrou a proposta, use dados mockados para demonstração
          // Simular uma proposta mock para demonstração
          const propostaDemo = {
            id: "demo-001",
            numero: `PROP-${propostaId}`,
            origem: "cliente",
            data: new Date().toISOString().split("T")[0],
            validade: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0],
            valorTotal: 12500.0,
            status: "pendente",
            contratoGerado: false,
            itens: [
              {
                id: 1,
                descricao: "Serviço de desenvolvimento de software",
                quantidade: 1,
                valorUnitario: 8500.0,
              },
              {
                id: 2,
                descricao: "Implementação e treinamento",
                quantidade: 1,
                valorUnitario: 2000.0,
              },
              {
                id: 3,
                descricao: "Suporte mensal",
                quantidade: 2,
                valorUnitario: 1000.0,
              },
            ],
            cliente_info: {
              nome: "Cliente Demonstração",
              empresa: "Empresa Demo Ltda",
              cargo: "Diretor",
              cnpj: "12.345.678/0001-90",
              endereco: "Av. Demonstração, 1000",
              cidade: "Rio de Janeiro",
              estado: "RJ",
              cep: "22000-000",
              telefone: "(21) 98765-4321",
              email: "cliente@demo.com.br",
            },
            observacoes:
              "Esta é uma proposta de demonstração para fins de teste.",
            condicoesEntrega: "Entrega em 30 dias após aprovação da proposta.",
          };

          setProposta(propostaDemo);
          setLoading(false);
        }
      } catch (error) {
        console.error("Erro ao processar proposta:", error);
        setError("Erro ao carregar a proposta. Por favor, tente novamente.");
        setLoading(false);
      }
    };

    carregarProposta();
  }, [id]);

  // Inicializar o canvas quando o modal for aberto
  useEffect(() => {
    if (showAssinaturaModal && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.clientWidth * 2;
      canvas.height = canvas.clientHeight * 2;

      const context = canvas.getContext("2d");
      context.scale(2, 2);
      context.lineCap = "round";
      context.lineWidth = 2;
      context.strokeStyle = "black";
      contextRef.current = context;
    }
  }, [showAssinaturaModal]);

  const handlePrint = () => {
    // Verificar se há referência válida
    if (!previewRef || !previewRef.current) {
      alert("Erro ao preparar a impressão. Tente novamente.");
      return;
    }

    // Criar uma janela temporária para imprimir apenas o conteúdo da proposta
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert(
        "Por favor, permita que o navegador abra popups para imprimir o PDF"
      );
      return;
    }

    // Obtém o conteúdo HTML do elemento de visualização
    const propostaHTML = previewRef.current.innerHTML;

    // CSS para impressão
    const printStyles = `
      <style>
        body { 
          font-family: Arial, sans-serif;
          color: #333;
          margin: 0;
          padding: 20px;
        }
        .proposta-preview {
          max-width: 21cm;
          margin: 0 auto;
          padding: 20px;
        }
        .proposta-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 40px;
          border-bottom: 2px solid #fd7e14;
          padding-bottom: 20px;
        }
        .proposta-logo img {
          max-width: 120px;
          height: auto;
        }
        .proposta-info h1 {
          font-size: 24px;
          color: #3a416f;
          margin: 0 0 10px 0;
        }
        .proposta-numero {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #fd7e14;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        table th, table td {
          padding: 8px;
          border: 1px solid #ddd;
          text-align: left;
        }
        table th {
          background-color: #f3f5f9;
        }
        .total-label {
          text-align: right;
          font-weight: bold;
        }
        .total-value {
          font-weight: bold;
        }
        @media print {
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      </style>
    `;

    // Escrever o conteúdo HTML na nova janela
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Proposta ${proposta.numero}</title>
          ${printStyles}
        </head>
        <body>
          <div class="proposta-preview">${propostaHTML}</div>
          <script>
            // Imprimir automaticamente e fechar a janela depois
            window.onload = function() {
              // Substituir caminhos de imagem antes de imprimir
              const images = document.querySelectorAll('img');
              images.forEach(img => {
                if (img.src.includes('images/logo.png')) {
                  img.src = '${window.location.origin}${
      import.meta.env.BASE_URL
    }images/logo.png';
                }
              });
              
              setTimeout(function() {
                window.print();
                setTimeout(function() {
                  window.close();
                }, 500);
              }, 300);
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  const handleAction = (action) => {
    if (action === "aceitar") {
      setShowAssinaturaModal(true);
    } else {
      setAcao(action);
      finalizarAcao(action);
    }
  };

  const handleStartDrawing = (e) => {
    const { offsetX, offsetY } = getEventCoordinates(e);
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const handleEndDrawing = () => {
    if (isDrawing) {
      contextRef.current.closePath();
      setIsDrawing(false);
      // Verificar se algo foi desenhado
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      const pixelData = context.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      ).data;
      const hasDrawing = pixelData.some((channel) => channel !== 0);
      setAssinado(hasDrawing);
    }
  };

  const handleDrawing = (e) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = getEventCoordinates(e);
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  // Helper para obter coordenadas tanto de mouse quanto de toque
  const getEventCoordinates = (event) => {
    if (event.touches && event.touches[0]) {
      const rect = canvasRef.current.getBoundingClientRect();
      return {
        offsetX: event.touches[0].clientX - rect.left,
        offsetY: event.touches[0].clientY - rect.top,
      };
    }
    return {
      offsetX: event.nativeEvent.offsetX,
      offsetY: event.nativeEvent.offsetY,
    };
  };

  const limparAssinatura = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    setAssinado(false);
  };

  const finalizarAcao = (action) => {
    if (action === "aceitar" && !assinado) {
      return;
    }

    // Se for aceitar, fecha o modal primeiro
    if (action === "aceitar") {
      setShowAssinaturaModal(false);
    }

    setAcao(action);

    // Simulando envio da ação para o servidor
    setTimeout(() => {
      try {
        // Em uma implementação real, você enviaria a assinatura e a ação para uma API

        // Obter propostas do localStorage
        const propostas = JSON.parse(localStorage.getItem("propostas") || "[]");
        const propostaIndex = propostas.findIndex(
          (p) => p.numero === proposta.numero
        );

        if (propostaIndex !== -1) {
          // Se foi aceita, salvar a assinatura e atualizar o status
          if (action === "aceitar" && canvasRef.current) {
            const assinaturaDataURL = canvasRef.current.toDataURL("image/png");

            // Salvar a assinatura no localStorage (temporário até implementar backend)
            const assinaturas = JSON.parse(
              localStorage.getItem("assinaturas") || "{}"
            );
            assinaturas[proposta.numero] = assinaturaDataURL;
            localStorage.setItem("assinaturas", JSON.stringify(assinaturas));

            // Atualizar o status da proposta para aprovada
            propostas[propostaIndex] = {
              ...propostas[propostaIndex],
              status: "aprovada",
              dataAprovacao: new Date().toISOString(),
              assinatura: assinaturaDataURL,
            };
          } else if (action === "declinar") {
            // Se a proposta foi recusada, atualizar o status
            propostas[propostaIndex] = {
              ...propostas[propostaIndex],
              status: "recusada",
              dataRecusa: new Date().toISOString(),
              motivoRecusa: "Recusado pelo cliente",
            };
          }

          // Salvar as alterações no localStorage
          localStorage.setItem("propostas", JSON.stringify(propostas));
        }

        setSucesso(true);

        // Redirecionar após 3 segundos
        setTimeout(() => {
          // Em produção, redirecionar para a página inicial do projeto
          const basePath =
            import.meta.env.MODE === "production" ? "/crm-facilitaai" : "";
          window.location.href = `${basePath}/#/agradecimento`;
        }, 5000); // Aumentar para 5 segundos para dar tempo de ler a mensagem
      } catch (error) {
        console.error("Erro ao finalizar ação:", error);
        alert(
          "Ocorreu um erro ao processar sua ação. Por favor, tente novamente."
        );
      }
    }, 1000);
  };

  const confirmarAssinatura = () => {
    finalizarAcao("aceitar");
  };

  const formatarData = (data) => {
    if (!data) return "";
    const date = new Date(data);
    return date.toLocaleDateString("pt-BR");
  };

  const formatarValor = (valor) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  if (loading) {
    return (
      <div className="proposta-cliente-container">
        <div className="loading">Carregando proposta...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="proposta-cliente-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (sucesso) {
    return (
      <div className="proposta-cliente-container">
        <div className="success-message">
          {acao === "aceitar" && (
            <>
              <h2>Proposta Aceita com Sucesso!</h2>
              <p>
                Obrigado por aceitar nossa proposta. Sua assinatura foi
                registrada e o status da proposta foi atualizado para{" "}
                <strong>APROVADA</strong>.
              </p>
              <p>Entraremos em contato em breve para os próximos passos.</p>
            </>
          )}
          {acao === "declinar" && (
            <>
              <h2>Proposta Declinada</h2>
              <p>
                Agradecemos seu tempo. Se tiver algum feedback sobre o motivo da
                recusa, entre em contato conosco.
              </p>
            </>
          )}
          <p className="redirect-message">
            Redirecionando em alguns segundos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="proposta-cliente-container">
      <div className="proposta-actions-header">
        <div className="proposta-info-header">
          <h1># {proposta.numero}</h1>
          <p>Facilita AI</p>
        </div>
        <div className="proposta-buttons">
          <button className="btn-baixar" onClick={handlePrint}>
            <FaDownload /> Baixar
          </button>
          <button
            className="btn-declinar"
            onClick={() => handleAction("declinar")}
          >
            <FaTimes /> Declinar
          </button>
          <button
            className="btn-aceitar"
            onClick={() => handleAction("aceitar")}
          >
            <FaCheck /> Aceitar
          </button>
        </div>
      </div>

      <div className="proposta-tabs">
        <button className="tab active">Resumo</button>
        <button className="tab">Discussão</button>
      </div>

      <div className="proposta-content-wrapper">
        <div className="proposta-preview-container" ref={previewRef}>
          <div className="proposta-preview">
            <div className="proposta-header">
              <div className="proposta-logo">
                <img
                  src={`${import.meta.env.BASE_URL}images/logo.png`}
                  alt="Logo Facilita AI"
                />
              </div>
              <div className="proposta-info">
                <h1>Proposta Comercial</h1>
                <div className="proposta-numero">Nº {proposta.numero}</div>
                <div className="proposta-datas">
                  <p>
                    <strong>Data:</strong> {formatarData(proposta.data)}
                  </p>
                  <p>
                    <strong>Validade:</strong> {formatarData(proposta.validade)}
                  </p>
                </div>
              </div>
            </div>

            <div className="proposta-empresa">
              <h2>Empresa</h2>
              <p>
                <strong>Facilita AI</strong>
              </p>
              <p>Praça Antonio Calado, 85 - Barra da Tijuca</p>
              <p>Rio de Janeiro RJ</p>
              <p>CNPJ: 28.894.664/0001-60</p>
            </div>

            <div className="proposta-cliente">
              <h2>Cliente</h2>
              <p>
                <strong>{proposta.cliente_info.nome}</strong>
              </p>
              {proposta.cliente_info.empresa && (
                <p>{proposta.cliente_info.empresa}</p>
              )}
              {proposta.cliente_info.cargo && (
                <p>Cargo: {proposta.cliente_info.cargo}</p>
              )}
              <p>CNPJ: {proposta.cliente_info.cnpj}</p>
              <p>{proposta.cliente_info.endereco}</p>
              <p>
                {proposta.cliente_info.cidade} - {proposta.cliente_info.estado}
              </p>
              {proposta.cliente_info.cep && (
                <p>CEP: {proposta.cliente_info.cep}</p>
              )}
              <p>Tel: {proposta.cliente_info.telefone}</p>
              <p>Email: {proposta.cliente_info.email}</p>
            </div>

            <div className="proposta-itens">
              <h2>Serviços e Produtos</h2>
              <table>
                <thead>
                  <tr>
                    <th>Descrição</th>
                    <th>Qtd</th>
                    <th>Valor Unitário</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {proposta.itens.map((item) => (
                    <tr key={item.id}>
                      <td>{item.descricao}</td>
                      <td>{item.quantidade}</td>
                      <td>{formatarValor(item.valorUnitario)}</td>
                      <td>
                        {formatarValor(item.quantidade * item.valorUnitario)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="total-label">
                      VALOR TOTAL
                    </td>
                    <td className="total-value">
                      {formatarValor(proposta.valorTotal)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {proposta.observacoes && (
              <div className="proposta-observacoes">
                <h2>Observações</h2>
                <p>{proposta.observacoes}</p>
              </div>
            )}

            {proposta.condicoesEntrega && (
              <div className="proposta-condicoes">
                <h2>Condições de Entrega</h2>
                <p>{proposta.condicoesEntrega}</p>
              </div>
            )}

            <div className="proposta-assinaturas">
              <div className="assinatura">
                <p className="nome-empresa">Facilita AI</p>
              </div>
              <div className="assinatura">
                <p className="nome-cliente">{proposta.cliente_info.nome}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="proposta-info-sidebar">
          <div className="proposta-meta">
            <h3>Informação da proposta</h3>
            <div className="cliente-info">
              <p>
                <strong>{proposta.cliente_info.nome}</strong>
              </p>
              {proposta.cliente_info.empresa && (
                <p>
                  <strong>{proposta.cliente_info.empresa}</strong>
                </p>
              )}
              {proposta.cliente_info.cargo && (
                <p>Cargo: {proposta.cliente_info.cargo}</p>
              )}
              <p>{proposta.cliente_info.cnpj}</p>
              <p>{proposta.cliente_info.endereco}</p>
              <p>
                {proposta.cliente_info.cidade} {proposta.cliente_info.estado}
              </p>
              {proposta.cliente_info.cep && <p>{proposta.cliente_info.cep}</p>}
              <p>{proposta.cliente_info.telefone}</p>
              <p>{proposta.cliente_info.email}</p>
            </div>

            <div className="proposta-valores">
              <div className="valor-total">
                <p>
                  Total R${proposta.valorTotal.toFixed(2).replace(".", ",")}
                </p>
              </div>

              <div className="proposta-status">
                <p>
                  <strong>Status</strong>:{" "}
                  {proposta.status === "pendente"
                    ? "Aguardando aprovação"
                    : proposta.status}
                </p>
                <p>
                  <strong>Data</strong>: {formatarData(proposta.data)}
                </p>
                <p>
                  <strong>Abrir Até</strong>: {formatarData(proposta.validade)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Assinatura */}
      {showAssinaturaModal && (
        <div className="assinatura-modal-backdrop">
          <div className="assinatura-modal">
            <div className="assinatura-modal-header">
              <h2>Assinatura Digital</h2>
              <button
                className="assinatura-modal-close"
                onClick={() => setShowAssinaturaModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="assinatura-instrucoes">
              Por favor, assine no campo abaixo para aceitar esta proposta
            </div>
            <div className="assinatura-canvas-container">
              <canvas
                ref={canvasRef}
                className="assinatura-canvas"
                onMouseDown={handleStartDrawing}
                onMouseUp={handleEndDrawing}
                onMouseMove={handleDrawing}
                onMouseLeave={handleEndDrawing}
                onTouchStart={handleStartDrawing}
                onTouchEnd={handleEndDrawing}
                onTouchMove={handleDrawing}
              />
            </div>
            <div className="assinatura-acoes">
              <button className="btn-limpar" onClick={limparAssinatura}>
                <FaEraser /> Limpar
              </button>
              <button
                className="btn-confirmar"
                onClick={confirmarAssinatura}
                disabled={!assinado}
              >
                <FaCheck /> Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropostaCliente;
