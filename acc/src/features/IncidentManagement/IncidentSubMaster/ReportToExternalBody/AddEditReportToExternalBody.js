import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  useAddReportToExternalBodyMutation,
  useGetReportToExternalBodyByIdQuery,
  useUpdateExternalBodyMutation,
} from '../../../../redux/RTK/IncidentManagement/incidentSubMasterApi';
import { useTranslation } from 'react-i18next';
import { showToastAlert } from '../../../../utils/SweetAlert';
import { TextField } from '../../../../components/TextField/TextField';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import MultiSelectDropdown from '../../../../components/Dropdown/MultiSelectDropdown';
import CloseIcon from '../../../../assets/Icons/CloseIcon.png';
import DoneIcon from '../../../../assets/Icons/DoneIcon.png';
import DndIcon from '../../../../assets/Icons/DoNotDisturbIcon.png';
import Label from '../../../../components/Label/Label';
import * as Yup from 'yup';
import { getlabel } from '../../../../utils/language';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Grid,
} from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const AddEditReportToExternalBody = ({
  showNegligenceModal,
  setShowExternalBodyModal,
  selectedExternalBodyId,
  setSelectedExternalBodyId,
  facilityList,
  labels,
  refetch,
  fieldAccess,
}) => {
  //* Hooks declaration
  const { t, i18n } = useTranslation();

  //* Selectors
  const {
    selectedMenu,
    selectedModuleId,
    userDetails,
    isSuperAdmin,
    roleFacilities,
  } = useSelector((state) => state.auth);

  //* State variables
  const [fieldLabels, setFieldLabels] = useState([]);
  const [newExternalBody, setNewExternalBody] = useState({
    externalBodyId: selectedExternalBodyId || 0,
    facility: '',
    externalBody: '',
  });

  //* RTK Queries
  const [triggerAddExternalBody, { isLoading: isAdding }] =
    useAddReportToExternalBodyMutation();
  const [triggerUpdateExternalBody, { isLoading: isUpdating }] =
    useUpdateExternalBodyMutation();

  const {
    data: externalBodyRecords,
    isFetching,
    refetch: refetchExternalBodyData,
  } = useGetReportToExternalBodyByIdQuery(
    {
      externalBodyId: selectedExternalBodyId,
      loginUserId: userDetails?.UserId,
    },
    { skip: !selectedExternalBodyId }
  );

  //* Field access checking
  const pageFields = fieldAccess?.Data?.Menus?.find(
    (section) => section?.MenuId === selectedMenu?.id
  )
    ?.Sections?.find(
      (sectionName) =>
        sectionName?.SectionName === 'Report to External Body-Page'
    )
    ?.Regions?.find((region) => region?.RegionCode === 'ALL')?.Fields;

  //* Use Effects to bind values
  useEffect(() => {
    if (labels?.Data) {
      const regionList = labels?.Data?.find(
        (x) => x.MenuId === selectedMenu?.id
      )?.Regions;
      const labelsList = regionList?.find(
        (x) => x.RegionCode === 'ALL'
      )?.Labels;
      setFieldLabels(labelsList);
    }
  }, [labels]);

  useEffect(() => {
    if (externalBodyRecords?.Data && selectedExternalBodyId) {
      setNewExternalBody({
        externalBodyId: externalBodyRecords?.Data?.ExternalBodyId,
        facility: [externalBodyRecords?.Data?.FacilityId],
        externalBody: externalBodyRecords?.Data?.ExternalBody,
      });
    }
  }, [externalBodyRecords]);

  //* Validation Schema
  const externalBodyValidation = Yup.object().shape({
    facility: Yup.number().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'IS_REB_P_Facility')
          ?.IsMandatory === true,
      then: (schema) =>
        schema
          .required(
            `${getlabel(
              'IM_IS_REB_Facility',
              {
                Data: fieldLabels,
                Status: labels?.Status,
              },
              i18n.language
            )} ${t('IsRequired')}`
          )
          .test(
            'is-zero',
            `${getlabel(
              'IM_IS_REB_Facility',
              {
                Data: fieldLabels,
                Status: labels?.Status,
              },
              i18n.language
            )} ${t('IsRequired')}`,
            (value) => {
              return value !== 0;
            }
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
    externalBody: Yup.string().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'IS_REB_P_ReporttoExternalBody')
          ?.IsMandatory === true,
      then: (schema) =>
        schema.required(
          `${getlabel(
            'IM_IS_REB_ReporttoExternalBody',
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

  //* Close modal
  const handleOnCancel = () => {
    setNewExternalBody({
      externalBodyId: selectedExternalBodyId || 0,
      facility: '',
      externalBody: '',
    });
    setSelectedExternalBodyId(null);
    setShowExternalBodyModal(false);
  };

  //* Submit external body
  const submitExternalBody = async (values) => {
    try {
      let response;
      if (newExternalBody?.externalBodyId === 0) {
        response = await triggerAddExternalBody({
          payload: {
            externalBodyId: values?.externalBodyId,
            externalBody: values?.externalBody,
            facilityIds: values?.facility?.join(','),
            moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
            loginUserId: userDetails?.UserId,
          },
        }).unwrap();
      }
      if (newExternalBody?.externalBodyId !== 0) {
        response = await triggerUpdateExternalBody({
          payload: {
            externalBodyId: values?.externalBodyId,
            externalBody: values?.externalBody,
            facilityId: parseInt(values?.facility?.join(',')),
            moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
            loginUserId: userDetails?.UserId,
          },
        }).unwrap();
        refetchExternalBodyData();
      }

      if (response && response.Message === 'Record Created Successfully') {
        showToastAlert({
          type: 'custom_success',
          text: response.Message,
          gif: 'SuccessGif',
        });
      }
      if (
        response &&
        response.Message ===
          'Report to External Body already exists for Facility'
      ) {
        showToastAlert({
          type: 'custom_info',
          text: response.Message,
          gif: 'InfoGif',
        });
      }
      setNewExternalBody({
        externalBodyId: selectedExternalBodyId || 0,
        facility: '',
        externalBody: '',
      });

      refetch();
      setSelectedExternalBodyId(null);
      setShowExternalBodyModal(false);
    } catch (error) {
      console.error('Failed to add/update reference number', error);
    }
  };

  return (
    <Dialog
      open={showNegligenceModal}
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
      maxWidth={'sm'}
      fullWidth={true}
      PaperProps={{
        sx: {
          borderRadius: '8px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: '#0083c0',
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 20px',
        }}
      >
        <StyledTypography
          fontSize="20px"
          fontWeight="300"
          lineHeight="18px"
          color="#fff"
        >
          {getlabel(
            'IM_IS_REB_ReporttoExternalBody',
            {
              Data: fieldLabels,
              Status: labels?.Status,
            },
            i18n.language
          )}
        </StyledTypography>
        <IconButton
          onClick={handleOnCancel}
          style={{
            padding: '0.7rem',
          }}
          sx={{
            color: '#fff',
            '&:hover': {
              transform: 'scale(1.05)',
              backgroundColor: 'color(srgb 0.75 0.74 0.74 / 0.15)',
            },
          }}
        >
          <Tooltip title="Close" arrow>
            <StyledImage src={CloseIcon} alt="Close Icon" />
          </Tooltip>
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <FlexContainer flexWrap="wrap">
          <Formik
            enableReinitialize={true}
            initialValues={newExternalBody}
            validateOnBlur={false}
            validationSchema={externalBodyValidation}
            onSubmit={(values) => submitExternalBody(values)}
          >
            {({ values }) => (
              <Form style={{ width: '100%' }}>
                <Grid
                  container
                  display={'flex'}
                  width="100%"
                  flexWrap={'wrap'}
                  justifyContent={'space-between'}
                  item
                  xs={12}
                  spacing={2}
                  alignItems={'center'}
                  marginTop={'1rem'}
                >
                  {pageFields?.find((x) => x.FieldId === 'IS_REB_P_Facility')
                    ?.IsShow && (
                    <Grid
                      container
                      display={'flex'}
                      width="100%"
                      flexWrap={'wrap'}
                      justifyContent={'space-between'}
                      item
                      xs={12}
                      spacing={2}
                      alignItems={'center'}
                    >
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <Label
                          value={getlabel(
                            'IM_IS_REB_Facility',
                            {
                              Data: fieldLabels,
                              Status: labels?.Status,
                            },
                            i18n.language
                          )}
                          isRequired={
                            pageFields?.find(
                              (x) => x.FieldId === 'IS_REB_P_Facility'
                            )?.IsMandatory
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={8}>
                        <MultiSelectDropdown
                          name={'facility'}
                          options={facilityList
                            .filter((facility) => {
                              if (isSuperAdmin) return true;
                              const facilityItem = roleFacilities?.find(
                                (role) =>
                                  role.FacilityId === facility.FacilityId
                              )?.Menu?.[selectedMenu?.id];
                              return facilityItem?.IsAdd;
                            })
                            .map((facility) => ({
                              text: facility.FacilityName,
                              value: facility.FacilityId,
                            }))}
                          disabled={selectedExternalBodyId}
                          value={values?.facility}
                        />
                        <ErrorMessage
                          name="facility"
                          component="div"
                          style={{
                            color: 'red',
                            fontSize: '12px',
                            marginTop: '4px',
                          }}
                        />
                      </Grid>
                    </Grid>
                  )}
                  {pageFields?.find(
                    (x) => x.FieldId === 'IS_REB_P_ReporttoExternalBody'
                  )?.IsShow && (
                    <Grid
                      container
                      display={'flex'}
                      width="100%"
                      flexWrap={'wrap'}
                      justifyContent={'space-between'}
                      item
                      xs={12}
                      spacing={2}
                      alignItems={'center'}
                    >
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <Label
                          value={getlabel(
                            'IM_IS_REB_ReporttoExternalBody',
                            {
                              Data: fieldLabels,
                              Status: labels?.Status,
                            },
                            i18n.language
                          )}
                          isRequired={
                            pageFields?.find(
                              (x) =>
                                x.FieldId === 'IS_REB_P_ReporttoExternalBody'
                            )?.IsMandatory
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={8}>
                        <Field name="externalBody">
                          {({ field }) => (
                            <TextField
                              {...field}
                              id="externalBody"
                              autoComplete="off"
                              values={values.externalBody}
                              fullWidth={true}
                              slotProps={{ htmlInput: { maxLength: 100 } }}
                              disabled={isFetching}
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="externalBody"
                          component="div"
                          style={{
                            color: 'red',
                            fontSize: '12px',
                            marginTop: '4px',
                          }}
                        />
                      </Grid>
                    </Grid>
                  )}
                  <Grid
                    display={'flex'}
                    width="100%"
                    justifyContent={'center'}
                    gap={'10px'}
                    marginTop={'1rem'}
                  >
                    <StyledButton
                      borderRadius="6px"
                      gap="4px"
                      padding="6px 10px"
                      variant="contained"
                      backgroundColor="#0083c0"
                      type="submit"
                      style={{ display: 'inline-flex', gap: '5px' }}
                      disabled={isAdding || isUpdating}
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
                      disabled={isAdding || isUpdating}
                      style={{ display: 'inline-flex', gap: '5px' }}
                      onClick={handleOnCancel}
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
        </FlexContainer>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditReportToExternalBody;
