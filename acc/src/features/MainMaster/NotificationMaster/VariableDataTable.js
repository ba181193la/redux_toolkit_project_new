import React from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Paper,
} from '@mui/material';
import {
  StyledTableBodyCell,
  StyledTableHeaderCell,
  StyledTableRow,
  StyledTableHead,
} from '../../../utils/DataTable.styled';
import { FlexContainer } from '../../../utils/StyledComponents';
import CustomScrollbars from '../../../components/CustomScrollbars/CustomScrollbars';
import { useTranslation } from 'react-i18next';
import { getlabel } from '../../../utils/language';
import { useParams } from 'react-router-dom';
import { useGetTemplateByTaskQuery } from '../../../redux/RTK/notificationMasterApi';
import { useSelector } from 'react-redux';

const VariableDataTable = ({ columns = [], data = [], labels }) => {
  const { i18n } = useTranslation();
  const { id } = useParams();
  const { selectedMenu, selectedModuleId, userDetails, selectedFacility } =
    useSelector((state) => state.auth);

    const { data: TemplatesByTask = [], isFetching: isTemplateFetching } =
      useGetTemplateByTaskQuery({
        menuId: selectedMenu?.id,
        moduleId: selectedModuleId,
        loginUserId: userDetails?.UserId,
        mailTaskId: id,
      });
  return (
    <FlexContainer flexDirection="column">
      <TableContainer component={Paper} style={{ border: '1px solid #99cde6' }}>
        <CustomScrollbars
          style={{ height: '350px' }}
          rtl={i18n.language === 'ar'}
        >
          <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
            <StyledTableHead>
              <TableRow>
                {columns.map((column) => (
                  <StyledTableHeaderCell key={column.id}>
                    {getlabel(column.translationId, labels, i18n.language)}
                  </StyledTableHeaderCell>
                ))}
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {data?.VariableList?.length > 0 ? (
                data?.VariableList.filter((row) => {
                  return TemplatesByTask?.Data?.TemplateDetail?.MailTaskId === row?.MailTaskId;
                })
                  // .sort((a, b) => a.OrderId - b.OrderId)
                  .map((filteredRow, rowIndex) => (
                    <StyledTableRow key={rowIndex}>
                      {columns.map((column) => (
                        <StyledTableBodyCell key={column.id}>
                          {filteredRow[column.id]}
                        </StyledTableBodyCell>
                      ))}
                    </StyledTableRow>
                  ))
              ) : (
                <TableRow>
                <StyledTableBodyCell colSpan={columns.length+2} align='center'>
                  {t('NoDataAvailable')}
                </StyledTableBodyCell>
              </TableRow>
              )}
            </TableBody>
          </Table>
        </CustomScrollbars>
      </TableContainer>
    </FlexContainer>
  );
};

export default VariableDataTable;
