import {
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  CircularProgress,
  Tooltip,
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
import MultiSelectDropdown from '../../../../components/Dropdown/MultiSelectDropdown';
import TextArea from '../../../../components/TextArea/TextArea';
import {
  useAddLiklihoodMutation,
  useGetLiklihoodByIdQuery,
  useUpdateLiklihoodMutation,
} from '../../../../redux/RTK/incidentRiskLevelApi';

const AddEditlikelihood = ({
  open,
  selectedCompanyId,
  setShowLiklihoodModal,
  setSelectedLiklhoodId,
  selectedLiklhoodId,
  labels,
  isEditCompany,
  records,
  refetch,
  fieldAccess,
}) => {
  const [triggerAddLiklihood] = useAddLiklihoodMutation();
  const [triggerUpdateLiklihood] = useUpdateLiklihoodMutation();
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState();
  const { userDetails, selectedMenu, selectedModuleId } = useSelector(
    (state) => state.auth
  );

  // const pageFields = fieldAccess?.Data?.Sections?.find(
  //   (section) => section?.SectionName === 'Page'
  // )?.Fields;

  const pageFields = fieldAccess?.Data?.Menus?.find(
    (section) => section?.MenuId === selectedMenu?.id
  )
    ?.Sections?.find(
      (sectionName) => sectionName?.SectionName === 'Likelihood-Page'
    )
    ?.Regions?.find((region) => region?.RegionCode === 'ALL')?.Fields;

  const [newliklihood, setNewliklihood] = useState({
    likelihood: '',
    score: '',
    likelihoodId: 0,
    definiton: '',
    facility: '',
  });
  const [initialValues, setInitialValues] = useState({
    likelihood: '',
    likelihoodId: 0,
    facility: '',
    definiton: '',
    // facilityId: 2,
    score: '',
  });

  const likelihoodValidation = Yup.object().shape({
    likelihood: Yup.string().when([], {
              is: () =>
                pageFields?.find((x) => x.FieldId === 'IRLC_L_P_Likelihood')
                  ?.IsMandatory === true,
              then: (schema) =>
                schema.required(
                  `${getlabel('IM_IRLC_L_Likelihood', labels, i18n.language)} ${t('IsRequired')}`
                ),
              otherwise: (schema) => schema.notRequired(),
            }),
            definiton: Yup.string().when([], {
              is: () =>
                pageFields?.find((x) => x.FieldId === 'IRLC_L_P_Definition')
                  ?.IsMandatory === true,
              then: (schema) =>
                schema.required(
                  `${getlabel('IM_IRLC_L_Definition', labels, i18n.language)} ${t('IsRequired')}`
                ),
              otherwise: (schema) => schema.notRequired(),
            }),
            score: Yup.string().when([], {
              is: () =>
                pageFields?.find((x) => x.FieldId === 'IRLC_L_P_Score')
                  ?.IsMandatory === true,
              then: (schema) =>
                schema.required(
                  `${getlabel('IM_IRLC_L_Score', labels, i18n.language)} ${t('IsRequired')}`
                ),
              otherwise: (schema) => schema.notRequired(),
            }),
          });

  const { data: getFacilityData, isLoading: facilityLoading } =
    useGetFacilityQuery(
      {
        payload: {
          pageIndex: 1,
          pageSize: 100,
          headerFacility: 2,
          loginUserId: userDetails?.UserId,
          moduleId: selectedModuleId,
          menuId: selectedMenu?.id,
        },
      },
      {
        refetchOnMountOrArgChange: true,
      }
    );

  const { data: liklihoodRecords, refetch: refetchLiklihoodRecords } =
    useGetLiklihoodByIdQuery(
      {
        likelihoodId: selectedLiklhoodId,
        loginUserId: userDetails?.UserId,
        menuId: 22,
      },
      { skip: !selectedLiklhoodId }
    );
  useEffect(() => {
    if (liklihoodRecords) {
      setInitialValues({
        likelihood: liklihoodRecords?.Data?.Likelihood || '',
        likelihoodId: liklihoodRecords?.Data?.LikelihoodId || 0,
        definiton: liklihoodRecords?.Data?.LikelihoodDefinition,
        facility: String(liklihoodRecords?.Data?.FacilityId || ''),
        score: liklihoodRecords?.Data?.Score || 0,
        // facilityId: 2
      });
    }
  }, [liklihoodRecords]);
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
    if (liklihoodRecords?.Data) {
      setNewliklihood({
        likelihood: liklihoodRecords?.Data?.Likelihood || '',
        likelihoodId: liklihoodRecords?.Data?.LikelihoodId || 0,
        definiton: liklihoodRecords?.Data?.LikelihoodDefinition,
        facility: liklihoodRecords?.Data?.Facility || '',
        score: liklihoodRecords?.Data?.Score || 0,
      });
    }
  }, [liklihoodRecords]);
  const submitCompany = async (values, setSubmitting) => {
    setSubmitting(true);
    let response;
    try {
      if (!newliklihood?.likelihoodId || newliklihood?.likelihoodId === 0) {
        response = await triggerAddLiklihood({
          payload: {
            likelihood: values?.likelihood,
            facilityId: values?.facilityId,
            // facilityIds: '4, 5',
            facilityIds: Array.isArray(values.facility)
              ? values.facility.join(',')
              : values.facility || '',
            likelihoodDefinition: values?.definiton,
            score: values?.score,
            loginUserId: userDetails?.UserId,
            // isDelete: true,
            moduleId: 2,
            menuId: 22,
          },
        }).unwrap();
      } else {
        response = await triggerUpdateLiklihood({
          payload: {
            likelihoodId: values?.likelihoodId,
            likelihood: values?.likelihood,
            facilityId: values?.facilityId,
            // facilityIds: '4, 5',
            facilityIds: Array.isArray(values.facility)
              ? values.facility.join(',')
              : values.facility || '',
            likelihoodDefinition: values?.definiton,
            score: values?.score,
            loginUserId: userDetails?.UserId,
            // isDelete: true,
            moduleId: 2,
            menuId: 22,
          },
        }).unwrap();
        refetchLiklihoodRecords();
      }
      if (response && response.Message !== 'Record Already Exist') {
        showToastAlert({
          type: 'custom_success',
          text: response.Message,
          gif: 'ErrorGif',
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
          gif: 'ErrorGif',
        });
      }

      setNewliklihood({
        likelihood: '',
        likelihoodId: 0,
        definiton: '',
        score: '',
      });
      setShowLiklihoodModal(false);
      refetch();
    } catch (error) {
      console.log('error', error);
    }
  };
  useEffect(() => {
    if (!open) {
      setNewliklihood({
        likelihood: '',
        score: '',
        definiton: '',
        facility: '',
      });
    }
  }, [open]);
  return (
    <Dialog
      open={open}
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
      maxWidth={'sm'}
      disableEnforceFocus
      disableAutoFocus
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
          {t('AddLikelihood')}
        </StyledTypography>

        <IconButton
          onClick={() => {
            setShowLiklihoodModal(false);
            setNewliklihood({
              likelihood: '',
              score: '',
              definiton: '',
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
            validationSchema={likelihoodValidation}
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
                      {pageFields?.find((x) => x.FieldId === 'IRLC_L_P_Likelihood')?.IsShow && (
                        <>
                      <Grid item xs={12} sm={12} md={6} lg={4} padding={'10px'}>
                        <Label
                          value={getlabel(
                            'IM_IRLC_L_Likelihood',
                            labels,
                            i18n.language
                          )}
                          isRequired={
                            pageFields?.find(
                              (x) => x.FieldId === 'IRLC_L_P_Likelihood'
                            )?.IsMandatory}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={8} padding={'10px'}>
                        <Field name="likelihood">
                          {({ field }) => (
                            <TextField
                              {...field}
                              id="likelihood"
                              autoComplete="off"
                              values={values?.companyCode}
                              fullWidth={true}
                              disabled={isEditCompany}
                              slotProps={{ htmlInput: { maxLength: 100 } }}
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="likelihood"
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
                      {pageFields?.find((x) => x.FieldId === 'IRLC_L_P_Definition')?.IsShow && (
                      <>
                      <Grid item xs={12} sm={12} md={6} lg={4} padding={'10px'}>
                        <Label
                          value={getlabel(
                            'IM_IRLC_L_Definition',
                            labels,
                            i18n.language
                          )}
                          isRequired={
                            pageFields?.find(
                              (x) => x.FieldId === 'IRLC_L_P_Definition'
                            )?.IsMandatory}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={8} padding={'10px'}>
                        <Field name="definiton">
                          {({ field }) => (
                            // <TextField
                            //   {...field}
                            //   id="companyCode"
                            //   autoComplete="off"
                            //   values={values?.companyCode}
                            //   fullWidth={true}
                            //   disabled={isEditCompany}
                            //   slotProps={{ htmlInput: { maxLength: 100 } }}
                            // />
                            <TextArea
                              // sx={{
                              //   width: '100%',
                              //   height: isMobile || isTablet ? '80px' : '100px',
                              //   padding: '10px',
                              //   maxWidth: isMobile || isTablet ? '90%' : '200px',
                              // }}
                              value={values?.definiton}
                              onChange={(e) =>
                                setFieldValue('definiton', e.target.value)
                              }
                              id="definiton"
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="definiton"
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
                      {pageFields?.find((x) => x.FieldId === 'IRLC_L_P_Score')?.IsShow && (
                        <>
                      <Grid item xs={12} sm={12} md={6} lg={4} padding={'10px'}>
                        <Label
                          value={getlabel(
                            'IM_IRLC_L_Score',
                            labels,
                            i18n.language
                          )}
                          isRequired={
                            pageFields?.find(
                              (x) => x.FieldId === 'IRLC_L_P_Score'
                            )?.IsMandatory}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={8} padding={'10px'}>
                        <Field name="score">
                          {({ field }) => (
                            <TextField
                              {...field}
                              id="score"
                              type="number"
                              autoComplete="off"
                              values={values?.companyCode}
                              fullWidth={true}
                              disabled={isEditCompany}
                              slotProps={{ htmlInput: { maxLength: 100 } }}
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="score"
                          component="div"
                          style={{
                            color: 'red',
                            fontSize: '12px',
                            marginTop: '4px',
                          }}
                        />
                      </Grid>
                      </>)}
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

                        false;
                        setNewliklihood({
                          likelihood: '',
                          definiton: '',
                          score: '',
                        });
                        setShowLiklihoodModal(false);
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

export default AddEditlikelihood;
