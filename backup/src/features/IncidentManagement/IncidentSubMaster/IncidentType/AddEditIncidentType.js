import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Grid,
  TextField,
  Autocomplete,
  TextareaAutosize,
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
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import MultiSelectDropdown from '../../../../components/Dropdown/MultiSelectDropdown';
import Label from '../../../../components/Label/Label';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { getlabel } from '../../../../utils/language';
import TextArea from '../../../../components/TextArea/TextArea';
import NotificationStaffList from './NotificationStaffList';
import LoadingGif from '../../../../assets/Gifs/LoadingGif.gif';
import { useSelector } from 'react-redux';
import {
  useAddIncidentTypeMutation,
  useGetIncidentTypeDataByIdQuery,
  useUpdateIncidentTypeMutation,
} from '../../../../redux/RTK/IncidentManagement/incidentSubMasterApi';
import { showToastAlert } from '../../../../utils/SweetAlert';
import SearchDropdown from '../../../../components/SearchDropdown/SearchDropdown';
const AddEditIncidentType = ({
  showIncidentTypeModal,
  setShowIncidentTypeModal,
  selectedIncidentTypeId,
  setSelectedIncidentTypeId,
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
  const [isSentinelValue, setIsSentinelValue] = useState('');
  const [notiStaffList, setNotiStaffList] = useState([]);
  const [newIncidentType, setNewIncidentType] = useState({
    incidentTypeId: 0,
    facility: '',
    incType: '',
    definition: '',
    isSentinel: '',
    inclusion: '',
    exclusion: '',
    notiStaffList: notiStaffList,
  });

  //* RTK Queries

  const [triggerAddIncidentType, { isLoading: isAdding }] =
    useAddIncidentTypeMutation();

  const [triggerUpdateIncidentType, { isLoading: isUpdating }] =
    useUpdateIncidentTypeMutation();

  const {
    data: incTypeRecords,
    isFetching,
    refetch: refetchIncTypeData,
  } = useGetIncidentTypeDataByIdQuery(
    {
      incidentTypeId: selectedIncidentTypeId,
      loginUserId: userDetails?.UserId,
      menuId: selectedMenu?.id,
    },
    { skip: !selectedIncidentTypeId }
  );

  //* Field access checking
  const pageFields = fieldAccess?.Data?.Menus?.find(
    (section) => section?.MenuId === selectedMenu?.id
  )
    ?.Sections?.find(
      (sectionName) => sectionName?.SectionName === 'Incident Type-Page'
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
    if (incTypeRecords?.Data && selectedIncidentTypeId) {
      setNewIncidentType({
        incidentTypeId: incTypeRecords?.Data?.IncidentTypeId,
        facility: [incTypeRecords?.Data?.FacilityId],
        incType: incTypeRecords?.Data?.IncidentTypeName,
        definition: incTypeRecords?.Data?.TypeDefinition,
        exclusion: incTypeRecords?.Data?.Exclusion,
        inclusion: incTypeRecords?.Data?.Inclusion,
        isSentinel:
          incTypeRecords?.Data?.IsSentinel === null
            ? ''
            : incTypeRecords?.Data?.IsSentinel
              ? 'yes'
              : 'no',
        notiStaffList: incTypeRecords?.Data?.NotifyStaff?.map((x) => ({
          facility: x?.StaffFacility,
          userId: x?.UserId,
          userName: x?.UserName,
          departmentName: x?.DepartmentName,
          designationName: x?.DesignationName,
        })),
      });
      setNotiStaffList(
        incTypeRecords?.Data?.NotifyStaff?.map((x) => ({
          facility: x?.StaffFacility,
          userId: x?.UserId,
          userName: x?.UserName,
          departmentName: x?.DepartmentName,
          designationName: x?.DesignationName,
        }))
      );
    }
  }, [incTypeRecords]);

  //* Validation Schema
  const incidentTypeValidation = Yup.object().shape({
    facility: Yup.number().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'IS_IT_P_Facility')
          ?.IsMandatory === true,
      then: (schema) =>
        schema
          .required(
            `${getlabel(
              'IM_IS_IT_Facility',
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
              'IM_IS_IT_Facility',
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
    incType: Yup.string().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'IS_IT_P_IncidentType')
          ?.IsMandatory === true,
      then: (schema) =>
        schema.required(
          `${getlabel(
            'IM_IS_IT_IncidentType',
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
        pageFields?.find((x) => x.FieldId === 'IS_IT_P_Definition')
          ?.IsMandatory === true,
      then: (schema) =>
        schema.required(
          `${getlabel(
            'IM_IS_IT_Definition',
            {
              Data: fieldLabels,
              Status: labels?.Status,
            },
            i18n.language
          )} ${t('IsRequired')}`
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
    isSentinel: Yup.string().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'IS_IT_P_IsSentinel')
          ?.IsMandatory === true,
      then: (schema) =>
        schema.required(
          `${getlabel(
            'IM_IS_IT_IsSentinel',
            {
              Data: fieldLabels,
              Status: labels?.Status,
            },
            i18n.language
          )} ${t('IsRequired')}`
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
    inclusion: Yup.string().when(['isSentinel'], {
      is: (isSentinel) =>
        pageFields?.find((x) => x.FieldId === 'IS_IT_P_Inclusion')
          ?.IsMandatory === true && isSentinel === 'yes',
      then: (schema) =>
        schema.required(
          `${getlabel(
            'IM_IS_IT_Inclusion',
            {
              Data: fieldLabels,
              Status: labels?.Status,
            },
            i18n.language
          )} ${t('IsRequired')}`
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
    exclusion: Yup.string().when(['isSentinel'], {
      is: (isSentinel) =>
        pageFields?.find((x) => x.FieldId === 'IS_IT_P_Exclusion')
          ?.IsMandatory === true && isSentinel === 'yes',
      then: (schema) =>
        schema.required(
          `${getlabel(
            'IM_IS_IT_Exclusion',
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
        pageFields?.find((x) => x.FieldId === 'IS_IT_P_NotificationStaff(s)')
          ?.IsMandatory,
      then: (schema) =>
        schema
          .min(
            1,
            `${`${getlabel(
              'IM_IS_IT_NotificationStaff(s)',
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
              'IM_IS_IT_NotificationStaff(s)',
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
    setNewIncidentType({
      incidentTypeId: 0,
      facility: '',
      incType: '',
      definition: '',
      isSentinel: '',
      notiStaffList: [],
    });
    setSelectedIncidentTypeId(null);
    setShowIncidentTypeModal(false);
  };

  //* Submit incident type
  const submitIncidentType = async (values) => {
    try {
      let response;
      if (newIncidentType?.incidentTypeId === 0) {
        response = await triggerAddIncidentType({
          payload: {
            incidentTypeId: values?.incidentTypeId,
            incidentTypeName: values?.incType,
            typeDefinition: values?.definition,
            notifyStaffId: notiStaffList?.map((x) => x.userId)?.join(','),
            facilityIds: values?.facility?.join(','),
            moduleId: 2,
            // moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
            loginUserId: userDetails?.UserId,
            isSentinel: values?.isSentinel === 'yes' ? true : false,
            exclusion: values?.exclusion,
            inclusion: values?.inclusion,
          },
        });
      }
      if (newIncidentType?.incidentTypeId !== 0) {
        response = await triggerUpdateIncidentType({
          payload: {
            incidentTypeId: values?.incidentTypeId,
            incidentTypeName: values?.incType,
            facilityId: parseInt(values?.facility?.join(',')),
            typeDefinition: values?.definition,
            notifyStaffId: notiStaffList?.map((x) => x.userId)?.join(','),
            moduleId: 2,
            // moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
            loginUserId: userDetails?.UserId,
            isSentinel: values?.isSentinel === 'yes' ? true : false,
            exclusion: values?.exclusion,
            inclusion: values?.inclusion,
          },
        });
        refetchIncTypeData();
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
        response?.data?.Message === 'Incident Reference Number already exists'
      ) {
        showToastAlert({
          type: 'custom_info',
          text: response.Message,
          gif: 'InfoGif',
        });
      }
      setNewIncidentType({
        incidentTypeId: 0,
        facility: '',
        incType: '',
        definition: '',
        isSentinel: '',
        notiStaffList: [],
      });
      refetch();
      setSelectedIncidentTypeId(null);
      setShowIncidentTypeModal(false);
    } catch (error) {
      console.error('Failed to add/update Incient Type', error);
    }
  };

  return (
    <Dialog
      open={showIncidentTypeModal}
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
            'IM_IS_IT_IncidentType',
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
              initialValues={newIncidentType}
              validateOnBlur={false}
              validateOnMount={false}
              validationSchema={incidentTypeValidation}
              onSubmit={(values) => submitIncidentType(values)}
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
                  >
                    {pageFields?.find((x) => x.FieldId === 'IS_IT_P_Facility')
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
                        marginTop={'1rem'}
                      >
                        <Grid item xs={12} sm={12} md={6} lg={4}>
                          <Label
                            value={getlabel(
                              'IM_IS_IT_Facility',
                              {
                                Data: fieldLabels,
                                Status: labels?.Status,
                              },
                              i18n.language
                            )}
                            isRequired={
                              pageFields?.find(
                                (x) => x.FieldId === 'IS_IT_P_Facility'
                              )?.IsMandatory
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={8}>
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
                            disabled={selectedIncidentTypeId}
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
                      (x) => x.FieldId === 'IS_IT_P_IncidentType'
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
                              'IM_IS_IT_IncidentType',
                              {
                                Data: fieldLabels,
                                Status: labels?.Status,
                              },
                              i18n.language
                            )}
                            isRequired={
                              pageFields?.find(
                                (x) => x.FieldId === 'IS_IT_P_IncidentType'
                              )?.IsMandatory
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={8}>
                          <Field name="incType">
                            {({ field }) => (
                              <TextField
                                {...field}
                                id="incType"
                                autoComplete="off"
                                values={values.incType}
                                fullWidth={true}
                                slotProps={{ htmlInput: { maxLength: 100 } }}
                              />
                            )}
                          </Field>
                          <ErrorMessage
                            name="incType"
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
                    {pageFields?.find((x) => x.FieldId === 'IS_IT_P_IsSentinel')
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
                              'IM_IS_IT_IsSentinel',
                              {
                                Data: fieldLabels,
                                Status: labels?.Status,
                              },
                              i18n.language
                            )}
                            isRequired={
                              pageFields?.find(
                                (x) => x.FieldId === 'IS_IT_P_IsSentinel'
                              )?.IsMandatory
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={8}>
                          <SearchDropdown
                            disableClearable={true}
                            name={'isSentinel'}
                            options={[
                              { text: 'Select', value: '' },
                              ...([
                                {
                                  text: 'Yes',
                                  value: 'yes',
                                },
                                {
                                  text: 'No',
                                  value: 'no',
                                },
                              ] || []),
                            ]}
                            getOptionLabel={(option) => option.text}
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
                              [
                                {
                                  text: 'Yes',
                                  value: 'yes',
                                },
                                {
                                  text: 'No',
                                  value: 'no',
                                },
                              ]?.find(
                                (option) =>
                                  option.value === values['isSentinel']
                              ) || null
                            }
                            onChange={(event, value) => {
                              setFieldValue('isSentinel', value?.value);
                              setIsSentinelValue(value?.value);
                            }}
                          />
                          <ErrorMessage
                            name="isSentinel"
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
                    {pageFields?.find((x) => x.FieldId === 'IS_IT_P_Definition')
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
                              'IM_IS_IT_Definition',
                              {
                                Data: fieldLabels,
                                Status: labels?.Status,
                              },
                              i18n.language
                            )}
                            isRequired={
                              pageFields?.find(
                                (x) => x.FieldId === 'IS_IT_P_Definition'
                              )?.IsMandatory
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={8}>
                          <Field name="definition">
                            {({ field }) => (
                              <TextArea
                                {...field}
                                id="definition"
                                autoComplete="off"
                                values={values.incType}
                                fullWidth={true}
                                slotProps={{ htmlInput: { maxLength: 100 } }}
                              />
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

                    {isSentinelValue == 'yes' && (
                      <>
                        {pageFields?.find(
                          (x) => x.FieldId === 'IS_IT_P_Inclusion'
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
                                  'IM_IS_IT_Inclusion',
                                  {
                                    Data: fieldLabels,
                                    Status: labels?.Status,
                                  },
                                  i18n.language
                                )}
                                isRequired={
                                  pageFields?.find(
                                    (x) => x.FieldId === 'IS_IT_P_Inclusion'
                                  )?.IsMandatory
                                }
                              />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={8}>
                              <Field name="inclusion">
                                {({ field }) => (
                                  <TextArea
                                    {...field}
                                    id="inclusion"
                                    autoComplete="off"
                                    values={values.incType}
                                    fullWidth={true}
                                    slotProps={{
                                      htmlInput: { maxLength: 100 },
                                    }}
                                  />
                                )}
                              </Field>
                              <ErrorMessage
                                name="inclusion"
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
                          (x) => x.FieldId === 'IS_IT_P_Exclusion'
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
                                  'IM_IS_IT_Exclusion',
                                  {
                                    Data: fieldLabels,
                                    Status: labels?.Status,
                                  },
                                  i18n.language
                                )}
                                isRequired={
                                  pageFields?.find(
                                    (x) => x.FieldId === 'IS_IT_P_Exclusion'
                                  )?.IsMandatory
                                }
                              />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={8}>
                              <Field name="exclusion">
                                {({ field }) => (
                                  <TextArea
                                    {...field}
                                    id="exclusion"
                                    autoComplete="off"
                                    values={values.incType}
                                    fullWidth={true}
                                    slotProps={{
                                      htmlInput: { maxLength: 100 },
                                    }}
                                  />
                                )}
                              </Field>
                              <ErrorMessage
                                name="exclusion"
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
                      </>
                    )}

                    {pageFields?.find(
                      (x) => x.FieldId === 'IS_IT_P_NotificationStaff(s)'
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
                                x.FieldId === 'IS_IT_P_NotificationStaff(s)'
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
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddEditIncidentType;
