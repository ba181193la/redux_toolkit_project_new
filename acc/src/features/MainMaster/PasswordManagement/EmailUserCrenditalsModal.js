import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  IconButton,
  Tooltip,
  Grid,
  Autocomplete,
  TextField,
} from '@mui/material';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../utils/StyledComponents';
import CloseIcon from '../../../assets/Icons/CloseIcon.png';
import LoadingGif from '../../../assets/Gifs/LoadingGif.gif';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { showToastAlert } from '../../../utils/SweetAlert';
import { useLazySendStaffCredentialsMailQuery } from '../../../redux/RTK/passwordManagementApi';
import Label from '../../../components/Label/Label';
import { useGetPageLoadDataQuery } from '../../../redux/RTK/passwordManagementApi';
import { getlabel } from '../../../utils/language';
import SearchDropdown from '../../../components/SearchDropdown/SearchDropdown';

const EmailUserCrenditalsModal = ({
  showEmailCredentialModal,
  setShowEmailCredentialModal,
  setShowStaffModal,
  labels,
  facilityId,
  setFacilityId,
  pageFields,
}) => {
  const { i18n } = useTranslation();
  const { t } = useTranslation();

  //* Selectors
  const {
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
    isSuperAdmin,
    roleFacilities,
  } = useSelector((state) => state.auth);

  //* RTK Queries
  const [triggerSendMail, { isLoading: mailSending }] =
    useLazySendStaffCredentialsMailQuery();

  const { data: pageLoadData } = useGetPageLoadDataQuery({
    menuId: selectedMenu?.id,
    loginUserId: userDetails?.UserId,
    headerFacilityId: selectedFacility?.id,
  });

  //* Send mail to all users
  const sendMailToAllUsers = async () => {
    let response = await triggerSendMail({
      userIds: 'All',
      menuId: selectedMenu?.id,
      moduleId: selectedModuleId,
      loginUserId: userDetails?.UserId,
      headerFacilityId: selectedFacility?.id,
      facilityId: facilityId,
    }).unwrap();
    if (response && response?.Message === 'Mail Sent Sucessfully') {
      showToastAlert({
        type: 'custom_success',
        text: 'Mail Sent Sucessfully',
        gif: 'SuccessGif',
      });
      setShowEmailCredentialModal(false);
    }
  };

  return (
    <>
      <Dialog
        open={showEmailCredentialModal}
        dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
        fullWidth={true}
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: '8px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
            height: mailSending ? '30vh' : 'auto',
            overflow: mailSending ? 'hidden' : 'auto',
          },
        }}
      >
        <Box>
          <DialogTitle
            sx={{
              backgroundColor: '#205475',
              color: '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              height: 50,
              alignItems: 'center',
              padding: '30px 15px',
            }}
          >
            <StyledTypography
              fontSize="20px"
              fontWeight="300"
              lineHeight="18px"
              color="#fff"
            >
              {t('EmailUserCredentials')}
            </StyledTypography>

            <IconButton
              onClick={() => {
                setShowEmailCredentialModal(false);
                setFacilityId(null);
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
          <DialogContent
            padding="0px"
            style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap' }}
          >
            {mailSending ? (
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
              <>
                {pageFields?.find((x) => x.FieldId === 'PM_P_Facility')
                  ?.IsShow && (
                  <Grid
                    container
                    spacing={2}
                    display={'flex'}
                    justifyContent={'space-between'}
                    width="100%"
                    marginBottom={'1rem'}
                  >
                    <Grid item xs={12} sm={12} md={12} lg={6} padding={'10px'}>
                      <Label
                        value={getlabel(
                          'MM_PM_Facility',
                          labels,
                          i18n.language
                        )}
                        isRequired={true}
                      />
                      <SearchDropdown
                        disableClearable={true}
                        name="facilityId"
                        options={[
                          { text: 'Select', value: '' },
                          ...(userDetails?.ApplicableFacilities?.filter(
                            (facility) => {
                              if (!facility.IsActive) return false;
                              if (isSuperAdmin) return true;
                              const facilityItem = roleFacilities
                                ?.find(
                                  (role) =>
                                    role.FacilityId === facility.FacilityId
                                )
                                ?.Menu?.find(
                                  (MenuItem) =>
                                    MenuItem.MenuId === selectedMenu?.id
                                );
                              return facilityItem?.IsAdd;
                            }
                          ).map((facility) => ({
                            text: facility.FacilityName,
                            value: facility.FacilityId,
                          })) || []),
                        ]}
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
                        onChange={(event, value) => {
                          setFacilityId(value?.value);
                        }}
                      />
                    </Grid>
                  </Grid>
                )}
                <FlexContainer
                  paddingTop="20px"
                  justifyContent="center"
                  alignItems="center"
                  gap="1.5rem"
                  display="flex"
                  flexWrap="wrap"
                  width="100%"
                >
                  <StyledButton
                    type="submit"
                    variant="contained"
                    sx={{ textTransform: 'none' }}
                    onClick={sendMailToAllUsers}
                    disabled={!facilityId}
                  >
                    {t('AllUsers')}
                  </StyledButton>
                  <StyledButton
                    type="submit"
                    variant="contained"
                    sx={{ textTransform: 'none' }}
                    disabled={!facilityId}
                    onClick={() => {
                      setShowStaffModal(true);
                      setShowEmailCredentialModal(false);
                    }}
                  >
                    {t('SpecificUsers')}
                  </StyledButton>
                </FlexContainer>
              </>
            )}
          </DialogContent>
        </Box>
      </Dialog>
    </>
  );
};

export default EmailUserCrenditalsModal;
