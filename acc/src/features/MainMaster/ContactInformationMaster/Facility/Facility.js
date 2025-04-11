import { useCallback, useEffect, useMemo, useState } from 'react';
import debounce from 'lodash/debounce';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledSearch,
  SuccessMessage,
} from '../../../../utils/StyledComponents';
import { Divider, InputAdornment, Tooltip } from '@mui/material';
import LoadingGif from '../../../../assets/Gifs/LoadingGif.gif';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import AddSubMaster from '../../../../assets/Icons/AddSubMaster.png';
import Search from '../../../../assets/Icons/Search.png';
import { useGetFieldsQuery, useGetLabelsQuery } from '../../../../redux/RTK/moduleDataApi';
import FacilityDataTable from '../FacilityDatatable';
import {
  useDownloadFacilityDataMutation,
  useGetFacilityQuery,
  useLazyGetAllFacilitySearchQuery,
} from '../../../../redux/RTK/contactInformationApi.js';
import { useTranslation } from 'react-i18next';
import useWindowDimension from '../../../../hooks/useWindowDimension';
import styled from 'styled-components';
import PrintFileIcon from '../../../../assets/Icons/PrintFileIcon.png';
import { saveAs } from 'file-saver';
import {
  setFacilityPageIndex,
  setFacilityPageSize,
} from '../../../../redux/features/mainMaster/contactInformationSlice';
import { checkAccess } from '../../../../utils/Auth';

export const StyledDivider = styled(Divider)`
  width: 0px !important;
  height: 30px !important;
  border-left: 1px solid #99cde6 !important;
  opacity: 1 !important;
`;

const columns = [
  {
    id: 'CompanyName',
    translationId: 'MM_CIM_CompanyName',
    fieldId: 'CIM_P_CompanyName',
  },
  {
    id: 'FacilityName',
    translationId: 'MM_CIM_FacilityName',
    fieldId: 'CIM_P_FacilityName',
  },
  {
    id: 'FacilityCode',
    translationId: 'MM_CIM_FacilityCode',
    fieldId: 'CIM_P_FacilityCode',
  },
  { id: 'Email', translationId: 'MM_CIM_EmailID', fieldId: 'CIM_P_EmailID' },
  {
    id: 'ContactPersonName',
    translationId: 'MM_CIM_ContactPersonName',
    fieldId: 'CIM_P_ContactPersonName',
  },
  { id: 'status', translationId: 'MM_CIM_Status', fieldId: 'CIM_P_Status' },
];
const Facility = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [roleMenu, setRoleMenu] = useState();
  const [message, setMessage] = useState('');
  const [color, setColor] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchApplied, setIsSearchApplied] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isSearch, setIsSearch] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const {
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
    selectedRoleFacility,
    isSuperAdmin,
  } = useSelector((state) => state.auth);
  const { facilityPageIndex, facilityPageSize } = useSelector(
    (state) => state.contactInformationMaster
  );
  const [triggerGetAllFacilitySearchQuery] = useLazyGetAllFacilitySearchQuery();
  const [selectedColumns, setSelectedColumns] = useState(columns);
  const { t } = useTranslation();
  const { isMobile } = useWindowDimension();

  useEffect(() => {
    const roleMenu = selectedRoleFacility?.Menu.find(
      (item) => item.MenuId === selectedMenu?.id
    );
    setRoleMenu(roleMenu);
  }, [selectedRoleFacility, selectedMenu]);

  const {
    data: getFacilityData,
    isLoading: facilityLoading,
    refetch,
  } = useGetFacilityQuery(
    {
      payload: {
        pageIndex: facilityPageIndex + 1,
        pageSize: facilityPageSize,
        headerFacility: selectedFacility?.id,
        loginUserId: userDetails?.UserId,
        moduleId: selectedModuleId,
        menuId: selectedMenu?.id,
      },
    },
    {
      refetchOnMountOrArgChange: true || searchKeyword !== '',
    }
  );

  const { records } = getFacilityData || {
    totalRecords: 0,
    records: [],
  };

  const { data: fields = [] } = useGetFieldsQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
  });
  useEffect(() => {
    const pageFields =
      Array.isArray(fields?.Data?.Sections) &&
      fields.Data.Sections.find((section) => section.SectionName === 'Page')
        ?.Fields;

    setSelectedColumns((prevColumns) =>
      prevColumns?.map((column) => {
        return {
          ...column,
          isShow: Array.isArray(pageFields)
            ? pageFields.find((col) => col.FieldId === column.fieldId)?.IsShow
            : false,
        };
      })
    );
  }, [fields]);

  useEffect(() => {
    if (!isSearchApplied) {
      const { totalRecords } = getFacilityData || { totalRecords: 0 };
      setTotalRecords(totalRecords);
      setFilteredRecords([...(records || [])]);
    }
  }, [records, isSearchApplied]);

  const { data: labels = [], isLoading: labelsLoading } = useGetLabelsQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
  });

  const [triggerDownloadData] = useDownloadFacilityDataMutation();

  const handleOnDownload = async (fileType) => {
    try {
      setIsLoading(true);
      setColor('#4caf50');
      setMessage('Downloading...');
      const blob = await triggerDownloadData({
        downloadType: fileType,
        payload: {
          pageIndex: facilityPageIndex,
          pageSize: facilityPageSize,
          headerFacility: selectedFacility?.id,
          loginUserId: userDetails?.UserId,
          moduleId: selectedModuleId,
          menuId: selectedMenu?.id,
          keyword: searchKeyword,
        },
      }).unwrap();
      saveAs(blob, 'Facility.pdf');
      setMessage('Download completed');
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      setColor('#e63a2e');
      setMessage('Download failed');
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  const searchByKeyWords = useCallback(
    async (keyword) => {
      setIsSearch(true);
      try {
        if (keyword === '' && isSearchApplied) {
          setIsSearchApplied(false);
          refetch();
          return;
        }
        const response = await triggerGetAllFacilitySearchQuery({
          pageIndex: facilityPageIndex + 1,
          pageSize: facilityPageSize,
          headerFacility: selectedFacility?.id,
          loginUserId: userDetails?.UserId,
          moduleId: selectedModuleId,
          isActive: true,
          menuId: selectedMenu?.id,
          keyword: keyword,
        }).unwrap();
        if (response?.records.length > 0) {
          setIsSearch(false);
          setTotalRecords(response?.totalRecords);
          setFilteredRecords([...(response?.records || [])]);
        } else {
          setTotalRecords(0);
          setFilteredRecords([]);
        }
      } catch (err) {
        if (err.data) {
          setIsSearch(false);
          setTotalRecords(0);
          setFilteredRecords([]);
        }
      } finally {
        setIsSearch(false);
      }
    },
    [
      facilityPageIndex,
      facilityPageSize,
      selectedFacility,
      userDetails,
      selectedModuleId,
      selectedMenu,
      isSearchApplied,
    ]
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
    if (searchKeyword) {
      debouncedSearch(searchKeyword);
    }
  }, [facilityPageIndex, facilityPageSize]);

  useEffect(() => {
    // when clear userSearchKeyword then  call refetch
    if (!searchKeyword && isSearchApplied) {
      debouncedSearch(searchKeyword);
    }
  }, [searchKeyword, isSearchApplied]);

  return (
    <FlexContainer flexDirection="column">
      <FlexContainer
        justifyContent="space-between"
        flexDirection={isMobile ? 'column' : 'row'}
      >
        <StyledSearch
          variant="outlined"
          placeholder="Search by keywords"
          value={searchKeyword}
          onChange={(event) => {
            const searchTerm = event.target.value?.toLowerCase();
            dispatch(setFacilityPageIndex(0));
            dispatch(setFacilityPageSize(25));
            setSearchKeyword(searchTerm);
            setIsSearchApplied(true);
            debouncedSearch(event.target.value);
          }}
          width={isMobile ? '100%' : '250px'}
          fullWidth
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <StyledImage src={Search} alt="Search Icon" />
              </InputAdornment>
            ),
          }}
        />

        <FlexContainer
          gap="10px"
          margin="0 0 16px 0"
          justifyContent={isMobile ? 'space-between' : 'end'}
          padding={isMobile ? '0 0px 10px 0' : '0 0px 20px 0'}
          flexDirection="column" // Added this line to stack the button and icon vertically
        >
          {checkAccess(
            isSuperAdmin,
            roleMenu?.IsView,
            roleMenu?.IsAdd || false
          ) &&
            userDetails?.StaffCategoryId === 1 && (
              <StyledButton
                variant="contained"
                height="35px"
                fontSize="12px"
                padding={isMobile ? '6px 10px' : '6px 16px'}
                width={isMobile ? '100%' : ''}
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
                  navigate('/MainMaster/AddNewContactInfo');
                }}
              >
                {t('AddFacility')}
              </StyledButton>
            )}
          {/* Print Icon below the AddFacility Button */}
          {roleMenu?.IsAdd && roleMenu?.IsView && roleMenu?.IsPrint && (
            <FlexContainer justifyContent="flex-end">
              {checkAccess(
                isSuperAdmin,
                roleMenu?.IsView,
                roleMenu?.IsPrint || false
              ) &&
                (userDetails?.StaffCategoryId === 1 ||
                  userDetails?.StaffCategoryId === 2) && (
                  <Tooltip title="Print" arrow>
                    <StyledImage
                      height="40px"
                      width="40px"
                      cursor="pointer"
                      borderRadius="40px"
                      disabled={!(totalRecords > 0)}
                      src={PrintFileIcon}
                      alt="Print"
                      onClick={() => handleOnDownload('pdf')}
                    />
                  </Tooltip>
                )}
            </FlexContainer>
          )}
        </FlexContainer>
      </FlexContainer>

      {facilityLoading || labelsLoading || isSearch ? (
        <FlexContainer justifyContent="center">
          <StyledImage src={LoadingGif} alt="LoadingGif" />
        </FlexContainer>
      ) : (
        <FacilityDataTable
          columns={selectedColumns}
          records={filteredRecords}
          labels={labels}
          isEdit={roleMenu?.IsEdit}
          isDelete={roleMenu?.IsDelete}
          isView={roleMenu?.IsView}
          totalRecords={totalRecords}
        />
      )}
      <SuccessMessage color={color} show={isLoading}>
        {message}
      </SuccessMessage>
    </FlexContainer>
  );
};
export default Facility;
