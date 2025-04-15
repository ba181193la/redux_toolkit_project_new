import React, { useEffect, useState,useCallback,useMemo } from 'react';
import { Divider, InputAdornment, Tooltip } from '@mui/material';
import debounce from 'lodash/debounce';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledSearch,
  StyledTypography,
  SuccessMessage,
} from '../../../utils/StyledComponents';
import AddSubMaster from '../../../assets/Icons/AddSubMaster.png';
import SearchIcon from '../../../assets/Icons/Search.png';
import DataTable from './DataTable';
import MapApplicationRole from './MapApplicationRole';
import {
  useDownloadApplicationRoleDataMutation,
  useGetApplicationRoleDetailsQuery,
  useLazyGetApplicationRolesSearchQuery
} from '../../../redux/RTK/applicationRoleApi';
import { useSelector,useDispatch } from 'react-redux';
import { useGetLabelsQuery } from '../../../redux/RTK/moduleDataApi';
import formatDate from '../../../utils/FormatDate';
import useWindowDimension from '../../../hooks/useWindowDimension';
import LoadingGif from '../../../assets/Gifs/LoadingGif.gif';
import styled from 'styled-components';
import PrintFileIcon from '../../../assets/Icons/PrintFileIcon.png';
import { saveAs } from 'file-saver';
import { setPageIndex, setPageSize } from '../../../redux/features/mainMaster/applicationRoleSlice';

export const StyledDivider = styled(Divider)`
  width: 0px !important;
  height: 30px !important;
  border-left: 1px solid #99cde6 !important;
  opacity: 1 !important;
`;

const columns = [
  { id: 'ApplicationRole', translationId: 'MM_AR_ApplicationRole' },
  { id: 'Modifiedby', translationId: 'MM_AR_AddedEditedBy' },
  { id: 'ModifiedDate', translationId: 'MM_AR_AddedEditedDate' },
];

const ApplicationRole = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch=useDispatch()
  const [triggerGetApplicationRolesSearchQuery] = useLazyGetApplicationRolesSearchQuery();

  const [roleMenu, setRoleMenu] = useState();
  const [open, setOpen] = useState(false);
  const [roleSearchKeyword, setRoleSearchKeyword] = useState('');
  const [filteredRecords, setFilteredRecords] = useState([]);
  const { isMobile, isTablet } = useWindowDimension();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [color, setColor] = useState('')
  const [isSearchApplied, setIsSearchApplied] = useState(false)
  const [isSearch, setIsSearch] = useState(false)
  const [TotalRecords, setTotalRecords] = useState(0)
  const [TotalPages, setTotalPages] = useState(0)

  const {
    selectedRoleFacility,
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
  } = useSelector((state) => state.auth);
  const { pageSize, pageIndex } = useSelector((state) => state.applicationRole);

  const { data: labels = [], isFetching: isFetchingLabels } = useGetLabelsQuery(
    {
      menuId: selectedMenu?.id,
      moduleId: selectedModuleId,
    }
  );

  const {
    data: getApplicationRoleData = [],
    refetch,
    isFetching: isFetchingApplicationRoleData,
  } = useGetApplicationRoleDetailsQuery(
    {
      payload: {
        pageIndex: pageIndex + 1,
        pageSize: pageSize,
        loginUserId: userDetails?.UserId,
        moduleId: selectedModuleId,
        menuId: selectedMenu?.id,
        roleId: 0,
      },
    },
    {
      skip:roleSearchKeyword!==""|| !selectedFacility?.id || !selectedModuleId || !selectedMenu?.id,
      // refetchOnMountOrArgChange: true
    }
  );

  

  useEffect(() => {
    if(!isSearchApplied){
      const { TotalRecords, Records, TotalPages } = getApplicationRoleData || {
        TotalRecords: 0,
        Records: [],
        TotalPages:0
      };  
      setTotalRecords(TotalRecords)
      setTotalPages(TotalPages)
      setFilteredRecords([...(Records || [])]);
    }
  }, [getApplicationRoleData,isSearchApplied]);

 

  const searchByKeyWords = useCallback(
    async (keyword) => {
      setIsSearch(true)
      try {
        if (keyword === "" && isSearchApplied) {
          setIsSearchApplied(false)
          refetch()
          return
        }        
        const response = await triggerGetApplicationRolesSearchQuery({
          pageIndex: pageIndex + 1,
          pageSize: pageSize,
          headerFacility: selectedFacility?.id,
          loginUserId: userDetails?.UserId,
          moduleId: selectedModuleId,
          menuId: selectedMenu?.id,
          keyword: keyword,
        }).unwrap();                
        if (response?.records.length > 0) {
          setIsSearch(false)
          setTotalRecords(response?.totalRecords)
          setFilteredRecords([...(response?.records || [])]);
        }else{
          setTotalRecords(0)
          setFilteredRecords([]);
        }
      } catch (err) {
        if (err.data) {
          setIsSearch(false)
          setTotalRecords(0)
          setFilteredRecords([]);
        }
      } finally {
        setIsSearch(false)
      }
    },
    [pageIndex, pageSize, selectedFacility, userDetails, selectedModuleId, selectedMenu, isSearchApplied]
  );

  // Memoize the debounced version of searchByKeyWords
  const debouncedSearch = useMemo(
    () =>
      debounce((keyword) => {
        searchByKeyWords(keyword); // Call the search function
      }, 800), // Debounce delay in ms
    [searchByKeyWords]
  );

  // Cleanup debouncedSearch on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel(); // Cancel pending debounced calls
    };
  }, [debouncedSearch]);

  useEffect(() => {
    //when filters change with searchKeyword
    if (roleSearchKeyword) {
      debouncedSearch(roleSearchKeyword)
    }
  }, [pageIndex, pageSize])

  useEffect(() => {
    // when clear userroleSearchKeyword then  call refetch
    if (!roleSearchKeyword && isSearchApplied) {
      debouncedSearch(roleSearchKeyword)
    }
  }, [roleSearchKeyword,isSearchApplied])


  useEffect(() => {
    const roleMenu = selectedRoleFacility?.Menu.find(
      (item) => item.MenuId === selectedMenu?.id
    );
    setRoleMenu(roleMenu);
  }, [selectedRoleFacility, selectedMenu]);

  const handleMapApplicationRole = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (selectedFacility?.id) refetch();
  }, [selectedFacility?.id]); 

  const [triggerDownloadData] = useDownloadApplicationRoleDataMutation();

  const handleOnDownload = async (fileType) => {
    try {
      setColor('#4caf50')
      setIsLoading(true);
      setMessage('Downloading...')
      const blob = await triggerDownloadData({
        downloadType: fileType,
        payload: {
          pageIndex: pageIndex,
          pageSize: pageSize,
          headerFacility: selectedFacility?.id,
          loginUserId: userDetails?.UserId,
          moduleId: selectedModuleId,
          menuId: selectedMenu?.id,
        },
      }).unwrap();
      saveAs(blob, 'ApplicationRole.pdf');
      setMessage('Download completed');
      setTimeout(() => {setIsLoading(false)}, 2000);
    } catch (error) {
      setColor('#e63a2e')
      setMessage('Download failed');
      setTimeout(() => {setIsLoading(false)}, 2000);
    }
  };

  return (
    <FlexContainer
      width={isMobile || isTablet ? '250px' : '100%'}
      height={isMobile || isTablet ? '250px' : '100%'}
      flexDirection="column"
      padding={isMobile || isTablet ? '15px' : '0'}
    >
      <FlexContainer padding="0 0 15px 0">
        <StyledTypography
          fontSize={isMobile || isTablet ? '24px' : '36px'}
          fontWeight="900"
          lineHeight={isMobile || isTablet ? '32px' : '44px'}
          color="#0083C0"
          whiteSpace={'nowrap'}
        >
          {t('MM_ApplicationRoles')}
        </StyledTypography>
      </FlexContainer>

      <FlexContainer
        height={isMobile || isTablet ? '800px' : '100%'}
        width={isMobile || isTablet ? '250px' : '100%'}
        padding="15px 25px 25px 25px"
        borderRadius="8px"
        flexDirection="column"
        backgroundColor="#fff"
      >
        {/* Search and Buttons in a horizontal line */}
        <FlexContainer
          gap="10px"
          justifyContent="space-between"
          alignItems="center"
          flexDirection={isMobile || isTablet ? 'column' : 'row'}
        >
          {/* Search Input */}
          <StyledSearch
            variant="outlined"
            placeholder={t('SearchByKeywords')}
            value={roleSearchKeyword}
            onChange={(event) => {
              const searchTerm = event.target.value?.toLowerCase();
              dispatch (setPageIndex(0))
              dispatch( setPageSize(25))
              setRoleSearchKeyword(searchTerm);
              setIsSearchApplied(true)
              debouncedSearch(searchTerm)

            }}
            width={isMobile || isTablet ? '100%' : '250px'}
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

          {/* MapApplicationRole and Add buttons */}
          <FlexContainer
            gap="10px"
            margin="16px 0 0 0"
            justifyContent={isMobile || isTablet ? 'space-between' : 'end'}
            flexDirection={isMobile || isTablet ? 'column' : 'row'}
            padding={isMobile || isTablet ? '0 0px 10px 0' : '0 0px 20px 0'}
          >
             {roleMenu?.IsAdd && (
              <StyledButton
                height="35px"
                fontSize="12px"
                variant="contained"
                onClick={handleMapApplicationRole}
                startIcon={
                  <StyledImage
                    height="14px"
                    width="14px"
                    src={AddSubMaster}
                    alt="Add New Icon"
                    style={{ marginInlineEnd: 8 }}
                  />
                }
              >
                {t('MapApplicationRole')}
              </StyledButton>
            )}
          
            <MapApplicationRole
              open={open}
              onClose={() => setOpen(false)}
              isMobile={isMobile}
              isTablet={isTablet}
            />
            {roleMenu?.IsAdd && (
              <StyledButton
                height="35px"
                fontSize="12px"
                variant="contained"
                startIcon={
                  <StyledImage
                    height="14px"
                    width="14px"
                    src={AddSubMaster}
                    alt="Add New Icon"
                    style={{ marginInlineEnd: 8 }}
                  />
                }
                onClick={() => {
                  navigate('/MainMaster/AddNewRole');
                }}
              >
                {t('AddRole')}
              </StyledButton>
            )}
          </FlexContainer>
        </FlexContainer>

        {/* Print Icon in the next line aligned to the right */}
        <FlexContainer justifyContent="flex-end" padding="10px">
        {roleMenu?.IsPrint && roleMenu?.IsView && (
            <Tooltip title="Print" arrow>
              <StyledImage
                height="40px"
                width="40px"
                cursor="pointer"
                borderRadius="40px"
                disabled={!(TotalRecords>0)}
                src={PrintFileIcon}
                alt="Print"
                onClick={() => handleOnDownload('pdf')}
              />
            </Tooltip>
        )}
        </FlexContainer>
        {isFetchingApplicationRoleData || isFetchingLabels ||isSearch ? (
          <FlexContainer justifyContent="center">
            <StyledImage src={LoadingGif} alt="LoadingGif" />
          </FlexContainer>
        ) : (
          <DataTable
            columns={columns}
            data={filteredRecords}
            TotalPages={TotalPages}
            labels={labels}
            isView={roleMenu?.IsView}
            isEdit={roleMenu?.IsEdit}
            isDelete={roleMenu?.IsDelete}
            totalRecords={TotalRecords}
          />
        )}
        <SuccessMessage show={isLoading} color={color}>{message}</SuccessMessage>
      </FlexContainer>
    </FlexContainer>
  );
};

export default ApplicationRole;
