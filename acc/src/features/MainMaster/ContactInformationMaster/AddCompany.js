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
} from '../../../utils/StyledComponents';

import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import CloseIcon from '../../../assets/Icons/CloseIcon.png';
import DoneIcon from '../../../assets/Icons/DoneIcon.png';
import DndIcon from '../../../assets/Icons/DoNotDisturbIcon.png';
import Label from '../../../components/Label/Label';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  useAddCompanyMutation,
  useGetCompanyByIdQuery,
  useUpdateCompanyMutation,
} from '../../../redux/RTK/contactInformationApi';
import { showToastAlert } from '../../../utils/SweetAlert';
import { useTranslation } from 'react-i18next';
import { getlabel } from '../../../utils/language';
import { useGetFieldsQuery } from '../../../redux/RTK/moduleDataApi';

const AddCompany = ({
  open,
  selectedCompanyId,
  setShowCompanyModal,
  labels,
  isEditCompany,
  records,
  refetch,
  fieldAccess,
}) => {
  const [triggerAddCompany] = useAddCompanyMutation();
  const [triggerUpdateCompany] = useUpdateCompanyMutation();
  const { userDetails, selectedMenu, selectedModuleId } = useSelector(
    (state) => state.auth
  );

  const { data: fields = [] } = useGetFieldsQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
  });

  const pageFields = fields?.Data?.Sections?.find(
    (section) => section?.SectionName === 'Page'
  )?.Fields;

  const [newCompany, setNewCompany] = useState({
    companyCode: '',
    companyName: '',
    companyId: 0,
  });
  const [initialValues, setInitialValues] = useState({
    companyCode: '',
    companyName: '',
    companyId: 0,
  });

  const {
    data: companyRecords,
    refetch: refetchCompanyData,
    isLoading: isCompanyByIdLoading,
  } = useGetCompanyByIdQuery(
    {
      companyId: selectedCompanyId,
      loginUserId: userDetails?.UserId,
    },
    { skip: !selectedCompanyId }
  );
  useEffect(() => {
    if (companyRecords) {
      setInitialValues({
        companyCode: companyRecords?.Data?.CompanyCode || '',
        companyName: companyRecords?.Data?.CompanyName || '',
        companyId: companyRecords?.Data?.CompanyId || 0,
      });
    }
  }, [companyRecords]);
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
    if (companyRecords?.Data) {
      setNewCompany({
        companyCode: companyRecords?.Data?.CompanyCode,
        companyName: companyRecords?.Data?.CompanyName,
        companyId: companyRecords?.Data?.CompanyId,
      });
    }
  }, [companyRecords]);

  const submitCompany = async (values, setSubmitting) => {
    setSubmitting(true);
    try {
      let response;
      if (newCompany?.companyId === 0) {
        response = await triggerAddCompany({
          payload: {
            companyCode: values?.companyCode,
            companyName: values?.companyName,
            licenseActivatedDate: null,
            renewalDate: null,
            isFooterLogoHide: true,
            isFooterLinkHide: true,
            isActive: false,
            moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
            loginUserId: userDetails?.UserId,
          },
        }).unwrap();
      } else if (newCompany?.companyId) {
        const currentRow = records?.find(
          (record) => record.CompanyId === values.companyId
        );
        const updatedStatus =
          values?.isActive !== undefined
            ? values.isActive
            : currentRow?.IsActive;

        response = await triggerUpdateCompany({
          payload: {
            companyId: values?.companyId,
            companyCode: values?.companyCode,
            companyName: values?.companyName,
            licenseActivatedDate: null,
            renewalDate: null,
            licenseKey: '',
            isFooterLogoHide: true,
            isFooterLinkHide: true,
            isDelete: false,
            isActive: updatedStatus,
            moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
            loginUserId: userDetails?.UserId,
          },
        }).unwrap();
        await refetchCompanyData();
      }

      if (response && response.Message !== 'Record Already Exist') {
        showToastAlert({
          type: 'custom_success',
          text: response.Message,
          gif: 'SuccessGif',
        });
      } else if (response?.Message === 'Record Already Exist') {
        showToastAlert({
          type: 'custom_info',
          text: response.Message,
          gif: 'InfoGif',
        });
      } else if (
        response?.Message === 'Company Code and Company Name already exist.'
      ) {
        showToastAlert({
          type: 'custom_info',
          text: response.Message,
          gif: 'InfoGif',
        });
      }

      setNewCompany({ companyId: 0, companyCode: '', companyName: '' });
      setShowCompanyModal(false);
      await refetch();
    } catch (error) {
    } finally {
      setSubmitting(false);
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
          {isEditCompany ? t('EditCompany') : t('AddCompany')}
        </StyledTypography>

        <IconButton
          onClick={() => {
            setShowCompanyModal(false);
            setNewCompany({
              companyCode: '',
              companyName: '',
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
        {isCompanyByIdLoading ? (
          <FlexContainer
            justifyContent="center"
            alignItems="center"
            height="200px"
          >
            <CircularProgress />
          </FlexContainer>
        ) : (
          <FlexContainer flexWrap="wrap">
            <Formik
              enableReinitialize={true}
              initialValues={initialValues}
              validateOnBlur={false}
              validationSchema={companyValidation}
              onSubmit={(values, { setSubmitting }) => {
                submitCompany(values, setSubmitting);
              }}
            >
              {({ values, handleSubmit, resetForm, isSubmitting }) => {
                return (
                  <Form style={{ width: '100%' }}>
                    {pageFields?.find((x) => x.FieldId === 'CIM_P_CompanyCode')
                      ?.IsShow && (
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
                                'MM_CIM_CompanyCode',
                                labels,
                                i18n.language
                              )}
                              isRequired={
                                pageFields?.find(
                                  (x) => x.FieldId === 'CIM_P_CompanyCode'
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
                            <Field name="companyCode">
                              {({ field }) => (
                                <TextField
                                  {...field}
                                  id="companyCode"
                                  autoComplete="off"
                                  values={values?.companyCode}
                                  fullWidth={true}
                                  disabled={isEditCompany}
                                  slotProps={{ htmlInput: { maxLength: 100 } }}
                                />
                              )}
                            </Field>
                            <ErrorMessage
                              name="companyCode"
                              component="div"
                              style={{
                                color: 'red',
                                fontSize: '12px',
                                marginTop: '4px',
                              }}
                            />
                          </Grid>
                        </Grid>
                      </>
                    )}
                    {pageFields?.find((x) => x.FieldId === 'CIM_P_CompanyName')
                      ?.IsShow && (
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
                          marginTop={'0.2rem'}
                        >
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
                                'MM_CIM_CompanyName',
                                labels,
                                i18n.language
                              )}
                              isRequired={
                                pageFields?.find(
                                  (x) => x.FieldId === 'CIM_P_CompanyName'
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
                            <Field name="companyName">
                              {({ field }) => (
                                <TextField
                                  {...field}
                                  id="companyName"
                                  autoComplete="off"
                                  values={values?.companyCode}
                                  fullWidth={true}
                                  slotProps={{ htmlInput: { maxLength: 500 } }}
                                />
                              )}
                            </Field>
                            <ErrorMessage
                              name="companyName"
                              component="div"
                              style={{
                                color: 'red',
                                fontSize: '12px',
                                marginTop: '4px',
                              }}
                            />
                          </Grid>
                        </Grid>
                      </>
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
                        color="primary"
                        onClick={handleSubmit}
                        type="submit"
                        style={{
                          display: 'inline-flex',
                          position: 'relative',
                          gap: '5px',
                        }}
                        disabled={isSubmitting}
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
                          setNewCompany({
                            companyCode: '',
                            companyName: '',
                          });
                          setShowCompanyModal(false);
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
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddCompany;
