import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import EditIcon from '../../../../assets/Icons/EditIconWhite.png';
import ExpandIcon from '../../../../assets/Icons/ExpandIcon.png';
import DndIcon from '../../../../assets/Icons/DoNotDisturbIcon.png';
import DoneIcon from '../../../../assets/Icons/DoneIcon.png';
import LoadingGif from '../../../../assets/Gifs/LoadingGif.gif';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
} from '../../../../utils/StyledComponents';
import { useTranslation } from 'react-i18next';
import { getlabel } from '../../../../utils/language';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { checkAccess } from '../../../../utils/Auth';
import {
  useGetCommonSetupQuery,
  useUpdateCommonSetupMutation,
} from '../../../../redux/RTK/IncidentManagement/incidentSubMasterApi';
import Label from '../../../../components/Label/Label';
import { showToastAlert } from '../../../../utils/SweetAlert';

const CommonSetup = ({ labels, fieldAccess, expandAll }) => {
  const { t, i18n } = useTranslation();

  //* Selectors
  const {
    selectedRoleFacility,
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
    isSuperAdmin,
  } = useSelector((state) => state.auth);

  //State Variables
  const [roleMenu, setRoleMenu] = useState();
  const [fieldLabels, setFieldLabels] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [reOccurenceError, setReOccurenceError] = useState(false);
  const [expand, setExpand] = useState(expandAll);
  const [commonSetupInitial, setCommonSetupInitial] = useState({
    setUpId: 0,
    latestValue: false,
    AllInvestigationCompleted: false,
    showJawdaIncidentLevel: false,
    reOccuranceDays: null,
  });

  //* Filtering fields access data
  const pageFields = fieldAccess?.Data?.Menus?.find(
    (section) => section?.MenuId === selectedMenu?.id
  )
    ?.Sections?.find(
      (sectionName) => sectionName?.SectionName === 'Common Setup-Page'
    )
    ?.Regions?.find((region) => region?.RegionCode === 'ALL')?.Fields;

  //* RTK Queries

  const [triggerUpdateCommonSetup, { isLoading: isUpdating }] =
    useUpdateCommonSetupMutation();

  const {
    data: commonSetupDetails,
    isFetching,
    refetch,
  } = useGetCommonSetupQuery(
    {
      payload: {
        pageIndex: 1,
        pageSize: 25,
        headerFacility: selectedFacility?.id,
        loginUserId: userDetails?.UserId,
        moduleId: 2,
        // moduleId: selectedModuleId,
        menuId: selectedMenu?.id,
      },
    },
    {
      skip: !selectedFacility?.id || !selectedModuleId || !selectedMenu?.id,
      refetchOnMountOrArgChange: true,
    }
  );

  //* Use Effect to bind data

  useEffect(() => {
    if (commonSetupDetails?.Records) {
      setCommonSetupInitial({
        setUpId: commonSetupDetails?.Records[0]?.CommonSetupId,
        latestValue: commonSetupDetails?.Records[0]?.IsLatestValueUpdate,
        AllInvestigationCompleted:
          commonSetupDetails?.Records[0]?.IsAnyInvestigationComplete,
        showJawdaIncidentLevel: commonSetupDetails?.Records[0]?.IsJAWDALevel,
        reOccuranceDays: commonSetupDetails?.Records[0]?.ReoccurrenceDays,
      });
    }
  }, [commonSetupDetails]);

  useEffect(() => {
    if (labels?.Data) {
      const regionList = labels?.Data?.find(
        (x) => x.MenuId === selectedMenu?.id
      )?.Regions;
      const labelsList = regionList?.find(
        (x) => x.RegionCode === 'ALL'
      )?.Labels;
      setFieldLabels(labelsList);
    }
  }, [labels]);

  useEffect(() => {
    const roleMenu = selectedRoleFacility?.Menu.find(
      (item) => item.MenuId === selectedMenu?.id
    );
    setRoleMenu(roleMenu);
  }, [selectedRoleFacility, selectedMenu]);

  useEffect(() => {
    setExpand(expandAll);
  }, [expandAll]);

  // Common setup submission
  const submitCommonSetup = async () => {
    if (!commonSetupInitial?.reOccuranceDays) {
      setReOccurenceError(true);
    } else {
      let response;
      try {
        if (commonSetupInitial?.setUpId !== 0) {
          response = await triggerUpdateCommonSetup({
            payload: {
              commonSetupId: commonSetupInitial?.setUpId,
              isLatestValueUpdate: commonSetupInitial?.latestValue,
              isAnyInvestigationComplete:
                commonSetupInitial?.AllInvestigationCompleted,
              isJAWDALevel: commonSetupInitial?.showJawdaIncidentLevel,
              reoccurrenceDays: commonSetupInitial?.reOccuranceDays,
              headerFacilityId: selectedFacility?.id,
              moduleId: 2,
              // moduleId: selectedModuleId,
              menuId: selectedMenu?.id,
              loginUserId: userDetails?.UserId,
            },
          });
          if (
            response &&
            response?.data?.Message === 'Record Updated Successfully'
          ) {
            showToastAlert({
              type: 'custom_success',
              text: response?.data?.Message,
            });
          }
          refetch();
          setIsEdit(false);
        }
      } catch (error) {
        console.error('Failed to update Common setup', error);
      }
    }
  };

  return (
    <>
      <Accordion
        sx={{ border: '5px', borderColor: '#0083c0' }}
        expanded={expand}
      >
        <AccordionSummary
          style={{ padding: '0 10px' }}
          onClick={() => {
            setExpand((prev) => !prev);
          }}
          expandIcon={
            <StyledImage
              src={ExpandIcon}
              alt="Expand Icon"
              height={'8px'}
              width={'15px'}
            />
          }
          sx={{
            backgroundColor: '#0083c0',
            borderRadius: '8px 8px 0px 0px',
            width: '100%',
            border: '1px solid #0083c0',
          }}
        >
          <Typography
            fontWeight="700"
            lineHeight="20px"
            textAlign="center"
            color="#FFFFFF"
            sx={{
              fontSize: {
                xs: '0.875rem',
                sm: '0.875rem',
                md: '1rem',
                lg: '1rem',
              },
            }}
          >
            {getlabel(
              'IM_IS_CS_CommonSetup',
              {
                Data: fieldLabels,
                Status: labels?.Status,
              },
              i18n.language
            )}
          </Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            width: '100%',
            height: isFetching || isUpdating ? '30vh' : 'auto',
            padding: '30px',
            border: '1px solid #0083c0',
          }}
        >
          {isFetching || isUpdating ? (
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
              {pageFields?.find(
                (x) => x.FieldId === 'IS_CS_P_UpdateLatestValueinAllPlaces'
              )?.IsShow && (
                <Grid
                  container
                  width="100%"
                  item
                  display={'flex'}
                  justifyContent={'center'}
                  xs={12}
                  alignItems={'center'}
                  marginTop={'0.2rem'}
                >
                  <Grid item xs={12} sm={12} md={6} lg={3}>
                    <Label
                      bold={true}
                      value={getlabel(
                        'IM_IS_CS_UpdateLatestValueinAllPlaces',
                        {
                          Data: fieldLabels,
                          Status: labels?.Status,
                        },
                        i18n.language
                      )}
                      isRequired={
                        pageFields?.find(
                          (x) =>
                            x.FieldId === 'IS_CS_P_UpdateLatestValueinAllPlaces'
                        )?.IsMandatory
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={3}>
                    <Checkbox
                      size="small"
                      disabled={!isEdit}
                      checked={commonSetupInitial?.latestValue}
                      onChange={(e) => {
                        setCommonSetupInitial({
                          ...commonSetupInitial,
                          latestValue: e.target.checked,
                        });
                      }}
                    />
                  </Grid>
                </Grid>
              )}

              {pageFields?.find(
                (x) =>
                  x.FieldId === 'IS_CS_P_AllInvestigationCompletedforClosure'
              )?.IsShow && (
                <Grid
                  container
                  width="100%"
                  item
                  display={'flex'}
                  justifyContent={'center'}
                  xs={12}
                  spacing={2}
                  alignItems={'center'}
                  marginTop={'0.2rem'}
                >
                  <Grid item xs={12} sm={12} md={6} lg={3}>
                    <Label
                      bold={true}
                      value={getlabel(
                        'IM_IS_CS_AllInvestigationCompletedforClosure',
                        {
                          Data: fieldLabels,
                          Status: labels?.Status,
                        },
                        i18n.language
                      )}
                      isRequired={
                        pageFields?.find(
                          (x) =>
                            x.FieldId ===
                            'IS_CS_P_AllInvestigationCompletedforClosure'
                        )?.IsMandatory
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={3}>
                    <Checkbox
                      size="small"
                      disabled={!isEdit}
                      checked={commonSetupInitial?.AllInvestigationCompleted}
                      onChange={(e) => {
                        setCommonSetupInitial({
                          ...commonSetupInitial,
                          AllInvestigationCompleted: e.target.checked,
                        });
                      }}
                    />
                  </Grid>
                </Grid>
              )}

              {pageFields?.find(
                (x) => x.FieldId === 'IS_CS_P_ShowJAWDAIncidentLevel'
              )?.IsShow && (
                <Grid
                  container
                  width="100%"
                  item
                  display={'flex'}
                  justifyContent={'center'}
                  xs={12}
                  spacing={2}
                  alignItems={'center'}
                  marginTop={'0.2rem'}
                >
                  <Grid item xs={12} sm={12} md={6} lg={3}>
                    <Label
                      bold={true}
                      value={getlabel(
                        'IM_IS_JIL_ShowJAWDAIncidentLevel',
                        {
                          Data: fieldLabels,
                          Status: labels?.Status,
                        },
                        i18n.language
                      )}
                      isRequired={
                        pageFields?.find(
                          (x) => x.FieldId === 'IS_CS_P_ShowJAWDAIncidentLevel'
                        )?.IsMandatory
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={3}>
                    <Checkbox
                      size="small"
                      disabled={!isEdit}
                      checked={commonSetupInitial?.showJawdaIncidentLevel}
                      onChange={(e) => {
                        setCommonSetupInitial({
                          ...commonSetupInitial,
                          showJawdaIncidentLevel: e.target.checked,
                        });
                      }}
                    />
                  </Grid>
                </Grid>
              )}

              {pageFields?.find((x) => x.FieldId === 'IS_CS_P_ReoccuranceDays')
                ?.IsShow && (
                <Grid
                  container
                  width="100%"
                  item
                  display={'flex'}
                  justifyContent={'center'}
                  xs={12}
                  spacing={2}
                  alignItems={'center'}
                  marginTop={'0.2rem'}
                >
                  <Grid item xs={12} sm={12} md={6} lg={3}>
                    <Label
                      bold={true}
                      value={getlabel(
                        'IM_IS_CS_ReoccuranceDays',
                        {
                          Data: fieldLabels,
                          Status: labels?.Status,
                        },
                        i18n.language
                      )}
                      isRequired={
                        pageFields?.find(
                          (x) => x.FieldId === 'IS_CS_P_ReoccuranceDays'
                        )?.IsMandatory
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={3}>
                    <TextField
                      id="reOccuranceDays"
                      autoComplete="off"
                      slotProps={{ htmlInput: { maxLength: 100 } }}
                      disabled={!isEdit}
                      value={commonSetupInitial?.reOccuranceDays}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {
                          setCommonSetupInitial({
                            ...commonSetupInitial,
                            reOccuranceDays: e.target.value,
                          });
                          setReOccurenceError(false);
                        }
                      }}
                    />
                    {reOccurenceError && (
                      <div
                        style={{
                          color: 'red',
                          fontSize: '12px',
                          marginTop: '4px',
                        }}
                      >
                        {getlabel(
                          'IM_IS_CS_ReoccuranceDays',
                          {
                            Data: fieldLabels,
                            Status: labels?.Status,
                          },
                          i18n.language
                        )}{' '}
                        {t('IsRequired')}
                      </div>
                    )}
                  </Grid>
                </Grid>
              )}
              <FlexContainer
                gap="15px"
                justifyContent="flex-end"
                margin="10px 0"
              >
                {!isEdit &&
                  checkAccess(
                    isSuperAdmin,
                    roleMenu?.IsView,
                    roleMenu?.IsEdit || false
                  ) && (
                    <StyledButton
                      borderRadius="6px"
                      padding="6px 10px"
                      variant="contained"
                      color="primary"
                      type="button"
                      sx={{ marginLeft: '10px' }}
                      style={{ display: 'inline-flex', gap: '5px' }}
                      onClick={() => {
                        setIsEdit(true);
                      }}
                      startIcon={
                        <StyledImage
                          height="12px"
                          width="12px"
                          src={EditIcon}
                          alt="WhiteSearch"
                        />
                      }
                    >
                      {t('Edit')}
                    </StyledButton>
                  )}
                {isEdit && (
                  <>
                    <StyledButton
                      borderRadius="6px"
                      padding="6px 10px"
                      variant="contained"
                      backgroundColor="#0083c0"
                      type="submit"
                      sx={{ marginLeft: '10px' }}
                      style={{ display: 'inline-flex', gap: '5px' }}
                      onClick={() => {
                        submitCommonSetup();
                      }}
                      disabled={isUpdating}
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
                      disabled={isUpdating}
                      onClick={() => {
                        setIsEdit(false);
                        setCommonSetupInitial({
                          setUpId:
                            commonSetupDetails?.Records[0]?.CommonSetupId,
                          latestValue:
                            commonSetupDetails?.Records[0]?.IsLatestValueUpdate,
                          AllInvestigationCompleted:
                            commonSetupDetails?.Records[0]
                              ?.IsAnyInvestigationComplete,
                          showJawdaIncidentLevel:
                            commonSetupDetails?.Records[0]?.IsJAWDALevel,
                          reOccuranceDays:
                            commonSetupDetails?.Records[0]?.ReoccurrenceDays,
                        });
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
                  </>
                )}
              </FlexContainer>
            </>
          )}
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default CommonSetup;
