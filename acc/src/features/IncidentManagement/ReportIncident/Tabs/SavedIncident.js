import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  Tooltip,
} from '@mui/material';
import { FlexContainer, StyledImage } from '../../../../utils/StyledComponents';
import {
  ActionCell,
  StyledTableBodyCell,
  StyledTableHead,
  StyledTableHeaderCell,
  StyledTableRow,
} from '../../../../utils/DataTable.styled';
import EditIcon from '../../../../assets/Icons/EditIcon.png';
import { useGetSavedIncidentsQuery } from '../../../../redux/RTK/IncidentManagement/reportincidentApi';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getIncidentlabel } from '../../../../utils/language';
import { useGetFieldsQuery } from '../../../../redux/RTK/moduleDataApi';
import CustomPagination from '../../../../components/Pagination/CustomPagination';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import formatDate from '../../../../utils/FormatDate';
import LoadingGif from '../../../../assets/Gifs/LoadingGif.gif';

const SavedIncident = ({ labels }) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [filteredRecords, setFilteredRecords] = useState([]);

  const { i18n, t } = useTranslation();
  const {
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
    regionCode,
  } = useSelector((state) => state.auth);

  const { data: getSavedIncidents, isFetching: fetchingIncidentData } = useGetSavedIncidentsQuery({
    payload: {
      pageIndex: pageIndex + 1,
      pageSize,
      headerFacility: selectedFacility?.id,
      loginUserId: userDetails?.UserId,
      moduleId: selectedModuleId,
      menuId: selectedMenu?.id,
      listingTabNo: 1,
      facilityId: selectedFacility?.id,
    },
  });
  const { totalRecords, records } = getSavedIncidents || {
    totalRecords: 0,
    records: [],
  };

  useEffect(() => {
    setFilteredRecords([...(records || [])]);
  }, [records]);

  const columnsMapping = [
    {
      id: 'FacilityName',
      translationId: 'IM_RI_Facility',
      fieldId: 'RI_P_Facility',
      isSelected: true,
    },
    {
      id: 'IncidentDateTime',
      translationId: 'IM_RI_IncidentDate',
      fieldId: 'RI_P_IncidentDate',
      isSelected: true,
    },
    {
      id: 'IncidentNo',
      translationId: 'IM_RI_IncidentNumber',
      fieldId: 'RI_P_IncidentNumber',
      isSelected: true,
    },
    {
      id: 'IncidentDetail',
      translationId: 'IM_RI_IncidentDetail',
      fieldId: 'RI_P_IncidentDetail',
      isSelected: true,
    },
    {
      id: 'BriefDescriptionOfIncident',
      translationId: 'IM_RI_BriefDescriptionofIncident',
      fieldId: 'RI_P_BriefDescriptionofIncident',
      isSelected: true,
    },
    {
      id: 'IncidentType',
      translationId: 'IM_RI_IncidentType',
      fieldId: 'RI_P_IncidentType',
      isSelected: true,
    },
    {
      id: 'DepartmentName',
      translationId: 'IM_RI_Department',
      fieldId: 'RI_P_Department',
      isSelected: true,
    },
  ];

  const handleOnPageChange = (event, newPage) => {
    setPageIndex(newPage);
  };

  const handleOnPageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value, 10));
  };


  return fetchingIncidentData ? (
    <FlexContainer justifyContent="center">
      <StyledImage src={LoadingGif} alt="LoadingGif" />
    </FlexContainer>
  ) : (
    <FlexContainer flexDirection="column">
      <TableContainer component={Paper} style={{ border: '1px solid #99cde6' }}>
        <Table>
          <StyledTableHead>
            <StyledTableRow>
              <StyledTableHeaderCell>{t('SNo')}</StyledTableHeaderCell>
              {columnsMapping?.map((column, index) => (
                <StyledTableHeaderCell key={index}>
                  {getIncidentlabel(column.translationId, labels, i18n.language)}
                </StyledTableHeaderCell>
              ))}
              <StyledTableHeaderCell>{t('Actions')}</StyledTableHeaderCell>
            </StyledTableRow>
          </StyledTableHead>
          <TableBody>
            {filteredRecords?.map((row, index) => {
              return (
                <StyledTableRow key={index}>
                  <StyledTableBodyCell>
                    {pageIndex * pageSize + index + 1}
                  </StyledTableBodyCell>
                  {columnsMapping?.map((column) => (
                    <StyledTableBodyCell key={column.id}>
                      {column.id === 'IncidentDateTime'
                        ? formatDate(row[column.id])
                        : row[column.id]}
                    </StyledTableBodyCell>
                  ))}
                  <ActionCell>
                    <FlexContainer className="action-icons">
                      <Tooltip title="Edit" arrow>
                        <Link
                          to={`/IncidentManagement/ReportIncident/ReportNewIncident/${row.IncidentId}`}
                          rel="noopener noreferrer"
                        >
                          <StyledImage
                            cursor="pointer"
                            height="12.5px"
                            width="12.5px"
                            src={EditIcon}
                            alt="Edit"
                          />
                        </Link>
                      </Tooltip>
                    </FlexContainer>
                  </ActionCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {totalRecords > 0 && (
        <CustomPagination
          totalRecords={totalRecords}
          page={pageIndex}
          pageSize={pageSize}
          handleOnPageChange={handleOnPageChange}
          handleOnPageSizeChange={handleOnPageSizeChange}
        />
      )}
    </FlexContainer>
  );
  
};

export default SavedIncident;
