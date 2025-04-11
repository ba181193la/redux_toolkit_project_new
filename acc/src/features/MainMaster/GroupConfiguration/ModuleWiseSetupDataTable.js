import React from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Paper,
  Checkbox,
} from '@mui/material';
import {
  StyledTableBodyCell,
  StyledTableHead,
  StyledTableHeaderCell,
  StyledTableRow,
} from '../../../utils/DataTable.styled';
import { FlexContainer } from '../../../utils/StyledComponents';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useFormikContext } from 'formik';

export const StyledDivider = styled.div`
  width: 0px !important;
  height: 30px !important;
  border-left: 1px solid #fff !important;
`;

const DataTable = ({ isEditable }) => {
  const { t } = useTranslation();

  const { values, setFieldValue } = useFormikContext();

  return (
    <FlexContainer flexDirection="column">
      <TableContainer component={Paper} style={{ border: '1px solid #99cde6' }}>
        <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
          <StyledTableHead>
            <TableRow>
              <StyledTableHeaderCell>{t('ModuleName')}</StyledTableHeaderCell>
              <StyledTableHeaderCell>
                {t('DisableSpecificGroupMaster')}
              </StyledTableHeaderCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            <StyledTableRow>
              <StyledTableBodyCell>MainMaster</StyledTableBodyCell>
              <Checkbox
                disabled={!isEditable}
                name="mainMaster"
                checked={
                  values?.mainMaster !== undefined ? values?.mainMaster : false
                }
                onChange={(e) => {
                  const checked = e.target.checked;
                  setFieldValue('mainMaster', checked);
                }}
              />
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableBodyCell>Incident Management</StyledTableBodyCell>
              <Checkbox
                name="incidentManagement"
                disabled={!isEditable}
                checked={
                  values?.incidentManagement !== undefined
                    ? values?.incidentManagement
                    : false
                }
                onChange={(e) => {
                  const checked = e.target.checked;
                  setFieldValue('incidentManagement', checked);
                }}
              />
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </FlexContainer>
  );
};

export default DataTable;
