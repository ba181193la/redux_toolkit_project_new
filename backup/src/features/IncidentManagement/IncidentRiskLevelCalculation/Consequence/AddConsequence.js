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
import Dropdown from '../../../../components/Dropdown/Dropdown';
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
import {
  useAddConsequenceMutation,
  useGetCategoryByIdQuery,
  useGetConsequenceByIdQuery,
  useUpdateConsequenceMutation,
  useGetConsequencelevelDetailsQuery,
  useGetCategoryDetailsQuery,
} from '../../../../redux/RTK/incidentRiskLevelApi';
import MultiSelectDropdown from '../../../../components/Dropdown/MultiSelectDropdown';

const AddEditStaffCategory = ({
  open,
  selectedCompanyId,
  setShowConsequenceModal,
  setSelectedConsequenceId,
  selectedConsequenceId,
  isEditConsequence,
  labels,
  isEditCompany,
  records,
  refetch,
  fieldAccess,
}) => {
  const [triggerAddConsequence] = useAddConsequenceMutation();
  const [triggerUpdateConsequence] = useUpdateConsequenceMutation();
  const [selectedIds, setSelectedIds] = useState();
  const { userDetails, selectedMenu, selectedModuleId, selectedFacility } =
    useSelector((state) => state.auth);


  const pageFields = fieldAccess?.Data?.Menus?.find(
    (section) => section?.MenuId === selectedMenu?.id
  )
    ?.Sections?.find(
      (sectionName) => sectionName?.SectionName === 'Consequence-Page'
    )
    ?.Regions?.find((region) => region?.RegionCode === 'ALL')?.Fields;

  const [newConsequence, setNewConsequence] = useState({
    categoryAffectedId: '',
    consequenceLevelId: '',
    consequence: '',
    consequenceId: 0,
    facility: '',
  });
  const [initialValues, setInitialValues] = useState({
    categoryAffectedId: '',
    consequenceLevelId: '',
    consequence: '',
    consequenceId: 0,
    facility: '',
  });

  const { data: categoryAffectedRecords } = useGetCategoryByIdQuery(
    {
      categoryAffectedId: selectedConsequenceId,
      loginUserId: userDetails?.UserId,
      menuId: 22,
    },
    { skip: !selectedConsequenceId }
  );

  //getCategoryData
  const { data: getCategoryData = [], isFetching } = useGetCategoryDetailsQuery(
    {
      payload: {
        pageIndex: 1,
        pageSize: 70,
        headerFacility: 2,
        loginUserId: 1,
        moduleId: 2,
        menuId: 22,

        // pageIndex: pageIndex,
        // pageSize: pageSize,
        // headerFacilityId: selectedFacility?.id,
        // loginUserId: userDetails?.UserId,
        // moduleId: selectedModuleId,
        // menuId: selectedMenu?.id,
      },
    },
    {
      skip: !selectedFacility?.id || !selectedModuleId || !selectedMenu?.id,
      refetchOnMountOrArgChange: true,
    }
  );

  //getConseqenceLevelData
  const { data: getConseqenceLevelData = [] } =
    useGetConsequencelevelDetailsQuery(
      {
        payload: {
          pageIndex: 1,
          pageSize: 70,
          headerFacility: 2,
          loginUserId: 1,
          moduleId: 2,
          menuId: 22,
        },
      },
      {
        // skip: !selectedFacility?.id || !selectedModuleId || !selectedMenu?.id,
        refetchOnMountOrArgChange: true,
      }
    );
  //getById
  const { data: consequenceRecords, refetch: refetchConsequenceRecords } =
    useGetConsequenceByIdQuery(
      {
        consequenceId: selectedConsequenceId,
        loginUserId: userDetails?.UserId,
        menuId: 22,
      },
      { skip: !selectedConsequenceId }
    );

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
    if (consequenceRecords) {
      setInitialValues({
        categoryAffectedId: consequenceRecords?.Data?.CategoryAffectedId || 0,
        consequenceLevelId: consequenceRecords?.Data?.ConsequenceLevelId || 0,
        consequenceId: consequenceRecords?.Data?.ConsequenceId || 0,
        consequence: consequenceRecords?.Data?.Consequence || '',
        facility: String(consequenceRecords?.Data?.FacilityId || ''),
      });
    }
  }, [consequenceRecords]);
  useEffect(() => {
    if (consequenceRecords?.Data) {
      setNewConsequence({
        categoryAffectedId: consequenceRecords?.Data?.CategoryAffectedId || 0,
        consequenceLevelId: consequenceRecords?.Data?.ConsequenceLevelId || 0,
        consequenceId: consequenceRecords?.Data?.ConsequenceId || 0,
        consequence: consequenceRecords?.Data?.Consequence || '',
        facility: String(consequenceRecords?.Data?.FacilityId || ''),
      });
    }
  }, [consequenceRecords]);
  const { t, i18n } = useTranslation();

  // const consequenceValidation = Yup.object().shape({
  //   consequence: Yup.string().required('Consequence is required'),
  //   categoryAffectedId: Yup.string().required('Category Affected is required'),
  //   consequenceLevelId: Yup.string().required('Consequence Level is required'),
  // });
  const consequenceValidation = Yup.object().shape({
    consequenceLevelId: Yup.string().when([], {
              is: () =>
                pageFields?.find((x) => x.FieldId === 'IRLC_C_P_ConsequenceLevel')
                  ?.IsMandatory === true,
              then: (schema) =>
                schema.required(
                  `${getlabel('IM_IRLC_C_ConsequenceLevel', labels, i18n.language)} ${t('IsRequired')}`
                ),
              otherwise: (schema) => schema.notRequired(),
            }),
            categoryAffectedId: Yup.string().when([], {
              is: () =>
                pageFields?.find((x) => x.FieldId === 'IRLC_C_P_CategoryAffected')
                  ?.IsMandatory === true,
              then: (schema) =>
                schema.required(
                  `${getlabel('IM_IRLC_C_CategoryAffected', labels, i18n.language)} ${t('IsRequired')}`
                ),
              otherwise: (schema) => schema.notRequired(),
            }),
            consequence: Yup.string().when([], {
              is: () =>
                pageFields?.find((x) => x.FieldId === 'IRLC_C_P_Consequence')
                  ?.IsMandatory === true,
              then: (schema) =>
                schema.required(
                  `${getlabel('IM_IRLC_C_Consequence', labels, i18n.language)} ${t('IsRequired')}`
                ),
              otherwise: (schema) => schema.notRequired(),
            }),
          });

  const submitConsequence = async (values, setSubmitting) => {
    // setSubmitting(true);
    let response;

    try {
      if (newConsequence?.consequenceId === 0) {
        response = await triggerAddConsequence({
          payload: {
            consequence: values?.consequence,
            categoryAffectedId: values?.categoryAffectedId,
            consequenceLevelId: values?.consequenceLevelId,
            loginUserId: userDetails?.UserId,
            isDelete: true,
            moduleId: 2,
            menuId: 22,
          },
        }).unwrap();
      } else if (newConsequence?.consequenceId) {
        const currentRow = records?.find((record) => {
          return record.consequenceId === values.consequenceId;
        });
        const currentStatus = currentRow?.IsActive;
        let updatedStatus = currentStatus;
        if (
          values?.isActive !== undefined &&
          values?.isActive !== currentStatus
        ) {
          updatedStatus = values.isActive;
        }
        response = await triggerUpdateConsequence({
          payload: {
            consequenceId: values?.consequenceId,
            consequence: values?.consequence,
            categoryAffectedId: values?.categoryAffectedId,
            consequenceLevelId: values?.consequenceLevelId,
            loginUserId: userDetails?.UserId,
            isDelete: false,
            moduleId: 2,
            menuId: 22,
          },
        }).unwrap();
        refetchConsequenceRecords();
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
        showToastAlert({
          type: 'custom_info',
          text: response.Message,
          gif: 'InfoGif',
        });
      }

      setNewConsequence({
        categoryAffectedId: '',
        consequenceLevelId: '',
        consequence: '',
        consequenceId: 0,
        facility: '',
      });
      setShowConsequenceModal(false);
      refetch();
    } catch (error) {}
  };

  useEffect(() => {
    if (!open) {
      setInitialValues({
        categoryAffectedId: '',
        consequenceLevelId: '',
        consequence: '',
        consequenceId: 0,
        facility: '',
      });
    }
  }, [open]);

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
          {/* {isEditCompany ? t('EditCompany') : t('AddCompany')} */}
          {t('AddConsequence')}
        </StyledTypography>

        <IconButton
          onClick={() => {
            setShowConsequenceModal(false);
            setNewConsequence({
              categoryAffectedId: '',
              consequenceLevelId: '',
              consequence: '',
              consequenceId: 0,
              facility: '',
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
            validationSchema={consequenceValidation}
            onSubmit={(values, { setSubmitting }) => {
              submitConsequence(values, setSubmitting);
            }}
          >
            {({
              values,
              handleSubmit,
              resetForm,
              setFieldValue,
              isSubmitting,
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
                       {pageFields?.find((x) => x.FieldId === 'IRLC_C_P_CategoryAffected')?.IsShow && (
                      <>
                      <Grid item xs={12} sm={12} md={6} lg={4} padding={'10px'}>
                        <Label
                          value={getlabel(
                            'IM_IRLC_C_CategoryAffected',
                            labels,
                            i18n.language
                          )}
                          isRequired={
                            pageFields?.find(
                              (x) => x.FieldId === 'IRLC_C_P_CategoryAffected'
                            )?.IsMandatory}
                        />
                      </Grid>

                      <Grid item xs={12} sm={12} md={6} lg={8} padding={'10px'}>
                        <Dropdown
                          name="categoryAffectedId"
                          isLoading={isFetching}
                          options={getCategoryData?.Records?.map(
                            (consequence) => ({
                              text: consequence.CategoryAffected,
                              value: consequence.CategoryAffectedId,
                            })
                          )}
                          value={values.categoryAffectedId}
                          onChange={(e) =>
                            setFieldValue('categoryAffectedId', e.target.value)
                          }
                          // error={
                          //   touched.companyCode && Boolean(errors.companyCode)
                          // }
                          helperText={
                            <ErrorMessage name="categoryAffectedId" />
                          }
                        />
                        <ErrorMessage
                          name="categoryAffectedId"
                          component="div"
                          style={{
                            color: 'red',
                            fontSize: '12px',
                            marginTop: '4px',
                          }}
                        />
                      </Grid>
                      </>)}

                      {pageFields?.find((x) => x.FieldId === 'IRLC_C_P_ConsequenceLevel')?.IsShow && (
                   <>
                      <Grid item xs={12} sm={12} md={6} lg={4} padding={'10px'}>
                        <Label
                          value={getlabel(
                            'IM_IRLC_C_ConsequenceLevel',
                            labels,
                            i18n.language
                          )}
                          isRequired={
                            pageFields?.find(
                              (x) => x.FieldId === 'IRLC_C_P_ConsequenceLevel'
                            )?.IsMandatory}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={8} padding={'10px'}>
                        <Dropdown
                          name="consequenceLevelId"
                          // isLoading={isLoading}
                          options={getConseqenceLevelData?.Records?.map(
                            (consequenceLevel) => ({
                              text: consequenceLevel.ConsequenceLevel,
                              value: consequenceLevel.ConsequenceLevelId,
                            })
                          )}
                          value={values.consequenceLevelId}
                          onChange={(e) =>
                            setFieldValue('consequenceLevelId', e.target.value)
                          }
                          // error={
                          //   touched.companyCode && Boolean(errors.companyCode)
                          // }
                          helperText={
                            <ErrorMessage name="consequenceLevelId" />
                          }
                        />
                        <ErrorMessage
                          name="consequenceLevelId"
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

{pageFields?.find((x) => x.FieldId === 'IRLC_C_P_Consequence')?.IsShow && (
  <>
                      <Grid item xs={12} sm={12} md={6} lg={4} padding={'10px'}>
                        <Label
                          value={getlabel(
                            'IM_IRLC_C_Consequence',
                            labels,
                            i18n.language
                          )}
                          isRequired={
                            pageFields?.find(
                              (x) => x.FieldId === 'IRLC_C_P_Consequence'
                            )?.IsMandatory}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={8} padding={'10px'}>
                        <Field name="consequence">
                          {({ field }) => (
                            <TextField
                              {...field}
                              id="consequence"
                              autoComplete="off"
                              values={values?.consequence}
                              fullWidth={true}
                              disabled={isEditConsequence}
                              slotProps={{ htmlInput: { maxLength: 100 } }}
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="consequence"
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

                        false;
                        setNewConsequence({
                          categoryAffectedId: '',
                        });
                        setShowConsequenceModal(false);
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
