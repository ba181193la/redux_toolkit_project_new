import { useTranslation } from 'react-i18next';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../utils/StyledComponents';
import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Tooltip,
} from '@mui/material';
import {
  ActionCell,
  StyledTableBodyCell,
  StyledTableHead,
  StyledTableHeaderCell,
  StyledTableRow,
} from '../../../utils/DataTable.styled';
import { getlabel } from '../../../utils/language';
import PlusIcon from '../../../assets/Icons/AddSubMaster.png';
import DeleteIcon from '../../../assets/Icons/DeleteIcon.png';
import AzureCredentialsModal from './AzureCredentialsModal';
import { useState } from 'react';

const AzureCredentialsDataTable = ({
  labels,
  azureCredentialsList,
  setAzureCredentialsList,
  showClientSecretField,
  companyList,
  disabled,
}) => {
  //* azure credentials table column list
  const azureCredentialsTableColumnsList = [
    {
      id: 'companyName',
      translationId: 'MM_AM_CompanyName',
      isShow: true,
    },
    {
      id: 'tenantId',
      translationId: 'MM_AM_TenantID',
      isShow: true,
    },
    {
      id: 'clientId',
      translationId: 'MM_AM_ClientID',
      isShow: true,
    },
    {
      id: 'clientSecret',
      translationId: 'MM_AM_ClientSecret',
      isShow: showClientSecretField,
    },
  ];

  //* Hooks declaration
  const { t, i18n } = useTranslation();

  //* State variables
  const [showAzureModal, setShowAzureModal] = useState(false);

  //* Delete Credentials
  const deleteCredentials = (index) => {
    setAzureCredentialsList((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <FlexContainer
      flexDirection="column"
      width="100%"
      style={{
        opacity: disabled ? 0.7 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
      }}
    >
      <Grid item xs={12} sm={12} md={10}>
        <StyledTypography
          fontSize="14px"
          fontWeight="700"
          lineHeight="30px"
          color="#333333"
          whiteSpace={'nowrap'}
        >
          {t('AzureCredentials')}
        </StyledTypography>
        <TableContainer component={Paper}>
          <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
            <StyledTableHead>
              <TableRow>
                <StyledTableHeaderCell style={{ padding: '0px 15px' }}>
                  {t('SNo')}
                </StyledTableHeaderCell>
                {azureCredentialsTableColumnsList
                  ?.filter((col) => col.isShow)
                  .map((column) => (
                    <StyledTableHeaderCell key={column.id}>
                      {getlabel(column?.translationId, labels, i18n.language)}
                    </StyledTableHeaderCell>
                  ))}
                <StyledTableHeaderCell style={{ padding: '0px 15px' }}>
                  {t('Actions')}
                </StyledTableHeaderCell>
              </TableRow>
            </StyledTableHead>

            {azureCredentialsList?.length > 0 ? (
              <TableBody>
                {azureCredentialsList?.map((row, rowIndex) => (
                  <StyledTableRow key={rowIndex}>
                    <StyledTableBodyCell>{rowIndex + 1}</StyledTableBodyCell>
                    {azureCredentialsTableColumnsList
                      ?.filter((col) => col.isShow)
                      .map((column) => {
                        return (
                          <>
                            <StyledTableBodyCell key={column.id}>
                              {row[column.id] ?? null}
                            </StyledTableBodyCell>
                          </>
                        );
                      })}
                    <ActionCell>
                      <FlexContainer className="action-icons">
                        <Tooltip title="Delete" arrow>
                          <StyledImage
                            cursor="pointer"
                            height="12.5px"
                            width="12.5px"
                            src={DeleteIcon}
                            alt="Delete"
                            onClick={() => deleteCredentials(rowIndex)}
                          />
                        </Tooltip>
                      </FlexContainer>
                    </ActionCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            ) : (
              <TableBody>
                <StyledTableRow>
                  <StyledTableBodyCell
                    colSpan={6}
                    style={{ textAlign: 'center' }}
                  >
                    {t('NoDataAvailable')}
                  </StyledTableBodyCell>
                </StyledTableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Grid>
      <Grid
        item
        xs={12}
        sm={12}
        md={10}
        padding={'10px'}
        justifyContent={'flex-end'}
      >
        <StyledButton
          borderRadius="6px"
          gap="4px"
          padding="6px 10px"
          variant="contained"
          color="primary"
          style={{ display: 'inline-flex', gap: '5px', float: 'inline-end' }}
          onClick={() => setShowAzureModal(true)}
          startIcon={
            <StyledImage
              height="16px"
              width="16px"
              src={PlusIcon}
              alt="WhiteSearch"
            />
          }
        >
          {t('AddCredentials')}
        </StyledButton>
      </Grid>
      {showAzureModal && (
        <AzureCredentialsModal
          labels={labels}
          showAzureModal={showAzureModal}
          setShowAzureModal={setShowAzureModal}
          azureCredentialsList={azureCredentialsList}
          setAzureCredentialsList={setAzureCredentialsList}
          showClientSecretField={showClientSecretField}
          companyList={companyList}
        />
      )}
    </FlexContainer>
  );
};

export default AzureCredentialsDataTable;
