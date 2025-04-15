import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledSearch,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Badge,
  Checkbox,
  Collapse,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
} from '@mui/material';
import Search from '../../../../assets/Icons/Search.png';
import FilterIcon from '../../../../assets/Icons/FilterIcon.png';
import FilterTable from '../../../../assets/Icons/FilterTable.png';
import DownloadFileIcon from '../../../../assets/Icons/DownloadFileIcon.png';
import FilterCloseIcon from '../../../../assets/Icons/FilterCloseIcon.png';
import UploadFileIcon from '../../../../assets/Icons/UploadFileIcon.png';
import PrintFileIcon from '../../../../assets/Icons/PrintFileIcon.png';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useGetPageLoadDataQuery } from '../../../../redux/RTK/staffMasterApi';

import useWindowDimension from '../../../../hooks/useWindowDimension';
import { media } from '../../../../utils/Breakpoints';
import CompletedIncidentTable from '../../IncidentApproval/CompletedList/CompletedIncidentTable';

const StyledCollapse = styled(Collapse)`
  padding: ${(props) => (props.openFilter ? '0 0 20px 0' : '0')};
`;

const StyledDivider = styled(Divider)`
  width: 0px !important;
  height: 30px !important;
  border-left: 1px solid #99cde6 !important;
  opacity: 1 !important;
`;

const BorderBox = styled.div`
  border: 1px solid #0083c0;
  padding: 6px 8px 8px 8px;
  border-radius: 4px;
`;

const StyledFlexContainer = styled(FlexContainer)`
  justify-content: space-between;
  flex-direction: column;
  ${media.screen.small`
    flex-direction: row;
    justify-content: space-between;
    `}
`;

const Completed = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const { isMobile } = useWindowDimension();
  const [searchQuery, setSearchQuery] = useState('');
  const [openFilter, setOpenFilter] = useState(false);
  const [columnEl, setColumnEl] = useState(null);

  //* Variables Declaration
  const [roleMenu, setRoleMenu] = useState();

  //* Get page load data
  const {
    selectedRoleFacility,
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
  } = useSelector((state) => state.auth);

  const { data: pageLoadData } = useGetPageLoadDataQuery({
    menuId: selectedMenu?.id,
    loginUserId: userDetails?.UserId,
    headerFacilityId: selectedFacility?.id,
  });

  const handleToggleFilter = () => {
    setOpenFilter(!openFilter);
  };

  useEffect(() => {
    const roleMenu = selectedRoleFacility?.Menu.find(
      (item) => item.MenuId === selectedMenu?.id
    );
    setRoleMenu(roleMenu);
  }, [selectedRoleFacility, selectedMenu]);

  return (
    <FlexContainer
      flexDirection="column"
      width="100%"
      height="100%"
      flexWrap="wrap"
      style={{
        padding: '10px',
        border: '1px solid #E0E0E0',
      }}
    >
      <StyledFlexContainer style={{ justifyContent: 'space-between' }}>
        <StyledSearch
          variant="outlined"
          placeholder="Search by keywords"
          value={searchQuery}
          fullWidth
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <img src={Search} alt="Search Icon" />
              </InputAdornment>
            ),
          }}
        />
        <FlexContainer
          gap="10px"
          alignItems="center"
          margin="0 0 16px 0"
          flexWrap={isMobile ? 'wrap' : ''}
          justifyContent={isMobile ? 'center' : ''}
        >
          <StyledButton fontSize="12px" backgroundColor="#fff" colour="#000">
            Clear All
          </StyledButton>
          <Badge color="primary" overlap="circular" variant="dot">
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
          </Badge>
          <StyledDivider />
          <StyledButton fontSize="12px" backgroundColor="#fff" colour="#000">
            Clear All
          </StyledButton>
          <StyledImage
            height="40px"
            width="40px"
            gap="10px"
            cursor="pointer"
            borderRadius="40px"
            src={FilterTable}
            alt="Toggle Columns"
            animate={true}
          />
          <Menu
            anchorEl={columnEl}
            open={Boolean(columnEl)}
            onClose={() => setColumnEl(null)}
            sx={{
              '& .MuiPaper-root': {
                width: 'auto',
                height: '400px',
              },
            }}
          >
            <MenuItem>
              <FormControlLabel
                control={<Checkbox style={{ padding: '2px 5px 2px 2px' }} />}
              />
            </MenuItem>
          </Menu>
          <StyledDivider />

          <>
            <StyledImage
              height="40px"
              width="40px"
              gap="10px"
              cursor="pointer"
              borderRadius="40px"
              src={DownloadFileIcon}
              alt="Download"
              animate={true}
            />
            <StyledImage
              height="40px"
              width="40px"
              gap="10px"
              cursor="pointer"
              borderRadius="40px"
              src={UploadFileIcon}
              alt="Upload"
              animate={true}
            />
            <StyledImage
              height="40px"
              width="40px"
              gap="10px"
              cursor="pointer"
              borderRadius="40px"
              src={PrintFileIcon}
              alt="Print"
              animate={true}
            />
          </>
        </FlexContainer>
      </StyledFlexContainer>

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
          </FlexContainer>
        </BorderBox>
      </StyledCollapse>

      <CompletedIncidentTable />
    </FlexContainer>
  );
};

export default Completed;
