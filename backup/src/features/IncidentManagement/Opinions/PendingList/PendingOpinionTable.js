import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TableSortLabel,
  Tooltip,
} from '@mui/material';

import {
  StyledTableBodyCell,
  StyledTableHeaderCell,
  StyledTableRow,
  ActionCell,
  StyledTableHead,
} from '../../../../utils/DataTable.styled';
import { FlexContainer, StyledImage } from '../../../../utils/StyledComponents';
import CustomPagination from '../../../../components/Pagination/CustomPagination';
import LikeIcon from '../../../../assets/Icons/LikeIcon.png';
import DislikeIcon from '../../../../assets/Icons/DislikeIcon.png';
import { useNavigate } from 'react-router-dom';
import CustomScrollbars from '../../../../components/CustomScrollbars/CustomScrollbars';
import { getlabel } from '../../../../utils/IncidentLabels';
import { useTranslation } from 'react-i18next';
import { checkAccess } from '../../../../utils/Auth';
import DeleteIcon from '../../../../assets/Icons/DeleteIcon.png';
import EditIcon from '../../../../assets/Icons/EditIcon.png';
import { setPendingFilters } from '../../../../redux/features/mainMaster/opinionSlice';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import format24HrTime from '../../../../utils/Format24HrTime';
import formatDate from '../../../../utils/FormatDate';

const PendingOpinionTable = ({
  TotalRecords,
  columns,
  Records,
  searchLabels,
}) => {
  const navigate = useNavigate();
  const [order, setOrder] = useState('asc');
  const { i18n, t } = useTranslation();
  const [orderBy, setOrderBy] = useState('');
  const dispatch = useDispatch();
  const { pageSize, pageIndex, pendingFilters } = useSelector(
    (state) => state.opinion.pendingFilters
  );
  const dummyData = {
    data: [
      {
        sNo: 1,
        facility: 'Facility A',
        incidentDate: '13-06-2024',
        reportedDate: '13-06-2024',
        incidentNumber: 'NRC-IR-13062024-002',
        incidentDetail: '-',
        briefDescription: 'ukkhkh',
        incidentType: 'Not Applicable',
        departmentUnit: 'Cardiology',
        reportedBy: 'Not Applicable',
        overallTAT: '24h',
        overallTATCompliance: 'Yes',
        specificTAT: '2h',
        specificTATCompliance: 'No',
        incidentStatus: 'Waiting for Incident Approval',
        action: 'Approve/Reject',
      },
      {
        sNo: 2,
        facility: 'Facility B',
        incidentDate: '13-06-2024',
        reportedDate: '13-06-2024',
        incidentNumber: 'NRC-IR-13062024-001',
        incidentDetail: '-',
        briefDescription: 'kkjh',
        incidentType: 'Not Applicable',
        departmentUnit: 'Administration',
        reportedBy: 'Not Applicable',
        overallTAT: '48h',
        overallTATCompliance: 'Yes',
        specificTAT: '1h',
        specificTATCompliance: 'Yes',
        incidentStatus: 'Waiting for Incident Approval',
        action: 'Approve/Reject',
      },
      {
        sNo: 3,
        facility: 'Facility C',
        incidentDate: '07-05-2024',
        reportedDate: '08-05-2024',
        incidentNumber: 'NRC-IR-07052024-001',
        incidentDetail:
          'The Arrival of candidates to accommodation without prior Notice from HR/Recruitment',
        briefDescription: 'test',
        incidentType: 'Near Miss',
        departmentUnit: 'Accounts',
        reportedBy: 'DEMO USER 1',
        overallTAT: '72h',
        overallTATCompliance: 'No',
        specificTAT: '3h',
        specificTATCompliance: 'No',
        incidentStatus: 'Waiting for Incident Approval',
        action: 'Approve/Reject',
      },
      {
        sNo: 4,
        facility: 'Facility D',
        incidentDate: '05-05-2024',
        reportedDate: '02-05-2024',
        incidentNumber: 'NRC-IR-05052024-001',
        incidentDetail: 'Fire and Safety hazards',
        briefDescription: '-',
        incidentType: 'Adverse Event',
        departmentUnit: 'Administration',
        reportedBy: 'Melissa Ragadio',
        overallTAT: '36h',
        overallTATCompliance: 'Yes',
        specificTAT: '4h',
        specificTATCompliance: 'Yes',
        incidentStatus: 'Waiting for Incident Approval',
        action: 'Approve/Reject',
      },
      {
        sNo: 5,
        facility: 'Facility A',
        incidentDate: '13-03-2024',
        reportedDate: '13-03-2024',
        incidentNumber: 'NRC-IR-13032024-001',
        incidentDetail:
          'The Arrival of candidates to accommodation without prior Notice from HR/Recruitment',
        briefDescription: 'Report Incident - Location Test',
        incidentType: 'Near Miss',
        departmentUnit: 'Accounts',
        reportedBy: 'Dr. Sujitha',
        overallTAT: '24h',
        overallTATCompliance: 'No',
        specificTAT: '5h',
        specificTATCompliance: 'No',
        incidentStatus: 'Waiting for Incident Approval',
        action: 'Approve/Reject',
      },
      {
        sNo: 6,
        facility: 'Facility B',
        incidentDate: '12-03-2024',
        reportedDate: '11-03-2024',
        incidentNumber: 'NRC-IR-11032024-001',
        incidentDetail: 'Furniture misuse',
        briefDescription: 'Incident accident',
        incidentType: 'Near Miss',
        departmentUnit: 'Accounts',
        reportedBy: 'Dr. Sujitha',
        overallTAT: '48h',
        overallTATCompliance: 'Yes',
        specificTAT: '1h',
        specificTATCompliance: 'Yes',
        incidentStatus: 'Waiting for Incident Approval',
        action: 'Approve/Reject',
      },
      {
        sNo: 7,
        facility: 'Facility C',
        incidentDate: '08-03-2024',
        reportedDate: '07-03-2024',
        incidentNumber: 'NRC-IR-07032024-001',
        incidentDetail: 'Disruptive behaviors',
        briefDescription: 'Near Miss Incident',
        incidentType: 'Near Miss',
        departmentUnit: 'Ambulance',
        reportedBy: 'Not Applicable',
        overallTAT: '72h',
        overallTATCompliance: 'No',
        specificTAT: '2h',
        specificTATCompliance: 'No',
        incidentStatus: 'Waiting for Incident Approval',
        action: 'Approve/Reject',
      },
      {
        sNo: 8,
        facility: 'Facility D',
        incidentDate: '04-03-2024',
        reportedDate: '29-02-2024',
        incidentNumber: 'NRC-IR-29022024-003',
        incidentDetail: 'Lack of Laundromat Facilities',
        briefDescription: 'rtrt',
        incidentType: 'Adverse Event',
        departmentUnit: 'Admission',
        reportedBy: 'Dr. Sujitha',
        overallTAT: '24h',
        overallTATCompliance: 'Yes',
        specificTAT: '3h',
        specificTATCompliance: 'Yes',
        incidentStatus: 'Waiting for Incident Approval',
        action: 'Approve/Reject',
      },
      {
        sNo: 9,
        facility: 'Facility A',
        incidentDate: '01-03-2024',
        reportedDate: '29-02-2024',
        incidentNumber: 'NRC-IR-29022024-002',
        incidentDetail: 'Noncompliant/Uncooperative/ Inappropriate Behavior',
        briefDescription: 'fg',
        incidentType: 'Incident',
        departmentUnit: 'Administration',
        reportedBy: 'Not Applicable',
        overallTAT: '36h',
        overallTATCompliance: 'Yes',
        specificTAT: '5h',
        specificTATCompliance: 'No',
        incidentStatus: 'Waiting for Incident Approval',
        action: 'Approve/Reject',
      },
      {
        sNo: 10,
        facility: 'Facility B',
        incidentDate: '14-02-2024',
        reportedDate: '13-02-2024',
        incidentNumber: 'NRC-IR-13022024-001',
        incidentDetail:
          'Fire - The Environment of tree sometimes it can cause fire because of climate changes or humans trespassing. by the cause of fire animals can be harmed',
        briefDescription: 'spill',
        incidentType: 'Adverse Event',
        departmentUnit: 'Biomedical Engineering',
        reportedBy: 'aly',
        overallTAT: '48h',
        overallTATCompliance: 'Yes',
        specificTAT: '4h',
        specificTATCompliance: 'Yes',
        incidentStatus: 'Waiting for Incident Approval',
        action: 'Approve/Reject',
      },
    ],
  };

  // const handleOnPageChange = (event,) => {
  //   dispatch(
  //     setPendingFilters({
  //       ...pendingFilters,
  //       pageIndex: newPage,
  //     })
  //   );
  // };
  // const handleOnPageChange = (event, newPage) => {
  //     dispatch(setPendingPageIndex(newPage));
  //   };

  const handleOnPageChange = (event, newPage) => {
    dispatch(
      setPendingFilters({
        ...pendingFilters,
        pageIndex: newPage,
      })
    );
  };

  // const handleOnPageSizeChange = (event) => {
  //   console.log('eventeeeee'.event?.target.value);
  //   dispatch(
  //     setPendingFilters({
  //       ...pendingFilters,
  //       pageSize: parseInt(event.target.value, 10),

  //       pageIndex: 0,
  //     })
  //   );
  // };

  const handleOnPageSizeChange = (event) => {
    const newPageSize = parseInt(event?.target?.value, 10);

    if (isNaN(newPageSize)) {
      console.warn('Invalid pageSize value:', event?.target?.value);
      return; // Prevents dispatching invalid values
    }

    dispatch(
      setPendingFilters({
        ...pendingFilters,
        pageSize: newPageSize,
        pageIndex: 0,
      })
    );
  };

  const handleSortRequest = (column) => {
    const isAsc = orderBy === column && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(column);
  };

  const sortedRecords = [...(Records || [])].sort((a, b) => {
    const aValue = a[orderBy]?.toString().toLowerCase();
    const bValue = b[orderBy]?.toString().toLowerCase();
    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });

  const paginatedData = dummyData.data.slice(
    (pageIndex - 1) * pageSize,
    pageIndex * pageSize
  );

  const handleOnEdit = (row) => {
    navigate(
      `/IncidentManagement/Opinions/PendingList/PendingOpinionEntry/${row.IncidentId}/${row.OpinionId}`
    );
    // navigate(`/IncidentManagement/PendingOpinionEntry/${'14'}`);
  };

  return (
    <FlexContainer flexDirection="column" width="100%">
      <TableContainer component={Paper} style={{ border: '1px solid #99cde6' }}>
        {pageSize>25?(<CustomScrollbars
          style={{ height: '1250px' }}
          rtl={i18n.language === 'ar'}
        >
          <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
            <StyledTableHead>
              <StyledTableRow>
                <StyledTableHeaderCell>{t('S.No')}</StyledTableHeaderCell>
                {columns
                  ?.filter((col) => col.isSelected)
                  ?.map((column) => (
                    <StyledTableHeaderCell key={column.id}>
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : 'asc'}
                        onClick={() => handleSortRequest(column.id)}
                      >
                        {getlabel(
                          column.translationId,
                          searchLabels,
                          i18n.language
                        )}
                      </TableSortLabel>
                    </StyledTableHeaderCell>
                  ))}
                <StyledTableHeaderCell>{t('Actions')}</StyledTableHeaderCell>
              </StyledTableRow>
            </StyledTableHead>
            <TableBody>
              {sortedRecords?.length > 0 ? (
                sortedRecords.map((row, rowIndex) => {
                  return (
                    <StyledTableRow key={rowIndex}>
                      <StyledTableBodyCell>
                        {pageIndex * pageSize + rowIndex + 1}
                      </StyledTableBodyCell>
                      {columns.map((column) => (
                        // <StyledTableBodyCell key={column.id}>
                        //   {column.id === 'IncidentDate' || column.id==='RequestedDate'
                        //     ? formatDate(row[column.id]) +
                        //       ' ' +
                        //       format24HrTime(row[column.id])
                        //     : (row[column.id] ?? null)}
                        // </StyledTableBodyCell>
                        <StyledTableBodyCell key={column.id}>
                          {' '}
                          {column.id === 'IncidentDate' ||
                          column.id === 'RequestedDate'
                            ? row[column.id]
                              ? formatDate(row[column.id]) +
                                ' ' +
                                format24HrTime(row[column.id])
                              : null
                            : (row[column.id] ?? null)}{' '}
                        </StyledTableBodyCell>
                      ))}
                      {/* {columns
                      ?.filter((col) => col.isSelected)
                      .map((column) => {
                        return (
                          <StyledTableBodyCell
                            key={column.id}
                            style={{
                              maxWidth:
                                column.id === 'SecondaryDesignation'
                                  ? '150px'
                                  : 'auto',
                              wordWrap: 'break-word',
                              overflowWrap: 'break-word',
                              whiteSpace: 'normal',
                            }}
                            status={
                              column.id === 'Status' ? row[column.id] : ''
                            }
                          >
                            {column.id === 'Added_EditedDate' &&
                            row[column.id] ? (
                              formatDate(row[column.id])
                            ) : column.id === 'SecondaryDesignation' ? (
                              <div style={styles.wrapText}>
                                {row[column.id] ?? null}
                              </div>
                            ) : (
                              (row[column.id] ?? null)
                            )}
                          </StyledTableBodyCell>
                        );
                      })} */}

                      <ActionCell>
                        <FlexContainer className="action-icons">
                          <Tooltip title="Edit" arrow>
                            <StyledImage
                              cursor="pointer"
                              height="12.5px"
                              width="12.5px"
                              tooltip="Edit"
                              src={EditIcon}
                              alt="Edit"
                              onClick={() => handleOnEdit(row)}
                            />
                          </Tooltip>
                        </FlexContainer>
                      </ActionCell>
                    </StyledTableRow>
                  );
                })
              ) : (
                <TableRow>
                  <StyledTableBodyCell
                    colSpan={columns.length + 2}
                    align="center"
                  >
                    {t('NoDataAvailable')}
                  </StyledTableBodyCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CustomScrollbars>):(
          <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
          <StyledTableHead>
            <StyledTableRow>
              <StyledTableHeaderCell>{t('S.No')}</StyledTableHeaderCell>
              {columns
                ?.filter((col) => col.isSelected)
                ?.map((column) => (
                  <StyledTableHeaderCell key={column.id}>
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleSortRequest(column.id)}
                    >
                      {getlabel(
                        column.translationId,
                        searchLabels,
                        i18n.language
                      )}
                    </TableSortLabel>
                  </StyledTableHeaderCell>
                ))}
              <StyledTableHeaderCell>{t('Actions')}</StyledTableHeaderCell>
            </StyledTableRow>
          </StyledTableHead>
          <TableBody>
            {sortedRecords?.length > 0 ? (
              sortedRecords.map((row, rowIndex) => {
                return (
                  <StyledTableRow key={rowIndex}>
                    <StyledTableBodyCell>
                      {pageIndex * pageSize + rowIndex + 1}
                    </StyledTableBodyCell>
                    {columns.map((column) => (
                      <StyledTableBodyCell key={column.id}>
                      {' '}
                      {column.id === 'IncidentDate' ||
                      column.id === 'RequestedDate'
                        ? row[column.id]
                          ? formatDate(row[column.id]) +
                            ' ' +
                            format24HrTime(row[column.id])
                          : null
                        : (row[column.id] ?? null)}{' '}
                    </StyledTableBodyCell>
                    ))}
                    {/* {columns
                    ?.filter((col) => col.isSelected)
                    .map((column) => {
                      return (
                        <StyledTableBodyCell
                          key={column.id}
                          style={{
                            maxWidth:
                              column.id === 'SecondaryDesignation'
                                ? '150px'
                                : 'auto',
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word',
                            whiteSpace: 'normal',
                          }}
                          status={
                            column.id === 'Status' ? row[column.id] : ''
                          }
                        >
                          {column.id === 'Added_EditedDate' &&
                          row[column.id] ? (
                            formatDate(row[column.id])
                          ) : column.id === 'SecondaryDesignation' ? (
                            <div style={styles.wrapText}>
                              {row[column.id] ?? null}
                            </div>
                          ) : (
                            (row[column.id] ?? null)
                          )}
                        </StyledTableBodyCell>
                      );
                    })} */}

                    <ActionCell>
                      <FlexContainer className="action-icons">
                        <Tooltip title="Edit" arrow>
                          <StyledImage
                            cursor="pointer"
                            height="12.5px"
                            width="12.5px"
                            tooltip="Edit"
                            src={EditIcon}
                            alt="Edit"
                            onClick={() => handleOnEdit(row)}
                          />
                        </Tooltip>
                      </FlexContainer>
                    </ActionCell>
                  </StyledTableRow>
                );
              })
            ) : (
              <TableRow>
                <StyledTableBodyCell
                  colSpan={columns.length + 2}
                  align="center"
                >
                  {t('NoDataAvailable')}
                </StyledTableBodyCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        )}
      
      </TableContainer>
      {TotalRecords > 0 && (
        <CustomPagination
          totalRecords={TotalRecords}
          page={pageIndex}
          pageSize={pageSize}
          handleOnPageChange={handleOnPageChange}
          handleOnPageSizeChange={handleOnPageSizeChange}
        />
      )}
    </FlexContainer>
  );
};

export default PendingOpinionTable;
