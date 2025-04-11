import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../utils/StyledComponents';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandIcon from '../../../assets/Icons/ExpandIcon.png';
import {
  StyledTableBodyCell,
  StyledTableHead,
  StyledTableHeaderCell,
  StyledTableRow,
} from '../../../utils/DataTable.styled';
import {
  Table,
  TableBody,
  TableContainer,
  TableRow,
  RadioGroup,
  Typography,
  Radio,
  Grid,
} from '@mui/material';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
  useGetAllModuleListQuery,
  useUpdateModuleListMutation,
} from '../../../redux/RTK/pageUtilitiesApi';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import DoneIcon from '../../../assets/Icons/DoneIcon.png';
import DndIcon from '../../../assets/Icons/DoNotDisturbIcon.png';
import EditIcon from '../../../assets/Icons/EditIconWhite.png';
import LoadingGif from '../../../assets/Gifs/LoadingGif.gif';
import { showToastAlert } from '../../../utils/SweetAlert';
import { checkAccess } from '../../../utils/Auth';

const SmallRadio = styled(Radio)`
  &.MuiRadio-root {
    transform: scale(0.8);
  }
`;

const ModuleAccess = ({ isEditAccess, isViewAccess }) => {
  //* Hooks declaraion
  const { t } = useTranslation();

  //* Selectors
  const {
    selectedFacility,
    selectedMenu,
    selectedModuleId,
    userDetails,
    isSuperAdmin,
  } = useSelector((state) => state.auth);

  //* State variables
  const [moduleAccessList, setModuleAccessList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  //* RTK Queries
  const [triggerUpdateModuleAccessList, { isLoading: submittingData }] =
    useUpdateModuleListMutation();

  //* Get All modules List
  const { data: allModuleList, refetch } = useGetAllModuleListQuery(
    {
      payload: {
        loginUserId: userDetails?.UserId,
        pageModuleId: selectedModuleId,
        pageMenuId: selectedMenu?.id,
      },
    },
    {
      skip: !userDetails?.UserId,
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    if (allModuleList?.Records) {
      setModuleAccessList([...allModuleList?.Records]);
    }
  }, [allModuleList]);

  //* Handle change for radio buttons
  const handleRadioChange = (row, value) => {
    const updatedList = moduleAccessList.map((x) => {
      if (row.ModuleId === x.ModuleId) {
        return {
          ...x,
          IsDeployed: value === 'yes',
        };
      }
      return x;
    });
    setModuleAccessList(updatedList);
  };

  //* Submit Module Access
  const submitModuleAccess = async () => {
    try {
      const modifiedList = moduleAccessList.map((x) => {
        return {
          loginUserId: userDetails?.UserId,
          isDeployed: x.IsDeployed,
          pageModuleId: selectedModuleId,
          pageMenuId: selectedMenu?.id,
          moduleId: x.ModuleId,
          facilityId: selectedFacility?.id,
        };
      });

      let response = await triggerUpdateModuleAccessList({
        payload: modifiedList,
      }).unwrap();
      refetch();
      if (response && response.Message === 'Record Updated Successfully') {
        showToastAlert({
          type: 'custom_success',
          text: 'Module Access Updated Successfully',
          gif: 'SuccessGif'
        });
      }

      setIsEdit(false);
    } catch (error) {
      console.error('Failed to update module access', error);
    }
  };

  //* Cancel module access section data
  const handleOnCancel = () => {
    setIsEdit(false);
    setModuleAccessList(allModuleList?.Records);
  };
  return (
    <Accordion
      sx={{ border: '5px', borderColor: '#0083c0', marginBlockEnd: '20px' }}
    >
      <AccordionSummary
        expandIcon={<StyledImage src={ExpandIcon} alt="Expand Icon" />}
        aria-controls="panel1-content"
        id="panel1-header"
        sx={{
          backgroundColor: '#0083c0',
          borderRadius: '8px 8px 0px 0px',
          width: '100%',
          border: '1px solid #0083c0',
        }}
      >
        <StyledTypography
          fontSize="16px"
          fontWeight="700"
          lineHeight="20px"
          textAlign="center"
          color="#FFFFFF"
        >
          {t('ModuleAccess')}
        </StyledTypography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          width: '100%',
          height: '100%',
          padding: '0px 0px 20px 0px',
          border: '1px solid #0083c0',
          padding: '20px',
        }}
      >
        <FlexContainer
          flexDirection="column"
          width="100%"
          justifyContent="center"
          alignItems="center"
          style={{
            height: submittingData ? '40vh' : 'auto',
          }}
        >
          {submittingData ? (
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
              <TableContainer
                component={FlexContainer}
                style={{ border: '1px solid #99cde6' }}
              >
                <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
                  <StyledTableHead backgroundColor="#DEF5FF" borderLeft="none">
                    <TableRow>
                      <StyledTableHeaderCell color="#000000A6">
                        {t('MODULENAME')}
                      </StyledTableHeaderCell>
                      <StyledTableHeaderCell color="#000000A6">
                        {t('ACCESSRIGHTS')}
                      </StyledTableHeaderCell>
                    </TableRow>
                  </StyledTableHead>

                  {moduleAccessList?.length > 0 ? (
                    <TableBody>
                      {moduleAccessList.map((row, rowIndex) => (
                        <StyledTableRow key={rowIndex}>
                          <StyledTableBodyCell style={{ padding: '5px 15px' }}>
                            {row?.DisplayName}
                          </StyledTableBodyCell>
                          <StyledTableBodyCell
                            marginRight="4px"
                            style={{ padding: '5px 10px' }}
                          >
                            {row?.ModuleId === 1 && (
                              <RadioGroup
                                row
                                value={row.IsDeployed ? 'yes' : 'no'}
                                onChange={(e) =>
                                  handleRadioChange(row, e.target.value)
                                }
                                style={{ flexWrap: 'nowrap' }}
                              >
                                <FlexContainer alignItems="center">
                                  <SmallRadio
                                    size="medium"
                                    color="primary"
                                    value="yes"
                                    disabled={true}
                                  />
                                  <Typography fontSize="12px">
                                    {t('Yes')}
                                  </Typography>
                                </FlexContainer>
                                <FlexContainer alignItems="center">
                                  <SmallRadio
                                    size="medium"
                                    color="primary"
                                    value="no"
                                    disabled={true}
                                  />
                                  <Typography fontSize="12px">
                                    {t('No')}
                                  </Typography>
                                </FlexContainer>
                              </RadioGroup>
                            )}
                            {row?.ModuleId !== 1 && (
                              <RadioGroup
                                row
                                value={row.IsDeployed ? 'yes' : 'no'}
                                onChange={(e) =>
                                  handleRadioChange(row, e.target.value)
                                }
                                style={{ flexWrap: 'nowrap' }}
                              >
                                <FlexContainer alignItems="center">
                                  <SmallRadio
                                    size="medium"
                                    color="primary"
                                    value="yes"
                                    disabled={!isEdit}
                                  />
                                  <Typography fontSize="12px">
                                    {t('Yes')}
                                  </Typography>
                                </FlexContainer>
                                <FlexContainer alignItems="center">
                                  <SmallRadio
                                    size="medium"
                                    color="primary"
                                    value="no"
                                    disabled={!isEdit}
                                  />
                                  <Typography fontSize="12px">
                                    {t('No')}
                                  </Typography>
                                </FlexContainer>
                              </RadioGroup>
                            )}
                          </StyledTableBodyCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  ) : (
                    <TableBody>
                      <StyledTableRow>
                        <StyledTableBodyCell
                          colSpan={2}
                          style={{ textAlign: 'center' }}
                        >
                          {t('NoDataAvailable')}
                        </StyledTableBodyCell>
                      </StyledTableRow>
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
              <Grid
                paddingBlockStart="10px"
                item
                xs={12}
                display="flex"
                justifyContent="flex-end"
                gap="10px"
                width="100%"
              >
                {!isEdit &&
                  moduleAccessList?.length > 0 &&
                  checkAccess(
                    isSuperAdmin,
                    isViewAccess,
                    isEditAccess || false
                  ) && (
                    <StyledButton
                      borderRadius="6px"
                      padding="6px 10px"
                      variant="contained"
                      color="primary"
                      type="submit"
                      sx={{ marginLeft: '10px' }}
                      style={{ display: 'inline-flex', gap: '5px' }}
                      onClick={() => setIsEdit(true)}
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
                      color="primary"
                      type="submit"
                      sx={{ marginLeft: '10px' }}
                      style={{ display: 'inline-flex', gap: '5px' }}
                      onClick={submitModuleAccess}
                      disabled={submittingData}
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
                      onClick={handleOnCancel}
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
              </Grid>
            </>
          )}
        </FlexContainer>
      </AccordionDetails>
    </Accordion>
  );
};

export default ModuleAccess;
