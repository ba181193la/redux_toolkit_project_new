import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
} from '@mui/material';
import {
  CommonStyledButton,
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledSearch,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import { useEffect, useState } from 'react';

import PlusIcon from '../../../../assets/Icons/AddSubMaster.png';
import SearchIcon from '../../../../assets/Icons/Search.png';
import EditIcon from '../../../../assets/Icons/EditIcon.png';
import EditIconWhite from '../../../../assets/Icons/EditIconWhite.png';
import DeleteIcon from '../../../../assets/Icons/DeleteIcon.png';
import LoadingGif from '../../../../assets/Gifs/LoadingGif.gif';
import {
  ActionCell,
  StyledTableBodyCell,
  StyledTableHead,
  StyledTableHeaderCell,
  StyledTableRow,
} from '../../../../utils/DataTable.styled';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import DndIcon from '../../../../assets/Icons/DoNotDisturbIcon.png';
import {
  useDeleteEmployeeSubTypeMutation,
  useGetEmployeeSubTypesDetailsQuery,
} from '../../../../redux/RTK/staffSubMasterApi';
import { useGetLabelsQuery } from '../../../../redux/RTK/moduleDataApi';
// import AddEditEmployeeSubType from './AddEditEmployeeSubType';
// import { getlabel } from '../../../../utils/language';
import formatDate from '../../../../utils/FormatDate';
import { showSweetAlert } from '../../../../utils/SweetAlert';
import DeleteUserGif from '../../../../assets/Gifs/DeleteuserGif.gif';
import ExpandIcon from '../../../../assets/Icons/ExpandIcon.png';
import SuccessGif from '../../../../assets/Gifs/SuccessGif.gif';
import CustomPagination from '../../../../components/Pagination/CustomPagination';
import {
  setEmpSubTypePageIndex,
  setEmpSubTypePageSize,
} from '../../../../redux/features/mainMaster/staffSubMasterSlice';
import { checkAccess } from '../../../../utils/Auth';
import {
  useGetConsequencelevelDetailsQuery,
  useGetIncidentRiskDetailsQuery,
  useGetIncidentRiskLevelCalculationQuery,
  useGetLikelihoodDetailsQuery,
  useSaveIncidentRiskLevelCalculationMutation,
} from '../../../../redux/RTK/incidentRiskLevelApi';
import styled from 'styled-components';
import Dropdown from '../../../../components/Dropdown/Dropdown';
import { randomColor } from 'randomcolor';
import DoNotDisturbIcon from '../../../../assets/Icons/DoNotDisturbIcon.png';
import DoneIcon from '../../../../assets/Icons/DoneIcon.png';
import SearchDropdown from '../../../../components/SearchDropdown/SearchDropdown';
// import { getlabel } from '../../../../utils/language';
 import { getlabel } from '../../../../utils/IncidentLabels';

export const StyledCalculatedTableCell = styled(TableCell)`
  font-family: Lato !important;
  font-size: 12px !important;
  font-weight: 400 !important;
  line-height: 14.5px !important;
  text-align: ${(props) => props.textAlign || 'left'};
  border-bottom: 0 !important;
  white-space: wrap;
  border: 1px solid #99cde6;
  color: ${({ status }) => {
    switch (status) {
      case 'Near Miss':
        return '#ff9800'; // Orange
      case 'Incident':
        return '#d32f2f'; // Red
      case 'Adverse Event':
        return '#388e3c'; // Green
      default:
        return '#000'; // Default black
    }
  }};
  background-color: ${({ colorIndex }) => {
    switch (colorIndex) {
      case 0:
        return '#e3f2fd'; // Light blue
      case 1:
        return '#fce4ec'; // Light pink
      case 2:
        return '#e8f5e9'; // Light green
      default:
        return '#ffffff'; // Default white
    }
  }};
`;
export const StyledTableCell = styled(TableCell)`
  font-family: Lato !important;
  font-size: 12px !important;
  font-weight: 400 !important;
  line-height: 14.5px !important;
  text-align: ${(props) => props.textAlign || 'left'};
  border-bottom: 0 !important;
  white-space: wrap;
  border: 1px solid #99cde6;
  color: ${({ status }) =>
    status
      ? status === 'Active'
        ? '#099815'
        : '#D00000'
      : '#000000'} !important;
`;

export const StyledCalculatedTableHeaderCell = styled(TableCell)`
  color: ${(props) => props.color || '#ffffff'} !important;
  font-family: Lato !important;
  font-size: 12px !important;
  font-weight: 700 !important;
  line-height: 15.6px !important;
  text-align: ${(props) => props.textAlign} || left;
  border-bottom: 0 !important;
  white-space: wrap;
  border: 1px solid #99cde6;
`;

const IncidentLevelCalculation = ({ facilityList }) => {
  // const data = [
  //   { rowHeader: "Product A", values: [100, 150, 200, 120] },
  //   { rowHeader: "Product B", values: [80, 130, 90, 160] },
  //   { rowHeader: "Product C", values: [140, 120, 110, 100] },
  // ];

  //*Hooks declaration
  const { i18n, t } = useTranslation();
  const [isEditable, setIsEditable] = useState(false);
  const dispatch = useDispatch();
  const [calculatedRows, setCalculatedRows] = useState([]);
  // const [selectedValue, setSelectedValue]=useState("")
  const [selectedValues, setSelectedValues] = useState({});

  const { data: getLikelihoodDetails = [] } = useGetLikelihoodDetailsQuery(
    {
      payload: {
        pageIndex: 1,
        pageSize: 70,
        headerFacility: selectedFacility?.id,
        loginUserId: 1,
        moduleId: 2,
        menuId: 22,
      },
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  //* Selectors
  const { pageIndex, pageSize } = useSelector(
    (state) => state.staffSubMaster.employmentSubType
  );

  const { data: getConseqenceLevelData = [] } =
    useGetConsequencelevelDetailsQuery(
      {
        payload: {
          pageIndex: 1,
          pageSize: 70,
          headerFacility: 2,
          loginUserId: 1,
          moduleId: 2,
          menuId: 22,
        },
      },
      {
        // skip: !selectedFacility?.id || !selectedModuleId || !selectedMenu?.id,
        refetchOnMountOrArgChange: true,
      }
    );

  const { data: getIncidentData = [] } = useGetIncidentRiskDetailsQuery(
    {
      payload: {
        pageIndex: 1,
        pageSize: 100,
        headerFacility: 2,
        loginUserId: userDetails?.UserId,
        moduleId: 2,
        menuId: 22,
      },
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const {
    data: getIncidentCalculateData,
    error,
    isLoading,
  } = useGetIncidentRiskLevelCalculationQuery(
    {
      payload: {
        pageIndex: 1,
        pageSize: 10,
        headerFacility: 2,
        loginUserId: 1,
        moduleId: 2,
        menuId: 26,
        incidentRiskLevelCalculations: [],
      },
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const incidentRiskLevels = getIncidentData?.Records?.map((record) => ({
    text: record.IncidentRiskLevel,
    value: record.IncidentRiskLevel,
  }));

  const records = getConseqenceLevelData?.Records || [];

  const columnHeaders = records.map((record) => record.ConsequenceLevel);

  const rowHeaders = [
    ...new Set(
      getLikelihoodDetails?.Records?.map((record) => record.Likelihood)
    ),
  ];
  const Values = [
    ...new Set(
      getIncidentCalculateData?.Records?.map(
        (record) => record.IncidentRiskLevel
      )
    ),
  ];

  const [
    updatedIncidentRiskLevelCalculations,
    setUpdatedIncidentRiskLevelCalculations,
  ] = useState([]);
  useEffect(() => {
    if (getIncidentCalculateData?.Records.length > 0) {
      const updatedData = getIncidentCalculateData.Records.map((record) => ({
        riskCalculationId: record.RiskCalculationId || 0,
        consequenceLevelId: record.ConsequenceLevelID || 0,
        consequenceLevel: record.ConsequenceLevel || '',
        likelihoodId: record.LikelihoodId || 0,
        likelihood: record.Likelihood || '',
        incidentRiskLevelId: record.RiskLevelID || 0,
        facilityId: selectedFacility?.id || 2,
        modifiedBy: userDetails?.UserId || 1,
        modifiedDate: modifiedDate,
      }));

      setUpdatedIncidentRiskLevelCalculations(updatedData);
    }
  }, [getIncidentCalculateData]);

  useEffect(() => {
    if (getIncidentCalculateData?.Records?.length) {
      const newCalculatedRows = rowHeaders.map((rowHeader, rowIndex) => ({
        rowHeader,
        values: columnHeaders.map((columnHeader, colIndex) => {
          const match = getIncidentCalculateData.Records.find(
            (record) =>
              record.Likelihood.trim().toLowerCase() ===
                rowHeader.trim().toLowerCase() &&
              record.ConsequenceLevel.trim().toLowerCase() ===
                columnHeader.trim().toLowerCase()
          );

          return {
            riskLevel: match ? match.RiskLevel : 'N/A',
            color: match ? match.scoreLevel : 'transparent',
          };
        }),
      }));

      // setCalculatedRows(newCalculatedRows);
      setCalculatedRows([...newCalculatedRows]);

      // Populate selectedValues with existing risk levels
      const initialSelectedValues = {};
      newCalculatedRows.forEach((row, rowIndex) => {
        row.values.forEach((value, colIndex) => {
          initialSelectedValues[`${rowIndex}-${colIndex}`] = value.riskLevel;
        });
      });

      setSelectedValues(initialSelectedValues);
    }
  }, [getIncidentCalculateData, isEditable]);

  const [showEmployeeSubTypeModel, setShowEmployeeSubTypeModel] =
    useState(false);
  const [selectedEmployeeSubTypeId, setSelectedEmployeeSubTypeId] =
    useState(null);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [employeeSubTypeSearchKeyword, setEmployeeSubTypeSearchKeyword] =
    useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');

  //* RTK Queries
  const [triggerDeleteEmployeeSubType] = useDeleteEmployeeSubTypeMutation();
  useSaveIncidentRiskLevelCalculationMutation;
  const [triggerSaveRiskLevelCalculation, { isLoading: isSubmitLoading }] =
    useSaveIncidentRiskLevelCalculationMutation();

  //* Page load data
  const {
    selectedRoleFacility,
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
    isSuperAdmin,
  } = useSelector((state) => state.auth);

  const [roleMenu, setRoleMenu] = useState();

  useEffect(() => {
    const roleMenu = selectedRoleFacility?.Menu.find(
      (item) => item.MenuId === selectedMenu?.id
    );
    setRoleMenu(roleMenu);
  }, [selectedRoleFacility, selectedMenu]);

  //* Fecth employee subtype details

  //* Handle Pagination

  //* Get labels value
  const { data: labels = [] } = useGetLabelsQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
  });
 const tableHeaderLabels = labels?.Data?.[0]?.Regions?.[0]?.Labels || [];

  const employeeSubTypeColumnsList = [
    { id: 'FacilityName', translationId: 'Facility', isSelected: true },
    {
      id: 'Likelihood',
      translationId: 'Likelihood',
      isSelected: true,
    },
    {
      id: 'Definition',
      translationId: 'Definition',
      isSelected: true,
    },
    {
      id: 'Score',
      translationId: 'Score',
      isSelected: true,
    },
  ];

  //* Edit Employee Sub Type
  const editEmployeeSubType = (employeeSubTypeId) => {
    setSelectedEmployeeSubTypeId(employeeSubTypeId);
    setShowEmployeeSubTypeModel(true);
  };

  //* Delete Employee Sub Type
  const deleteEmployeeSubType = async (employeeSubTypeId) => {
    const callback = async () => {
      try {
        await triggerDeleteEmployeeSubType({
          employeeSubTypeId: employeeSubTypeId,
          loginUserId: userDetails?.UserId,
          menuId: selectedMenu?.id,
        }).unwrap();

        showSweetAlert({
          type: 'success',
          title: 'Deleted!',
          text: 'Employee Sub Type has been deleted.',
          timer: 3000,
          gif: SuccessGif,
          height: 250,
          width: 250,
        });
        refetch();
      } catch (error) {
        console.log({ error });
      }
    };
    showSweetAlert({
      type: 'delete',
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      gif: DeleteUserGif,
      callback,
      cancelButtonText: 'No, Keep it',
      confirmButtonText: 'Yes, delete it!',
    });
  };

  //* Sort records based on order and orderBy state
  const handleSortRequest = (column) => {
    const isAsc = orderBy === column && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(column);
  };

  const sortedRecords = [...filteredRecords].sort((a, b) => {
    const aValue = a[orderBy]?.toString().toLowerCase();
    const bValue = b[orderBy]?.toString().toLowerCase();

    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });

  const handleDropdownChange = (rowIndex, colIndex, newValue) => {
    setSelectedValues((prevState) => ({
      ...prevState,
      [`${rowIndex}-${colIndex}`]: newValue?.value || '', // Store based on row-col key
    }));
  };

  const modifiedDate = new Date().toISOString();

  let payloadData = [];

  const handleSubmit = async () => {
    if (!isEditable) return;

    const updatedRiskLevels = [];
    calculatedRows.forEach((row, rowIndex) => {
      const likelihoodRecord = getLikelihoodDetails?.Records?.find(
        (record) => record.Likelihood === row.rowHeader
      );

      columnHeaders.forEach((columnHeader, colIndex) => {
        const consequenceRecord = getConseqenceLevelData?.Records?.find(
          (record) => record.ConsequenceLevel === columnHeader
        );

        const selectedRiskLevel =
          selectedValues[`${rowIndex}-${colIndex}`] || 'N/A';

        const incidentRiskLevelRecord = getIncidentData?.Records?.find(
          (record) =>
            record.IncidentRiskLevel.trim().toLowerCase() ===
            selectedRiskLevel.trim().toLowerCase()
        );

        const existingCalculation = getIncidentCalculateData?.Records?.find(
          (record) =>
            record.Likelihood.trim().toLowerCase() ===
              row.rowHeader.trim().toLowerCase() &&
            record.ConsequenceLevel.trim().toLowerCase() ===
              columnHeader.trim().toLowerCase()
        );

        const previousRiskLevel = existingCalculation?.RiskLevel || 'N/A';

        if (
          selectedRiskLevel !== previousRiskLevel ||
          (selectedRiskLevel === 'N/A' && previousRiskLevel === 'N/A')
        ) {
          updatedRiskLevels.push({
            rowHeader: row.rowHeader,
            columnHeader: columnHeader,
            previousRiskLevel: previousRiskLevel,
            previousRiskLevelId: existingCalculation?.IncidentRiskLevelId || 0,
            updatedRiskLevel: selectedRiskLevel,
            updatedRiskLevelId:
              incidentRiskLevelRecord?.IncidentRiskLevelId || 0,
          });

          payloadData = updatedIncidentRiskLevelCalculations?.map((risk) => {
            if (
              (risk?.incidentRiskLevelId === 0 &&
                risk?.consequenceLevelId ===
                  consequenceRecord?.ConsequenceLevelId &&
                risk?.likelihoodId === likelihoodRecord?.LikelihoodId &&
                selectedRiskLevel !== 'N/A' &&
                incidentRiskLevelRecord != undefined) ||
              risk.riskCalculationId === existingCalculation?.RiskCalculationId
            ) {
              risk.incidentRiskLevelId =
                incidentRiskLevelRecord?.IncidentRiskLevelId;
              return risk;
            } else {
              return risk;
            }
          });
        }
      });
    });
    if (updatedIncidentRiskLevelCalculations.length === 0) {
      setIsEditable(false);
      return;
    }

    const payload = {
      pageIndex: 1,
      pageSize: 10,
      headerFacility: selectedFacility?.id || 2,
      loginUserId: userDetails?.UserId || 1,
      moduleId: 2,
      menuId: 22,
      incidentRiskLevelCalculations: payloadData,
    };

    try {
      const response = await triggerSaveRiskLevelCalculation({
        payload,
      }).unwrap();

      if (response.Status === 'Success' && response.Data === null) {
        showSweetAlert({
          type: 'warning',
          title: response.Message,
          timer: 2000,
        });
      }

      if (!response || response.status === 'failed') {
        throw new Error('❌ Operation Failed: API rejected the request.');
      }

      // **🔹 Update calculatedRows state immediately with new values**
      setCalculatedRows((prevRows) =>
        prevRows.map((row, rowIndex) => ({
          ...row,
          values: row.values.map((value, colIndex) => ({
            ...value,
            riskLevel: selectedValues[`${rowIndex}-${colIndex}`] || '',
            color:
              getIncidentData?.Records?.find(
                (record) =>
                  record.IncidentRiskLevel.trim().toLowerCase() ===
                  (selectedValues[`${rowIndex}-${colIndex}`] || 'N/A')
                    .trim()
                    .toLowerCase()
              )?.scoreLevel || 'transparent',
          })),
        }))
      );
      if (response.Data !== null) {
        setIsEditable(false);
      }
      // **🔹 Reset Editable Mode**
    } catch (error) {
      console.error('❌ Save Failed:', error);

      if (error?.data) {
        console.error(
          '🔍 API Error Details:',
          JSON.stringify(error.data, null, 2)
        );
      } else if (error?.message) {
        console.error('🔍 Error Message:', error.message);
      } else {
        console.error('🔍 No additional error details received.');
      }
    }
  };

  return (
    <Accordion
      sx={{ border: '5px', borderColor: '#0083c0', marginBlockEnd: '20px' }}
    >
      <AccordionSummary
        expandIcon={<StyledImage src={ExpandIcon} alt="Expand Icon" />}
        aria-controls="panel1-content"
        id="panel1-header"
        sx={{
          backgroundColor: '#0083c0',
          borderRadius: '8px 8px 0px 0px',
          width: '100%',
          border: '1px solid #0083c0',
        }}
      >
        <StyledTypography
          fontSize="16px"
          fontWeight="700"
          lineHeight="20px"
          textAlign="center"
          color="#FFFFFF"
        >
          {t('IncidentRiskLevelCalculation')}
        </StyledTypography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          width: '100%',
          height: '100%',
          padding: '20px',
          border: '1px solid #0083c0',
        }}
      >
        <FlexContainer
          flexWrap="wrap"
          style={{
            width: 'auto',
            height: 'auto',
            overflow: 'auto',
          }}
        >
          <FlexContainer
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
            flexWrap="wrap"
            gap="5px"
          >
            <FlexContainer justifyContent="space-between" gap="50px">
              <StyledTypography
                fontSize="1.3rem"
                fontWeight="600"
                lineHeight="24px"
                textAlign="left"
                color="#333333"
              >
                {/* {getlabel('MM_SM_EmployeeSubtype', labels, i18n.language)} */}
                {'Incident Risk Level Calculation'}
              </StyledTypography>

              {/* <StyledSearch
              variant="outlined"
              placeholder={t('SearchByKeywords')}
              value={employeeSubTypeSearchKeyword}
              autoComplete="off"
              onChange={(event) => {
                const searchTerm = event.target.value?.toLowerCase();
                setEmployeeSubTypeSearchKeyword(event.target.value);

                if (searchTerm?.length < 1) {
                  setFilteredRecords(Records);
                  return;
                }
                setFilteredRecords(
                  Records?.filter(
                    (item) =>
                      item.EmployeeSubType?.toLowerCase().includes(
                        searchTerm
                      ) ||
                      item.FacilityName?.toLowerCase().includes(searchTerm) ||
                      item.AddedEditedBy?.toLowerCase().includes(searchTerm) ||
                      formatDate(item.AddedEditedDate)
                        ?.toLowerCase()
                        .includes(searchTerm)
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
            /> */}
              <FlexContainer justifyContent="flex-end" gap="5px">
                {checkAccess(
                  isSuperAdmin,
                  roleMenu?.IsAdd && roleMenu?.IsView,
                  true
                ) && (
                  <StyledButton
                    // onClick={() => setIsEditable(true)}
                    // onClick={() => setIsEditable((prev) => !prev)}
                    onClick={() => {
                      if (isEditable) {
                        handleSubmit();
                        // setIsEditable(false);
                      } else {
                        setIsEditable(true);
                      }
                    }}
                    variant="contained"
                    style={{
                      display: 'inline-flex',
                      gap: '4px',
                      transition: 'none',
                    }}
                    margin="0 70px 0 0"
                    padding="0.2rem 0.5rem" // Reduced padding for smaller size
                    fontSize="calc(0.7rem + 0.2vw)"
                    disabled={isSubmitLoading}
                  >
                    {isSubmitLoading ? (
                      <CircularProgress
                        size={16}
                        style={{
                          color: '#fff',
                        }}
                      />
                    ) : (
                      <StyledImage
                        src={DoneIcon}
                        style={{ marginInlineEnd: 8 }}
                        sx={{
                          marginBottom: '1px',
                          color: '#FFFFFF',
                        }}
                      />
                    )}
                    {/* {t('EditIncidentLevelCalculation')} */}
                    {isEditable
                      ? t('Submit')
                      : t('Edit Incident Risk Level Calculation')}
                  </StyledButton>
                )}
                {isEditable && (
                  // <CommonStyledButton
                  //   // onClick={() => setIsEditable(true)}
                  //   type="button"
                  //   variant="outlined"
                  //   onClick={() => setIsEditable(false)}
                  //   style={{ display: 'inline-flex', gap: '4px' }}
                  //   margin="0 70px 0 0"
                  //   padding="0.2rem 0.5rem" // Reduced padding for smaller size
                  //   fontSize="calc(0.7rem + 0.2vw)"
                  // >
                  //   <StyledImage
                  //     src={DoNotDisturbIcon}
                  //     style={{ marginInlineEnd: 8 }}
                  //   />
                  //   {/* {t('EditIncidentLevelCalculation')} */}
                  //   {'Cancel'}
                  // </CommonStyledButton>
                  <StyledButton
                    variant="outlined"
                    border="1px solid #0083c0"
                    backgroundColor="#ffffff"
                    type="button"
                    colour="#0083c0"
                    borderRadius="6px"
                    margin="0 0 0 10px"
                    display="inline-flex"
                    gap="5px"
                    onClick={() => {
                      setIsEditable(false);
                    }}
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
                )}
              </FlexContainer>
            </FlexContainer>
          </FlexContainer>
          <FlexContainer
            flexDirection="column"
            width="100%"
            justifyContent="center"
            margin="10px 0 0 0 "
            flexWrap="wrap"
            overFlow="hidden"
          >
            <>
              <TableContainer
                component={Paper}
                // style={{ margin: '20px', maxWidth: 1050, overflow: 'auto' }}
                // style={{ border: '1px solid #99cde6' }}
              >
                <Table>
                  <StyledTableHead>
                    <TableRow>
                      <StyledTableHeaderCell
                        align="center"
                        rowSpan={3} // Adjust the row span as needed
                        style={{
                          fontWeight: 'bold',
                          display: 'flex',
                          flexDirection: 'column', // Arrange content vertically
                          justifyContent: 'center',
                          position: 'relative', // For absolute positioning of the divider
                        }}
                      >
                        <div
                          style={{
                            flex: 1,
                            textAlign: 'center',
                            marginBottom: '25px',
                          }}
                        >
                          {getlabel(
                            'IM_IRLC_CL_ConsequenceLevel',
                            tableHeaderLabels,
                            i18n.language
                          )}
                        </div>
                        <div
                          style={{
                            position: 'absolute',
                            top: '50%', // Position at the center
                            left: 0,
                            width: '100%', // Full width of the cell
                            borderTop: '1px solid white', // Style the divider line
                          }}
                        />
                        <div style={{ flex: 1, textAlign: 'center' }}>
                          {getlabel(
                            'IM_IRLC_L_Likelihood',
                            tableHeaderLabels,
                            i18n.language
                          )}
                        </div>
                      </StyledTableHeaderCell>
                      {columnHeaders.map((header, index) => (
                        <StyledCalculatedTableHeaderCell
                          key={index}
                          align="center"
                          style={{ fontWeight: 'bold' }}
                        >
                          {header}
                        </StyledCalculatedTableHeaderCell>
                      ))}
                    </TableRow>
                  </StyledTableHead>
                  <TableBody>
                    {calculatedRows.map((row, rowIndex) => (
                      <StyledTableRow key={rowIndex}>
                        <StyledTableCell
                          align="center"
                          style={{ fontWeight: 'bold' }}
                        >
                          {row.rowHeader}
                        </StyledTableCell>
                        {row.values.map((value, colIndex) => (
                          <StyledCalculatedTableCell
                            key={colIndex}
                            align="center"
                            // style={{ backgroundColor: randomColor() }} // Random color
                            style={{
                              backgroundColor: !isEditable
                                ? value.color
                                : 'transparent',
                            }}
                          >
                            {isEditable ? (
                              <SearchDropdown
                                name="incidentype"
                                options={incidentRiskLevels || []}
                                getOptionLabel={(option) => option.text}
                                dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
                                sx={{
                                  '& .MuiAutocomplete-inputRoot': {
                                    fontSize: '13px',
                                    height: '100%',
                                  },
                                  '& .MuiOutlinedInput-root': {
                                    height: '34px',
                                    '& .MuiAutocomplete-input': {
                                      height: '34px',
                                      fontSize: '13px',
                                    },
                                  },
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    variant="outlined"
                                    placeholder="Select"
                                  />
                                )}
                                ListboxProps={{
                                  sx: {
                                    '& .MuiAutocomplete-option': {
                                      fontSize: '14px',
                                      minHeight: '30px',
                                      display: 'flex',
                                      alignItems: 'center',
                                    },
                                  },
                                }}
                                value={
                                  incidentRiskLevels.find(
                                    (option) =>
                                      option.value ===
                                      selectedValues[`${rowIndex}-${colIndex}`]
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  handleDropdownChange(
                                    rowIndex,
                                    colIndex,
                                    newValue
                                  );
                                }}
                              />
                            ) : (
                              // value?.riskLevel
                              calculatedRows[rowIndex]?.values[colIndex]
                                ?.riskLevel
                            )}
                          </StyledCalculatedTableCell>
                        ))}
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* {TotalRecords != 0 && (
                  <CustomPagination
                    totalRecords={TotalRecords}
                    page={pageIndex}
                    pageSize={pageSize}
                    handleOnPageChange={handleOnPageChange}
                    handleOnPageSizeChange={handleOnPageSizeChange}
                  />
                )} */}
            </>
          </FlexContainer>
          {/* {showEmployeeSubTypeModel && (
              <AddEditEmployeeSubType
                showEmployeeSubTypeModel={showEmployeeSubTypeModel}
                setShowEmployeeSubTypeModel={setShowEmployeeSubTypeModel}
                selectedEmployeeSubTypeId={selectedEmployeeSubTypeId}
                setSelectedEmployeeSubTypeId={setSelectedEmployeeSubTypeId}
                facilityList={facilityList}
                labels={labels}
                refetch={refetch}
              />
            )} */}
        </FlexContainer>
      </AccordionDetails>
    </Accordion>
  );
};

export default IncidentLevelCalculation;
