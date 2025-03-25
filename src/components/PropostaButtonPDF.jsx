import React, { useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import { generatePDF, formatPropostaFileName } from "../utils/pdfGenerator";

/**
 * Botão para salvar proposta como PDF
 * @param {Object} props - Props do componente
 * @param {Object} props.proposta - Objeto de proposta
 * @param {React.RefObject} props.contentRef - Referência para o conteúdo a ser convertido em PDF
 */
const PropostaButtonPDF = ({ proposta, contentRef }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSavePDF = async () => {
    if (!contentRef.current || isGenerating) return;

    setIsGenerating(true);

    try {
      // Gera nome do arquivo baseado no número da proposta
      const fileName = formatPropostaFileName(proposta);

      // Gera e faz download do PDF
      await generatePDF(contentRef.current, fileName);

      console.log("PDF gerado com sucesso");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Erro ao gerar o PDF. Por favor, tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      className="btn-pdf"
      onClick={handleSavePDF}
      title="Exportar como PDF"
      disabled={isGenerating}
    >
      <FaFilePdf /> {isGenerating ? "Gerando..." : "Salvar PDF"}
    </button>
  );
};

export default PropostaButtonPDF;
