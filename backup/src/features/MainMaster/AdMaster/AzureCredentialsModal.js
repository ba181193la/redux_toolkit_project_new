import {
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
} from '@mui/material';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../utils/StyledComponents';
import { getlabel } from '../../../utils/language';
import { useTranslation } from 'react-i18next';
import CloseIcon from '../../../assets/Icons/CloseIcon.png';
import DoneIcon from '../../../assets/Icons/DoneIcon.png';
import DndIcon from '../../../assets/Icons/DoNotDisturbIcon.png';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useState } from 'react';
import Label from '../../../components/Label/Label';
import { useGetFieldsQuery } from '../../../redux/RTK/moduleDataApi';
import { useSelector } from 'react-redux';
import MultiSelectDropdown from '../../../components/Dropdown/MultiSelectDropdown';

const AzureCredentialsModal = ({
  labels,
  showAzureModal,
  setShowAzureModal,
  azureCredentialsList,
  setAzureCredentialsList,
  showClientSecretField,
  companyList,
}) => {
  //* Hooks declartion
  const { i18n, t } = useTranslation();
  //* Selectors
  const { selectedMenu, selectedModuleId } = useSelector((state) => state.auth);

  //* Azure credentials modal Validation
  const credentialsValidation = Yup.object().shape({
    companyId: Yup.number().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'AM_P_CompanyName')?.IsMandatory,
      then: (schema) =>
        schema
          .required(
            `${getlabel('MM_AM_CompanyName', labels, i18n.language)} ${t('IsRequired')}`
          )
          .test(
            'is-zero',
            `${getlabel('MM_AM_CompanyName', labels, i18n.language)} ${t('IsRequired')}`,
            (value) => {
              return value !== 0;
            }
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
    tenantId: Yup.string().when([], {
      is: pageFields?.find((x) => x.FieldId === 'AM_P_TenantID')?.IsMandatory,
      then: (schema) => {
        return schema.required(
          `${getlabel('MM_AM_TenantID', labels, i18n.language)} ${t('IsRequired')}`
        );
      },
      otherwise: (schema) => {
        return schema.notRequired();
      },
    }),
    clientId: Yup.string().when([], {
      is: pageFields?.find((x) => x.FieldId === 'AM_P_ClientID')?.IsMandatory,
      then: (schema) => {
        return schema.required(
          `${getlabel('MM_AM_ClientID', labels, i18n.language)} ${t('IsRequired')}`
        );
      },
      otherwise: (schema) => {
        return schema.notRequired();
      },
    }),

    secretId: Yup.string().when([], {
      is: () =>
        showClientSecretField &&
        pageFields?.find((x) => x.FieldId === 'AM_P_ClientSecret')?.IsMandatory,
      then: (schema) =>
        schema.required(
          `${getlabel('MM_AM_ClientSecret', labels, i18n.language)} ${t('IsRequired')}`
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  //* State variables
  const [newCredentials, setNewCredentials] = useState({
    companyId: '',
    tenantId: '',
    clientId: '',
    secretId: '',
  });

  const { data: fields = [] } = useGetFieldsQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
  });

  const pageFields = fields?.Data?.Sections?.find(
    (section) => section?.SectionName === 'Page'
  )?.Fields;
  const filterCompanyList = (companyList, azureCredentialsList) => {
    const companyIdsToRemove = new Set(
        azureCredentialsList.flatMap(cred => cred.companyId)
    );
    
    return companyList.filter(company => !companyIdsToRemove.has(company.value));
}
const filteredList = filterCompanyList(companyList, azureCredentialsList);
  return (
    <Dialog
      open={showAzureModal}
      maxWidth={'sm'}
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
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
          {t('AzureCredentials')}
        </StyledTypography>
        <IconButton
          onClick={() => {
            setShowAzureModal(false);
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
          <img src={CloseIcon} alt="Close Icon" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <FlexContainer flexWrap="wrap">
          <Formik
            enableReinitialize={true}
            initialValues={newCredentials}
            validateOnBlur={false}
            validationSchema={credentialsValidation}
            context={{ showClientSecretField }}
            onSubmit={(values) => {
              
              // const existRowIndex = 
              // azureCredentialsList.findIndex(
              //   (x) =>
              //     x.CompanyName ===
              //       companyList.find(
              //         (company) => company.value === values?.companyId
              //       )?.text ||
              //     (null &&
              //       x.TenantId === values?.tenantId &&
              //       x.ClientId === values?.clientId &&
              //       x.ClientSecret === values?.secretId &&
              //       x.CompanyId === values?.companyId)
              // );
              
              // if (existRowIndex !== -1) {
              //   setShowAzureModal(false);
              //   showToastAlert({
              //     type: 'custom_info',
              //     text: `Azure Credentials already exists at row ${existRowIndex + 1}`,
              //   });
              // } else {
                values?.companyId.map((id)=> {
               
                setAzureCredentialsList((prev) => [
                  ...prev,
                  {
                    companyName:
                      companyList.find(
                        (company) => company.value === id
                      )?.text || null,
                    tenantId: values?.tenantId,
                    clientId: values?.clientId,
                    clientSecret: values?.secretId,
                    companyId: id,
                  },
                ]);
              })
                setShowAzureModal(false);
              }
            }
          // }
          >
            {({ values, handleSubmit }) => (
              <Form style={{ width: '100%' }}>
                {pageFields?.find((x) => x.FieldId === 'AM_P_CompanyName')
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
                          'MM_AM_CompanyName',
                          labels,
                          i18n.language
                        )}
                        isRequired={
                          pageFields?.find(
                            (x) => x.FieldId === 'AM_P_CompanyName'
                          )?.IsMandatory
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={8} padding={'10px'}>
                      <Field name="companyId">
                        {({ field }) => (
                          <MultiSelectDropdown
                                {...field}
                                id="companyId"
                                name= "companyId"
                                required={field.IsMandatory}
                                options={filteredList.length > 0 ? filteredList : []}
                              />
                        )}
                      </Field>
                      <ErrorMessage
                        name="companyId"
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
                {pageFields?.find((x) => x.FieldId === 'AM_P_TenantID')
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
                    marginTop={'0.2rem'}
                  >
                    <Grid item xs={12} sm={12} md={6} lg={4} padding={'10px'}>
                      <Label
                        value={getlabel(
                          'MM_AM_TenantID',
                          labels,
                          i18n.language
                        )}
                        isRequired={
                          pageFields?.find((x) => x.FieldId === 'AM_P_TenantID')
                            ?.IsMandatory
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={8} padding={'10px'}>
                      <Field name="tenantId">
                        {({ field }) => (
                          <TextField
                            {...field}
                            id="tenantId"
                            autoComplete="off"
                            values={values?.tenantId}
                            fullWidth={true}
                            slotProps={{ htmlInput: { maxLength: 200 } }}
                          />
                        )}
                      </Field>
                      <ErrorMessage
                        name="tenantId"
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
                {pageFields?.find((x) => x.FieldId === 'AM_P_ClientID')
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
                    marginTop={'0.2rem'}
                  >
                    <Grid item xs={12} sm={12} md={6} lg={4} padding={'10px'}>
                      <Label
                        value={getlabel(
                          'MM_AM_ClientID',
                          labels,
                          i18n.language
                        )}
                        isRequired={
                          pageFields?.find((x) => x.FieldId === 'AM_P_ClientID')
                            ?.IsMandatory
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={8} padding={'10px'}>
                      <Field name="clientId">
                        {({ field }) => (
                          <TextField
                            {...field}
                            id="clientId"
                            autoComplete="off"
                            values={values?.clientId}
                            fullWidth={true}
                            slotProps={{ htmlInput: { maxLength: 200 } }}
                          />
                        )}
                      </Field>
                      <ErrorMessage
                        name="clientId"
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
                {showClientSecretField &&
                  pageFields?.find((x) => x.FieldId === 'AM_P_ClientSecret')
                    ?.IsShow && (
                    <Grid
                      container
                      display={showClientSecretField ? 'flex' : 'none'}
                      width="100%"
                      flexWrap={'wrap'}
                      justifyContent={'space-between'}
                      item
                      xs={12}
                      spacing={2}
                      alignItems={'center'}
                      marginTop={'0.2rem'}
                    >
                      <Grid item xs={12} sm={12} md={6} lg={4} padding={'10px'}>
                        <Label
                          value={getlabel(
                            'MM_AM_ClientSecret',
                            labels,
                            i18n.language
                          )}
                          isRequired={
                            pageFields?.find(
                              (x) => x.FieldId === 'AM_P_ClientSecret'
                            )?.IsMandatory
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={8} padding={'10px'}>
                        <Field name="secretId">
                          {({ field }) => (
                            <TextField
                              {...field}
                              id="secretId"
                              autoComplete="off"
                              values={values?.secretId}
                              fullWidth={true}
                              slotProps={{ htmlInput: { maxLength: 200 } }}
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="secretId"
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
                    color="primary"
                    onClick={handleSubmit}
                    type="submit"
                    style={{ display: 'inline-flex', gap: '5px' }}
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
                    style={{ display: 'inline-flex', gap: '5px' }}
                    onClick={() => {
                      setShowAzureModal(false);
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
            )}
          </Formik>
        </FlexContainer>
      </DialogContent>
    </Dialog>
  );
};

export default AzureCredentialsModal;
