import { useEffect, useState } from 'react';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledSearch,
  StyledTypography,
} from '../../../utils/StyledComponents';
import { useSelector } from 'react-redux';
import AddSubMaster from '../../../assets/Icons/AddSubMaster.png';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../redux/RTK/moduleDataApi';
import { useTranslation } from 'react-i18next';
import AddReport from './AddReport';
import ReportGeneratorDataTable from './ReportGeneratorDatatable';
import { useGetReportDetailsQuery } from '../../../redux/RTK/reportGeneratorApi';
import { media } from '../../../utils/Breakpoints';
import { Formik } from 'formik';
import SearchIcon from '../../../assets/Icons/Search.png';
import LoadingGif from '../../../assets/Gifs/LoadingGif.gif';
import { InputAdornment } from '@mui/material';

const ReportGenerator = () => {
  const { t } = useTranslation();
  const [roleMenu, setRoleMenu] = useState();
  const [isEditModal, setIsEditModal] = useState(false);
  const [isViewModal, setIsViewModal] = useState(false);
  const [isAddModal, setIsAddModal] = useState(false);
  const [SelectedReportId, setSelectedReportId] = useState(null);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [isEditOnly, setIsEditOnly] = useState(false);
  const [matchingStaffNames, setMatchingStaffNames] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [employeeSubTypeSearchKeyword, setEmployeeSubTypeSearchKeyword] =
    useState('');
  const { selectedRoleFacility, selectedMenu, selectedFacility } = useSelector(
    (state) => state.auth
  );

  const { pageSize, pageIndex } = useSelector((state) => state.reportGenerator);

  const columns = [
    { id: 'FacilityName', translationId: 'MM_RG_Facility' },
    { id: 'ModuleName', translationId: 'MM_RG_ModuleName' },
    { id: 'MenuName', translationId: 'MM_RG_MenuName' },
    { id: 'AddedEditedBy', translationId: 'MM_RG_AddedEditedBy' },
    { id: 'AddedEditedDate', translationId: 'MM_RG_AddedEditedDate' },
  ];

  useEffect(() => {
    const roleMenu = selectedRoleFacility?.Menu.find(
      (item) => item.MenuId === selectedMenu?.id
    );
    setRoleMenu(roleMenu);
  }, [selectedRoleFacility, selectedMenu]);

  const { data: labels = [], isLoading: labelsLoading } = useGetLabelsQuery({
    menuId: 17,
    moduleId: 1,
  });

  const { data: getReportList = [], isLoading: reportListLoading } =
    useGetReportDetailsQuery({
      payload: {
        //   pageIndex: 1,
        //   pageSize: 10,
        //   headerFacility: selectedFacility?.id,
        //   loginUserId: 2,
        //   moduleId: 1,
        //   menuId: 17,
        // },
        pageIndex: pageIndex,
        pageSize: pageSize,
        headerFacilityId: selectedFacility?.id,
        loginUserId: 1,
        moduleId: 1,
        menuId: 17,
      },
    });

  const { totalPages, totalRecords, records } = getReportList || {
    totalPages: 0,
    totalRecords: 0,
    records: [],
  };

  useEffect(() => {
    setFilteredRecords([...(records || [])]);
  }, [records]);

  const [selectedColumns] = useState(columns);

  const handleOnClose = () => {
    setIsAddModal(false);
    setIsEditModal(false);
    setIsViewModal(false);
  };

  const { data: fields = [] } = useGetFieldsQuery({
    menuId: 17,
    moduleId: 1,
  });

  return (
    <FlexContainer width="100%" height="100%" flexDirection="column">
      <Formik>
        {({ resetForm }) => {
          const handleReport = (resetForm) => {
            resetForm();

            setIsAddModal(true);
            setMatchingStaffNames([]);
          };
          return (
            <>
              <FlexContainer padding="0 0 15px 0">
                <StyledTypography
                  fontSize="36px"
                  fontWeight="900"
                  lineHeight="44px"
                  color="#0083C0"
                  whiteSpace={'nowrap'}
                  {...media.screen.xSmall`
            font-size: 28px; // Adjust font size for xSmall screens
          `}
                  {...media.screen.medium`
            font-size: 32px; // Adjust font size for medium screens
          `}
                >
                  {t('MM_ReportGenerator')}
                </StyledTypography>
              </FlexContainer>

              <FlexContainer
                height="100%"
                width="100%"
                padding="15px 25px 25px 25px"
                borderRadius="8px"
                flexDirection="column"
                backgroundColor="#fff"
                {...media.screen.xSmall`
          padding: 10px; // Adjust padding for xSmall screens
        `}
              >
                {labelsLoading || reportListLoading ? (
                  <FlexContainer justifyContent="center">
                    <StyledImage src={LoadingGif} alt="LoadingGif" />
                  </FlexContainer>
                ) : (
                  <>
                    <FlexContainer
                      justifyContent="space-between"
                      margin="0 0 30px 0"
                    >
                      <StyledSearch
                        variant="outlined"
                        placeholder={t('SearchByKeywords')}
                        value={employeeSubTypeSearchKeyword}
                        autoComplete="off"
                        onChange={(event) => {
                          const searchTerm = event.target.value?.toLowerCase();
                          setEmployeeSubTypeSearchKeyword(event.target.value);

                          if (searchTerm?.length < 1) {
                            setFilteredRecords(records);
                            return;
                          }
                          setFilteredRecords(
                            records?.filter((item) =>
                              item.CategoryAffected?.toLowerCase().includes(
                                searchTerm
                              )
                            ) || []
                          );
                        }}
                        fullWidth={false}
                        margin="normal"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment
                              position="start"
                              style={{ paddingInlineStart: '10px' }}
                            >
                              <img src={SearchIcon} alt="Search Icon" />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <FlexContainer gap="10px" margin="16px 0 0 0">
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
                            onClick={() => handleReport(resetForm)}
                            {...media.screen.small`
                height: 30px; // Adjust button height for small screens
              `}
                          >
                            {t('AddReport')}
                          </StyledButton>
                        )}
                      </FlexContainer>
                    </FlexContainer>
                    <ReportGeneratorDataTable
                      columns={selectedColumns}
                      labels={labels}
                      isEdit={true}
                      isDelete={true}
                      isView={true}
                      setIsViewOnly={setIsViewOnly}
                      setIsEditOnly={setIsEditOnly}
                      records={filteredRecords}
                      totalRecords={totalRecords}
                      totalPages={totalPages}
                      setIsEditModal={setIsEditModal}
                      setIsAddModal={setIsAddModal}
                      setIsViewModal={setIsViewModal}
                      setSelectedReportId={setSelectedReportId}
                    />
                  </>
                )}
              </FlexContainer>
            </>
          );
        }}
      </Formik>
      <AddReport
        isAddModal={isAddModal}
        isEditModal={isEditModal}
        isViewModal={isViewModal}
        viewOnly={isViewOnly}
        matchingStaffNames={matchingStaffNames}
        setMatchingStaffNames={setMatchingStaffNames}
        labels={labels}
        setIsViewOnly={setIsViewOnly}
        SelectedReportId={SelectedReportId}
        onClose={() => handleOnClose()}
        fieldAccess={fields}
      />
    </FlexContainer>
  );
};

export default ReportGenerator;
