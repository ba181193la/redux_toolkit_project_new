import { Grid, TextField, Typography, Button,IconButton,Accordion,AccordionSummary,Dialog,DialogTitle,DialogContent,Box,Tooltip   } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';
import { Formik, Form } from 'formik';

import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
  CommonStyledButton,
} from '../../../../utils/StyledComponents';
import {
  ActionButton,
  FormContainer,
  FormLabel,
  StyledGridContainer,
  StyledGridItem,
} from '../../IncidentInvestigation/IncidentInvestigation.styled';

// import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '../../../../assets/Icons/CloseIcon.png';
import DoNotDisturbIcon from '../../../../assets/Icons/DoNotDisturbIcon.png';

import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../../redux/RTK/moduleDataApi';
import { getlabel } from '../../../../utils/language';
import Label from '../../../../components/Label/Label';
import { useTranslation } from 'react-i18next';
import { useUpdateMergeIncidentMutation } from '../../../../redux/RTK/IncidentManagement/incidentApprovalApi';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Margin } from '@mui/icons-material';
import IncidentList from './IncidentList';
import { showSweetAlert,showToastAlert } from '../../../../utils/SweetAlert';
import Error from '../../../../assets/Gifs/error.gif';
import SuccessGif from '../../../../assets/Gifs/SuccessGif.gif';


const MergeIncident = ({entryData,  common_data}) => {
  const fileInputRef = useRef(null);
  const { id } = useParams();
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [color, setColor] = useState('');

  const [isIncidentModel, setIsIncidentModel] = useState(false);
  const [selectedIncident, setSelectedIncident] = React.useState(null);
   const [triggerUpdateMergeIncident] =
      useUpdateMergeIncidentMutation();

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
      fields: `IA_P_IncidentNumber`,
      translationId: 'IM_IA_IncidentNumber',
      label: 'Incident Number',
      name: 'IncidentNumber',
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


  const {
    selectedMenu,
    userDetails,
    selectedFacility,
    selectedModuleId,
    roleFacilities,
    isSuperAdmin,
  } = useSelector((state) => state.auth);




  


  const handleSearch = () => {
    setIsIncidentModel(true);
  };

  const handleClose = () => {
    setIsIncidentModel(false);
  };

  const handleSelectRow = (incident) => {
    const [subCategory, incidentDetails] = incident.CategoryDetail
      ? incident.CategoryDetail.split('-')
      : ['', ''];
      setSelectedIncident({
      ...incident,
      SubCategory: subCategory,
      IncidentDetails: incidentDetails,
    });
  
    handleClose(); 
  };

  let ReoccurrenceLog = entryData?.reoccurrenceDetails?.length > 0 ? {
    "reoccurrenceLogId": entryData.reoccurrenceDetails.ReoccurrenceLogId,
    "incidentApprovalId": entryData.reoccurrenceDetails.IncidentApprovalId,
    "incidentNo": entryData.reoccurrenceDetails.IncidentNo,
    "incidentDetailId": entryData.reoccurrenceDetails.IncidentDetailId,
    "incidentDetail": entryData.reoccurrenceDetails.IncidentDetail,
    "incidentDate": entryData.reoccurrenceDetails.IncidentDate,
    "locationDetails": entryData.reoccurrenceDetails.LocationDetails,
    "isDelete": entryData.reoccurrenceDetails.IsDelete,
    "incidentReason": entryData.reoccurrenceDetails.IncidentReason,
    "recommendation": entryData.reoccurrenceDetails.Recommendation
  } : [];

  
  const handleSubmit = async (values) => {
   try {



    const response =   await triggerUpdateMergeIncident({
      payload: {
        "incidentId": id,
        "facilityId": selectedFacility?.id,
        "approverUserId": userDetails?.UserId,
        "incidentTypeId": entryData?.IncidentTypeId,
        "incidentType":entryData?.IncidentType,
        "clinicalType": entryData?.ClinicalType,
        "affectedCategoryId": entryData?.AffectedCategoryId,
        "affectedCategory": entryData?.AffectedCategory,
        "mainCategoryId": entryData?.MainCategoryId,
        "mainCategory": selectedIncident?.MainCategory,
        "subCategoryId": entryData?.SubCategoryId,
        "subCategory": selectedIncident?.SubCategory,
        "incidentDetailId": entryData?.IncidentDetailId,
        "incidentDetail": selectedIncident?.IncidentDetails,
        "departmentId": entryData?.DepartmentId,
        "departmentName": entryData?.DepartmentName,
        "incidentHarmLevelId": entryData?.IncidentHarmLevelId,
        "incidentHarmLevel": entryData?.IncidentHarmLevel,
        "incidentReoccurence": "no",
        "incidentClosureTATId": 1,
        "closureTATDays": 1,
        "locationDetials": "",
        "additionalStaffNotify": "No",
        "approverStatus": "Incident Merged",
        "isSentinel": true,
        "slaPriority": "",
        "moduleId": selectedModuleId,
        "menuId": selectedMenu?.id,
        "loginUserId": userDetails?.UserId,
        "mergedIncidentId": selectedIncident?.IncidentId,
        "othersName": "",
        "incidentApproval_ReoccurrenceLog": common_data.incidentApproval_ReoccurrenceLog,
        "incidentApproval_AdditionalNotifyStaff": []
      },
    }).unwrap();
    
    showToastAlert({
      type: 'custom_success',
      text: response.Message,
      gif: SuccessGif,
    });
    setMessage(response.Message);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    navigate("/IncidentManagement/IncidentApproval");

  }

  catch (error) {
    if (error && error.data) {
      showSweetAlert({
        type: 'warning',
        title: 'Oops!',
        text: error.data,
        gif: Error,
        showConfirmButton: true, 
      confirmButtonText: 'Close', 
      });
      setColor('#e63a2e');
      setMessage('Failed');
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  }


  };
  
  return (


    <Accordion
          sx={{
            borderColor: '#3498db',
            marginBottom: '10px',
            border: '1px solid #3498db',
            borderRadius: '8px 8px 0px 0px',
          }}
          expanded={true}
        >
          <AccordionSummary
            aria-controls="panel1-content"
            id="panel1-header"
            sx={{
              backgroundColor: '#3498db',
              width: '100%',
            }}
          >
            <StyledTypography
              fontSize="16px"
              fontWeight="700"
              lineHeight="20px"
              textAlign="center"
              color="#FFFFFF"
              border={'1px solid #3498db'}
            >
              Merge Incident
            </StyledTypography>
          </AccordionSummary>
    <FormContainer style={{ marginBottom: '20px', paddingLeft: '0px' }}>
      <FlexContainer flexDirection="column" gap="16px">


      <Grid container spacing={2} style={{ paddingLeft: '0px' }}>
      {/* Incident Number */}
      <Grid item xs={3}>
        <FormLabel style={{ marginBottom: '8px', display: 'block' }}>
          Incident Number:
        </FormLabel>
        <Grid container alignItems="center" spacing={1}>
          <Grid item xs>


            <div style={{ position: 'relative', display: 'flex', alignItems: 'center',   backgroundColor: '#eee',
                             }}>
                    <TextField
                      fullWidth
                      value={selectedIncident?.IncidentNo || ''}
                      disabled
                      sx={{
                        '& .MuiInputBase-input.Mui-disabled': {
                          opacity: 1,
                          fontWeight: 'bold',
                          color: 'black',
                          WebkitTextFillColor: 'black',
                          backgroundColor: '#eee',
                        },
                      }}
                      InputProps={{
                        style: {
                          paddingRight: '40px',
                          backgroundColor: '#eee',
      
                        },
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        right: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        height: '100%',
                        borderLeft: '1px solid #ccc',
                        paddingLeft: '10px',
                        backgroundColor: '#eee',
      
                      }}
                    >
                      <i
                        className="fa fa-search"
                        onClick={handleSearch}
                        style={{
                          cursor: 'pointer',
                          fontSize: '15px',
                          color: '#555',
                          backgroundColor: '#eee',
      
                          
                        }}
                      ></i>
                    </div>
                  </div>



            {/* <TextField
              fullWidth
              value={selectedIncident?.IncidentNo || ''}
              placeholder="Enter Incident Number"
              InputProps={{
                readOnly: true,
              }}
              sx={{
                '& .MuiInputBase-input': {
                  fontWeight: 'bold',
                },
              }}
            /> */}
          </Grid>
          {/* <Grid item>
            <IconButton  onClick={handleSearch}>
              <SearchIcon />
            </IconButton>
          </Grid> */}
        </Grid>
      </Grid>


      <Dialog
      open={isIncidentModel}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: '900px',
          maxWidth: 'none',
          borderRadius: '8px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
        },
      }}
    >
      <Box>
        <DialogTitle
          sx={{
            backgroundColor: '#205475',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            height: 40,
            alignItems: 'center',
            padding: '0 8px',
          }}
        >
          <StyledTypography
            fontSize="18px"
            fontWeight="300"
            lineHeight="18px"
            padding="0 12px"
            color="#fff"
          >
            {/* {t('Staff')} */}
            Incident Detail List
          </StyledTypography>
          <IconButton
            onClick={handleClose}
            sx={{
              color: '#fff',
              '&:hover': {
                transform: 'scale(1.05)',
                transition: 'transform 0.3s ease',
                backgroundColor: 'rgba(15, 108, 189, 0.2)',
              },
            }}
          >
            <Tooltip title="Close" arrow>
              <StyledImage src={CloseIcon} alt="Close Icon" tooltip="Close" />
            </Tooltip>
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ border: '4px solid #205475' }}>
          <Formik>
              <Form>
                <Box
                  sx={{
                    marginBottom: 2,
                    display: 'block',
                    alignItems: 'center',
                  }}
                >
                  <FlexContainer padding="20px 20px 20px 0" alignItems="center">
                    <FlexContainer width="50%" gap="0px" alignItems="center">
                      
                      <Box sx={{ padding: '0 0 0 20px',width:"60%" }}>
                       
                      </Box>
                    </FlexContainer>
                  </FlexContainer>

                  <IncidentList
                    data={[]}
                    columns={[]}
                    staffFetching={false} 
                    isEdit={false} 
                    labels={{}}  
                    totalRecords={0} 
                    setIsStaffModel={() => {}}  
                    setSelectedFacilityId={null}  
                    selectedFacilityId={null}  
                    setStaffFacilityId={null} 
                    onSelectRow={handleSelectRow}
                  />

                 
                </Box>

                
              </Form>
          </Formik>
        </DialogContent>
      </Box>
    </Dialog>



      {/* Incident Main Category */}
      <Grid item xs={3}>
        <FormLabel style={{ marginBottom: '8px', display: 'block' }}>
          Incident Main Category:
        </FormLabel>
        <TextField
          fullWidth
          value={selectedIncident?.MainCategory || ''}
          placeholder="Enter Main Category"
          InputProps={{
            readOnly: true,
          }}
          sx={{
            '& .MuiInputBase-input': {
              fontWeight: 'bold',
            },
          }}
        />
      </Grid>

      {/* Incident Sub Category */}
      <Grid item xs={3}>
        <FormLabel style={{ marginBottom: '8px', display: 'block' }}>
          Incident Sub Category:
        </FormLabel>
        <TextField
          fullWidth
          value={selectedIncident?.SubCategory || ''}
          placeholder="Enter Sub Category"
          InputProps={{
            readOnly: true,
          }}
          sx={{
            '& .MuiInputBase-input': {
              fontWeight: 'bold',
            },
          }}
        />
      </Grid>

      {/* Incident Details */}
      <Grid item xs={3}>
        <FormLabel style={{ marginBottom: '8px', display: 'block' }}>
          Incident Details:
        </FormLabel>
        <TextField
          fullWidth
          value={selectedIncident?.IncidentDetails || ''}
          placeholder="Enter Incident Details"
          sx={{
            '& .MuiInputBase-input': {
              fontWeight: 'bold',
            },
          }}
        />
      </Grid>
    </Grid>

        {/* Comments Section */}



        {/* Action Buttons */}
        <FlexContainer
          style={{
            gap: '20px',
            marginTop: '10px',
            marginLeft: '0px',
            justifyContent: 'center', // Center the buttons horizontally
          }}
        >
          <ActionButton
            style={{
              backgroundColor: '#5cb85c',
              color: 'white',
            }}
            startIcon={
              <i className="fas fa-save" style={{ marginInlineEnd: 8 }} />
            }
            onClick={() => handleSubmit(selectedIncident)}
          >
            {t('Submit')}
          </ActionButton>

          <ActionButton
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
            }}
            startIcon={
              <i
                className="fas fa-ban"
                style={{
                  color: 'white',
                  marginInlineEnd: 8,
                  fontSize: '16px',
                }}
              />
            }
          >
            {t('Cancel')}
          </ActionButton>
        </FlexContainer>
      </FlexContainer>
    </FormContainer>
    </Accordion>
  );
};

export default MergeIncident;
