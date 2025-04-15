  import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  FlexContainer,
  StyledImage,
  StyledSearch,
  StyledTypography,
} from '../../../../../utils/StyledComponents';
import CloseIcon from '../../../../../assets/Icons/CloseIcon.png';
import SearchIcon from '../../../../../assets/Icons/Search.png';
import { useGetBriefPageLoadDataQuery } from '../../../../../redux/RTK/loginApi';
import useWindowDimension from '../../../../../hooks/useWindowDimension';
import SearchDropdown from '../../../../../components/SearchDropdown/SearchDropdown';
import {
  useGetAllFacilitiesQuery,
  useGetStaffUserDetailsQuery,
} from '../../../../../redux/RTK/userAssignmentApi';
import { useSelector } from 'react-redux';
import WitnessByStaffTable from './WitnessByStaffTable';
import LoadingGif from '../../../../../assets/Gifs/LoadingGif.gif';

const WitnessedByStaffModal = ({
  selectedIndex,
  setSelectedIndex,
  handleSelectRow,
}) => {
  const [selectedFacility, setSelectedFacility] = useState('');
  const [filteredRecords, setFilteredRecords] = useState([]);
  const { selectedMenu, userDetails } = useSelector((state) => state.auth);
  const { filters } = useSelector((state) => state.userStaff);

  const { isMobile } = useWindowDimension();

  // const { data: pageLoadData } = useGetBriefPageLoadDataQuery();
  const { data: allFacilities = [] } = useGetAllFacilitiesQuery({
    payload: {
      pageIndex: 1,
      pageSize: 100,
      headerFacility: 2,
      loginUserId: 1,
      moduleId: 1,
      menuId: 3,
    },
  });

  const handleFacilityChange = (facilityId) => {
    setSelectedFacility(facilityId);
  };
  const {
    data: getStaffData = [],
    refetch,
    isFetching: isStaffFetching,
  } = useGetStaffUserDetailsQuery(
    {
      payload: {
        ...filters,
        pageIndex: filters?.pageIndex + 1,
        headerFacility: selectedFacility,
        loginUserId: userDetails?.UserId,
        moduleId: 1,
        menuId: 10,
      },
    },
    {
      skip: selectedFacility === '',
    }
  );

  useEffect(() => {
    setFilteredRecords([...(activeRecords || [])]);
  }, [activeRecords]);

  const { totalRecords, records } = getStaffData || {
    totalRecords: 0,
    records: [],
  };

  const activeRecords = records?.filter((record) => record.Status === 'Active');

  useEffect(() => {
    setFilteredRecords([...(activeRecords || [])]);
  }, [records]);
  // const { facilityList } = pageLoadData || {};

  const handleOnCancel = () => {
    setSelectedIndex(null);
    setSelectedFacility('');
  };

  const columns = [
    {
      id: 'StaffName',
      translationId: 'MM_SM_StaffName',
    },
    {
      id: 'EmployeeId',
      translationId: 'MM_SM_EmployeeID',
    },
    {
      id: 'PrimaryDesignation',
      translationId: 'MM_SM_Designation',
    },
    {
      id: 'Department',
      translationId: 'MM_SM_Department',
    },
    {
      id: 'Status',
      translationId: 'MM_SM_Status',
    },
  ];

  return (
    <Dialog
      open={selectedIndex !== null}
      fullWidth={true}
      PaperProps={{
        style: {
          width: '70%',
          maxWidth: 'none',
        },
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
          Staff Detail List
        </StyledTypography>
        <IconButton
          onClick={handleOnCancel}
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
        <FlexContainer
          flexDirection={isMobile ? 'column' : 'row'}
          justifyContent="space-between"
        >
          <FlexContainer
            flexDirection="column"
            justifyContent="center"
            width="250px"
          >
            <SearchDropdown
              name="facility"
              // value={
              //   allFacilities?.find(
              //     (option) => option?.value === selectedFacility
              //   ) || null
              // }
              options={
                Array.isArray(allFacilities?.Records)
                  ? allFacilities.Records.map((facility) => ({
                      text: facility?.FacilityDetail,
                      value: facility?.FacilityId,
                    }))
                  : []
              }
              // onChange={(e, value) => setSelectedFacility(value.value)}
              onChange={(event, selectedValue) =>
                handleFacilityChange(selectedValue ? selectedValue.value : null)
              }
            />
          </FlexContainer>
          <StyledSearch
            variant="outlined"
            width="250px"
            placeholder="Search By Keywords"
            fullWidth={false}
            margin="normal"
            autoComplete="off"
            InputProps={{
              startAdornment: (
                <InputAdornment
                  position="start"
                  style={{ paddingInlineStart: '10px' }}
                >
                  <StyledImage src={SearchIcon} alt="Search Icon" />
                </InputAdornment>
              ),
            }}
          />
        </FlexContainer>
        {isStaffFetching ? (
          <FlexContainer justifyContent="center">
            <StyledImage src={LoadingGif} alt="LoadingGif" />
          </FlexContainer>
        ) : (
          <WitnessByStaffTable
            columns={columns}
            selectedFacility={selectedFacility}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            handleOnCancel={handleOnCancel}
            handleSelectRow={handleSelectRow}
            data={filteredRecords}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WitnessedByStaffModal;
