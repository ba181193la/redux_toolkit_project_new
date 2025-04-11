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
import CustomPagination from '../../../../components/Pagination/CustomPagination';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import formatDate from '../../../../utils/FormatDate';
import LoadingGif from '../../../../assets/Gifs/LoadingGif.gif';

const IncidentToBeReSubmit = ({ labels }) => {
  const { i18n, t } = useTranslation();

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  const { selectedMenu, userDetails, selectedFacility } = useSelector(
    (state) => state.auth
  );

  const { data: getSavedIncidents, isFetching: fetchingSavedIncidents } = useGetSavedIncidentsQuery({
    payload: {
      pageIndex: pageIndex + 1,
      pageSize,
      headerFacility: selectedFacility?.id,
      loginUserId: userDetails?.UserId,
      moduleId: 2,
      menuId: selectedMenu?.id,
      listingTabNo: 2,
      facilityId: selectedFacility?.id,
    },
  });
  const { totalRecords, records } = getSavedIncidents || {
    totalRecords: 0,
    records: [],
  };

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
      id: 'Remarks',
      translationId: 'IM_RI_Remarks',
      fieldId: 'RI_P_Remarks',
      isSelected: true,
    },
  ];

  const handleOnPageChange = (event, newPage) => {
    setPageIndex(newPage);
  };

  const handleOnPageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value, 10));
  };

  return fetchingSavedIncidents?(<FlexContainer justifyContent="center">
        <StyledImage src={LoadingGif} alt="LoadingGif" />
      </FlexContainer>):(<FlexContainer flexDirection={'column'}>
      <TableContainer component={Paper} style={{ border: '1px solid #99cde6' }}>
        <Table>
          <StyledTableHead>
            <StyledTableRow>
              <StyledTableHeaderCell>{t('SNo')}</StyledTableHeaderCell>
              {columnsMapping?.map((column) => {
                return (
                  <StyledTableHeaderCell>
                    {getIncidentlabel(
                      column.translationId,
                      labels,
                      i18n.language
                    )}
                  </StyledTableHeaderCell>
                );
              })}
              <StyledTableHeaderCell>{t('Actions')}</StyledTableHeaderCell>
            </StyledTableRow>
          </StyledTableHead>
          <TableBody>
            {records?.map((row, index) => {
              return (
                <StyledTableRow key={index}>
                  <StyledTableBodyCell>
                    {pageIndex * pageSize + index + 1}
                  </StyledTableBodyCell>
                  {columnsMapping?.map((column) => {
                    return (
                      <StyledTableBodyCell>
                        {column.id === 'IncidentDateTime'
                          ? formatDate(row[column.id])
                          : row[column.id]}
                      </StyledTableBodyCell>
                    );
                  })}
                  <ActionCell>
                    <FlexContainer className="action-icons">
                      {/* {checkAccess(
                        isSuperAdmin,
                        isView,
                        role?.IsEdit || false
                      ) && ( */}
                      <Tooltip title="Edit" arrow>
                        <Link
                          to={`/IncidentManagement/ReportIncident/ReportNewIncident/${row.IncidentNo}`}
                          target="_blank"
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
                      {/* )} */}
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
    </FlexContainer>)
};
export default IncidentToBeReSubmit;
