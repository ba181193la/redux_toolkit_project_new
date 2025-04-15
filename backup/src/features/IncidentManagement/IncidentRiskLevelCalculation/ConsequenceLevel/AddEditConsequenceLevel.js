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
import {
  useAddConsequenceLevelMutation,
  useGetConsequenceLevelbyIdQuery,
  useUpdateConsequenceLevelMutation,
} from '../../../../redux/RTK/incidentRiskLevelApi';

const AddEditStaffCategory = ({
  open,
  selectedConsequenceLevelId,
  setShowConsequenceLevelModal,
  labels,
  isEditCompany,
  records,
  refetch,
  fieldAccess,
}) => {
  const [triggerAddConsequenceLevel] = useAddConsequenceLevelMutation();
  const [triggerUpdateConsequenceLevel] = useUpdateConsequenceLevelMutation();
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState();
  const { userDetails, selectedMenu, selectedModuleId, selectedFacility } =
    useSelector((state) => state.auth);

  // const pageFields = fieldAccess?.Data?.Sections?.find(
  //   (section) => section?.SectionName === 'Page'
  // )?.Fields;

  const pageFields = fieldAccess?.Data?.Menus?.find(
    (section) => section?.MenuId === selectedMenu?.id
  )
    ?.Sections?.find(
      (sectionName) => sectionName?.SectionName === 'Consequence Level-Page'
    )
    ?.Regions?.find((region) => region?.RegionCode === 'ALL')?.Fields;

  const [newConsequenceLevel, setNewConsequenceLevel] = useState({
    consequenceLevel: '',
    score: '',
    consequenceLevelId: 0,
    facility: '',
  });
  const [initialValues, setInitialValues] = useState({
    consequenceLevel: '',
    score: '',
    consequenceLevelId: 0,
    facility: '',
  });

  const { data: consequenceLevelData, refetch: refetchCompanyData } =
    useGetConsequenceLevelbyIdQuery(
      {
        consequenceLevelId: selectedConsequenceLevelId,
        loginUserId: userDetails?.UserId,
      },
      { skip: !selectedConsequenceLevelId }
    );

     const consequenceLevelValidation = Yup.object().shape({
      consequenceLevel: Yup.string().when([], {
            is: () =>
              pageFields?.find((x) => x.FieldId === 'IRLC_CL_P_ConsequenceLevel')
                ?.IsMandatory === true,
            then: (schema) =>
              schema.required(
                `${getlabel('IM_IRLC_CL_ConsequenceLevel', labels, i18n.language)} ${t('IsRequired')}`
              ),
            otherwise: (schema) => schema.notRequired(),
          }),
          score: Yup.string().when([], {
            is: () =>
              pageFields?.find((x) => x.FieldId === 'IRLC_CL_P_Score')
                ?.IsMandatory === true,
            then: (schema) =>
              schema.required(
                `${getlabel('IM_IRLC_CL_Score', labels, i18n.language)} ${t('IsRequired')}`
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
  useEffect(() => {
    if (consequenceLevelData) {
      setInitialValues({
        consequenceLevel: consequenceLevelData?.Data?.ConsequenceLevel,
        score: consequenceLevelData?.Data?.Score,
        consequenceLevelId: consequenceLevelData?.Data?.ConsequenceLevelId,
        facility: String(consequenceLevelData?.Data?.FacilityId || ''),
      });
    }
  }, [consequenceLevelData]);
  const { t, i18n } = useTranslation();
 
  useEffect(() => {
    if (consequenceLevelData?.Data) {
      setNewConsequenceLevel({
        consequenceLevel: consequenceLevelData?.Data?.ConsequenceLevel,
        score: consequenceLevelData?.Data?.Score,
        consequenceLevelId: consequenceLevelData?.Data?.ConsequenceLevelId,
        facility: String(consequenceLevelData?.Data?.FacilityId || ''),
      });
    }
  }, [consequenceLevelData]);
  const submitCompany = async (values, setSubmitting) => {
    // setSubmitting(true);
    let response;
    try {
      if (newConsequenceLevel?.consequenceLevelId === 0) {
        response = await triggerAddConsequenceLevel({
          payload: {
            consequenceLevel: values?.consequenceLevel,
            facilityId: selectedFacility?.id,
            score: values?.score,
            loginUserId: userDetails?.UserId,
            moduleId: 2,
            menuId: 22,
          },
        }).unwrap();
      } else if (newConsequenceLevel?.consequenceLevelId) {
        const currentRow = records?.find((record) => {
          return record.consequenceLevelId === values?.consequenceLevelId;
        });
        const currentStatus = currentRow?.IsActive;
        let updatedStatus = currentStatus;
        if (
          values?.isActive !== undefined &&
          values?.isActive !== currentStatus
        ) {
          updatedStatus = values.isActive;
        }
        response = await triggerUpdateConsequenceLevel({
          payload: {
            consequenceLevelId: values?.consequenceLevelId,
            consequenceLevel: values?.consequenceLevel,
            facilityId: selectedFacility?.id,
            score: values?.score,
            loginUserId: userDetails?.UserId,
            // isDelete: true,
            moduleId: 2,
            menuId: 22,
          },
        }).unwrap();
        refetchCompanyData();
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
        response.Message === 'Record Already Exist' &&
        response.Status === 'Failure'
      ) {
        alert('Record Already Exist');
        showToastAlert({
          type: 'custom_info',
          text: response.Message,
          gif: 'InfoGif',
        });
      }
      setSubmitting(false);
      setShowConsequenceLevelModal(false);
      setNewConsequenceLevel({
        consequenceLevel: '',
        score: '',
        consequenceLevelId: 0,
        facility: '',
      });
      setShowConsequenceLevelModal(false);
      refetch();
    } catch (error) {
      console.log('error', error);
    }
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
          {t('AddConsequenceLevel')}
        </StyledTypography>

        <IconButton
          onClick={() => {
            setShowConsequenceLevelModal(false);
            setNewConsequenceLevel({
              consequenceLevel: '',
              score: '',
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
            validationSchema={consequenceLevelValidation}
            onSubmit={(values, { setSubmitting }) => {
              submitCompany(values, setSubmitting);
            }}
          >
            {({ values, handleSubmit, resetForm, isSubmitting }) => {
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
                     {pageFields?.find((x) => x.FieldId === 'IRLC_CL_P_ConsequenceLevel')?.IsShow && (
        <>
          <Grid item xs={12} sm={12} md={6} lg={4} padding={'10px'}>
            <Label
              value={getlabel('IM_IRLC_CL_ConsequenceLevel', labels, i18n.language)}
              isRequired={
                pageFields?.find(
                  (x) => x.FieldId === 'IRLC_CL_P_ConsequenceLevel'
                )?.IsMandatory}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={8} padding={'10px'}>
            <Field name="consequenceLevel">
              {({ field }) => (
                <TextField
                  {...field}
                  id="consequenceLevel"
                  autoComplete="off"
                  value={values?.consequenceLevel} // Updated to field.value
                  fullWidth={true}
                  disabled={isEditCompany}
                  slotProps={{ htmlInput: { maxLength: 100 } }}
                />
              )}
            </Field>
            <ErrorMessage
              name="consequenceLevel"
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
  
  {pageFields?.find((x) => x.FieldId === 'IRLC_CL_P_Score')?.IsShow && (
              <>
                      <Grid item xs={12} sm={12} md={6} lg={4} padding={'10px'}>
                        <Label value={getlabel(
                              'IM_IRLC_CL_Score',                      
                              labels,
                              i18n.language
                            )}
                            isRequired={
                              pageFields?.find(
                                (x) => x.FieldId === 'IRLC_CL_P_Score'
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
                        setNewConsequenceLevel({
                          consequenceLevel: '',
                          score: '',
                        });
                        setShowConsequenceLevelModal(false);
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

export default AddEditStaffCategory;
