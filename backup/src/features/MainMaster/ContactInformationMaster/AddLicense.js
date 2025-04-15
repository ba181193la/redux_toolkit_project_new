import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import { Box } from '@mui/system';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../utils/StyledComponents';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Label from '../../../components/Label/Label';
import CloseIcon from '../../../assets/Icons/CloseIcon.png';
import {
  useGetLicenseByIdQuery,
  useUpdateLicenseMutation,
} from '../../../redux/RTK/contactInformationApi';
import TextArea from '../../../components/TextArea/TextArea';
import formatDate from '../../../utils/FormatDate';
import { useSelector } from 'react-redux';
import { showToastAlert } from '../../../utils/SweetAlert';
import { useTranslation } from 'react-i18next';
import DndIcon from '../../../assets/Icons/DoNotDisturbIcon.png';
import { useGetFieldsQuery } from '../../../redux/RTK/moduleDataApi';
import { getlabel } from '../../../utils/language';

const AddLicense = ({
  open,
  onClose,
  selectedRow,
  refetch,
  isMobile,
  isTablet,
  labels,
}) => {
  const { selectedMenu, selectedModuleId, userDetails } = useSelector(
    (state) => state.auth
  );

  const { t, i18n } = useTranslation();
  const {
    data: licenseData,
    isLoading: isLicenseLoading,
    refetch: refetchLicenseDetails,
  } = useGetLicenseByIdQuery(
    {
      companyId: selectedRow?.CompanyId,
      loginUserId: userDetails?.UserId,
      moduleId: selectedModuleId,
      menuId: selectedMenu?.id,
    },
    {
      skip:
        !selectedRow?.CompanyId ||
        !userDetails?.UserId ||
        !selectedModuleId ||
        !selectedMenu?.id,
    }
  );

  const validationSchema = Yup.object({
    // licenseKey: Yup.string().when(['licenseData'], {
    //   is: (licenseData) =>
    //     licenseData?.Data?.LicenseActiveStatus === 'false',
    //   then: Yup.string().required(
    //     'License Key is required when the license is expired'
    //   ),
    // }),
    licenseKey: Yup.string().required('License Key is required'),
  });
  const [triggerUpdateLicense] = useUpdateLicenseMutation();

  const licenseFlag = userDetails?.ApplicableRoles?.some(
    (role) => role.RoleId === 1
  );
  console.log("userDetails?.ApplicableRoles", userDetails?.ApplicableRoles);
  const isLicenseExpired =
    licenseData?.Data?.LicenseActiveStatus === 'License Expired';
  const licenseStatus = licenseData?.Data?.LicenseActiveStatus;
  const initialValues = {
    companyId: selectedRow?.CompanyId || '',
    companyName: selectedRow?.CompanyName || '',
    companyCode: selectedRow?.CompanyCode || '',
    licenseStatus:
      licenseStatus === 'License Expired'
        ? licenseData?.Data?.RenewalDate === null
          ? 'Not created'
          : 'Expired'
        : 'Active',
    expiryDate: licenseData?.Data?.RenewalDate || null,
    licenseKey: '',
  };

  const [loading, setLoading] = useState(false);

  const renderLicenseInfo = ({ setFieldValue, errors, touched }) => {
    if (isLicenseLoading) {
      return <StyledTypography>{t('NoDataAvailable')}</StyledTypography>;
    }

    if (!licenseData || !licenseData.Data) {
      return <StyledTypography>{t('NoDataAvailable')}</StyledTypography>;
    }
    return (
      <>
        <FlexContainer
          width="100%"
          justifyContent="space-between"
          alignItems="center"
          gap="20px"
        >
          <Box sx={{ flex: 1 }}>
            <Label
              value={getlabel('MM_CIM_CompanyName', labels, i18n.language)}
            />
          </Box>
          <Box sx={{ flex: 2 }}>
            <Label value={initialValues?.companyName} />
          </Box>
        </FlexContainer>

        <FlexContainer
          width="100%"
          justifyContent="space-between"
          alignItems="center"
          gap="20px"
        >
          <Box sx={{ flex: 1 }}>
            <Label
              value={getlabel('MM_CIM_LicenseStatus', labels, i18n.language)}
            />
          </Box>
          <Box sx={{ flex: 2 }}>
            <Label
              value={initialValues?.licenseStatus}
              color={
                initialValues?.licenseStatus === 'Expired' ||
                initialValues?.licenseStatus === 'Not created'
                  ? '#FF0000'
                  : '#099815'
              }
              style={{ fontWeight: 'bold' }}
            />
          </Box>
        </FlexContainer>

        <FlexContainer
          width="100%"
          justifyContent="space-between"
          alignItems="center"
          gap="20px"
        >
          <Box sx={{ flex: 1 }}>
            <Label value={t('ExpiryDate')} />
          </Box>
          <Box sx={{ flex: 2 }}>
            <Label
              value={
                licenseData?.Data?.RenewalDate
                  ? formatDate(licenseData?.Data?.RenewalDate)
                  : 'NA' || ''
              }
            />
          </Box>
        </FlexContainer>

        {licenseFlag &&
          (((initialValues?.licenseStatus === 'Expired' ||
            initialValues?.licenseStatus === 'Not created') &&
            getDaysUntil(initialValues.expiryDate) <= 30) ||
            isLicenseExpired) && (
            <FlexContainer
              width="100%"
              justifyContent="space-between"
              alignItems="center"
              gap="20px"
            >
              <Box sx={{ flex: 1 }}>
                <Label value={t('LicenseKey')} isRequired={true} />
              </Box>
              <Box sx={{ flex: 10 }}>
                <TextArea
                  name="licenseKey"
                  onChange={(e) => setFieldValue('licenseKey', e.target.value)}
                />
                {/* <ErrorMessage
                name="licenseKey"
                component="div"
                style={{
                  color: 'red',
                  fontSize: '12px',
                  marginTop: '4px',
                }}
              /> */}
                {errors.licenseKey && touched.licenseKey && (
                  <div style={{ color: 'red', fontSize: '11px' }}>
                    {errors.licenseKey}
                  </div>
                )}
              </Box>
            </FlexContainer>
          )}
      </>
    );
  };

  function getDaysUntil(targetDate) {
    const givenDate = new Date(targetDate); // Convert input to Date object
    const currentDate = new Date(); // Get today's date

    // Convert both dates to UTC to avoid time zone issues
    // givenDate.setHours(0, 0, 0, 0);
    // currentDate.setHours(0, 0, 0, 0);

    // Calculate difference in milliseconds and convert to days
    const differenceInMs = givenDate - currentDate;
    return Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));
  }

  // Example usage:

  return (
    <Dialog
      open={open}
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '8px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
          width: isMobile ? '100%' : 'auto',
        },
      }}
    >
      <Box sx={{ width: isMobile ? '100%' : 600 }}>
        <DialogTitle
          sx={{
            backgroundColor: '#205475',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            height: 40,
            alignItems: 'center',
            padding: '0 8px',
          }}
        >
          <StyledTypography
            fontSize="18px"
            fontWeight="300"
            lineHeight="18px"
            padding="0 12px"
            color="#fff"
          >
            {t('AddorRenewLicense')}
          </StyledTypography>
          <IconButton
            onClick={onClose}
            sx={{
              color: '#fff',
              '&:hover': {
                transform: 'scale(1.05)',
                transition: 'transform 0.3s ease',
                backgroundColor: 'rgba(15, 108, 189, 0.2)',
              },
            }}
          >
            <Tooltip title="Close" arrow>
              <StyledImage src={CloseIcon} alt="Close Icon" />
            </Tooltip>
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            border: '4px solid #205475',
            padding: isMobile ? '8px' : '20px',
          }}
        >
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values, { setFieldValue }) => {
              let response;
              setLoading(true);
              try {
                response = await triggerUpdateLicense({
                  payload: {
                    CompanyId: values?.companyId,
                    companyCode: values?.companyCode,
                    licenseKey: values?.licenseKey,
                    moduleId: selectedModuleId,
                    menuId: selectedMenu?.id,
                    loginUserId: userDetails?.UserId,
                  },
                }).unwrap();

                if (response && response.Message) {
                  showToastAlert({
                    type: 'custom_success',
                    text: response.Message,
                    gif: 'SuccessGif',
                  });
                  setFieldValue('licenseStatus', 'Active');
                }
                refetchLicenseDetails();
                onClose();
              } catch (error) {
                showToastAlert({
                  type: 'custom_error',
                  text: 'Failed to update license. Please Check your License Key.',
                  gif: 'InfoGif',
                });
                onClose();
              } finally {
                setLoading(false);
                refetch();
              }
            }}
          >
            {({ setFieldValue, resetForm, errors, touched }) => (
              <Form>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    marginTop: '20px',
                  }}
                >
                  {renderLicenseInfo({ setFieldValue, errors, touched })}

                  {((licenseFlag &&
                   (initialValues?.licenseStatus === 'Expired' ||
                    initialValues?.licenseStatus === 'Not created') &&
                    getDaysUntil(initialValues.expiryDate) <= 30) ||
                    (licenseFlag &&
                      initialValues?.licenseStatus !== 'Active')) && (
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
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          <StyledTypography
                            fontSize="14px"
                            color="#fff"
                            fontWeight="500"
                          >
                            {t('UpdateLicense')}
                          </StyledTypography>
                        )}
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
                          onClose();
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
                  )}
                </Box>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default AddLicense;
