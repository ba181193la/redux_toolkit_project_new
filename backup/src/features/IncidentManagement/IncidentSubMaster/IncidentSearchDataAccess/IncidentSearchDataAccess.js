import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  InputAdornment,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DoneIcon from '../../../../assets/Icons/DoneIcon.png';
import SearchIcon from '../../../../assets/Icons/Search.png';
import DndIcon from '../../../../assets/Icons/DoNotDisturbIcon.png';
import EditIcon from '../../../../assets/Icons/EditIconWhite.png';
import LoadingGif from '../../../../assets/Gifs/LoadingGif.gif';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
} from '../../../../utils/StyledComponents';
import ExpandIcon from '../../../../assets/Icons/ExpandIcon.png';
import { getlabel } from '../../../../utils/language';
import {
  StyledTableBodyCell,
  StyledTableHead,
  StyledTableHeaderCell,
  StyledTableRow,
} from '../../../../utils/DataTable.styled';
import styled from 'styled-components';
import { checkAccess } from '../../../../utils/Auth';
import StaffDetailListModel from './StaffDetailListModel';
import {
  useGetPageLoadDataQuery,
  useUpdateSearchDataAccessMutation,
} from '../../../../redux/RTK/IncidentManagement/incidentSubMasterApi';
import { showToastAlert } from '../../../../utils/SweetAlert';

const SmallRadio = styled(Radio)`
  &.MuiRadio-root {
    transform: scale(0.8);
  }
`;

const IncidentSearchDataAccess = ({ labels, fieldAccess, expandAll }) => {
  //* Hooks declaration
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //* Selectors
  const {
    selectedRoleFacility,
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
    isSuperAdmin,
  } = useSelector((state) => state.auth);

  //* State variables
  const [isEdit, setIsEdit] = useState(false);
  const [roleMenu, setRoleMenu] = useState();
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [listStaffList, setListStaffList] = useState('');
  const [detailStaffList, setDetailStaffList] = useState('');
  const [fieldLabels, setFieldLabels] = useState([]);
  const [staffColumn, setStaffColumn] = useState('list');
  const [staffFacilityId, setStaffFacilityId] = useState(2);
  const [dataAccessList, setDataAccessList] = useState([]);
  const [expand, setExpand] = useState(expandAll);

  //* RTK Queries

  const {
    data: pageLoadData,
    isFetching,
    refetch,
  } = useGetPageLoadDataQuery({
    menuId: selectedMenu?.id,
    loginUserId: userDetails?.UserId,
    headerFacilityId: selectedFacility?.id,
  });

  const [triggerSubmit, { isLoading: submitting }] =
    useUpdateSearchDataAccessMutation();

  //* Filtering fields access data
  const pageFields = fieldAccess?.Data?.Menus?.find(
    (section) => section?.MenuId === selectedMenu?.id
  )
    ?.Sections?.find(
      (sectionName) =>
        sectionName?.SectionName === 'Incident Search Data Access-Page'
    )
    ?.Regions?.find((region) => region?.RegionCode === 'ALL')?.Fields;

  //* Variables declaration
  const tableColumnList = [
    {
      id: 'role',
      translationId: 'IM_IS_ISDA_Role',
      isShow: pageFields?.find((x) => x.FieldId === 'IS_ISDA_P_Role')?.IsShow,
    },
    {
      id: 'listing',
      translationId: 'IM_IS_ISDA_Listing',
      isShow: pageFields?.find((x) => x.FieldId === 'IS_ISDA_P_Listing')
        ?.IsShow,
    },
    {
      id: 'detail',
      translationId: 'IM_IS_ISDA_Detail',
      isShow: pageFields?.find((x) => x.FieldId === 'IS_ISDA_P_Detail')?.IsShow,
    },
  ];

  useEffect(() => {
    if (pageLoadData?.Data) {
      const transformedData =
        pageLoadData?.Data?.IncidentSearchDataAccess?.IncidentSearchDataAccess?.map(
          (priority) => {
            if (priority?.UserAccessType === 'Staff') {
              setListStaffList(priority?.ListingRights);
              setDetailStaffList(priority?.DetailRights);
              return {
                id: priority?.IncidentSearchDataId,
                role: priority?.UserAccessType,
                listing: priority?.ListingRights,
                detail: priority?.DetailRights,
                designation: priority?.DesignationId,
                userId: priority?.UserId,
              };
            } else {
              return {
                id: priority?.IncidentSearchDataId,
                role: priority?.UserAccessType,
                listing: priority?.ListingRights,
                detail: priority?.DetailRights,
                designation: priority?.DesignationId,
                userId: priority?.UserId,
              };
            }
          }
        );
      setDataAccessList(transformedData);
    }
  }, [pageLoadData]);

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

  const handleRadioChange = (row, field, value) => {
    const updatedData = [...dataAccessList];
    const rowIndex = updatedData.findIndex((r) => r.role === row.role);
    if (rowIndex !== -1) {
      updatedData[rowIndex][field] = value === 'True' ? 'True' : 'False';
      setDataAccessList(updatedData);
    }
  };

  //* Cancel module access section data
  const handleOnCancel = () => {
    setIsEdit(false);
    setDataAccessList(dataAccessList);
  };

  //* Submit data access
  const submitDataAccess = async () => {
    let response;
    try {
      const combinedData = dataAccessList.map((data) => ({
        incidentSearchDataId: parseInt(data?.id),
        userAccessType: data?.role,
        designationId: data?.designation,
        userId: data?.userId,
        detailRights: data?.role !== 'Staff' ? data?.detail : detailStaffList,
        listingRights: data?.role !== 'Staff' ? data?.listing : listStaffList,
        menuId: data?.menuId,
        loginUserId: userDetails?.UserId,
        moduleId: 2,
        // moduleId: selectedModuleId,
        menuId: selectedMenu?.id,
      }));
      response = await triggerSubmit({
        payload: combinedData,
      });
      if (
        response &&
        response?.data?.Message === 'Record Updated Successfully'
      ) {
        showToastAlert({
          type: 'custom_success',
          text: response?.data?.Message,
          gif: 'SuccessGif',
        });
      }
      refetch();
      setIsEdit(false);
    } catch (error) {
      console.error('Failed to update Incident Search Data Access', error);
    }
  };

  return (
    <Accordion sx={{ border: '5px', borderColor: '#0083c0' }} expanded={expand}>
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
            'IM_IS_ISDA_IncidentSearchDataAccess',
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
          height: '100%',
          padding: '0px',
          border: '1px solid #0083c0',
        }}
      >
        {submitting || isFetching ? (
          <FlexContainer
            justifyContent="center"
            alignItems="center"
            height="50vh"
            width="100%"
            position="relative"
            style={{ top: '0', left: '0' }}
          >
            <StyledImage src={LoadingGif} alt="LoadingGif" />
          </FlexContainer>
        ) : (
          <FlexContainer flexDirection="column" width="100%" padding="10px">
            <TableContainer
              component={FlexContainer}
              style={{ border: '1px solid #99cde6' }}
            >
              <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
                <StyledTableHead backgroundColor="#0083c0" borderLeft="#0083c0">
                  <TableRow>
                    <StyledTableHeaderCell>{t('SNo')}</StyledTableHeaderCell>
                    {tableColumnList
                      ?.filter((x) => x.isShow)
                      ?.map((column) => (
                        <StyledTableHeaderCell key={column.id}>
                          {getlabel(
                            column.translationId,
                            {
                              Data: fieldLabels,
                              Status: labels?.Status,
                            },
                            i18n.language
                          )}
                        </StyledTableHeaderCell>
                      ))}
                  </TableRow>
                </StyledTableHead>

                {dataAccessList?.length > 0 ? (
                  <TableBody>
                    {dataAccessList?.map((row, rowIndex) => {
                      if (row?.role !== 'Staff') {
                        return (
                          <StyledTableRow key={rowIndex} borderColor="#0083c0">
                            <StyledTableBodyCell>
                              {rowIndex + 1}
                            </StyledTableBodyCell>
                            {tableColumnList
                              ?.filter((column) => column.isShow)
                              ?.map((column) => {
                                const value = row[column?.id];

                                if (
                                  column.id === 'listing' ||
                                  column.id === 'detail'
                                ) {
                                  return (
                                    <StyledTableBodyCell key={column.id}>
                                      <RadioGroup
                                        row
                                        value={
                                          value === 'True' ? 'True' : 'False'
                                        }
                                        onChange={(e) =>
                                          handleRadioChange(
                                            row,
                                            column.id,
                                            e.target.value
                                          )
                                        }
                                        style={{ flexWrap: 'nowrap' }}
                                      >
                                        <FlexContainer alignItems="center">
                                          <SmallRadio
                                            size="medium"
                                            color="primary"
                                            value="True"
                                            disabled={!isEdit}
                                            style={{
                                              padding: '5px',
                                            }}
                                          />
                                          <Typography fontSize="12px">
                                            {t('Yes')}
                                          </Typography>
                                        </FlexContainer>
                                        <FlexContainer alignItems="center">
                                          <SmallRadio
                                            size="medium"
                                            color="primary"
                                            value="False"
                                            disabled={!isEdit}
                                            style={{
                                              padding: '5px',
                                            }}
                                          />
                                          <Typography fontSize="12px">
                                            {t('No')}
                                          </Typography>
                                        </FlexContainer>
                                      </RadioGroup>
                                    </StyledTableBodyCell>
                                  );
                                }

                                return (
                                  <StyledTableBodyCell key={column.id}>
                                    {row[column.id]}
                                  </StyledTableBodyCell>
                                );
                              })}
                          </StyledTableRow>
                        );
                      }
                      return null; // Return null to prevent rendering when role is 'Staff'
                    })}

                    <StyledTableRow borderColor="#0083c0">
                      <StyledTableBodyCell>
                        {dataAccessList?.length + 1}
                      </StyledTableBodyCell>
                      <StyledTableBodyCell>{t('Staff')}</StyledTableBodyCell>
                      <StyledTableBodyCell>
                        <TextField
                          variant="outlined"
                          disabled={true}
                          autoComplete="off"
                          fullWidth={false}
                          InputProps={{
                            sx: {
                              color: '#333333',
                              '&.Mui-disabled': {
                                color: '#000000',
                                opacity: 1,
                              },
                            },
                            endAdornment: (
                              <InputAdornment position="end">
                                <img
                                  src={SearchIcon}
                                  alt="Search Icon"
                                  height={'20px'}
                                  width={'20px'}
                                  style={{
                                    cursor: !isEdit ? 'now-allowed' : 'pointer',
                                    pointerEvents: !isEdit ? 'none' : '',
                                  }}
                                  onClick={() => {
                                    setShowStaffModal(true);
                                    setStaffColumn('list');
                                  }}
                                />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </StyledTableBodyCell>
                      <StyledTableBodyCell>
                        <TextField
                          variant="outlined"
                          disabled={true}
                          autoComplete="off"
                          fullWidth={false}
                          InputProps={{
                            sx: {
                              color: '#333333',
                              '&.Mui-disabled': {
                                color: '#000000',
                                opacity: 1,
                              },
                            },
                            endAdornment: (
                              <InputAdornment position="end">
                                <img
                                  src={SearchIcon}
                                  alt="Search Icon"
                                  height={'20px'}
                                  width={'20px'}
                                  style={{
                                    cursor: 'pointer',
                                    pointerEvents: !isEdit ? 'none' : '',
                                  }}
                                  onClick={() => {
                                    setShowStaffModal(true);
                                    setStaffColumn('detail');
                                  }}
                                />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </StyledTableBodyCell>
                    </StyledTableRow>
                  </TableBody>
                ) : (
                  <TableBody>
                    <StyledTableRow>
                      <StyledTableBodyCell
                        colSpan={
                          tableColumnList?.filter((x) => x.isShow).length + 1
                        }
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
                dataAccessList?.length > 0 &&
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
                    type="submit"
                    sx={{ marginLeft: '10px' }}
                    style={{ display: 'inline-flex', gap: '5px' }}
                    onClick={() => setIsEdit(true)}
                    disabled={submitting}
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
                    onClick={submitDataAccess}
                    disabled={submitting}
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
          </FlexContainer>
        )}
      </AccordionDetails>
      {showStaffModal && (
        <StaffDetailListModel
          showStaffModal={showStaffModal}
          setShowStaffModal={setShowStaffModal}
          selectedStaffList={
            staffColumn === 'list' ? listStaffList : detailStaffList
          }
          setSelectedStaffList={
            staffColumn === 'list' ? setListStaffList : setDetailStaffList
          }
          pageFields={pageFields}
          fieldLabels={fieldLabels}
          labelStatus={labels?.Status}
          facilityList={pageLoadData?.Data?.Facilitylist}
          staffFacilityId={staffFacilityId}
        />
      )}
    </Accordion>
  );
};

export default IncidentSearchDataAccess;
