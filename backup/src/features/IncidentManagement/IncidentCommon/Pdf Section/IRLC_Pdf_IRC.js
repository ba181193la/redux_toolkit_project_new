 const generateMatrixData = (LikelihoodData, ConsequenceLevelData, RiskLevelData) => {
            if (!LikelihoodData?.length || !ConsequenceLevelData?.length || !RiskLevelData?.length) {
              return { Headers: [], Records: [] };
            }
          
            // Extract Headers (Consequence Levels)
            const consequenceLevels = ConsequenceLevelData.map((item) => item.consequenceLevel);
          
            // Extract Row Headers (Likelihoods)
            const likelihoods = LikelihoodData.map((item) => item.likelihood);
          
            // Construct Matrix Records
            const records = likelihoods.map((likelihood) => {
              const scores = consequenceLevels.map((consequence) => {
                // Find the matching risk level for the given likelihood & consequence
                const matchedRisk = RiskLevelData.find(
                  (risk) => risk.likelihood === likelihood && risk.consequenceLevel === consequence
                );
                return matchedRisk ? matchedRisk.riskLevel : "-"; // Default fallback
              });
          
              return { Likelihood: likelihood, Scores: scores };
            });
          
            return { Headers: consequenceLevels, Records: records };
          };




const IRLC_Pdf_IRC = ({ RiskLevelData, LikelihoodData, ConsequenceLevelData }) => {
    const matrixData = generateMatrixData(LikelihoodData, ConsequenceLevelData, RiskLevelData);
  
    if (matrixData?.Records?.length) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Risk Matrix", pageWidth / 2, startY, { align: "center" });
  
      startY += 10;
  
      const matrixHead = ["Likelihood / Consequence", ...matrixData.Headers];
  
      const matrixBody = matrixData.Records.map((item) => [
        item.Likelihood,
        ...item.Scores,
      ]);
  
      checkAndAddPage(60);
  
      doc.autoTable({
        startY: startY + 10,
        head: [matrixHead],
        body: matrixBody,
        theme: "grid",
        headStyles: {
          fillColor: [192, 192, 192],
          textColor: [0, 0, 0],
          fontStyle: "bold",
          halign: "center",
        },
        styles: {
          fontSize: 10,
          cellPadding: 4,
          lineWidth: 0.1,
          lineColor: [0, 0, 0],
        },
        margin: { left: margin + 10, right: margin + 10 },
      });
    }
  
    return null;
  };

  export default IRLC_Pdf_IRC;
  