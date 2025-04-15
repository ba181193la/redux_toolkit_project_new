import { useTranslation } from 'react-i18next';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../utils/StyledComponents';
import DataTable from './DataTable';
import useWindowDimension from '../../../hooks/useWindowDimension';
import { useEffect, useState } from 'react';
import {
  Badge,
  Collapse,
  Divider,
  IconButton,
  TextField,
  Tooltip,
} from '@mui/material';
import { useGetAllIntegrationLogsQuery } from '../../../redux/RTK/integrationLogApi';
import FilterIcon from '../../../assets/Icons/FilterIcon.png';
import styled from 'styled-components';
import FilterCloseIcon from '../../../assets/Icons/FilterCloseIcon.png';
import FilterFormFields from './FilterFormFields';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { resetFilters } from '../../../redux/features/mainMaster/integrationLogSlice';
import LoadingGif from '../../../assets/Gifs/LoadingGif.gif';

const IntegrationLog = () => {
  const { i18n, t } = useTranslation();
  const { isMobile, isTablet } = useWindowDimension();
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [openFilter, setOpenFilter] = useState(false);
  const { filters, isFilterApplied } = useSelector(
    (state) => state.integrationLog
  );
  const { selectedMenu, userDetails, selectedFacility, selectedModuleId } =
    useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const BorderBox = styled.div`
    border: 1px solid #0083c0;
    padding: 6px 8px 8px 8px;
    border-radius: 4px;
  `;
  const StyledCollapse = styled(Collapse)`
    padding: ${(props) => (props.openFilter ? '0 0 20px 0' : '0')};
  `;

  const {
    data: getallIntegrationLog = [],
    isFetching: isFetchingIntegrationLogData,
  } = useGetAllIntegrationLogsQuery(
    {
      payload: {
        pageIndex: 1,
        pageSize: 25,
        logDate: filters?.logDate || '',
        headerFacility: selectedFacility?.id || 2,
        loginUserId: userDetails?.UserId || 1,
        moduleId: selectedModuleId || 1,
        menuId: selectedMenu?.id || 37,
      },
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const {
    totalRecords: TotalRecords,
    records: Records,
    totalPages: TotalPages,
  } = getallIntegrationLog || {
    TotalRecords: 0,
    Records: [],
  };

  useEffect(() => {
    setFilteredRecords([...(Records || [])]);
  }, [Records]);

  const handleToggleFilter = () => {
    setOpenFilter(!openFilter);
  };

  return (
    <FlexContainer
      width="100%"
      height="100%"
      flexDirection="column"
      justifyContent="space-between"
    >
      <FlexContainer
        justifyContent={'space-between'}
        style={{ paddingBottom: '15px' }}
      >
        <StyledTypography
          fontSize="36px"
          fontWeight="900"
          lineHeight="44px"
          color="#0083C0"
          whiteSpace={'nowrap'}
        >
          {t('MM_IntegrationLog')}
        </StyledTypography>
      </FlexContainer>
      <FlexContainer width="100%" height="auto" flex="1" flexDirection="column">
        <FlexContainer
          height="100%"
          width="100%"
          padding="15px 15px 0"
          borderRadius="8px"
          flexDirection="column"
          backgroundColor="#fff"
          boxShadow="0px 4px 4px 0px #00000029"
        >
          <FlexContainer flexDirection="column">
            {isFetchingIntegrationLogData ? (
              <FlexContainer justifyContent="center">
                <StyledImage src={LoadingGif} alt="LoadingGif" />
              </FlexContainer>
            ) : (
              <>
                <FlexContainer
                  style={{ justifyContent: 'space-between' }}
                  flexDirection={isMobile || isTablet ? 'column' : 'row'}
                >
                  <FlexContainer
                    gap="10px"
                    alignItems="center"
                    margin="0 0 16px 0"
                    flexWrap={isMobile || isTablet ? 'wrap' : ''}
                    justifyContent={
                      isMobile || isTablet ? 'center' : 'flex-end'
                    }
                    style={{ width: '100%', display: 'flex' }}
                  >
                    <StyledButton
                      fontSize="12px"
                      backgroundColor="#fff"
                      colour="#000"
                      onClick={() => dispatch(resetFilters())}
                    >
                      {t('ClearAll')}
                    </StyledButton>
                    <Badge
                      color="primary"
                      overlap="circular"
                      variant="dot"
                      invisible={!isFilterApplied}
                    >
                      <Tooltip title="Filter" arrow>
                        <StyledImage
                          height={isMobile || isTablet ? '30px' : '40px'}
                          width={isMobile || isTablet ? '30px' : '40px'}
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
                          {t('SelectFilter')}
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
                          <Tooltip title="Filter" arrow>
                            <StyledImage
                              src={FilterCloseIcon}
                              alt="Filter Close Icon"
                            />
                          </Tooltip>
                        </IconButton>
                      </FlexContainer>
                      <Divider
                        sx={{
                          marginY: '15px',
                          borderColor: '#0083C0',
                          width: 'calc(100% - 10px)',
                        }}
                      />
                      <FilterFormFields
                        handleToggleFilter={handleToggleFilter}
                      />
                    </FlexContainer>
                  </BorderBox>
                </StyledCollapse>
                <DataTable
                  integrationLogData={filteredRecords}
                  totalRecords={TotalRecords}
                />
              </>
            )}
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default IntegrationLog;
