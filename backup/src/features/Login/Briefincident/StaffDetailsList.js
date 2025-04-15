import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
} from '@mui/material';
import React, { useState } from 'react';
import {
  FlexContainer,
  StyledImage,
  StyledSearch,
  StyledTypography,
} from '../../../utils/StyledComponents';
import CloseIcon from '../../../assets/Icons/CloseIcon.png';
import BriefIncident_StaffDetailTable from './BI_StaffDetailTable';
import SearchIcon from '../../../assets/Icons/Search.png';
import { useGetBriefPageLoadDataQuery } from '../../../redux/RTK/loginApi';
import useWindowDimension from '../../../hooks/useWindowDimension';
import SearchDropdown from '../../../components/SearchDropdown/SearchDropdown';
import { useGetAllFacilitiesQuery } from '../../../redux/RTK/userAssignmentApi';
import { useEffect } from 'react';

const StaffDetailsList = ({ selectedIndex, setSelectedIndex, facilityColumn, setFacilityColumn }) => {
  const [selectedFacility, setSelectedFacility] = useState('');

  const { isMobile } = useWindowDimension();

  const { data: pageLoadData  } = useGetBriefPageLoadDataQuery();
  const { Data: {FacilityList}=[] } = pageLoadData || {};
  // const { data: allFacilities = [] } = useGetAllFacilitiesQuery({
  //       payload: {
  //         pageIndex: 1,
  //         pageSize: 50,
  //         headerFacility: 2,
  //         loginUserId: 1,
  //         moduleId: 1,
  //         menuId: 3,
  //       },
  //     });

  const handleOnCancel = () => {
    setSelectedIndex(null);
    setSelectedFacility('');
  };
 
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
  value={
    Array.isArray(FacilityList)
      ? FacilityList?.find((option) => option?.value === selectedFacility) || null
      : null
  }
  options={
    Array.isArray(FacilityList)
      ? FacilityList?.map((facility) => ({
          text: facility?.FacilityName,
          value: facility?.FacilityId,
        }))
      : []
  }
  onChange={(e, value) => {
    setSelectedFacility(value?.value); // Set the selected facility ID
    setFacilityColumn(value?.text); // Set another state (e.g., facility name)
  }}
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
        <BriefIncident_StaffDetailTable
          selectedFacility={selectedFacility}
          facilityColumn={facilityColumn}
          selectedIndex={selectedIndex}
          handleOnCancel={handleOnCancel}
        />
      </DialogContent>
    </Dialog>
  );
};

export default StaffDetailsList;
