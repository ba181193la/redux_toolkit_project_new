import { useCallback, useEffect, useMemo, useState } from 'react';
import debounce from 'lodash/debounce';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledSearch,
} from '../../../../utils/StyledComponents';
import { InputAdornment } from '@mui/material';
import LoadingGif from '../../../../assets/Gifs/LoadingGif.gif';
import { useDispatch, useSelector } from 'react-redux';
import AddSubMaster from '../../../../assets/Icons/AddSubMaster.png';
import Search from '../../../../assets/Icons/Search.png';
import {
  useGetCompanyByIdQuery,
  useGetCompanyDetailsQuery,
  useLazyGetAllCompanySearchQuery,
} from '../../../../redux/RTK/contactInformationApi.js';
import {
  setPageIndex,
  setPageSize,
} from '../../../../redux/features/mainMaster/contactInformationSlice';
import AddCompany from '../AddCompany';
import DataTable from '../DataTable.js';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../../redux/RTK/moduleDataApi';
import { useTranslation } from 'react-i18next';
import useWindowDimension from '../../../../hooks/useWindowDimension';
import { checkAccess } from '../../../../utils/Auth';

const Company = () => {
  const dispatch = useDispatch();
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [isSearchApplied, setIsSearchApplied] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [roleMenu, setRoleMenu] = useState();
  const { isMobile, isTablet } = useWindowDimension();
  const {
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
    selectedRoleFacility,
    isSuperAdmin,
  } = useSelector((state) => state.auth);
  const { pageSize, pageIndex } = useSelector(
    (state) => state.contactInformationMaster
  );
  const [triggerGetAllCompanySearchQuery] = useLazyGetAllCompanySearchQuery();
  const columns = [
    {
      id: 'CompanyCode',
      translationId: 'MM_CIM_CompanyCode',
      fieldId: 'CIM_P_CompanyCode',
    },
    {
      id: 'CompanyName',
      translationId: 'MM_CIM_CompanyName',
      fieldId: 'CIM_P_CompanyName',
    },
    {
      id: 'LicenseStatus',
      translationId: 'MM_CIM_LicenseStatus',
      fieldId: 'CIM_P_LicenseStatus',
    },
  ];
  const [selectedColumns, setSelectedColumns] = useState(columns);
  useEffect(() => {
    const roleMenu = selectedRoleFacility?.Menu.find(
      (item) => item.MenuId === selectedMenu?.id
    );
    setRoleMenu(roleMenu);
  }, [selectedRoleFacility, selectedMenu]);
  const { t } = useTranslation();
  const { data: fields = [] } = useGetFieldsQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
  });
  useEffect(() => {
    const pageFields =
      Array.isArray(fields?.Data?.Sections) && fields.Data.Sections[0].Fields;

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

  const {
    data: getCompanyData = [],
    isLoading: isCompanyDataLoading,
    refetch,
  } = useGetCompanyDetailsQuery(
    {
      payload: {
        pageIndex: pageIndex + 1,
        pageSize: pageSize,
        headerFacility: selectedFacility?.id,
        loginUserId: userDetails?.UserId,
        moduleId: selectedModuleId,
        menuId: selectedMenu?.id,
      },
    },
    {
      skip:
        !selectedFacility?.id ||
        !selectedModuleId ||
        !selectedMenu?.id ||
        searchKeyword !== '',
    }
  );

  const { records } = getCompanyData || { records: [] };
  useEffect(() => {
    if (!isSearchApplied) {
      const { totalPages, totalRecords } = getCompanyData || {
        totalPages: 0,
        totalRecords: 0,
      };
      setTotalPages(totalPages);
      setTotalRecords(totalRecords);
      setFilteredRecords([...(records || [])]);
    }
  }, [records, isSearchApplied]);

  const { data: labels = [], isLoading: isLabelsLoading } = useGetLabelsQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
  });

  const handleCompany = () => {
    setShowCompanyModal(true);
  };

  useEffect(() => {
    const roleMenu = selectedRoleFacility?.Menu.find(
      (item) => item.MenuId === selectedMenu?.id
    );
    setRoleMenu(roleMenu);
  }, [selectedRoleFacility, selectedMenu]);

  const { data: companyData } = useGetCompanyByIdQuery(
    {
      companyId: companyId,
      loginUserId: userDetails?.UserId,
    },
    { skip: !companyId }
  );

  const searchByKeyWords = useCallback(
    async (keyword) => {
      setIsSearch(true);
      try {
        if (keyword === '' && isSearchApplied) {
          refetch();
          setIsSearchApplied(false);
          return;
        }
        const response = await triggerGetAllCompanySearchQuery({
          pageIndex: pageIndex + 1,
          pageSize: pageSize,
          pageIndex: pageIndex + 1,
          pageSize: pageSize,
          headerFacility: selectedFacility?.id,
          loginUserId: userDetails?.UserId,
          moduleId: selectedModuleId,
          menuId: selectedMenu?.id,
          keyword: keyword,
        }).unwrap();
        if (response?.records.length > 0) {
          setIsSearch(false);
          setTotalRecords(response?.totalRecords);
          setFilteredRecords([...(response?.records || [])]);
        } else {
          setIsSearch(false);
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
      pageIndex,
      pageSize,
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
  }, [pageSize, pageIndex]);

  useEffect(() => {
    //when filters change with searchKeyword
    if (!searchKeyword && isSearchApplied) {
      debouncedSearch(searchKeyword);
    }
  }, [searchKeyword, isSearchApplied]);

  return (
    <FlexContainer flexDirection="column">
      <FlexContainer
        justifyContent="space-between"
        flexDirection={isMobile || isTablet ? 'column' : 'row'}
      >
        <StyledSearch
          variant="outlined"
          placeholder={t('SearchByKeywords')}
          value={searchKeyword}
          onChange={(event) => {
            const searchTerm = event.target.value?.toLowerCase();
            dispatch(setPageIndex(0));
            dispatch(setPageSize(25));
            setSearchKeyword(searchTerm);
            setIsSearchApplied(true);
            debouncedSearch(searchTerm);
          }}
          width={isMobile || isTablet ? '100%' : '250px'}
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
        {roleMenu?.IsView && (
          <FlexContainer
            gap="10px"
            margin="0 0 16px 0"
            justifyContent={isMobile || isTablet ? 'space-between' : 'end'}
            padding={isMobile || isTablet ? '0 0px 10px 0' : '0 0px 20px 0'}
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
                  padding={isMobile || isTablet ? '6px 10px' : '6px 16px'}
                  width={isMobile || isTablet ? '100%' : ''}
                  startIcon={
                    <StyledImage
                      height="14px"
                      width="14px"
                      src={AddSubMaster}
                      alt="Add New Icon"
                      style={{ marginInlineEnd: 8 }}
                    />
                  }
                  onClick={handleCompany}
                >
                  {t('AddCompany')}
                </StyledButton>
              )}
            <AddCompany
              open={showCompanyModal}
              setShowCompanyModal={setShowCompanyModal}
              onClose={() => setShowCompanyModal(false)}
              companyData={companyData}
              labels={labels}
              fieldAccess={fields}
              records={records}
              refetch={refetch}
            />
          </FlexContainer>
        )}
      </FlexContainer>
      {isCompanyDataLoading || isLabelsLoading || isSearch ? (
        <FlexContainer justifyContent="center">
          <StyledImage src={LoadingGif} alt="LoadingGif" />
        </FlexContainer>
      ) : (
        <DataTable
          columns={selectedColumns}
          records={filteredRecords}
          totalRecords={totalRecords}
          pageSize={pageSize}
          totalPages={totalPages}
          fieldAccess={fields}
          labels={labels}
          isMobile={isMobile}
          isTablet={isTablet}
          isView={roleMenu?.IsView}
          isEdit={roleMenu?.IsEdit}
          isDelete={roleMenu?.IsDelete}
          setOpen={setShowCompanyModal}
          setCompanyId={setCompanyId}
          refetch={refetch}
          staffCategoryId={userDetails?.StaffCategoryId}
        />
      )}
    </FlexContainer>
  );
};
export default Company;
