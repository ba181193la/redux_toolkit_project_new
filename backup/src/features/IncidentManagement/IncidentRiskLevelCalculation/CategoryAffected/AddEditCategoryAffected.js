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
import {
  useAddCategoryMutation,
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
} from '../../../../redux/RTK/incidentRiskLevelApi';
import MultiSelectDropdown from '../../../../components/Dropdown/MultiSelectDropdown';
import { getlabel } from '../../../../utils/IncidentLabels';

const AddEditStaffCategory = ({
  open,
  selectedCompanyId,
  setShowCategoryModal,
  setSelectedCategoryAffectedId,
  selectedCategoryAffectedId,
  isEditCategory,
  labels,
  isEditCompany,
  records,
  refetch,
  fieldAccess,
}) => {
  const [triggerAddCategory] = useAddCategoryMutation();
  const [triggerUpdateCategory] = useUpdateCategoryMutation();
  const [selectedIds, setSelectedIds] = useState();
  const { userDetails, selectedMenu, selectedModuleId, selectedFacility } =
    useSelector((state) => state.auth);

  const pageFields = fieldAccess?.Data?.Menus?.find(
    (section) => section?.MenuId === selectedMenu?.id
  )
    ?.Sections?.find(
      (sectionName) => sectionName?.SectionName === 'Category Affected-Page'
    )
    ?.Regions?.find((region) => region?.RegionCode === 'ALL')?.Fields;

  const [newCategory, setNewCategory] = useState({
    categoryAffected: '',
    categoryAffectedId: 0,
  });
  const [initialValues, setInitialValues] = useState({
    categoryAffected: '',
    categoryAffectedId: 0,
    // facility: '',
  });

  const {
    data: categoryAffectedRecords,
    refetch: refetchCategoryAffectedRecords,
  } = useGetCategoryByIdQuery(
    {
      categoryAffectedId: selectedCategoryAffectedId,
      loginUserId: userDetails?.UserId,
      menuId: 22,
    },
    { skip: !selectedCategoryAffectedId }
  );

  // const categoryAffectedValidation = Yup.object().shape({
  //   categoryAffected: Yup.string()
  //     .required('Category Affected is required')
  //     .min(3, 'Must be at least 3 characters'),
  // });

  const categoryAffectedValidation = Yup.object().shape({
    categoryAffected: Yup.string().when([], {
        is: () =>
          pageFields?.find((x) => x.FieldId === 'IRLC_CA_P_CategoryAffected')
            ?.IsMandatory === true,
        then: (schema) =>
          schema.required(
            `${getlabel('IM_IRLC_CA_CategoryAffected', labels, i18n.language)} ${t('IsRequired')}`
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
    if (categoryAffectedRecords) {
      setInitialValues({
        categoryAffected: categoryAffectedRecords?.Data?.CategoryAffected || '',
        categoryAffectedId:
          categoryAffectedRecords?.Data?.CategoryAffectedId || 0,
        // facility: String(categoryAffectedRecords?.Data?.FacilityId || ''),
      });
    }
  }, [categoryAffectedRecords]);

  const { t, i18n } = useTranslation();
  useEffect(() => {
    if (categoryAffectedRecords?.Data) {
      setNewCategory({
        categoryAffected: categoryAffectedRecords?.Data?.CategoryAffected,
        // facility: categoryAffectedRecords?.Data?.Facility,
        categoryAffectedId: categoryAffectedRecords?.Data?.CategoryAffectedId,
      });
    }
  }, [categoryAffectedRecords]);
  const submitCompany = async (values, setSubmitting) => {
    // setSubmitting(true);
    let response;
    try {
      if (newCategory?.categoryAffectedId === 0) {
        response = await triggerAddCategory({
          payload: {
            categoryAffectedId: values?.categoryAffectedId,
            categoryAffected: values?.categoryAffected,
            loginUserId: userDetails?.UserId,
            isDelete: true,
            moduleId: 2,
            menuId: 22,
          },
        }).unwrap();
      } else if (newCategory?.categoryAffectedId) {
        // const currentRow = records?.find((record) => {
        //   return record.CompanyId === values.companyId;
        // });
        // const currentStatus = currentRow?.IsActive;
        // let updatedStatus = currentStatus;
        // if (
        //   values?.isActive !== undefined &&
        //   values?.isActive !== currentStatus
        // ) {
        //   updatedStatus = values.isActive;
        // }
        response = await triggerUpdateCategory({
          payload: {
            categoryAffectedId: values?.categoryAffectedId,
            categoryAffected: values?.categoryAffected,
            // facilityId: selectedFacility?.id,
            // // facilityIds: '4, 5',
            // facilityIds: Array.isArray(values.facility)
            //   ? values.facility.join(',')
            //   : values.facility || '',

            loginUserId: userDetails?.UserId,
            isDelete: false,
            moduleId: 2,
            menuId: 22,
          },
        }).unwrap();
        refetchCategoryAffectedRecords();
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

      setSubmitting(false);
      setShowCategoryModal(false);

      setNewCategory({
        categoryAffected: '',
        categoryAffectedId: 0
      });
      setShowCategoryModal(false);
      refetch();
    } catch (error) {
      console.log('CL_error', error);
    }
  };

  useEffect(() => {
    if (!open) {
      setInitialValues({
        categoryAffected: '',
        categoryAffectedId: 0
        // facility: '',
      });
    }
  }, [open]);

  const RohanLabel = getlabel(
    'IM_IRLC_CA_CategoryAffected',
    labels,
    i18n.language
  );

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
          {'Add Category Affected'}
        </StyledTypography>

        <IconButton
          onClick={() => {
            setShowCategoryModal(false);
            setNewCategory({
              categoryAffected: '',
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
            validationSchema={categoryAffectedValidation}
            onSubmit={(values, { setSubmitting }) => {
              console.log({ values });
              submitCompany(values, setSubmitting);
            }}
          >
            {({ values, handleSubmit, resetForm, isSubmitting, errors }) => {
              return (
                <Form style={{ width: '100%' }}>
                  <>
                  {pageFields?.find((x) => x.FieldId === 'IRLC_CA_P_CategoryAffected')
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
                      <Grid item xs={12} sm={12} md={6} lg={4} padding={'10px'}>
                        <Label
                          value={getlabel(
                            'IM_IRLC_CA_CategoryAffected',
                            labels,
                            i18n.language
                          )}
                          isRequired={
                            pageFields?.find(
                              (x) => x.FieldId === 'IRLC_CA_P_CategoryAffected'
                            )?.IsMandatory}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={8} padding={'10px'}>
                        <Field name="categoryAffected">
                          {({ field }) => (
                            <TextField
                              {...field}
                              id="categoryAffected"
                              autoComplete="off"
                              values={values?.companyCode}
                              fullWidth={true}
                              disabled={isEditCompany}
                              slotProps={{ htmlInput: { maxLength: 100 } }}
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="categoryAffected"
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
                        setNewCategory({
                          categoryAffected: '',
                        });
                        setShowCategoryModal(false);
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
