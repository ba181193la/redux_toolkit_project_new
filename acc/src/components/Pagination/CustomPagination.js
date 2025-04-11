import TablePagination from '@mui/material/TablePagination';
import {
  CustomPaginationContainer,
  CustomPaginationLabel,
} from '../../utils/DataTable.styled';
import { useTranslation } from 'react-i18next';
import useWindowDimension from '../../hooks/useWindowDimension';

const CustomPagination = ({
  totalRecords,
  pageSize,
  page,
  handleOnPageChange,
  handleOnPageSizeChange,
}) => {
  const { t } = useTranslation();
  const { isMobile } = useWindowDimension();
  return (
    <CustomPaginationContainer
      justifyContent={isMobile ? 'center' : 'flex-end'}
    >
      <CustomPaginationLabel>
        <div>
          {totalRecords} {t('RecordsFound')}
        </div>
      </CustomPaginationLabel>
      <TablePagination
        component="div"
        count={totalRecords}
        page={page}
        onPageChange={handleOnPageChange}
        rowsPerPage={pageSize}
        onRowsPerPageChange={handleOnPageSizeChange}
        labelRowsPerPage={t('ShowRows')}
        labelDisplayedRows={({ from, to }) => (
          <span>
            {from}-{to} of {Math.ceil(totalRecords / pageSize)} {t('Pages')}
          </span>
        )}
        slotProps={{
          actions: {
            nextButton: {
              disabled: page >= Math.ceil(totalRecords / pageSize) - 1,
            },
          },
        }}
        rowsPerPageOptions={[2, 5, 10, 25, 50]}
        sx={{
          '& .MuiTablePagination-actions button': {
            padding: '6px 12px',
          },
          '& .MuiInputBase-root': {
            border: '1px solid #E2E4E6',
            borderRadius: '0px',
            padding: '0 12px',
          },
          '& .MuiSelect-select': {
            paddingRight: '24px',
            paddingLeft: '8px',
          },
          '& .MuiTablePagination-displayedRows': {
            margin: 0,
          },
          '& .MuiToolbar-root': {
            ...(isMobile
              ? {
                  flexWrap: 'wrap',
                  gap: '15px',
                  padding: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                  '& p': {
                    margin: 0,
                  },
                }
              : {
                  '& p': {
                    margin: 0,
                  },
                }),
          },
        }}
      />
    </CustomPaginationContainer>
  );
};

export default CustomPagination;
