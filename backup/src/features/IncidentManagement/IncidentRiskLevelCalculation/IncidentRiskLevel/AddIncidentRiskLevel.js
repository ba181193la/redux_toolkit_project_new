import {
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  CircularProgress,
  Tooltip,
  Checkbox,
} from '@mui/material';

import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../../utils/StyledComponents';

import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import CloseIcon from '../../../../assets/Icons/CloseIcon.png';
import DoneIcon from '../../../../assets/Icons/DoneIcon.png';
import DndIcon from '../../../../assets/Icons/DoNotDisturbIcon.png';
import Label from '../../../../components/Label/Label';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  useAddCompanyMutation,
  useGetCompanyByIdQuery,
  useGetFacilityQuery,
  useUpdateCompanyMutation,
} from '../../../../redux/RTK/contactInformationApi';
import { showToastAlert } from '../../../../utils/SweetAlert';
import { useTranslation } from 'react-i18next';
import { getlabel } from '../../../../utils/IncidentLabels';
import { SketchPicker } from 'react-color';
import MultiSelectDropdown from '../../../../components/Dropdown/MultiSelectDropdown';
import TextArea from '../../../../components/TextArea/TextArea';
import {
  useAddRiskLevelMutation,
  useGetIncidentRiskLevelByIdQuery,
  useUpdateIncidentRiskLevelMutation,
} from '../../../../redux/RTK/incidentRiskLevelApi';

const AddIncidentRiskLevel = ({
  open,
  selectedCompanyId,
  setShowIncidentRiskLevel,
  setSelectedIncidentRiskLevelId,
  selectedIncidentRiskLevelId,
  labels,
  isEditCompany,
  records,
  refetch,
  fieldAccess,
}) => {
  const [triggerAddRiskLevel] = useAddRiskLevelMutation();
  const [triggerUpdateRiskLevel] = useUpdateIncidentRiskLevelMutation();
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState();
  const { userDetails, selectedMenu, selectedModuleId, selectedFacility } =
    useSelector((state) => state.auth);

  const [color, setColor] = useState('#fff');
  const [showPicker, setShowPicker] = useState(false);
  const handleClick = (e) => {
    e.stopPropagation(); // Prevent click from propagating to the body
    setShowPicker(!showPicker);
  };

  // const incidentRiskLevelvalidation = Yup.object().shape({
  //         incidentRiskLevel: Yup.string()
  //           .required("Incident Risk Level is required")
  //           .min(3, "Must be at least 3 characters"),
  //           actionsToBeTaken: Yup.string()
  //           .required(" Actions To Be Taken is required"),
  //           greaterScoreRange: Yup.string()
  //           .required(" Score Range is required"),
  //           lesserScoreRange: Yup.string()
  //           .required(" Score Range is required"),
  //       });

  const incidentRiskLevelvalidation = Yup.object().shape({
    incidentRiskLevel: Yup.string().when([], {
                is: () =>
                  pageFields?.find((x) => x.FieldId === 'IRLC_IRL_P_IncidentRiskLevel')
                    ?.IsMandatory === true,
                then: (schema) =>
                  schema.required(
                    `${getlabel('IM_IRLC_IRL_IncidentRiskLevel', labels, i18n.language)} ${t('IsRequired')}`
                  ),
                otherwise: (schema) => schema.notRequired(),
              }),
              actionsToBeTaken: Yup.string().when([], {
                is: () =>
                  pageFields?.find((x) => x.FieldId === 'IRLC_IRL_P_ActionTobeTaken')
                    ?.IsMandatory === true,
                then: (schema) =>
                  schema.required(
                    `${getlabel('IM_IRLC_IRL_ActionTobeTaken', labels, i18n.language)} ${t('IsRequired')}`
                  ),
                otherwise: (schema) => schema.notRequired(),
              }),
              greaterScoreRange: Yup.string().when([], {
                is: () =>
                  pageFields?.find((x) => x.FieldId === 'IRLC_IRL_P_ScoreRange(Greaterthan)')
                    ?.IsMandatory === true,
                then: (schema) =>
                  schema.required(
                    `${getlabel('IM_IRLC_IRL_ScoreRange(Greaterthan)', labels, i18n.language)} ${t('IsRequired')}`
                  ),
                otherwise: (schema) => schema.notRequired(),
              }),
              
              lesserScoreRange: Yup.string().when([], {
                is: () =>
                  pageFields?.find((x) => x.FieldId === 'IRLC_IRL_P_ScoreRange(LessthanorEqualto)')
                    ?.IsMandatory === true,
                then: (schema) =>
                  schema.required(
                    `${getlabel('IM_IRLC_IRL_ScoreRange(LessthanorEqualto)', labels, i18n.language)} ${t('IsRequired')}`
                  ),
                otherwise: (schema) => schema.notRequired(),
              }),

              rcaRequired: Yup.boolean().when([], {
                is: () => {
                  return (
                    pageFields?.find((x) => x.FieldId === "IRLC_IRL_P_RCARequired")
                      ?.IsMandatory === true
                  );
                },
                then: (schema) =>
                  schema.oneOf(
                    [true],
                    `${getlabel("IM_IRLC_IRL_RCARequired", labels, i18n.language)} ${t(
                      "IsRequired"
                    )}`
                  ),

                otherwise: (schema) => schema.notRequired(),
              }),

              bgColor: Yup.string().when([], {
                is: () =>
                  pageFields?.find((x) => x.FieldId === 'IRLC_IRL_P_BackgroundColor')
                    ?.IsMandatory === true,
                then: (schema) =>
                  schema.required(
                    `${getlabel('IM_IRLC_IRL_BackgroundColor', labels, i18n.language)} ${t('IsRequired')}`
                  ),
                otherwise: (schema) => schema.notRequired(),
              }),
            });

  const handleClose = () => setShowPicker(false);

  const handleChange = (color, setFieldValue) => {
    setColor(color?.hex);
    setFieldValue(color?.hex);
    handleClose();
  };


  const pageFields = fieldAccess?.Data?.Menus?.find(
    (section) => section?.MenuId === selectedMenu?.id
  )
    ?.Sections?.find(
      (sectionName) => sectionName?.SectionName === 'Incident Risk Level-Page'
    )
    ?.Regions?.find((region) => region?.RegionCode === 'ALL')?.Fields;

  const [newRiskLevel, setNewRiskLevel] = useState({
    facility: '',
    incidentRiskLevelId: 0,
    incidentRiskLevel: '',
    actionsToBeTaken: '',
    greaterScoreRange: '',
    lesserScoreRange: '',
    bgColor: '',
    rcaRequired: false,
  });
  const [initialValues, setInitialValues] = useState({
    incidentRiskLevelId: 0,
    incidentRiskLevel: '',
    actionsToBeTaken: '',
    greaterScoreRange: '',
    lesserScoreRange: '',
    bgColor: '',
    rcaRequired: false,
  });
  // });
  const { data: RiskLeveldata, refetch: refetchIncidentRiskLevelId } =
    useGetIncidentRiskLevelByIdQuery(
      {
        incidentRiskLevelId: selectedIncidentRiskLevelId,
        loginUserId: userDetails?.UserId,
        menuId: 22,
      },
      { skip: !selectedIncidentRiskLevelId }
    );
  useEffect(() => {
    if (RiskLeveldata) {
      setInitialValues({
        incidentRiskLevelId: RiskLeveldata.Data.IncidentRiskLevelId,
        incidentRiskLevel: RiskLeveldata.Data.IncidentRiskLevel,
        actionsToBeTaken: RiskLeveldata.Data.ActionToBeTaken,
        greaterScoreRange: RiskLeveldata.Data.GreaterScoreRange,
        lesserScoreRange: RiskLeveldata.Data.LesserScoreRange,
        bgColor: RiskLeveldata.Data.BackgroundColorCode,
        rcaRequired: RiskLeveldata.Data.IsRCARequired,
        facility: String(RiskLeveldata?.Data?.FacilityId || ''),
      });
      setColor(RiskLeveldata.Data.BackgroundColorCode || '#fff');
    }
  }, [RiskLeveldata]);
  const { data: getFacilityData, isLoading: facilityLoading } =
    useGetFacilityQuery(
      {
        payload: {
          pageIndex: 1,
          pageSize: 100,
          headerFacility: selectedFacility?.id,
          loginUserId: userDetails?.UserId,
          moduleId: selectedModuleId,
          menuId: selectedMenu?.id,
        },
      },
      {
        refetchOnMountOrArgChange: true,
      }
    );
  const { t, i18n } = useTranslation();
  const companyValidation = Yup.object().shape({
    companyCode: Yup.string().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'CIM_P_CompanyCode')
          ?.IsMandatory === true,
      then: (schema) =>
        schema.required(
          `${getlabel('MM_CIM_CompanyCode', labels, i18n.language)} ${t('IsRequired')}`
        ),
      otherwise: (schema) => schema.notRequired(),
    }),

    companyName: Yup.string().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'CIM_P_CompanyName')
          ?.IsMandatory === true,
      then: (schema) =>
        schema.required(
          `${getlabel('MM_CIM_CompanyName', labels, i18n.language)} ${t('IsRequired')}`
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
  });
  useEffect(() => {
    if (RiskLeveldata?.Data) {
      setNewRiskLevel({
        incidentRiskLevelId: RiskLeveldata.Data.IncidentRiskLevelId,
        incidentRiskLevel: RiskLeveldata.Data.IncidentRiskLevel,
        actionsToBeTaken: RiskLeveldata.Data.ActionToBeTaken,
        greaterScoreRange: RiskLeveldata.Data.GreaterScoreRange,
        lesserScoreRange: RiskLeveldata.Data.LesserScoreRange,
        bgColor: RiskLeveldata.Data.BackgroundColorCode,
        rcaRequired: RiskLeveldata.Data.IsRCARequired,
      });
    }
  }, [RiskLeveldata]);
  const submitCompany = async (values, setSubmitting) => {
    // setSubmitting(true);
    let response;
    try {
      if (newRiskLevel?.incidentRiskLevelId === 0) {
        response = await triggerAddRiskLevel({
          payload: {
            incidentRiskLevel: values?.incidentRiskLevel,
            actionToBeTaken: values?.actionsToBeTaken,
            greaterScoreRange: values?.greaterScoreRange,
            lesserScoreRange: values?.lesserScoreRange,
            backgroundColorCode: values?.bgColor,
            isRCARequired: values?.rcaRequired,
            // facilityId: selectedFacility?.id,
            loginUserId: userDetails?.UserId,
            moduleId: 2,
            menuId: 22,
          },
        }).unwrap();
      } else if (newRiskLevel?.incidentRiskLevelId) {
        const currentRow = records?.find((record) => {
          return record.incidentRiskLevelId === values.incidentRiskLevelId;
        });
        const currentStatus = currentRow?.IsActive;
        let updatedStatus = currentStatus;
        if (
          values?.isActive !== undefined &&
          values?.isActive !== currentStatus
        ) {
          updatedStatus = values.isActive;
        }
        response = await triggerUpdateRiskLevel({
          payload: {
            incidentRiskLevelId: values?.incidentRiskLevelId,
            incidentRiskLevel: values?.incidentRiskLevel,
            actionToBeTaken: values?.actionsToBeTaken,
            greaterScoreRange: values?.greaterScoreRange,
            lesserScoreRange: values?.lesserScoreRange,
            backgroundColorCode: values?.bgColor,
            isRCARequired: values?.rcaRequired,
            // facilityId: selectedFacility?.id,
            loginUserId: userDetails?.UserId,
            moduleId: 2,
            menuId: 22,
          },
        }).unwrap();
        refetchIncidentRiskLevelId();
      }
      if (response && response.Message !== 'Record Already Exist') {
        showToastAlert({
          type: 'custom_success',
          text: response.Message,
          gif: 'ErrorGif'
        });
      }
      if (
        response &&
        response.Message === 'Record Already Exist' &&
        response.Status === 'Failure'
      ) {
        showToastAlert({
          type: 'custom_info',
          text: response.Message,
          gif: 'ErrorGif'
        });
      }

      setNewRiskLevel({
        incidentRiskLevel: '',
        incidentRiskLevelId: 0,
        actionsToBeTaken: '',
        greaterScoreRange:'',
        lesserScoreRange: '',
        bgColor: '',
        rcaRequired: '',
      });
      setColor('#fff');
      setShowIncidentRiskLevel(false);
      refetch();
    } catch (error) {}
  };

  return (
    <Dialog
      open={open}
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
          backgroundColor: '#205475',
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
          {newRiskLevel?.incidentRiskLevelId ? t('EditIncidentRiskLevel') : t('AddIncidentRiskLevel')}
        </StyledTypography>

        <IconButton
          onClick={() => {
            setShowIncidentRiskLevel(false);
            setNewRiskLevel({
              incidentRiskLevel: '',
              actionsToBeTaken: '',
              greaterScoreRange:'',
              lesserScoreRange: '',
              bgColor: '',
              rcaRequired: '',
            });
          }}
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
            initialValues={initialValues}
            validateOnBlur={false}
            validationSchema={incidentRiskLevelvalidation}
            onSubmit={(values, { setSubmitting }) => {
              submitCompany(values, setSubmitting);
            }}
          >
            {({
              values,
              handleSubmit,
              resetForm,
              isSubmitting,
              setFieldValue,
            }) => {
              return (
                <Form style={{ width: '100%' }}>
                  <>
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
                      {pageFields?.find(
                        (x) => x.FieldId === 'IRLC_IRL_P_IncidentRiskLevel'
                      )?.IsShow && (
                        <>
                          <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={4}
                            padding={'10px'}
                          >
                            <Label
                              value={getlabel(
                                'IM_IRLC_IRL_IncidentRiskLevel',
                                labels,
                                i18n.language
                              )}
                              isRequired={
                                pageFields?.find(
                                  (x) =>
                                    x.FieldId === 'IRLC_IRL_P_IncidentRiskLevel'
                                )?.IsMandatory
                              }
                            />
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={8}
                            padding={'10px'}
                          >
                            <Field name="incidentRiskLevel">
                              {({ field }) => (
                                <TextField
                                  {...field}
                                  id="incidentRiskLevel"
                                  autoComplete="off"
                                  values={values?.companyCode}
                                  fullWidth={true}
                                  disabled={isEditCompany}
                                  slotProps={{ htmlInput: { maxLength: 100 } }}
                                />
                              )}
                            </Field>
                            <ErrorMessage
                              name="incidentRiskLevel"
                              component="div"
                              style={{
                                color: 'red',
                                fontSize: '12px',
                                marginTop: '4px',
                              }}
                            />
                          </Grid>
                        </>
                      )}
                      {pageFields?.find(
                        (x) => x.FieldId === 'IRLC_IRL_P_ActionTobeTaken'
                      )?.IsShow && (
                        <>
                          <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={4}
                            padding={'10px'}
                          >
                            <Label
                              value={getlabel(
                                'IM_IRLC_IRL_ActionTobeTaken',
                                labels,
                                i18n.language
                              )}
                              isRequired={
                                pageFields?.find(
                                  (x) =>
                                    x.FieldId === 'IRLC_IRL_P_ActionTobeTaken'
                                )?.IsMandatory
                              }
                            />
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={8}
                            padding={'10px'}
                          >
                            <TextArea
                              value={values?.actionsToBeTaken}
                              onChange={(e) =>
                                setFieldValue(
                                  'actionsToBeTaken',
                                  e.target.value
                                )
                              }
                              name="actionsToBeTaken"
                              id="actionsToBeTaken"
                            />

                            <ErrorMessage
                              name="actionsToBeTaken"
                              component="div"
                              style={{
                                color: 'red',
                                fontSize: '12px',
                                marginTop: '4px',
                              }}
                            />
                          </Grid>
                        </>
                      )}
                      {pageFields?.find(
                        (x) =>
                          x.FieldId === 'IRLC_IRL_P_ScoreRange(Greaterthan)'
                      )?.IsShow && (
                        <>
                          <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={4}
                            padding={'10px'}
                          >
                            <Label
                              value={getlabel(
                                'IM_IRLC_IRL_ScoreRange(Greaterthan)',
                                labels,
                                i18n.language
                              )}
                              isRequired={
                                pageFields?.find(
                                  (x) =>
                                    x.FieldId ===
                                    'IRLC_IRL_P_ScoreRange(Greaterthan)'
                                )?.IsMandatory
                              }
                            />
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={8}
                            padding={'10px'}
                          >
                            <Field name="greaterScoreRange">
                              {({ field }) => (
                                <TextField
                                  {...field}
                                  id="greaterScoreRange"
                                  autoComplete="off"
                                  type="number"
                                  values={values?.companyCode}
                                  fullWidth={true}
                                  disabled={isEditCompany}
                                  slotProps={{ htmlInput: { maxLength: 100 } }}
                                />
                              )}
                            </Field>
                            <ErrorMessage
                              name="greaterScoreRange"
                              component="div"
                              style={{
                                color: 'red',
                                fontSize: '12px',
                                marginTop: '4px',
                              }}
                            />
                          </Grid>
                        </>
                      )}
                      {pageFields?.find(
                        (x) =>
                          x.FieldId ===
                          'IRLC_IRL_P_ScoreRange(LessthanorEqualto)'
                      )?.IsShow && (
                        <>
                          <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={4}
                            padding={'10px'}
                          >
                            <Label
                              value={getlabel(
                                'IM_IRLC_IRL_ScoreRange(LessthanorEqualto)',
                                labels,
                                i18n.language
                              )}
                              isRequired={
                                pageFields?.find(
                                  (x) =>
                                    x.FieldId ===
                                    'IRLC_IRL_P_ScoreRange(LessthanorEqualto)'
                                )?.IsMandatory
                              }
                            />
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={8}
                            padding={'10px'}
                          >
                            <Field name="lesserScoreRange">
                              {({ field }) => (
                                <TextField
                                  {...field}
                                  id="lesserScoreRange"
                                  autoComplete="off"
                                  type="number"
                                  values={values?.companyCode}
                                  fullWidth={true}
                                  disabled={isEditCompany}
                                  slotProps={{ htmlInput: { maxLength: 100 } }}
                                />
                              )}
                            </Field>
                            <ErrorMessage
                              name="lesserScoreRange"
                              component="div"
                              style={{
                                color: 'red',
                                fontSize: '12px',
                                marginTop: '4px',
                              }}
                            />
                          </Grid>
                        </>
                      )}
                      {pageFields?.find(
                        (x) => x.FieldId === 'IRLC_IRL_P_BackgroundColor'
                      )?.IsShow && (
                        <>
                          <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={4}
                            padding={'10px'}
                          >
                            <Label
                              value={getlabel(
                                'IM_IRLC_IRL_BackgroundColor',
                                labels,
                                i18n.language
                              )}
                              isRequired={
                                pageFields?.find(
                                  (x) =>
                                    x.FieldId === 'IRLC_IRL_P_BackgroundColor'
                                )?.IsMandatory
                              }
                            />
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={8}
                            padding={'10px'}
                          >
                            {/* <Field name="backgroundColor">
                          {({ field }) => (
                            <TextField
                              {...field}
                              id="backgroundColor"
                              autoComplete="off"
                              values={values?.companyCode}
                              fullWidth={true}
                              disabled={isEditCompany}
                              slotProps={{ htmlInput: { maxLength: 100 } }}
                            />
                          )}
                        </Field> */}
                            <div>
                              <div
                                style={{
                                  width: '25px',
                                  height: '25px',
                                  backgroundColor: color,
                                  border: '2px solid #ccc',
                                  cursor: 'pointer',
                                }}
                                onClick={handleClick}
                              ></div>
                              {showPicker && (
                                <div>
                                  <SketchPicker
                                    color={color}
                                    name="bgColor"
                                    onChangeComplete={(e) => {
                                      setColor(e?.hex);
                                      setFieldValue('bgColor', e?.hex);
                                      handleClose();
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                            <ErrorMessage
                              name="bgColor"
                              component="div"
                              style={{
                                color: 'red',
                                fontSize: '12px',
                                marginTop: '4px',
                              }}
                            />
                          </Grid>
                        </>
                      )}
                      {pageFields?.find(
                        (x) => x.FieldId === 'IRLC_IRL_P_RCARequired'
                      )?.IsShow && (
                        <>
                          <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={4}
                            padding={'10px'}
                          >
                            <Label value={getlabel(
                                'IM_IRLC_IRL_RCARequired',
                                labels,
                                i18n.language
                              )} 
                            isRequired={
                              pageFields?.find(
                                (x) =>
                                  x.FieldId === 'IRLC_IRL_P_RCARequired'
                              )?.IsMandatory
                            }
                            />
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={8}
                            padding={'10px'}
                          >
                            <Checkbox
                              id="rcaRequired"
                              name="rcaRequired"
                              checked={values.rcaRequired} // Bind the checkbox to the Formik field value
                              onChange={(e) => {
                                setFieldValue('rcaRequired', e.target.checked);
                              }}
                              disabled={isEditCompany}
                            />
                            <ErrorMessage
                              name="rcaRequired"
                              component="div"
                              style={{
                                color: 'red',
                                fontSize: '12px',
                                marginTop: '4px',
                              }}
                            />
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </>

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
                      color="primary"
                      onClick={handleSubmit}
                      type="submit"
                      style={{
                        display: 'inline-flex',
                        position: 'relative',
                        gap: '5px',
                      }}
                      disabled={isSubmitting} // Disable button while submitting
                      startIcon={
                        isSubmitting ? (
                          <CircularProgress
                            size={16}
                            style={{
                              color: '#fff',
                            }}
                          />
                        ) : (
                          <StyledImage
                            height="16px"
                            width="16px"
                            src={DoneIcon}
                            alt="Done Icon"
                          />
                        )
                      }
                    >
                      {isSubmitting ? t('Submitting') : t('Submit')}
                    </StyledButton>

                    <StyledButton
                      variant="outlined"
                      border="1px solid #0083c0"
                      backgroundColor="#ffffff"
                      type="button"
                      colour="#0083c0"
                      borderRadius="6px"
                      margin="0 0 0 10px"
                      display="inline-flex"
                      gap="5px"
                      onClick={() => {
                        resetForm();
                        setColor('#fff');

                        false;
                        setNewRiskLevel({
                          incidentRiskLevel: '',
                          actionsToBeTaken: '',
                          greaterScoreRange: '',
                          lesserScoreRange: '',
                          bgColor: '',
                          rcaRequired: '',
                        });
                        setShowIncidentRiskLevel(false);
                      }}
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
                </Form>
              );
            }}
          </Formik>
        </FlexContainer>
      </DialogContent>
    </Dialog>
  );
};

export default AddIncidentRiskLevel;
