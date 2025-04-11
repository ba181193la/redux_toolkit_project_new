import React, { useState } from 'react';
import DraftedData from './ClosureDraftedData';
import DataTableRejected from './DataTableDrafted';
import FilterFormDrafted from './FilterFormDrafted';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledSearch,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import FilterIcon from '../../../../assets/Icons/FilterIcon.png';
import { Collapse, Divider, IconButton, Badge, Tooltip } from '@mui/material';
import styled from 'styled-components';
import FilterCloseIcon from '../../../../assets/Icons/FilterCloseIcon.png';
import DataTableDrafted from './DataTableDrafted';

const IC_DraftedPage = () => {
  const [seletedDraftedColumns, setSeletedDraftedColumns] =
    useState(DraftedData);
  const [openFilter, setOpenFilter] = useState(false);
  const handleToggleFilter = () => {
    setOpenFilter(!openFilter);
  };
  const StyledCollapse = styled(Collapse)`
    padding: ${(props) => (props.openFilter ? '0 0 20px 0' : '0')};
  `;
  const BorderBox = styled.div`
    border: 1px solid #0083c0;
    padding: 6px 8px 8px 8px;
    border-radius: 4px;
  `;

  const columns = [
    { id: 'S.No', label: 'S.No' },
    { id: 'Incident Date', label: 'Incident Date' },
    { id: 'Reported Date', label: 'Reported Date' },
    { id: 'Reported By', label: 'Reported By' },
    { id: 'Incident Number', label: 'Incident Number' },
    { id: 'Incident Details', label: 'Incident Details' },
    { id: 'Incident Type', label: 'Incident Type' },
    { id: 'Department/Unit', label: 'Department/Unit' },
    { id: 'Contributing Department', label: 'Contributing Department' },
    { id: 'Incident Level', label: 'Incident Level' },
    { id: 'Root Causes', label: 'Root Causes' },
    { id: 'RCA Status', label: 'RCA Status' },
    { id: 'Harm Level', label: 'Harm Level' },
    { id: 'Incident Status', label: 'Incident Status' },
    { id: 'Action', label: 'Action' },
  ];

  return (
    <>
      <FlexContainer
        gap="10px"
        alignItems="center"
        margin="0 0 16px 0"
        justifyContent="right"
        padding="10px 20px 0 0"
      >
        <StyledButton
          fontSize="12px"
          backgroundColor="#fff"
          colour="#000"
          //onClick={() => dispatch(resetFilters())}
        >
          Clear All
        </StyledButton>
        <Badge
          color="primary"
          overlap="circular"
          variant="dot"
          //invisible={!isFilterApplied}
        >
          <Tooltip title="Filter" arrow>
          <StyledImage
            height="40px"
            width="40px"
            gap="10px"
            borderRadius="40px"
            cursor="pointer"
            src={FilterIcon}
            alt="Filter"
            onClick={handleToggleFilter}
            animate={true}
          />
          </Tooltip>
        </Badge>
      </FlexContainer>
      <StyledCollapse in={openFilter} openFilter={openFilter}>
        <BorderBox>
          <FlexContainer flexDirection="column" padding="0 8px">
            <FlexContainer
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <StyledTypography
                fontSize={'18px'}
                color="#205475"
                padding="2px 0 2px 0"
                fontWeight="700"
                lineHeight="21.6px"
              >
                Select Filter
              </StyledTypography>
              <IconButton
                onClick={handleToggleFilter}
                sx={{
                  color: '#205475',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    transition: 'transform 0.3s ease',
                    backgroundColor: 'rgba(15, 108, 189, 0.2)',
                  },
                }}
              >
                <StyledImage src={FilterCloseIcon} alt="Filter Close Icon" />
              </IconButton>
            </FlexContainer>
            <Divider
              sx={{
                marginY: '15px',
                borderColor: '#0083C0',
                width: 'calc(100% - 10px)',
              }}
            />
            <FilterFormDrafted
              handleToggleFilter={handleToggleFilter}
              //fields={fields}
              //labels={labels}
            />
          </FlexContainer>
        </BorderBox>
      </StyledCollapse>
      <DataTableDrafted columns={columns} rows={seletedDraftedColumns} />
    </>
  );
};

export default IC_DraftedPage;
