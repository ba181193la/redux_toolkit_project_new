import { useTranslation } from 'react-i18next';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Grid,
  TextField,
} from '@mui/material';
import BackArrowGif from '../../../../assets/Gifs/BackArrowGif.gif';
import BackArrow from '../../../../assets/Icons/white/left-arrow.png';
import DoneIcon from '../../../../assets/Icons/DoneIcon.png';
import DndIcon from '../../../../assets/Icons/DoNotDisturbIcon.png';
import { useNavigate, useParams } from 'react-router-dom';
import Label from '../../../../components/Label/Label';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../../redux/RTK/moduleDataApi';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getlabel } from '../../../../utils/language';
import SearchDropdown from '../../../../components/SearchDropdown/SearchDropdown';
import TextArea from '../../../../components/TextArea/TextArea';
import { useUpdateInvesigationApprovalMutation } from '../../../../redux/RTK/IncidentManagement/incidentInvestigationApprovalApi';
import { showToastAlert } from '../../../../utils/SweetAlert';
import IncidentDetails from '../../IncidentCommon/IncidentDetails';
import IncidentApprovalDetails from '../../IncidentCommon/IncidentApprovalDetails';
import IncidentInvestigationDetails from '../../IncidentCommon/IncidentInvestigationDetails';

const InvestigationPendingDetails = () => {
  //* Hooks Declaration
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id: incId } = useParams();

  //* Selectors
  const { selectedMenu, regionCode, selectedModuleId, userDetails } =
    useSelector((state) => state.auth);

  //* State variables
  const [fieldLabels, setFieldLabels] = useState([]);
  const [pageFields, setPageFields] = useState([]);
  const [actionList, setActionList] = useState([
    {
      text: 'Approve',
      value: 'Approved',
    },
    {
      text: 'Reject',
      value: 'Rejected',
    },
  ]);

  //* RTK Queries

  const [triggerSubmitApproval] = useUpdateInvesigationApprovalMutation();

  const { data: labels = [], isFetching: labelsFetching } = useGetLabelsQuery({
    menuId: selectedMenu?.id,
    moduleId: 2,
    // moduleId: selectedModuleId,
  });

  const { data: fieldAccess = [], isFetching: accessFetching } =
    useGetFieldsQuery({
      menuId: selectedMenu?.id,
      moduleId: 2,
      // moduleId: selectedModuleId,
    });

  //* Field access checking
  useEffect(() => {
    if (fieldAccess?.Data) {
      const allFieldsData = fieldAccess?.Data?.Menus?.find(
        (section) => section?.MenuId === selectedMenu?.id
      );

      const pageFields = allFieldsData?.Sections?.find(
        (section) => section.SectionName === 'Page'
      );

      if (pageFields) {
        const allFields =
          pageFields?.Regions.find((region) => region?.RegionCode === 'ALL')
            ?.Fields || [];
        const regionBasedFields =
          regionCode === 'ABD'
            ? pageFields?.Regions.find((region) => region?.RegionCode === 'ABD')
                ?.Fields || []
            : [];
        const combinedFields =
          regionBasedFields.length > 0
            ? [...allFields, ...regionBasedFields]
            : allFields;

        setPageFields(combinedFields);
      }
    }
  }, [fieldAccess, regionCode]);

  //* Use Effects to bind values
  useEffect(() => {
    if (labels?.Data) {
      const filteredLabels = labels?.Data?.find(
        (x) => x.MenuId === selectedMenu?.id
      )?.Regions;

      const allLabels =
        filteredLabels?.find((x) => x.RegionCode === 'ALL')?.Labels || [];

      const regionBasedLabels =
        regionCode === 'ABD'
          ? filteredLabels?.find((x) => x.RegionCode === 'ABD')?.Labels || []
          : [];
      const combinedLabels =
        regionBasedLabels.length > 0
          ? [...allLabels, ...regionBasedLabels]
          : allLabels;

      setFieldLabels(combinedLabels);
    }
  }, [labels, regionCode]);

  //* Validation schema
  const validationSchema = Yup.object({
    action: Yup.string().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'IIA_P_Action')?.IsMandatory ===
        true,
      then: (schema) =>
        schema.required(
          `${getlabel(
            'IM_IIA_Action',
            {
              Data: fieldLabels,
              Status: labels?.Status,
            },
            i18n.language
          )} ${t('IsRequired')}`
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
    remarks: Yup.string().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'IIA_P_ApproverRemarks')
          ?.IsMandatory === true,
      then: (schema) =>
        schema.required(
          `${getlabel(
            'IM_IIA_ApproverRemarks',
            {
              Data: fieldLabels,
              Status: labels?.Status,
            },
            i18n.language
          )} ${t('IsRequired')}`
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const submitApprovalStatus = async (values) => {
    let response;
    try {
      response = await triggerSubmitApproval({
        incidentId: incId,
        moduleId: 2,
        // moduleId: selectedModuleId,
        menuId: selectedMenu?.id,
        loginUserId: userDetails?.UserId,
        approverStatus: values?.action,
        approverRemarks: values?.remarks,
      });

      if (
        response &&
        response?.data?.Message === 'Record Updated Successfully'
      ) {
        showToastAlert({
          type: 'custom_success',
          text: response?.data?.Message,
          gif: 'SuccessGif',
        });
        navigate('/IncidentManagement/IncidentInvestigationApproval');
      }
    } catch (error) {
      console.error('Failed to submit investigation approval', error);
    }
  };

  return (
    <FlexContainer
      width="100%"
      height="auto"
      flexDirection="column"
      justifyContent="center"
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
              lg: '2rem',
            },
          }}
        >
          {t('IM_IncidentInvestigationApprovalDetails')}
        </StyledTypography>
      </FlexContainer>
      <FlexContainer width="100%" height="auto" flex="1" flexDirection="column">
        <FlexContainer
          width="100%"
          height="auto"
          flex="1"
          flexDirection="column"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
          }}
        >
          <FlexContainer
            alignItems="center"
            width="100%"
            flexWrap="wrap"
            marginInlineStart="20px !important"
            marginBlockTop="10px !important"
          >
            <StyledButton
              borderRadius="6px"
              gap="4px"
              padding="6px 10px"
              variant="contained"
              backgroundColor="#3498db"
              type="button"
              style={{
                display: 'inline-flex',
                gap: '5px',
              }}
              onClick={() =>
                navigate('/IncidentManagement/IncidentInvestigationApproval')
              }
              startIcon={
                <StyledImage
                  height="20px"
                  width="20px"
                  src={BackArrow}
                  alt="WhiteSearch"
                />
              }
            >
              {t('Previous')}
            </StyledButton>
          </FlexContainer>
          <FlexContainer
            alignItems="center"
            width="100%"
            flexWrap="wrap"
            padding="20px"
          >
            <IncidentDetails />
            <IncidentApprovalDetails />
            <IncidentInvestigationDetails />
            <Accordion
              sx={{
                margin: '10px',
                border: '1px solid  #406883',
                borderRadius: '8px 8px 0px 0px',
                width: '100%',
              }}
              expanded={true}
            >
              <AccordionSummary
                aria-controls="panel1-content"
                id="panel1-header"
                sx={{
                  backgroundColor: '#406883',
                  width: '100%',
                  justifyContent: 'center',
                }}
              >
                <StyledTypography
                  fontSize="18px"
                  fontWeight="700"
                  lineHeight="20px"
                  textAlign="center"
                  color="#FFFFFF"
                  width="100%"
                >
                  {t('IM_IncidentInvestigationApproval')}
                </StyledTypography>
              </AccordionSummary>
              <AccordionDetails>
                <Formik
                  initialValues={{ action: '', remarks: '' }}
                  enableReinitialize={true}
                  validationSchema={validationSchema}
                  validateOnChange={true}
                  onSubmit={(values) => {
                    submitApprovalStatus(values);
                  }}
                >
                  {({ values, errors, setFieldValue }) => (
                    <Form style={{ width: '100%' }}>
                      <Grid container spacing={2} alignItems={'flex-start'}>
                        {pageFields?.find((x) => x.FieldId === 'IIA_P_Action')
                          ?.IsShow && (
                          <Grid item xs={12} sm={12} md={6} lg={3}>
                            <Label
                              value={getlabel(
                                'IM_IIA_Action',
                                {
                                  Data: fieldLabels,
                                  Status: labels?.Status,
                                },
                                i18n.language
                              )}
                              isRequired={
                                pageFields?.find(
                                  (x) => x.FieldId === 'IIA_P_Action'
                                )?.IsMandatory
                              }
                            />
                            <SearchDropdown
                              disableClearable={true}
                              name="action"
                              options={[
                                { text: 'Select', value: '' },
                                ...(actionList || []),
                              ]}
                              getOptionLabel={(option) => option.text || ''}
                              dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
                              sx={{
                                '& .MuiAutocomplete-inputRoot': {
                                  fontSize: '13px',
                                  height: '100%',
                                },
                                '& .MuiOutlinedInput-root': {
                                  height: '34px',
                                  '& .MuiAutocomplete-input': {
                                    height: '34px',
                                    fontSize: '13px',
                                  },
                                },
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="outlined"
                                  placeholder="Select"
                                />
                              )}
                              ListboxProps={{
                                sx: {
                                  '& .MuiAutocomplete-option': {
                                    fontSize: '13px',
                                    minHeight: '30px',
                                    display: 'flex',
                                    alignItems: 'center',
                                  },
                                },
                              }}
                              value={
                                actionList.find(
                                  (option) => option.value === values['action']
                                ) || null
                              }
                              onChange={(event, value) => {
                                setFieldValue(
                                  'action',
                                  value ? value?.value : ''
                                );
                              }}
                            />

                            <ErrorMessage
                              name="action"
                              component="div"
                              style={{
                                color: 'red',
                                fontSize: '12px',
                              }}
                            />
                          </Grid>
                        )}
                        {pageFields?.find(
                          (x) => x.FieldId === 'IIA_P_ApproverRemarks'
                        )?.IsShow && (
                          <Grid item xs={12} sm={12} md={6} lg={9}>
                            <Label
                              value={getlabel(
                                'IM_IIA_ApproverRemarks',
                                {
                                  Data: fieldLabels,
                                  Status: labels?.Status,
                                },
                                i18n.language
                              )}
                              isRequired={
                                pageFields?.find(
                                  (x) => x.FieldId === 'IIA_P_ApproverRemarks'
                                )?.IsMandatory
                              }
                            />
                            <Field name="remarks">
                              {({ field }) => (
                                <TextArea name="remarks" {...field} />
                              )}
                            </Field>
                            <ErrorMessage
                              name="remarks"
                              component="div"
                              style={{
                                color: 'red',
                                fontSize: '12px',
                                marginTop: '4px',
                              }}
                            />
                          </Grid>
                        )}
                        <Grid
                          display={'flex'}
                          width="100%"
                          justifyContent={'flex-end'}
                          gap={'10px'}
                          marginTop={'2rem'}
                        >
                          <StyledButton
                            borderRadius="6px"
                            gap="4px"
                            padding="6px 10px"
                            variant="contained"
                            backgroundColor="#0083c0"
                            type="submit"
                            style={{ display: 'inline-flex', gap: '5px' }}
                            startIcon={
                              <StyledImage
                                height="16px"
                                width="16px"
                                src={DoneIcon}
                                alt="WhiteSearch"
                              />
                            }
                          >
                            {t('Submit')}
                          </StyledButton>
                          <StyledButton
                            variant="outlined"
                            border="1px solid #0083c0"
                            backgroundColor="#ffffff"
                            type="button"
                            colour="#0083c0"
                            borderRadius="6px"
                            sx={{ marginLeft: '10px' }}
                            style={{ display: 'inline-flex', gap: '5px' }}
                            onClick={() =>
                              navigate(
                                '/IncidentManagement/IncidentInvestigationApproval'
                              )
                            }
                            startIcon={
                              <StyledImage
                                height="16px"
                                width="16px"
                                src={DndIcon}
                                alt="WhiteSearch"
                              />
                            }
                          >
                            {t('Cancel')}
                          </StyledButton>
                        </Grid>
                      </Grid>
                    </Form>
                  )}
                </Formik>
              </AccordionDetails>
            </Accordion>
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default InvestigationPendingDetails;
