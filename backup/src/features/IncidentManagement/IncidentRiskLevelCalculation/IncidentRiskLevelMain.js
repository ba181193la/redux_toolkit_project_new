import React, { useEffect, useRef, useState } from 'react';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../utils/StyledComponents';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import CategoryAffected from './CategoryAffected/CategoryAffected';
import ConsequenceLevel from './ConsequenceLevel/ConsequenceLevel';
import Consequence from './Consequence/Consequence';
import Likelihood from './Likelihood/Likelihood';
import IncidentRiskLevel from './IncidentRiskLevel/IncidentRiskLevel';
import IncidentLevelCalculation from './IncidentRiskLevelCalculation/IncidentLevelCalculation';
import { useGetFieldsQuery } from '../../../redux/RTK/moduleDataApi';
import PrintFileIcon from '../../../assets/Icons/PrintFileIcon.png';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { useGetCategoryDetailsQuery, useGetConsequenceDetailsQuery, useGetConsequencelevelDetailsQuery, useGetIncidentRiskDetailsQuery, useGetIncidentRiskLevelCalculationQuery, useGetLikelihoodDetailsQuery } from '../../../redux/RTK/incidentRiskLevelApi';
import Logo from '../../../assets/Icons/Logo.png';
import IRLC_Pdf from '../../../features/IncidentManagement/IncidentCommon/Pdf Section/IRLC_Pdf'
import IRLC_Pdf_CL from '../../../features/IncidentManagement/IncidentCommon/Pdf Section/IRLC_Pdf_CL'
import IRLC_Pdf_C from '../../../features/IncidentManagement/IncidentCommon/Pdf Section/IRLC_Pdf_C'
import IRLC_Pdf_L from '../../../features/IncidentManagement/IncidentCommon/Pdf Section/IRLC_Pdf_L'
import IRLC_Pdf_IR from '../../../features/IncidentManagement/IncidentCommon/Pdf Section/IRLC_Pdf_IR'
import IRLC_Pdf_IRC from '../../../features/IncidentManagement/IncidentCommon/Pdf Section/IRLC_Pdf_IRC'

const PageUtilities = () => {
  const { t } = useTranslation();

  //* State Variables
  const [roleMenu, setRoleMenu] = useState();
  const [expandAll, setExpandAll] = useState(false);
  const pdfSectionRef = useRef(null);

  //* Selectors
  const { selectedMenu, userDetails, selectedRoleFacility, selectedFacility, selectedModuleId } = useSelector(
    (state) => state.auth
  );

   const { pageSize, pageIndex } = useSelector((state) => state.incidentRiskLevel);
  

  useEffect(() => {
    const roleMenu = selectedRoleFacility?.Menu.find(
      (item) => item.MenuId === selectedMenu?.id
    );
    setRoleMenu(roleMenu);
  }, [selectedRoleFacility, selectedMenu]);
  const { data: fieldAccess = [], isFetching: accessFetching } =
      useGetFieldsQuery({
        menuId: selectedMenu?.id,
        moduleId: 2,
        // moduleId: selectedModuleId,
      });

      const {
          data: getCategoryData = [],
          isFetching,
          refetch,
        } = useGetCategoryDetailsQuery(
          {
            payload: {
              pageIndex: pageIndex+1,
              pageSize: pageSize,
              headerFacility: selectedFacility?.id,
              loginUserId: 1,
              moduleId: 2,
              menuId: 22,
      
              // pageIndex: pageIndex,
              // pageSize: pageSize,
              // headerFacilityId: selectedFacility?.id,
              // loginUserId: userDetails?.UserId,
              // moduleId: selectedModuleId,
              // menuId: selectedMenu?.id,
            },
          },
          {
            skip: !selectedFacility?.id || !selectedModuleId || !selectedMenu?.id,
            refetchOnMountOrArgChange: true,
          }
        );
        console.log("print_IRLC", getCategoryData)

  const {
      data: getConseqenceLevelData = []
    } = useGetConsequencelevelDetailsQuery(
      {
        payload: {
          pageIndex: pageIndex+1,
          pageSize: pageSize,
          headerFacility: selectedFacility?.id,
          loginUserId: 1,
          moduleId: 2,
          menuId: 22,
        },
      },
      {
        // skip: !selectedFacility?.id || !selectedModuleId || !selectedMenu?.id,
        refetchOnMountOrArgChange: true,
      }
    );

    const {
        data: consequenceData = [],
      } = useGetConsequenceDetailsQuery(
        {
          payload: {
            pageIndex: pageIndex+1,
            pageSize: pageSize,
            headerFacility: 2,
            loginUserId: 1,
            moduleId: 2,
            menuId: 22,
          },
        },
        {
          // skip: !selectedFacility?.id || !selectedModuleId || !selectedMenu?.id,
          refetchOnMountOrArgChange: true,
        }
      );

      const {
          data: getLikelihoodDetails = [],
        } = useGetLikelihoodDetailsQuery(
          {
            payload: {
              pageIndex: 1,
              pageSize: 70,
              headerFacility: selectedFacility?.id,
              loginUserId: 1,
              moduleId: 2,
              menuId: 22,
            },
          },
          {
            skip: !selectedFacility?.id,
            refetchOnMountOrArgChange: true,
          }
        );

         const {
            data: getIncidentRiskData = [],
          } = useGetIncidentRiskDetailsQuery(
            {
              payload: {
                pageIndex: pageIndex + 1,
                pageSize: pageSize,
                headerFacility: 2,
                loginUserId: 1,
                moduleId: 2,
                menuId: 22,
              },
            },
            {
              skip: !selectedFacility?.id,
              refetchOnMountOrArgChange: true,
            }
          );
          
          const {
              data: getIncidentCalculateData,
              error,
              isLoading,
            } = useGetIncidentRiskLevelCalculationQuery(
              {
                payload: {
                  pageIndex: 1,
                  pageSize: 10,
                  headerFacility: 2,
                  loginUserId: 1,
                  moduleId: 2,
                  menuId: 26,
                  incidentRiskLevelCalculations: [],
                },
              },
              {
                refetchOnMountOrArgChange: true,
              }
            );

         
          

          


    const handlePrint = () => {
      try {
        const pdfSection = document.getElementById("pdfSectionRef");
        if (!pdfSection) {
          console.error("pdfSectionRef not found");
          return;
        }
    
        pdfSection.style.display = "block"; // Temporarily make div visible
    
        const doc = new jsPDF("1", "mm", "a3");
        const pdfFileName = "Incident_Report.pdf";
        let totalPages=0;
        const headerY = margin + 10;
        const footerY = pageHeight - margin - 15;
    
        const margin = 10;
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        const titleHeight = 15;
        const footerHeight = 20; 
    
        let startY = margin; // Start from margin
    
        // 🟢 Add Page Border
        doc.setDrawColor(0);
        doc.setLineWidth(1);
        doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);
    
        // 🟢 Add Logo at Top-Right
        const logoWidth = 50;
        const logoHeight = 15;
        const logoX = pageWidth - margin - logoWidth;
        const logoY = margin; // Align to top margin
    
        const imgElement = document.getElementById("logo");
        if (imgElement instanceof HTMLImageElement) {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = imgElement.width;
          canvas.height = imgElement.height;
          ctx?.drawImage(imgElement, 0, 0);
          const logoBase64 = canvas.toDataURL("image/png");
          doc.addImage(logoBase64, "PNG", logoX, logoY, logoWidth, logoHeight);
        }
    
        // 🟢 Add Hospital Name on Left Side
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("Accrehealth Hospital", margin + 5, margin + 10);
    
        // 🟢 Add Gray Background for Title Bar
        const titleY = logoY + logoHeight + 5; // Place below logo
        doc.setFillColor(192, 192, 192); // Gray Background
        doc.rect(margin, titleY, pageWidth - 2 * margin, titleHeight, "F");
    
        // 🟢 Add Centered Title
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text("Incident Risk Level Calculation", pageWidth / 2, titleY + 10, { align: "center" });
    
        startY = titleY + titleHeight + 5; // Move below title section

        // const checkAndAddPage = (contentHeight) => {
        //   const footerHeight = 5; // Space for footer
        //   const availableSpace = pageHeight - margin - footerHeight - startY;
          
        //   if (contentHeight > availableSpace) {
        //     doc.addPage();
        //     startY = margin + 5; // Reset to top margin after adding page
        //     doc.setDrawColor(0);
        //     doc.setLineWidth(1);
        //     doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);
        //   }
          
        // };
        const addHeader = () => {
          const logoWidth = 40; // Adjust based on your logo size
          const logoHeight = 20;
          
          // Add logo (Replace 'logo' with actual image variable)
          doc.addImage(logo, 'PNG', margin, margin, logoWidth, logoHeight);
      
          // Set font style exactly as on the first page
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(14);
      
          // Ensure title is aligned the same way
          const titleX = margin + logoWidth + 10; // Adjust X position as needed
          const titleY = margin + 15; // Adjust Y position to match first page
          doc.text('Main Title Here', titleX, titleY);
      };
        const checkAndAddPage = (contentHeight) => {
          const footerHeight = 5; // Space reserved for footer
          const availableSpace = pageHeight - margin - footerHeight - startY;
      
          if (contentHeight > availableSpace || startY + 20 > pageHeight - margin) {
              doc.addPage();
              startY = margin + 5; // Reset startY to maintain margin
              doc.setDrawColor(0);
              doc.setLineWidth(1);
              doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);
          }
          // addHeader();
      };
      

        doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Incident Report", pageWidth / 2, startY + 10, { align: "center" });

    startY += 15; // Move `startY` down to avoid overlap with table
    
        // 🟢 Extract Table Data from API
        if (!getCategoryData || !getCategoryData.Records || getCategoryData.Records.length === 0) {
          console.warn("No API data available for PDF!");
          pdfSection.style.display = "none";
          return;
        }
    
        const apiTableData = getCategoryData.Records.map((item, index) => [
          index + 1,
          item.CategoryAffected || "N/A",
        ]);
    
        console.log("API Table Data:", apiTableData);

        checkAndAddPage(60)
    
        // 🟢 Generate Table Below Header
        doc.autoTable({
          startY: startY + 10,
          head: [["S.no", "Category Name"]],
          body: apiTableData,
          theme: "grid",
          headStyles: {
            fillColor: false,
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

        startY = doc.lastAutoTable.finalY + 15;

        // 🟢 Add "All Data Report" Title Above the Second Table
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Consequence Level", pageWidth / 2, startY, { align: "center" });

    startY += 10; // Move `startY` down to avoid overlap

    // 🟢 Extract Data from getAll API
    if (!getConseqenceLevelData || !getConseqenceLevelData.Records || getConseqenceLevelData.Records.length === 0) {
      console.warn("No data available for the second table!");
      pdfSection.style.display = "none";
      return;
    }

    const ConsequenceLevelData = getConseqenceLevelData.Records.map((item, index) => [
      index + 1,
      item.ConsequenceLevel || "N/A",
      item.Score || "N/A",
    ]);

    checkAndAddPage(60)

    // 🟢 Generate Second Table
    doc.autoTable({
      startY: startY + 10,
      head: [["S.No", "Consequence Level", "Score"]],
      body: ConsequenceLevelData,
      theme: "grid",
      headStyles: {
        fillColor: false,
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

    startY = doc.lastAutoTable.finalY + 15;

        // 🟢 Add "All Data Report" Title Above the Second Table
        if (consequenceData?.Records?.length) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Consequence", margin, startY);

    startY += 10; // Move `startY` down to avoid overlap

    // 🟢 Extract Data from getAll API

    const ConsequenceData = consequenceData.Records.map((item, index) => [
      index + 1,
      item.CategoryAffected || "N/A",
      item.ConsequenceLevel || "N/A",
      item.Consequence || "N/A",
    ]);

    checkAndAddPage(60);

    // 🟢 Generate Second Table
    doc.autoTable({
      startY: startY + 10,
      head: [["S.No", "Category Affected", "Consequence Level", "Consequence"]],
      body: ConsequenceData,
      theme: "grid",
      headStyles: {
        fillColor: false,
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
    })};

    startY = doc.lastAutoTable.finalY + 15;

    if (getLikelihoodDetails?.Records?.length) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Likelihood", pageWidth / 2, startY, { align: "center" });
  
      startY += 10; // Move `startY` down to avoid overlap
  
      // 🟢 Extract Data from getAll API
  
      const LikelihoodData = getLikelihoodDetails.Records.map((item, index) => [
        index + 1,
        item.Likelihood || "N/A",
        item.LikelihoodDefinition || "N/A",
        item.Score || "N/A",
      ]);

      checkAndAddPage(60);
  
      // 🟢 Generate Second Table
      doc.autoTable({
        startY: startY + 10,
        head: [["S.No", "Likelihood", "Definition", "Score"]],
        body: LikelihoodData,
        theme: "grid",
        headStyles: {
          fillColor: false,
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
      })};

      startY = doc.lastAutoTable.finalY + 15;

      doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Risk Level", pageWidth / 2, startY, { align: "center" });

    startY += 10; // Move `startY` down to avoid overlap

    // 🟢 Extract Data from getAll API
    // if (!getIncidentRiskData || !getIncidentRiskData.Records || getIncidentRiskData.Records.length === 0) {
    //   console.warn("No data available for the second table!");
    //   pdfSection.style.display = "none";
    //   return;
    // }

    const RiskLevelData = getIncidentRiskData.Records.map((item, index) => [
      index + 1,
      item.IncidentRiskLevel || "N/A",
      item.ActionToBeTaken || "N/A",
      item.ScoreRange || "N/A",
      item.IsRCARequired || "N/A"
    ]);

    checkAndAddPage(60);

    // 🟢 Generate Second Table
    doc.autoTable({
      startY: startY + 10,
      head: [["S.No", "Incident Risk Level", "Action to be Taken", "Score Range", "RCA Required"]],
      body: RiskLevelData,
      theme: "grid",
      headStyles: {
        fillColor: false,
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

    startY = doc.lastAutoTable.finalY + 15;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Risk Level Calculation", pageWidth / 2, startY, { align: "center" });

    startY += 10; // Move `startY` down to avoid overlap

    // 🟢 Extract Data from getAll API
    // if (!getIncidentRiskData || !getIncidentRiskData.Records || getIncidentRiskData.Records.length === 0) {
    //   console.warn("No data available for the second table!");
    //   pdfSection.style.display = "none";
    //   return;
    // }

    const consequenceLevels = getConseqenceLevelData?.Records?.map(item => item.ConsequenceLevel) || [];
const likelihoods = getLikelihoodDetails?.Records?.map(item => item.Likelihood) || [];
const incidentRiskData = getIncidentCalculateData?.Records || []; // Ensure it's an array

// Debugging logs
console.log("Consequence Levels:", consequenceLevels);
console.log("Likelihoods:", likelihoods);
console.log("Incident Risk Data:", incidentRiskData);

// Construct matrix table data
const matrixTableData = [
  ["Consequence Level/Likelihood ", ...consequenceLevels], // Column headers
  ...likelihoods.map((likelihood) => [
    likelihood, // First column: Row headers
    ...consequenceLevels.map((consequence) => {
      const riskEntry = incidentRiskData.find(
        (record) =>
          record.Likelihood.trim().toLowerCase() === likelihood.trim().toLowerCase() &&
          record.ConsequenceLevel.trim().toLowerCase() === consequence.trim().toLowerCase()
      );
      return riskEntry?.RiskLevel || ""; // Display Risk Level Name
    }),
  ]),
];

checkAndAddPage(60);

// 🟢 Generate Matrix Table
doc.autoTable({
  startY: startY + 10,
  head: [matrixTableData[0]], // Column headers
  body: matrixTableData.slice(1), // Remaining rows
  theme: "grid",
  headStyles: {
    fillColor: false, // Light gray background
    textColor: [0, 0, 0],
    fontStyle: "bold",
    halign: "center",
  },
  styles: {
    fontSize: 10,
    cellPadding: 4,
    lineWidth: 0.5,
    lineColor: [0, 0, 0],
    halign: "center",
    valign: "middle",
  },
  columnStyles: {
    0: { fontStyle: "bold", fillColor: [230, 230, 230] }, // First column styled differently
  },
  margin: { left: margin + 10, right: margin + 10 },
  
});

startY = doc.lastAutoTable.finalY + 15;


    

        
      totalPages = doc.internal.pages.length;

      for (let i = 1; i <= totalPages - 1; i++) {
        doc.setPage(i);
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        
        // Define footer position ensuring it's at the very bottom
        const footerMargin = 15; // Adjust if needed
        const footerY = pageHeight - footerMargin; 
        
        // Page Number
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(
            `Page ${i} of ${totalPages - 1}`,
            pageWidth - 40, 
            footerY, 
            { align: 'right' }
        );
    
        // Confidential Information Text
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(
            `Confidential Information`,
            pageWidth / 2, 
            footerY, 
            { align: 'center' }
        );
    }

    doc.setDrawColor(0);
doc.setLineWidth(1);
doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);
    
        // 🟢 Finalize and Save PDF
        doc.save(pdfFileName);

    
        pdfSection.style.display = "none"; // Hide div after PDF generation
      } catch (error) {
        console.error("PDF generation error:", error);
      }
    };
    
      
      
      
      
      
      
      
      

  return (
    <FlexContainer
      width="100%"
      height="100%"
      flexDirection="column"
      justifyContent="space-between"
    >
      <FlexContainer justifyContent={'space-between'} padding="0 0 15px 0">
        <StyledTypography
          fontWeight="900"
          lineHeight="44px"
          color="#0083C0"
          whiteSpace={'nowrap'}
          sx={{
            fontSize: {
              xs: '1.5rem',
              sm: '1.75rem',
              md: '2rem',
              lg: '2.25rem',
            },
          }}
        >
          {t('IM_IncidentRiskLevelCalculation')}
        </StyledTypography>
      </FlexContainer>
      <FlexContainer width="100%" height="auto" flex="1" flexDirection="column">
        <FlexContainer
          height="100%"
          width="100%"
          padding="30px 15px 30px 15px"
          borderRadius="8px"
          flexDirection="column"
          backgroundColor="#fff"
          boxShadow="0px 4px 4px 0px #00000029"
        >
          <FlexContainer
            style={{
              justifyContent: 'flex-end',
              width: '100%',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '10px',
            }}
          >
            <StyledImage
              height="40px"
              width="40px"
              gap="10px"
              cursor="pointer"
              borderRadius="40px"
              src={PrintFileIcon}
              onClick={handlePrint}
              // onClick={handlePrint}
              alt="Print"
              animate={true}
            />
            {!expandAll && (
              <StyledButton
                onClick={() => {
                  setExpandAll(true);
                }}
                fontSize="13px"
                backgroundColor="#0083c0"
                style={{
                  display: 'inline-flex',
                  gap: '8px',
                  float: 'right',
                  cursor: 'pointer',
                }}
              >
                {t('ExpandAll')}
              </StyledButton>
            )}
            {expandAll && (
              <StyledButton
                onClick={() => {
                  setExpandAll(false);
                }}
                fontSize="13px"
                backgroundColor="#0083c0"
                style={{
                  display: 'inline-flex',
                  gap: '8px',
                  float: 'right',
                  cursor: 'pointer',
                }}
              >
                {t('CollapseAll')}
              </StyledButton>
            )}
          </FlexContainer>
          {/* {userDetails?.StaffCategoryId === 1 && ( */}
          <CategoryAffected
            expandAll={expandAll}
            isEditAccess={roleMenu?.IsEdit}
            fieldAccess={fieldAccess}
            isViewAccess={roleMenu?.IsView}
          />
          {/* )} */}

          <ConsequenceLevel
            expandAll={expandAll}
            isEditAccess={roleMenu?.IsEdit}
            isViewAccess={roleMenu?.IsView}
            fieldAccess={fieldAccess}
          />
          <Consequence
            expandAll={expandAll}
            isEditAccess={roleMenu?.IsEdit}
            isViewAccess={roleMenu?.IsView}
            fieldAccess={fieldAccess}
          />
          <Likelihood
            expandAll={expandAll}
            isEditAccess={roleMenu?.IsEdit}
            isViewAccess={roleMenu?.IsView}
            fieldAccess={fieldAccess}
          />
          <IncidentRiskLevel
            expandAll={expandAll}
            isEditAccess={roleMenu?.IsEdit}
            isViewAccess={roleMenu?.IsView}
            fieldAccess={fieldAccess}
          />
          <IncidentLevelCalculation
            expandAll={expandAll}
            isEditAccess={roleMenu?.IsEdit}
            isViewAccess={roleMenu?.IsView}
          />
        </FlexContainer>
      </FlexContainer>
      <div
        ref={pdfSectionRef}
        id="pdfSectionRef"
        className="no-print"
        style={{ display: 'none' }}
      >
        <>
          <img id="logo" src={Logo} />
        </>
        <IRLC_Pdf categoryData={getCategoryData} />
        <IRLC_Pdf_CL getConseqenceLevelData={getConseqenceLevelData} />
        <IRLC_Pdf_C consequenceData={consequenceData} />
        <IRLC_Pdf_L LikelihoodData={getLikelihoodDetails} />
        <IRLC_Pdf_IR RiskLevelData={getIncidentRiskData} />
        <IRLC_Pdf_IRC
  RiskLevelData={getIncidentRiskData} 
  LikelihoodData={getLikelihoodDetails} 
  ConsequenceLevelData={getConseqenceLevelData} 
/>
      </div>
    </FlexContainer>
  );
};

export default PageUtilities;
