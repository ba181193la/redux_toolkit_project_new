import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Grid,
  TextField,
} from '@mui/material';

import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import CloseIcon from '../../../../assets/Icons/CloseIcon.png';
import DoneIcon from '../../../../assets/Icons/DoneIcon.png';
import DndIcon from '../../../../assets/Icons/DoNotDisturbIcon.png';
import LoadingGif from '../../../../assets/Gifs/LoadingGif.gif';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import MultiSelectDropdown from '../../../../components/Dropdown/MultiSelectDropdown';
import Label from '../../../../components/Label/Label';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { getlabel } from '../../../../utils/language';
import { useSelector } from 'react-redux';
import {
  useAddHarmLevelMutation,
  useGetHarmLevelDataByIdQuery,
  useUpdateHarmLevelMutation,
} from '../../../../redux/RTK/IncidentManagement/incidentSubMasterApi';
import { showToastAlert } from '../../../../utils/SweetAlert';
import TextArea from '../../../../components/TextArea/TextArea';
import NotificationStaffList from './NotificationStaffList';

const AddEditHarmLevel = ({
  showHarmLevelModal,
  setShowHarmLevelModal,
  selectedHarmLevelId,
  setSelectedHarmLevelId,
  facilityList,
  labels,
  refetch,
  fieldAccess,
}) => {
  //* Hooks declaration
  const { t, i18n } = useTranslation();

  //* Selectors
  const { selectedMenu, userDetails, isSuperAdmin, roleFacilities } =
    useSelector((state) => state.auth);

  //* State variables
  const [fieldLabels, setFieldLabels] = useState([]);
  const [notiStaffList, setNotiStaffList] = useState([]);
  const [newHarmLevel, setNewHarmLevel] = useState({
    harmLevelId: 0,
    facility: '',
    harmLevel: '',
    definition: '',
    notiStaffList: notiStaffList,
  });

  //* RTK Queries

  const [triggerAddHarmLevel, { isLoading: isAdding }] =
    useAddHarmLevelMutation();

  const [triggerUpdateHarmLevel, { isLoading: isUpdating }] =
    useUpdateHarmLevelMutation();

  const {
    data: harmLevelRecords,
    isFetching,
    refetch: refetchHarmLevelData,
  } = useGetHarmLevelDataByIdQuery(
    {
      incidentHarmLevelId: selectedHarmLevelId,
      loginUserId: userDetails?.UserId,
      menuId: selectedMenu?.id,
    },
    { skip: !selectedHarmLevelId }
  );

  //* Field access checking
  const pageFields = fieldAccess?.Data?.Menus?.find(
    (section) => section?.MenuId === selectedMenu?.id
  )
    ?.Sections?.find(
      (sectionName) => sectionName?.SectionName === 'Harm Level-Page'
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
    if (harmLevelRecords?.Data && selectedHarmLevelId) {
      setNewHarmLevel({
        harmLevelId: harmLevelRecords?.Data?.IncidentHarmLevelId,
        facility: [harmLevelRecords?.Data?.FacilityId],
        harmLevel: harmLevelRecords?.Data?.IncidentHarmLevel,
        definition: harmLevelRecords?.Data?.HarmLevelDefinition,
        notiStaffList: harmLevelRecords?.Data?.NotifyStaff?.map((x) => ({
          facility: x?.StaffFacility,
          userId: x?.UserId,
          userName: x?.UserName,
          departmentName: x?.DepartmentName,
          designationName: x?.DesignationName,
        })),
      });
      setNotiStaffList(
        harmLevelRecords?.Data?.NotifyStaff?.map((x) => ({
          facility: x?.StaffFacility,
          userId: x?.UserId,
          userName: x?.UserName,
          departmentName: x?.DepartmentName,
          designationName: x?.DesignationName,
        }))
      );
    }
  }, [harmLevelRecords]);

  //* Validation Schema
  const harmLevelValidation = Yup.object().shape({
    facility: Yup.number().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'IS_HL_P_Facility')
          ?.IsMandatory === true,
      then: (schema) =>
        schema
          .required(
            `${getlabel(
              'IM_IS_HL_Facility',
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
              'IM_IS_HL_Facility',
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
    harmLevel: Yup.string().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'IS_HL_P_HarmLevel')
          ?.IsMandatory === true,
      then: (schema) =>
        schema.required(
          `${getlabel(
            'IM_IS_HL_HarmLevel',
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
        pageFields?.find((x) => x.FieldId === 'IS_HL_P_Definition')
          ?.IsMandatory === true,
      then: (schema) =>
        schema.required(
          `${getlabel(
            'IM_IS_HL_Definition',
            {
              Data: fieldLabels,
              Status: labels?.Status,
            },
            i18n.language
          )} ${t('IsRequired')}`
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
    notiStaffList: Yup.array().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'IS_HL_P_NotificationStaff(s)')
          ?.IsMandatory,
      then: (schema) =>
        schema
          .min(
            1,
            `${`${getlabel(
              'IM_IS_HL_NotificationStaff(s)',
              {
                Data: fieldLabels,
                Status: labels?.Status,
              },
              i18n.language
            )} ${t('IsRequired')}`}`
          )
          .test(
            'not-empty',
            `${`${getlabel(
              'IM_IS_HL_NotificationStaff(s)',
              {
                Data: fieldLabels,
                Status: labels?.Status,
              },
              i18n.language
            )} ${t('IsRequired')}`}`,
            (value) => value && value.length > 0
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  //* Close modal
  const handleOnCancel = () => {
    setNewHarmLevel({
      harmLevelId: 0,
      facility: '',
      harmLevel: '',
      definition: '',
      notiStaffList: [],
    });
    setSelectedHarmLevelId(null);
    setShowHarmLevelModal(false);
  };

  //* Submit harm level
  const submitHarmLevel = async (values) => {
    try {
      let response;
      if (newHarmLevel?.harmLevelId === 0) {
        response = await triggerAddHarmLevel({
          payload: {
            incidentHarmLevelId: values?.harmLevelId,
            incidentHarmLevel: values?.harmLevel,
            harmLevelDefinition: values?.definition,
            notifyStaffId: notiStaffList?.map((x) => x.userId)?.join(','),
            facilityIds: values?.facility?.join(','),
            moduleId: 2,
            // moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
            loginUserId: userDetails?.UserId,
          },
        });
      }
      if (newHarmLevel?.harmLevelId !== 0) {
        response = await triggerUpdateHarmLevel({
          payload: {
            incidentHarmLevelId: values?.harmLevelId,
            incidentHarmLevel: values?.harmLevel,
            facilityId: parseInt(values?.facility?.join(',')),
            harmLevelDefinition: values?.definition,
            notifyStaffId: notiStaffList?.map((x) => x.userId)?.join(','),
            moduleId: 2,
            // moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
            loginUserId: userDetails?.UserId,
          },
        });
        refetchHarmLevelData();
      }

      if (response && response?.data?.Message !== 'Record Already Exist') {
        showToastAlert({
          type: 'custom_success',
          text: response?.data?.Message,
          gif: 'SuccessGif',
        });
      }
      if (
        response &&
        response?.data?.Message === 'Record Created Successfully'
      ) {
        showToastAlert({
          type: 'custom_success',
          text: response?.data?.Message,
          gif: 'SuccessGif',
        });
      }
      if (
        response &&
        response?.data?.Message === 'Incident Harm Level already exists'
      ) {
        showToastAlert({
          type: 'custom_info',
          text: response?.data?.Message,
          gif: 'InfoGif',
        });
      }
      setNewHarmLevel({
        harmLevelId: 0,
        facility: '',
        harmLevel: '',
        definition: '',
        notiStaffList: [],
      });
      refetch();
      setSelectedHarmLevelId(null);
      setShowHarmLevelModal(false);
    } catch (error) {
      console.error('Failed to add/update Incient Type', error);
    }
  };

  return (
    <Dialog
      open={showHarmLevelModal}
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
      maxWidth={'md'}
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
            'IM_IS_HL_HarmLevel',
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
      <DialogContent style={{ height: isFetching ? '50vh' : 'auto' }}>
        {isFetching ? (
          <FlexContainer
            justifyContent="center"
            alignItems="center"
            height="100%"
            width="100%"
            position="absolute"
            style={{ top: '0', left: '0' }}
          >
            <StyledImage src={LoadingGif} alt="LoadingGif" />
          </FlexContainer>
        ) : (
          <FlexContainer flexWrap="wrap">
            <Formik
              enableReinitialize={true}
              initialValues={newHarmLevel}
              validateOnBlur={false}
              validateOnMount={false}
              validationSchema={harmLevelValidation}
              onSubmit={(values) => submitHarmLevel(values)}
              initialTouched={{
                notiStaffList: false,
              }}
            >
              {({ values, errors, setFieldValue, touched }) => (
                <Form
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
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
                    {pageFields?.find((x) => x.FieldId === 'IS_HL_P_Facility')
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
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                          <Label
                            value={getlabel(
                              'IM_IS_HL_Facility',
                              {
                                Data: fieldLabels,
                                Status: labels?.Status,
                              },
                              i18n.language
                            )}
                            isRequired={
                              pageFields?.find(
                                (x) => x.FieldId === 'IS_HL_P_Facility'
                              )?.IsMandatory
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={8} lg={8}>
                          <MultiSelectDropdown
                            name="facility"
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
                            disabled={selectedHarmLevelId}
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
                    {pageFields?.find((x) => x.FieldId === 'IS_HL_P_HarmLevel')
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
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                          <Label
                            value={getlabel(
                              'IM_IS_HL_HarmLevel',
                              {
                                Data: fieldLabels,
                                Status: labels?.Status,
                              },
                              i18n.language
                            )}
                            isRequired={
                              pageFields?.find(
                                (x) => x.FieldId === 'IS_HL_P_HarmLevel'
                              )?.IsMandatory
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={8} lg={8}>
                          <Field name="harmLevel">
                            {({ field }) => (
                              <TextField
                                {...field}
                                id="harmLevel"
                                autoComplete="off"
                                values={values.harmLevel}
                                fullWidth={true}
                                slotProps={{ htmlInput: { maxLength: 100 } }}
                                // disabled={isFetching}
                              />
                            )}
                          </Field>
                          <ErrorMessage
                            name="harmLevel"
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
                    {pageFields?.find((x) => x.FieldId === 'IS_HL_P_Definition')
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
                              'IM_IS_HL_Definition',
                              {
                                Data: fieldLabels,
                                Status: labels?.Status,
                              },
                              i18n.language
                            )}
                            isRequired={
                              pageFields?.find(
                                (x) => x.FieldId === 'IS_HL_P_Definition'
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
                    {pageFields?.find(
                      (x) => x.FieldId === 'IS_HL_P_NotificationStaff(s)'
                    )?.IsShow && (
                      <Grid
                        container
                        display={'flex'}
                        width="100%"
                        flexWrap={'wrap'}
                        justifyContent={'space-between'}
                        item
                        xs={12}
                        alignItems={'center'}
                      >
                        <NotificationStaffList
                          isMandatory={
                            pageFields?.find(
                              (x) =>
                                x.FieldId === 'IS_HL_P_NotificationStaff(s)'
                            )?.IsMandatory
                          }
                          labels={labels}
                          facilityList={facilityList}
                          notiStaffList={notiStaffList}
                          setNotiStaffList={setNotiStaffList}
                          setFieldValue={setFieldValue}
                          fieldAccess={fieldAccess}
                        />
                        {errors.notiStaffList && touched.notiStaffList && (
                          <div
                            style={{
                              color: 'red',
                              fontSize: '12px',
                              marginTop: '4px',
                            }}
                          >
                            {errors.notiStaffList}
                          </div>
                        )}
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
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddEditHarmLevel;
