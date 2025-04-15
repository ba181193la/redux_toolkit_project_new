import React, { useEffect, useState } from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../utils/StyledComponents';
import { Autocomplete, Button, Grid, Tooltip } from '@mui/material';
import { TextField } from '../../../components/TextField/TextField';
import Label from '../../../components/Label/Label';
import TextArea from '../../../components/TextArea/TextArea';
import GenerateLicense from '../../../assets/Icons/GenerateLicense.png';
import CopyIcon from '../../../assets/Icons/Copy.png';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useGenerateLicenseMutation } from '../../../redux/RTK/licenseGenerateApi';
import DndIcon from '../../../assets/Icons/DoNotDisturbIcon.png';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Dropdown from '../../../components/Dropdown/Dropdown';
import { useGetCompanyDetailsQuery } from '../../../redux/RTK/contactInformationApi';
import { showToastAlert } from '../../../utils/SweetAlert';
import LoadingGif from '../../../assets/Gifs/LoadingGif.gif';
import useWindowDimension from '../../../hooks/useWindowDimension';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../redux/RTK/moduleDataApi';
import { getlabel } from '../../../utils/language';
import SearchDropdown from '../../../components/SearchDropdown/SearchDropdown';
import { Box } from '@mui/system';

const LicenseGenerator = () => {
  const [triggerGenerateLicense] = useGenerateLicenseMutation();
  const [licenseKey, setLicenseKey] = useState('');
  const [dots, setDots] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shake] = useState(false);
  const { isMobile, isTablet } = useWindowDimension();
  const { selectedMenu, selectedModuleId, userDetails, selectedFacility } =
    useSelector((state) => state.auth);
  const { data: getCompanyData = [], isLoading: isCompanyDataLoading } =
    useGetCompanyDetailsQuery(
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
        skip: !selectedFacility?.id || !selectedModuleId || !selectedMenu?.id,
      }
    );

  const { data: labels = [], isLoading: isLabelsLoading } = useGetLabelsQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
  });
  const { data: fields = [] } = useGetFieldsQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
  });
  const initialValues = {
    companyCode: '',
    licenseKey: '',
    validity: '',
    validityDate: null,
  };

  const pageFields = fields?.Data?.Sections?.find(
    (section) => section?.SectionName === 'Page'
  )?.Fields;
  const { t, i18n } = useTranslation();
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length === 10) {
          return '';
        }
        return prevDots + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const validationSchema = Yup.object().shape({
    companyCode: Yup.string().required(
      `${getlabel('IM_LG_CompanyCode', labels, i18n.language)} ${t('IsRequired')}`
    ),
    validity: Yup.number()
      .typeError(
        `${getlabel('IM_LG_Validity', labels, i18n.language)} must be a number`
      )
      .integer(
        `${getlabel('IM_LG_Validity', labels, i18n.language)} must be an integer`
      )
      .min(
        1,
        `${getlabel('IM_LG_Validity', labels, i18n.language)} must be atleast 1 day`
      )
      .required(
        `${getlabel('IM_LG_Validity', labels, i18n.language)} ${t('IsRequired')}`
      ),
    validityDate: Yup.date().required('Validity date is required'),
  });

  const companyOptions = getCompanyData?.records?.map((company) => ({
    text: company.CompanyCode,
    value: company.CompanyId,
  }));

  const validityDays = pageFields?.find(
    (x) => x.FieldId === 'LG_P_IM_LG_Validity'
  )?.IsShow;

  const validityDates = pageFields?.find(
    (x) => x.FieldId === 'LG_P_IM_LG_Date'
  )?.IsShow;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
       <FlexContainer width="100%" height="100%" flexDirection="column">
       <FlexContainer
        style={{ paddingBottom: '15px' }}
      >
        <StyledTypography
          fontWeight="900"
          lineHeight="44px"
          color="#0083C0"
          whiteSpace={'nowrap'}
          sx={{
            fontSize: {
              xs: '1.5rem',
              sm: '1.75rem',
              md: '2rem',
              lg: '2.25rem',
            },
          }}
        >
          {t('License_Generator')}
        </StyledTypography>
        </FlexContainer>
      <FlexContainer
        width="100%"
        height="100%"
        flexDirection="column"
        style={{ backgroundColor: '#ffffff', borderRadius: '10px' }}
      >
       <Box
          sx={{
            width: '100%',
            height: 'auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: { xs: '1.5rem', sm: '1.75rem', md: '2rem', lg: '2rem' },
          }}
        >
      {isLabelsLoading ? (
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
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            setIsLoading(true);
            try {
              const response = await triggerGenerateLicense({
                payload: {
                  companyCode: values.companyCode,
                  validityDate: values.validityDate,
                  validity: values.validity,
                },
              }).unwrap();

              if (response && response.Status === 'Success') {
                showToastAlert({
                  type: 'custom_success',
                  text: 'License key generated successfully',
                  gif: 'SuccessGif',
                });

                setLicenseKey(response.LicenseKey);
              } else {
                showToastAlert({
                  type: 'custom_error',
                  text: 'Failed to generate license key',
                  gif: 'InfoGif',
                });
              }
            } catch (error) {
              showToastAlert({
                type: 'custom_error',
                text: 'An error occurred while generating the license key',
              });
            } finally {
              setIsLoading(false);
            }
          }}
        >
          {({
            handleChange,
            values,
            setFieldValue,
            resetForm,
            errors,
            touched,
          }) => (
            <Form>
                  <Grid container spacing={isMobile || isTablet ? 2 : 4}>
                    <Grid item xs={12} sm={3} padding="1px">
                      {pageFields?.find(
                        (x) => x.FieldId === 'LG_P_IM_LG_CompanyCode'
                      )?.IsShow && (
                        <FlexContainer flexDirection="column" gap="10px">
                          <Label
                            value={getlabel(
                              'IM_LG_CompanyCode',
                              labels,
                              i18n.language
                            )}
                            margin={isMobile || isTablet ? '10px 0' : '100px 0'}
                          />
                          <SearchDropdown
                            name={'companyCode'}
                            options={[
                              { text: 'Select', value: '' },
                              ...(getCompanyData?.records?.map((company) => ({
                                text: company.CompanyCode,
                                value: company.CompanyCode,
                              })) || []),
                            ]}
                            // disabled={selectedDepartmentId}
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
                                  fontSize: '14px',
                                  minHeight: '30px',
                                  display: 'flex',
                                  alignItems: 'center',
                                },
                              },
                            }}
                            value={
                              getCompanyData?.records
                                ?.map((company) => ({
                                  text: company.CompanyCode,
                                  value: company.CompanyCode,
                                }))
                                ?.find(
                                  (option) =>
                                    option.value === values['companyCode']
                                ) || null
                            }
                            onChange={(event, value) => {
                              setFieldValue('companyCode', value?.value);
                            }}
                          />
                          <ErrorMessage
                            name="companyCode"
                            component="div"
                            style={{ color: '#d32f2f', fontSize: '12px' }}
                          />
                        </FlexContainer>
                      )}
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={9}
                      padding={isMobile || isTablet ? '5px' : '10px'}
                    >
                      <Grid container spacing={isMobile || isTablet ? 1 : 4}>
                        <Grid item xs={12} sm={5}>
                          {pageFields?.find(
                            (x) => x.FieldId === 'LG_P_IM_LG_Validity'
                          )?.IsShow && (
                            <FlexContainer
                              flexDirection="column"
                              gap="5px"
                              margin="4px 0 0 0"
                            >
                              <Label
                                value={getlabel(
                                  'IM_LG_Validity',
                                  labels,
                                  i18n.language
                                )}
                              />

                              <FlexContainer alignItems="center">
                                <TextField
                                  name="validity"
                                  value={values.validity}
                                  onChange={(e) => {
                                    const validityValue = e.target.value;
                                    handleChange(e);
                                    const validityInDays =
                                      Number(validityValue);
                                    if (
                                      !isNaN(validityInDays) &&
                                      validityInDays > 0
                                    ) {
                                      const newValidityDate = dayjs().add(
                                        validityInDays,
                                        'day'
                                      ); // Adjusting for 1-based index
                                      setFieldValue(
                                        'validityDate',
                                        newValidityDate
                                      );
                                    } else {
                                      setFieldValue('validityDate', null);
                                    }
                                  }}
                                  onInput={(e) => {
                                    e.target.value = e.target.value.replace(
                                      /[^0-9]/g,
                                      ''
                                    );
                                  }}
                                  error={
                                    touched.validity && Boolean(errors.validity)
                                  }
                                  helperText={<ErrorMessage name="validity" />}
                                />
                                <StyledTypography
                                  margin="0 0 0 10px"
                                  fontSize="10px"
                                  color="#000000BD"
                                  whiteSpace="nowrap"
                                >
                                  ({t('inDays')})
                                </StyledTypography>
                              </FlexContainer>
                            </FlexContainer>
                          )}
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <FlexContainer
                            justifyContent="center"
                            alignItems="center"
                            style={{ height: '100%' }}
                          >
                            {validityDays && validityDates && (
                              <Label
                                value={t('OR')}
                                margin={
                                  isMobile || isTablet
                                    ? '20px 10px 0 0'
                                    : '50px 30px 0 0'
                                }
                              />
                            )}
                          </FlexContainer>
                        </Grid>
                        <Grid item xs={12} sm={5}>
                          {pageFields?.find(
                            (x) => x.FieldId === 'LG_P_IM_LG_Date'
                          )?.IsShow && (
                            <FlexContainer
                              flexDirection="column"
                              gap="5px"
                              style={{ marginTop: '25px' }}
                            >
                              <DatePicker
                                value={
                                  values.validityDate
                                    ? dayjs(values.validityDate)
                                    : null
                                }
                                onChange={(date) => {
                                  setFieldValue('validityDate', date);
                                  if (date) {
                                    const daysUntilDate =
                                      date.diff(dayjs(), 'day') + 1;
                                    setFieldValue(
                                      'validity',
                                      daysUntilDate >= 1 ? daysUntilDate : ''
                                    );
                                  } else {
                                    setFieldValue('validity', '');
                                  }
                                }}
                                shouldDisableDate={(date) =>
                                  date.isBefore(dayjs().add(1, 'day'), 'day')
                                }
                                format="DD/MM/YYYY"
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    error={
                                      touched.validityDate &&
                                      Boolean(errors.validityDate)
                                    }
                                    helperText={
                                      <ErrorMessage name="validityDate" />
                                    }
                                  />
                                )}
                              />
                            </FlexContainer>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} padding="10px">
                      <FlexContainer
                        justifyContent="center"
                        gap="20px"
                        flexDirection={isMobile || isTablet ? 'column' : 'row'}
                      >
                        <Button
                          type="submit"
                          variant="contained"
                          sx={{
                            width: isMobile || isTablet ? '100%' : 'auto',
                            backgroundColor: '#00C040',
                            '&:hover': { backgroundColor: '#00A030' },
                          }}
                          startIcon={
                            <StyledImage
                              height="18px"
                              width="18px"
                              gap="8px"
                              src={GenerateLicense}
                              alt="Go to icon"
                            />
                          }
                        >
                          <StyledTypography margin="0 0 0 10px" color="white">
                            {t('Generate')}
                          </StyledTypography>
                        </Button>
                        <StyledButton
                          variant="outlined"
                          border="1px solid #0083c0"
                          backgroundColor="#ffffff"
                          type="button"
                          colour="#0083c0"
                          width={isMobile || isTablet ? '100%' : 'auto'}
                          borderRadius="6px"
                          margin="0 0 0 10px"
                          display="inline-flex"
                          gap="5px"
                          onClick={() => {
                            resetForm();
                            setLicenseKey('');
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
                      </FlexContainer>
                    </Grid>
                    <Grid item xs={12} padding="10px">
                      <FlexContainer
                        position="relative"
                        width="100%"
                        maxWidth="800px"
                        justifyContent="center"
                        margin="0 auto"
                      >
                        <TextArea
                          sx={{
                            width: '100%',
                            height: isMobile || isTablet ? '80px' : '100px',
                            padding: '10px',
                            maxWidth: isMobile || isTablet ? '90%' : '200px',
                          }}
                          value={licenseKey}
                          shake={shake}
                          name="licenseKey"
                          readOnly
                        />

                        {isLoading && (
                          <FlexContainer
                            position="absolute"
                            top="50%"
                            left="50%"
                            transform="translate(-50%, -50%)"
                            justifyContent="center"
                            alignItems="center"
                            zIndex="1"
                            backgroundColor="transparent"
                            padding="10px"
                            borderRadius="8px"
                          >
                            <StyledTypography
                              color="#000000"
                              fontWeight="600"
                              marginLeft="10px"
                              marginTop="10px"
                            >
                              {`${t('Please wait')}${dots}`}{' '}
                            </StyledTypography>
                          </FlexContainer>
                        )}
                        <Tooltip title="Copy" arrow>
                          <StyledImage
                            height={isMobile || isTablet ? '10px' : '14px'}
                            width={isMobile || isTablet ? '10px' : '14px'}
                            src={CopyIcon}
                            alt="Copy Icon"
                            style={{
                              cursor: 'pointer',
                              position: 'absolute', // Use absolute positioning
                              top: isMobile || isTablet ? '-20px' : '-20px', // Adjust position above the text area
                              left: isMobile || isTablet ? '5px' : '800px', // Adjust horizontal position
                            }}
                            onClick={() => {
                              if (licenseKey) {
                                navigator.clipboard
                                  .writeText(licenseKey)
                                  .then(() => {
                                    alert('License key copied to clipboard!');
                                  });
                              } else {
                                alert('No license key to copy!');
                              }
                            }}
                          />
                        </Tooltip>
                      </FlexContainer>
                    </Grid>
                  </Grid>
            </Form>
          )}
        </Formik>
      )}
      </Box>
      </FlexContainer>
      </FlexContainer>
    </LocalizationProvider>
  );
};

export default LicenseGenerator;
