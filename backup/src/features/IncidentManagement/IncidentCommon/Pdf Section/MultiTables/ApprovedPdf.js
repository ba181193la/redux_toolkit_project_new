import React, { useRef, useState, useEffect } from 'react';
import {
    Modal,
    Backdrop,
    Box,
    Typography,
    IconButton,
    Tooltip,
    Grid,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,

  } from '@mui/material';

import { useTranslation } from 'react-i18next';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../../../redux/RTK/moduleDataApi';
// import { getlabel } from '../../../utils/language';
import { useGetIncidentApprovalPendingByIdQuery } from '../../../../../redux/RTK/incidentInvestigationApi';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import formatDate from '../../../../../utils/FormatDate';
import LastApproveIncidentTable from './LastApproved';



export default function Approved(){

    const { i18n, t } = useTranslation();
    const { id } = useParams();
  
    const {
      selectedMenu,
      userDetails,
      selectedFacility,
      selectedModuleId,
      roleFacilities,
      isSuperAdmin,
    } = useSelector((state) => state.auth);
  
    const { data: approvalData, isFetching: isFetchingData } =
      useGetIncidentApprovalPendingByIdQuery(
        {
          menuId: 26,
          loginUserId: userDetails?.UserId,
          incidentId: id,
           moduleId: 2
        },
        { skip: !id }
      );
  
    const { incidentApproval, incidentApprovalInvestigators } =
      approvalData?.Data || {};
  
    const reportIncidentSafe = approvalData?.Data || {};
    const incidentApprovalInvestigatorsSafe = incidentApprovalInvestigators || [];

  
    const fieldsConfig = [
      {
        fieldId: `IA_P_IncidentMainCategory`,
        translationId: 'IM_IA_IncidentMainCategory',
        label: 'Incident Main Category',
        name: 'MainCategory',
      },
      {
        fieldId: `IA_P_IncidentSubCategory`,
        translationId: 'IM_IA_IncidentSubCategory',
        label: 'Incident Sub Category',
        name: 'SubCategory',
      },
      {
        fields: `IA_P_IncidentDetails`,
        translationId: 'IM_IA_IncidentDetails',
        label: 'Incident Details',
        name: 'IncidentDetail',
      },
      {
        fieldId: `IA_P_IncidentType`,
        translationId: 'IM_IA_IncidentType',
        label: 'Incident Type',
        name: 'IncidentTypeName',
      },
      {
        fieldId: `IA_P_Clinical/NonClinical`,
        translationId: 'IM_IA_Clinical/NonClinical',
        label: 'Clinical/Non-Clinical',
        name: 'ClinicalType',
      },
      {
        fieldId: `IA_P_IncidentDepartment`,
        translationId: 'IM_IA_IncidentDepartment',
        label: 'Incident Department',
        name: 'DepartmentName',
      },
      {
        fieldId: `IA_P_LocationDetails(Roomnoetc)`,
        translationId: 'IM_IA_LocationDetails(Roomnoetc)',
        label: 'Location Details/Room No etc',
        name: 'LocationDetials',
      },
      {
        fieldId: `IA_P_HarmLevel`,
        translationId: 'IM_IA_HarmLevel',
        label: 'Harm Level',
        name: 'IncidentHarmLevel',
      },
      {
        fieldId: `IA_P_Anyadditionalstaffyouwishtobenotified`,
        translationId: 'IM_IA_Anyadditionalstaffyouwishtobenotified',
        label: 'Any Additional Staff You Wish To Be Notified',
        name: 'AdditionalStaffNotify',
      },
      {
        fieldId: `IA_P_ApprovedBy`,
        translationId: 'IM_IA_ApprovedBy',
        label: 'Approved By',
        name: 'ApprovedBy',
      },
      {
        fieldId: `IA_P_ApprovedDate`,
        translationId: 'IM_IA_ApprovedDate',
        label: 'Approved Date',
        name: 'ApprovalDate',
      },
      {
        fieldId: `IA_P_ApprovedTime`,
        translationId: 'IM_IA_ApprovedTime',
        label: 'Approved Time',
        name: 'ApprovalTime',
      },
      {
        fieldId: `IA_P_IncidentStatus`,
        translationId: 'IM_IA_IncidentStatus',
        label: 'Status',
        name: 'ApproverStatus',
      },
    ];
  
    const AssignedInvestigator = [
      {
        fieldId: `IA_P_AssignedInvestigator(s)`,
        translationId: 'IM_IA_InvestigatorName',
        label: 'Name',
        name: 'UserName',
      },
      {
        fieldId: `IA_AI_Department`,
        translationId: 'IM_IA_Department',
        label: 'Department',
        name: 'DepartmentName',
      },
      {
        fieldId: `IA_AI_Designation`,
        translationId: 'IM_IA_Designation',
        label: 'Designation',
        name: 'DesignationName',
      },
      {
        fieldId: `IA_AI_InvestigationComments`,
        translationId: 'IM_IA_InvestigationComments',
        label: 'Investigation Comments',
        name: 'Comments',
      },
      {
        fieldId: `IA_AI_AssignedBy`,
        translationId: 'IM_IA_AssignedBy',
        label: 'Assigned By',
        name: 'AssignedBy',
      },
      {
        fieldId: `IA_AI_AssignedOn`,
        translationId: 'IM_IA_AssignedOn',
        label: 'Assigned On',
        name: 'AssignOn',
      },
    ];
  
    const { data: labelsData = [], isFetching: isLabelsFetching } =
      useGetLabelsQuery({
        menuId: 26,
        moduleId: 2,
      });
    const { data: fieldsData = [], isFetching: isFieldsFetching } =
      useGetFieldsQuery({
        menuId: 26,
        moduleId: 2,
      });
  
    const fields =
      fieldsData?.Data?.Menus?.filter((item) => item.MenuId === 26) || [];
  
    const labels = (labelsData.Data || [])
      .filter((item) => item.MenuId === 26)
      .flatMap((item) =>
        (item.Regions || [])
          .filter((region) => region.RegionCode === 'ALL')
          .flatMap((region) => region.Labels || [])
      );
  
    const filterLabels = { Data: labels };
  
    const filteredFieldsConfig = fieldsConfig.filter((field) =>
      labels.some((label) => label.TranslationId === field.translationId)
    );
    const [configs, setConfigs] = useState({
      fieldsConfig,
      AssignedInvestigator,
    });
  
    useEffect(() => {
      if (fields?.length > 0) {
        const matchingSections = fields[0]?.Sections?.filter(
          (section) =>
            section.SectionName === 'Accordion-Assigned Investigator(s)' ||
            section.SectionName === 'Accordion-Page'
        );
  
        const pageFields = matchingSections?.flatMap(
          (section) =>
            section?.Regions?.find((region) => region.RegionCode === 'ALL')
              ?.Fields || []
        );
  
        if (pageFields && pageFields.length > 0) {
          const updatedConfigs = Object.entries(configs).reduce(
            (acc, [key, config]) => ({
              ...acc,
              [key]: config.filter((column) => {
                const pageField = pageFields.find(
                  (col) => col.FieldId === column.fieldId
                );
  
                return pageField && pageField.IsShow === true;
              }),
            }),
            {}
          );
  
          setConfigs(updatedConfigs);
        }
      }
    }, [fields[0]]);
  
    const formatCellValue = (label, value) => {
      if (label === 'Approved Date:' && value) {
        return formatDate(value);
      }
      if (label === 'Approval Time:' && value) {
        const timePart = value.split('T')[1];
        if (timePart) {
          const [hours, minutes] = timePart.split(':');
          return `${hours}:${minutes}`;
        }
      }
      return value;
    };
    
return(

    <>


<Box sx={{ display: 'flex', justifyContent: 'center', padding: 2, gap: 3 }}>
  <TableContainer sx={{ width: '100%', maxWidth: 1200 }}>
    <Table id='textTable'>
      <TableHead>
        <TableRow style={{backgroundColor:'#c0c0c0'}}>
          <TableCell colSpan={12} align="center" sx={{ border: '1px solid black', width:'100%',padding: '8px' }}>
            <Typography variant="h6" >Incident Approval Details</Typography>
          </TableCell>
        </TableRow>
      </TableHead>
  

    </Table>
  </TableContainer>


</Box>
<Box sx={{ position: 'relative', minHeight: '100vh' }}>
  <Table id= 'Approval' sx={{ 
    border: '1px solid black',
    borderCollapse: 'collapse',
    width: '100%',
    marginBottom: '120px' 
  }}>
    {/* Header */}
    <TableHead>
      <TableRow sx={{ backgroundColor: '#c0c0c0' }}>
      </TableRow>
    </TableHead>

    <TableBody>
  {[
    ['Incident Main Category:', reportIncidentSafe.MainCategory, 'Incident Sub Category:', reportIncidentSafe.SubCategory],
    ['Incident Details', reportIncidentSafe.IncidentDetail, 'Incident Type:', reportIncidentSafe.IncidentType],
    ['Clinical/Non Clinical:', reportIncidentSafe.ClinicalType, 'Incident Department:', reportIncidentSafe.DepartmentName],
    ['Location Details:', reportIncidentSafe.LocationDetials, 'Harm Level:', reportIncidentSafe.IncidentHarmLevel],
    ['Any additional staff you wish to be notified?:', reportIncidentSafe.AdditionalStaffNotify, 'Approval Status:', reportIncidentSafe.ApproverStatus],
    ['Approved By:', reportIncidentSafe.ApprovedBy, 'Approved Date:', reportIncidentSafe.ApprovedDateTime],
    ['Approval Time:', reportIncidentSafe.ApprovedDateTime, '', '']
  ].map((row, rowIndex) => (
    <TableRow key={rowIndex}>
      {row.map((cell, cellIndex) => {
        const isLabel = cellIndex % 2 === 0;
        let content = cell;
        // If it's a value cell, check the label immediately before it
        if (!isLabel && row[cellIndex - 1]) {
          content = formatCellValue(row[cellIndex - 1], cell);
        }
        return (
          <TableCell
            key={cellIndex}
            className={isLabel ? 'bold-cell' : ''}
            sx={{
              fontWeight: isLabel ? 'bold' : 'normal',
              padding: '8px',
              backgroundColor: isLabel ? '#f5f5f5' : 'white',
              border: '1px solid black',
              width: '25%',
            }}
            colSpan={3}
          >
            {content}
          </TableCell>
        );
      })}
    </TableRow>
  ))}
</TableBody>

  </Table>

  {/* Footer */}
  <Box sx={{
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '16px',
    borderTop: '1px solid black'
  }}>
  </Box>
</Box>

 {/* <LastApproveIncidentTable
        columns={configs.AssignedInvestigator}
        labels={filterLabels}
        data={incidentApprovalInvestigatorsSafe}
      /> */}

    </>
)
}