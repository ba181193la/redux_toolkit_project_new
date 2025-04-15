import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  useAddJAWDAIncidentLevelMutation,
  useGetJAWDAIncidentLevelByIdQuery,
  useUpdateJAWDAIncidentLevelMutation,
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
import TextArea from '../../../../components/TextArea/TextArea';

const AddEditJAWDAIncidentLevel = ({
  showJawdaModal,
  setShowJawdaModal,
  selectedJawdaId,
  setSelectedJawdaId,
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
  const [newJawdaLevel, setNewJawdaLevel] = useState({
    jawdaLevelId: selectedJawdaId || 0,
    facility: '',
    jawdaLevel: '',
    definition: '',
  });

  //* RTK Queries
  const [triggerAddJawdaLevel, { isLoading: isAdding }] =
    useAddJAWDAIncidentLevelMutation();
  const [triggerUpdateJawdaLevel, { isLoading: isUpdating }] =
    useUpdateJAWDAIncidentLevelMutation();

  const {
    data: jawdaLevelRecords,
    isFetching,
    refetch: refetchJawdaLevelData,
  } = useGetJAWDAIncidentLevelByIdQuery(
    {
      jawdaLevelId: selectedJawdaId,
      loginUserId: userDetails?.UserId,
    },
    { skip: !selectedJawdaId }
  );

  //* Field access checking
  const pageFields = fieldAccess?.Data?.Menus?.find(
    (section) => section?.MenuId === selectedMenu?.id
  )
    ?.Sections?.find(
      (sectionName) => sectionName?.SectionName === 'JAWDA Incident Level-Page'
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
    if (jawdaLevelRecords?.Data && selectedJawdaId) {
      setNewJawdaLevel({
        jawdaLevelId: jawdaLevelRecords?.Data?.JAWDALevelId,
        jawdaLevel: jawdaLevelRecords?.Data?.JAWDALevel,
        definition: jawdaLevelRecords?.Data?.Definition,
        facility: [jawdaLevelRecords?.Data?.FacilityId],
        externalBody: jawdaLevelRecords?.Data?.ExternalBody,
      });
    }
  }, [jawdaLevelRecords]);

  //* Validation Schema
  const jawdaLevelValidation = Yup.object().shape({
    facility: Yup.number().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'IS_JIL_P_Facility')
          ?.IsMandatory === true,
      then: (schema) =>
        schema
          .required(
            `${getlabel(
              'IM_IS_JIL_Facility',
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
              'IM_IS_JIL_Facility',
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
    jawdaLevel: Yup.string().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'IS_JIL_P_JAWDAIncidentLevel')
          ?.IsMandatory === true,
      then: (schema) =>
        schema.required(
          `${getlabel(
            'IM_IS_JIL_JAWDAIncidentLevel',
            {
              Data: fieldLabels,
              Status: labels?.Status,
            },
            i18n.language
          )} ${t('IsRequired')}`
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
    definition: Yup.string().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'IS_JIL_P_Definition')
          ?.IsMandatory === true,
      then: (schema) =>
        schema.required(
          `${getlabel(
            'IM_IS_JIL_Definition',
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
    setNewJawdaLevel({
      jawdaLevelId: 0,
      facility: '',
      jawdaLevel: '',
      definition: '',
    });
    setSelectedJawdaId(null);
    setShowJawdaModal(false);
  };

  //* Submit external body
  const submitJawdaLevel = async (values) => {
    try {
      let response;
      if (newJawdaLevel?.jawdaLevelId === 0) {
        response = await triggerAddJawdaLevel({
          payload: {
            jawdaLevelId: values?.jawdaLevelId,
            jawdaLevel: values?.jawdaLevel,
            definition: values?.definition,
            facilityIds: values?.facility?.join(','),
            moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
            loginUserId: userDetails?.UserId,
          },
        }).unwrap();
      }
      if (newJawdaLevel?.jawdaLevelId !== 0) {
        response = await triggerUpdateJawdaLevel({
          payload: {
            jawdaLevelId: values?.jawdaLevelId,
            jawdaLevel: values?.jawdaLevel,
            definition: values?.definition,
            facilityId: parseInt(values?.facility?.join(',')),
            moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
            loginUserId: userDetails?.UserId,
          },
        }).unwrap();
        refetchJawdaLevelData();
      }

      if (response && response.Message !== 'Record Already Exist') {
        showToastAlert({
          type: 'custom_success',
          text: response.Message,
          gif: 'SuccessGif',
        });
      }
      if (
        response &&
        response.Message === 'JAWDA Incident Level already exists for Facility'
      ) {
        showToastAlert({
          type: 'custom_info',
          text: response.Message,
          gif: 'InfoGif',
        });
      }
      setNewJawdaLevel({
        jawdaLevelId: 0,
        facility: '',
        jawdaLevel: '',
        definition: '',
      });
      refetch();
      setSelectedJawdaId(null);
      setShowJawdaModal(false);
    } catch (error) {
      console.error('Failed to add/update JAWDA Incident Level', error);
    }
  };

  return (
    <Dialog
      open={showJawdaModal}
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
            'IM_IS_JIL_JAWDAIncidentLevel',
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
            initialValues={newJawdaLevel}
            validateOnBlur={false}
            validationSchema={jawdaLevelValidation}
            onSubmit={(values) => submitJawdaLevel(values)}
          >
            {({ values, setFieldValue }) => (
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
                  {pageFields?.find((x) => x.FieldId === 'IS_JIL_P_Facility')
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
                            'IM_IS_JIL_Facility',
                            {
                              Data: fieldLabels,
                              Status: labels?.Status,
                            },
                            i18n.language
                          )}
                          isRequired={
                            pageFields?.find(
                              (x) => x.FieldId === 'IS_JIL_P_Facility'
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
                          disabled={selectedJawdaId}
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
                    (x) => x.FieldId === 'IS_JIL_P_JAWDAIncidentLevel'
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
                      <Grid item xs={12} sm={12} md={4} lg={4}>
                        <Label
                          value={getlabel(
                            'IM_IS_JIL_JAWDAIncidentLevel',
                            {
                              Data: fieldLabels,
                              Status: labels?.Status,
                            },
                            i18n.language
                          )}
                          isRequired={
                            pageFields?.find(
                              (x) => x.FieldId === 'IS_JIL_P_JAWDAIncidentLevel'
                            )?.IsMandatory
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={8} lg={8}>
                        <Field name="jawdaLevel">
                          {({ field }) => (
                            <TextField
                              {...field}
                              id="jawdaLevel"
                              autoComplete="off"
                              values={values.jawdaLevel}
                              fullWidth={true}
                              slotProps={{ htmlInput: { maxLength: 100 } }}
                              // disabled={isFetching}
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="jawdaLevel"
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
                  {pageFields?.find((x) => x.FieldId === 'IS_JIL_P_Definition')
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
                    >
                      <Grid item xs={12} sm={12} md={4} lg={4}>
                        <Label
                          value={getlabel(
                            'IM_IS_JIL_Definition',
                            {
                              Data: fieldLabels,
                              Status: labels?.Status,
                            },
                            i18n.language
                          )}
                          isRequired={
                            pageFields?.find(
                              (x) => x.FieldId === 'IS_JIL_P_Definition'
                            )?.IsMandatory
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={8} lg={8}>
                        <Field name="definition">
                          {({ field }) => (
                            <TextArea name="definition" {...field} />
                          )}
                        </Field>
                        <ErrorMessage
                          name="definition"
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

export default AddEditJAWDAIncidentLevel;
