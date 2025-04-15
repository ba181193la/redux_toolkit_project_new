import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Tooltip,
} from '@mui/material';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../utils/StyledComponents';
import { ErrorMessage, Field, Formik, Form } from 'formik';
import CloseIcon from '../../../assets/Icons/CloseIcon.png';
import DoneIcon from '../../../assets/Icons/DoneIcon.png';
import DndIcon from '../../../assets/Icons/DoNotDisturbIcon.png';
import { useTranslation } from 'react-i18next';
import { getlabel } from '../../../utils/language';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  useGetPasswordDataQuery,
  useGetPasswordPolicyQuery,
  useUpdateStaffPasswordMutation,
} from '../../../redux/RTK/passwordManagementApi';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { showToastAlert } from '../../../utils/SweetAlert';
import { decryptAES, encryptAES } from '../../../utils/Auth';
import Label from '../../../components/Label/Label';

const BorderBox = styled.div`
  border: 1px solid #c4c4c4;
  padding: 6px 8px 8px 8px;
  border-radius: 4px;
`;

const PasswordPolicySubText = styled.span`
  color: #0083c0;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 20px;
  margin-top: 20px;
`;

const EditViewPasswordDetails = ({
  labels,
  selectedStaffDetails,
  showPasswordDetailsModal,
  setShowPasswordDetailsModal,
  tableActionType,
  refetch,
  pageFields,
}) => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const secretKey = process.env.REACT_APP_SECRET_KEY;

  const { selectedMenu, selectedModuleId, userDetails, selectedFacility } =
    useSelector((state) => state.auth);

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordDetailsInitialValues, setPasswordDetailsInitialValues] =
    useState({
      newPassword: '',
      confirmPassword: '',
    });

  const [passwordPolicyInitialValues, setPasswordPolicyInitialValues] =
    useState({
      minLength: '',
      minLowercase: '',
      minUppercase: '',
      minDigits: '',
    });

  const handleToggleNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };
  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const closePasswordDetails = () => {
    setShowPasswordDetailsModal(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setPasswordDetailsInitialValues({ newPassword: '', confirmPassword: '' });
  };

  const [triggerUpdatePasswordDetails, { isLoading }] =
    useUpdateStaffPasswordMutation();

  if (tableActionType === 'Edit') {
    const { data: passwordPolicy } = useGetPasswordPolicyQuery(
      {
        loginUserId: userDetails?.UserId,
        headerFacilityId: selectedFacility?.id,
      },
      {
        skip: !userDetails?.UserId,
        refetchOnMountOrArgChange: true,
      }
    );

    useEffect(() => {
      if (passwordPolicy?.Data) {
        setPasswordPolicyInitialValues({
          minLength: passwordPolicy?.Data?.MinLength,
          minLowercase: passwordPolicy?.Data?.MinLowerAlphabets,
          minUppercase: passwordPolicy?.Data?.MinUpperAlphabets,
          minDigits: passwordPolicy?.Data?.MinDigits,
        });
      }
    }, [passwordPolicy]);
  }
  if (tableActionType === 'View') {
    const { data: passwordData } = useGetPasswordDataQuery(
      {
        moduleId: selectedModuleId,
        menuId: selectedMenu?.id,
        loginUserId: userDetails?.UserId,
        userId: selectedStaffDetails?.UserId,
        headerFacilityId: selectedFacility?.id,
      },
      {
        skip: !userDetails?.UserId,
        refetchOnMountOrArgChange: true,
      }
    );
    useEffect(() => {
      if (passwordData?.Data) {
        setPasswordDetailsInitialValues({
          newPassword: decryptAES(passwordData?.Data, secretKey),
          confirmPassword: decryptAES(passwordData?.Data, secretKey),
        });
      }
    }, [passwordData]);
  }

  const passwordValidationRegex = new RegExp(
    `^(?=(?:[^a-z]*[a-z]){${passwordPolicyInitialValues?.minLowercase}})(?=(?:[^A-Z]*[A-Z]){${passwordPolicyInitialValues?.minUppercase}})(?=(?:[^0-9]*[0-9]){${passwordPolicyInitialValues?.minDigits}}).{${passwordPolicyInitialValues?.minLength},}$`
  );
  const passwordDetailsValidation = Yup.object().shape({
    newPassword: Yup.string()
      .required(
        `${getlabel('MM_PM_Password', labels, i18n.language)} ${t('IsRequired')}`
      )
      .matches(
        passwordValidationRegex,
        t('PasswordDoesNotMatchWithPasswordPolicy')
      ),
    confirmPassword: Yup.string()
      .required(
        `${getlabel('MM_PM_ConfirmPassword', labels, i18n.language)} ${t('IsRequired')}`
      )
      .oneOf(
        [Yup.ref('newPassword'), null],
        t("PasswordAndConfirmPasswordDoesn'tMatch")
      )
      .matches(
        passwordValidationRegex,
        t('PasswordDoesNotMatchWithPasswordPolicy')
      ),
  });

  const submitPasswordDetails = async (values) => {
    let response;
    response = await triggerUpdatePasswordDetails({
      payload: {
        userId: selectedStaffDetails?.UserId,
        password: encryptAES(values?.confirmPassword, secretKey),
        moduleId: selectedModuleId,
        menuId: selectedMenu?.id,
        loginUserId: userDetails?.UserId,
        facilityId: selectedFacility?.id,
      },
    }).unwrap();
    if (response && response.Message === 'Record Updated Successfully') {
      showToastAlert({
        type: 'custom_success',
        text: response.Message,
        gif: 'SuccessGif',
      });
    }
    if (response && response.Message === 'ReusePassword does not Exist') {
      showToastAlert({
        type: 'custom_info',
        text: 'Do not reuse a password used last five times.',
        gif: 'InfoGif',
      });
    }
    refetch();
    setPasswordDetailsInitialValues({ newPassword: '', confirmPassword: '' });
    setShowPasswordDetailsModal(false);
  };

  return (
    <Dialog
      open={showPasswordDetailsModal}
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
          backgroundColor: '#205475',
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          height: 50,
          alignItems: 'center',
          padding: '30px',
        }}
      >
        <StyledTypography
          fontSize="20px"
          fontWeight="300"
          lineHeight="18px"
          color="#fff"
        >
          {t('PasswordDetails')}
        </StyledTypography>
        <Tooltip title="close" arrow>
          <IconButton
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
            onClick={closePasswordDetails}
          >
            <StyledImage src={CloseIcon} alt="Close Icon" />
          </IconButton>
        </Tooltip>
      </DialogTitle>
      <DialogContent style={{ padding: '10px', margin: '20px' }}>
        <FlexContainer paddingTop="20px" flexWrap="wrap">
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
            <Formik
              initialValues={passwordDetailsInitialValues}
              validationSchema={passwordDetailsValidation}
              enableReinitialize={true}
              validateOnBlur={true}
              validateOnChange={true}
              onSubmit={(values) => {
                submitPasswordDetails(values);
              }}
            >
              {() => (
                <Form style={{ width: '100%' }}>
                  <Grid
                    display={'flex'}
                    width="100%"
                    flexWrap={'wrap'}
                    alignItems={'center'}
                    padding={'0px'}
                    container
                  >
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={tableActionType === 'Edit' ? 6 : 12}
                      xl={tableActionType === 'Edit' ? 6 : 12}
                      padding={'10px'}
                    >
                      {pageFields?.find((x) => x.FieldId === 'PM_P_Facility')
                        ?.IsShow && (
                        <Grid
                          container
                          display={'flex'}
                          width="100%"
                          flexWrap={'wrap'}
                          justifyContent={'space-between'}
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          xl={12}
                          alignItems={'center'}
                        >
                          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <StyledTypography
                              fontSize="14px"
                              fontWeight="700"
                              color="#33333"
                              style={{
                                wordWrap: 'break-word',
                              }}
                            >
                              {getlabel(
                                'MM_PM_Facility',
                                labels,
                                i18n.language
                              )}
                            </StyledTypography>
                          </Grid>
                          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <StyledTypography
                              fontSize="14px"
                              fontWeight="500"
                              lineHeight="30px"
                              color="#33333"
                              style={{
                                wordWrap: 'break-word',
                              }}
                            >
                              {selectedStaffDetails?.Facility}
                            </StyledTypography>
                          </Grid>
                        </Grid>
                      )}
                      {pageFields?.find((x) => x.FieldId === 'PM_P_EmployeeID')
                        ?.IsShow && (
                        <Grid
                          container
                          display={'flex'}
                          width="100%"
                          flexWrap={'wrap'}
                          justifyContent={'space-between'}
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          alignItems={'center'}
                        >
                          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <StyledTypography
                              fontSize="14px"
                              fontWeight="700"
                              color="#33333"
                              style={{
                                wordWrap: 'break-word',
                              }}
                            >
                              {getlabel(
                                'MM_PM_EmployeeID',
                                labels,
                                i18n.language
                              )}
                            </StyledTypography>
                          </Grid>
                          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <StyledTypography
                              fontSize="14px"
                              fontWeight="500"
                              lineHeight="30px"
                              color="#33333"
                              style={{
                                wordWrap: 'break-word',
                              }}
                            >
                              {selectedStaffDetails?.EmployeeId}
                            </StyledTypography>
                          </Grid>
                        </Grid>
                      )}
                      {pageFields?.find((x) => x.FieldId === 'PM_P_StaffName')
                        ?.IsShow && (
                        <Grid
                          container
                          display={'flex'}
                          width="100%"
                          flexWrap={'wrap'}
                          justifyContent={'space-between'}
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          spacing={2}
                          alignItems={'center'}
                        >
                          <Grid item xs={6} sm={6}>
                            <StyledTypography
                              fontSize="14px"
                              fontWeight="700"
                              color="#33333"
                              style={{
                                wordWrap: 'break-word',
                              }}
                            >
                              {getlabel(
                                'MM_PM_StaffName',
                                labels,
                                i18n.language
                              )}
                            </StyledTypography>
                          </Grid>
                          <Grid item xs={6} sm={6}>
                            <StyledTypography
                              fontSize="14px"
                              fontWeight="500"
                              lineHeight="30px"
                              color="#33333"
                              style={{
                                wordWrap: 'break-word',
                              }}
                            >
                              {selectedStaffDetails?.StaffName}
                            </StyledTypography>
                          </Grid>
                        </Grid>
                      )}
                      <Grid
                        container
                        display={'flex'}
                        width="100%"
                        flexWrap={'wrap'}
                        justifyContent={'space-between'}
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        spacing={2}
                        alignItems={'center'}
                        marginBlock={'-5px'}
                      >
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          xl={12}
                          display={'flex'}
                          justifyContent={'space-between'}
                        >
                          <Label
                            bold={true}
                            value={getlabel(
                              'MM_PM_Password',
                              labels,
                              i18n.language
                            )}
                            isRequired={true}
                          />

                          <Button
                            onClick={handleToggleNewPassword}
                            style={{
                              padding: '0px',
                              textTransform: 'capitalize',
                              minWidth: '120px',
                            }}
                          >
                            {showNewPassword
                              ? t('HidePassword')
                              : t('ShowPassword')}
                          </Button>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          xl={12}
                          style={{ paddingBlock: '5px' }}
                        >
                          <Field name="newPassword">
                            {({ field, form }) => (
                              <>
                                <TextField
                                  {...field}
                                  id="newPassword"
                                  autoComplete="off"
                                  fullWidth={true}
                                  disabled={tableActionType === 'View'}
                                  type={showNewPassword ? 'text' : 'password'}
                                  slotProps={{
                                    htmlInput: {
                                      maxLength: 100,
                                    },
                                  }}
                                />
                              </>
                            )}
                          </Field>
                          <ErrorMessage
                            name="newPassword"
                            component="div"
                            style={{
                              color: 'red',
                              fontSize: '12px',
                              marginTop: '4px',
                            }}
                          />
                        </Grid>
                      </Grid>
                      {tableActionType === 'Edit' && (
                        <Grid
                          container
                          display={'flex'}
                          width="100%"
                          flexWrap={'wrap'}
                          justifyContent={'space-between'}
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          spacing={2}
                          alignItems={'center'}
                          padding={0}
                        >
                          <Grid
                            item
                            xs={12}
                            sm={12}
                            md={12}
                            lg={12}
                            display={'flex'}
                            justifyContent={'space-between'}
                          >
                            <Label
                              bold={true}
                              value={getlabel(
                                'MM_PM_ConfirmPassword',
                                labels,
                                i18n.language
                              )}
                              isRequired={true}
                            />
                            <Button
                              onClick={handleToggleConfirmPassword}
                              style={{
                                padding: '0px',
                                textTransform: 'capitalize',
                                minWidth: '120px',
                              }}
                            >
                              {showConfirmPassword
                                ? t('HidePassword')
                                : t('ShowPassword')}
                            </Button>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={12}
                            md={12}
                            lg={12}
                            xl={12}
                            style={{ paddingBlock: '5px' }}
                          >
                            <Field name="confirmPassword">
                              {({ field }) => (
                                <>
                                  <TextField
                                    {...field}
                                    id="confirmPassword"
                                    autoComplete="off"
                                    fullWidth
                                    type={
                                      showConfirmPassword ? 'text' : 'password'
                                    }
                                    slotProps={{
                                      htmlInput: {
                                        maxLength: 100,
                                      },
                                    }}
                                  />
                                </>
                              )}
                            </Field>
                            <ErrorMessage
                              name="confirmPassword"
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
                    </Grid>
                    {tableActionType === 'Edit' && (
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={6}
                        lg={6}
                        xl={6}
                        padding={'10px'}
                      >
                        <BorderBox>
                          <PasswordPolicySubText>
                            {t('PasswordPolicy')}
                          </PasswordPolicySubText>
                          <Divider style={{ marginBlockStart: '10px' }} />
                          <List>
                            <ListItem disablePadding>
                              <ListItemText
                                secondary={`Length must be greater than or equal to ${passwordPolicyInitialValues?.minLength} characters.`}
                              />
                            </ListItem>
                            <ListItem disablePadding>
                              <ListItemText
                                secondary={`Password must contain ${passwordPolicyInitialValues?.minLowercase} lowercase letters.`}
                              />
                            </ListItem>
                            <ListItem disablePadding>
                              <ListItemText
                                secondary={`Password must contain  ${passwordPolicyInitialValues?.minUppercase} uppercase letters.`}
                              />
                            </ListItem>
                            <ListItem disablePadding>
                              <ListItemText
                                secondary={`Password must contain  ${passwordPolicyInitialValues?.minDigits} numbers.`}
                              />
                            </ListItem>
                            <ListItem disablePadding>
                              <ListItemText
                                secondary={`Do not reuse any of the last five passwords.`}
                              />
                            </ListItem>
                          </List>
                        </BorderBox>
                      </Grid>
                    )}
                    {tableActionType === 'Edit' && (
                      <Grid
                        display={'flex'}
                        width="100%"
                        justifyContent={'center'}
                        gap={'10px'}
                      >
                        <StyledButton
                          borderRadius="6px"
                          padding="6px 10px"
                          variant="contained"
                          color="primary"
                          type="submit"
                          disabled={isLoading}
                          sx={{ marginLeft: '10px' }}
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
                          disabled={isLoading}
                          sx={{ marginLeft: '10px' }}
                          style={{ display: 'inline-flex', gap: '5px' }}
                          onClick={closePasswordDetails}
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
                  </Grid>
                </Form>
              )}
            </Formik>
          </Grid>
        </FlexContainer>
      </DialogContent>
    </Dialog>
  );
};

export default EditViewPasswordDetails;
