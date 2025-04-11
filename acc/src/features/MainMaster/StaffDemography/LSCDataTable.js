import {
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  TextField,
  Tooltip,
} from '@mui/material';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
} from '../../../utils/StyledComponents';
import {
  ActionCell,
  StyledTableHead,
  StyledTableHeaderCell,
  StyledTableRow,
} from '../../../utils/DataTable.styled';
import { StyledTableBodyCell } from '../ApplicationRoles/AddNewRole/MainMasterTable';
import EditIcon from '../../../assets/Icons/EditIcon.png';
import DeleteIcon from '../../../assets/Icons/DeleteIcon.png';
import { useTranslation } from 'react-i18next';
import { getlabel } from '../../../utils/language';
import { checkAccess } from '../../../utils/Auth';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import TextArea from '../../../components/TextArea/TextArea';
import SearchDropdown from '../../../components/SearchDropdown/SearchDropdown';
import Date from '../../../components/Date/Date';
import PlusIcon from '../../../assets/Icons/AddSubMaster.png';
import SaveIcon from '../../../assets/Icons/SaveIcon.png';
import { showToastAlert } from '../../../utils/SweetAlert';

const LSCDataTable = ({
  labels,
  fieldAccess,
  lscRecords,
  setLSCRecords,
  countryList,
  today,
}) => {
  //* Hooks Declation
  const { i18n, t } = useTranslation();

  //* Selectors
  const { userDetails, selectedMenu, isSuperAdmin, selectedRoleFacility } =
    useSelector((state) => state.auth);

  //* State varibales
  const [roleMenu, setRoleMenu] = useState();

  //* Effect to set role menu
  useEffect(() => {
    const roleMenu = selectedRoleFacility?.Menu.find(
      (item) => item.MenuId === selectedMenu?.id
    );
    setRoleMenu(roleMenu);
  }, [selectedRoleFacility, selectedMenu]);

  //* Binding page fields
  const pageFields = fieldAccess?.Data?.Sections?.find(
    (sectionName) => sectionName?.SectionName === 'Life Support Certification'
  )?.Fields;

  const educationColumnsList = [
    {
      id: 'title',
      translationId: 'MM_SF_Title',
      isShow: pageFields?.find((x) => x.FieldId === 'SF_LSC_Title')?.IsShow,
    },
    {
      id: 'authority',
      translationId: 'MM_SF_IssueAuthorityInstitution',
      isShow: pageFields?.find(
        (x) => x.FieldId === 'SF_LSC_IssueAuthorityInstitution'
      )?.IsShow,
    },
    {
      id: 'country',
      translationId: 'MM_SF_Country',
      isShow: pageFields?.find((x) => x.FieldId === 'SF_LSC_Country')?.IsShow,
    },
    {
      id: 'fromDate',
      translationId: 'MM_SF_IssueDate',
      isShow: pageFields?.find((x) => x.FieldId === 'SF_LSC_IssueDate')?.IsShow,
    },
    {
      id: 'toDate',
      translationId: 'MM_SF_ExpiryDate',
      isShow: pageFields?.find((x) => x.FieldId === 'SF_LSC_ExpiryDate')
        ?.IsShow,
    },
    {
      id: 'certificate',
      translationId: 'MM_SF_AttachOriginalCertificate',
      isShow: pageFields?.find((x) => x.FieldId === 'SF_Exp_ToDate')?.IsShow,
    },
    {
      id: 'selectLatest',
      translationId: 'MM_SF_SelectLatest',
      isShow: pageFields?.find((x) => x.FieldId === 'SF_LSC_SelectLatest')
        ?.IsShow,
    },
    {
      id: 'submittedBy',
      translationId: 'MM_SF_SubmittedBy',
      isShow: pageFields?.find((x) => x.FieldId === 'SF_LSC_SubmittedBy')
        ?.IsShow,
    },
    {
      id: 'submittedDate',
      translationId: 'MM_SF_SubmittedDate',
      isShow: pageFields?.find((x) => x.FieldId === 'SF_LSC_SubmittedDate')
        ?.IsShow,
    },
  ];

  //* Add more data
  const addMore = () => {
    const lastRecord = lscRecords[lscRecords?.length - 1];
    const unsavedRecord = lscRecords?.findIndex(
      (record) => record?.isEdit === true
    );
    if (
      !lastRecord?.title &&
      !lastRecord?.authority &&
      !lastRecord?.country &&
      !lastRecord?.fromDate &&
      !lastRecord?.toDate &&
      !lastRecord?.certificate &&
      !lastRecord?.submittedBy &&
      lastRecord?.isEdit
    ) {
      showToastAlert({
        type: 'custom_info',
        text: `Enter records in Exoerience Tab row no ${lscRecords?.length}`,
        gif: 'InfoGif',
      });
    } else if (unsavedRecord && unsavedRecord !== -1) {
      showToastAlert({
        type: 'custom_info',
        text: `Save record in Exoerience Tab row no ${unsavedRecord + 1}`,
        gif: 'InfoGif',
      });
    } else {
      setLSCRecords((prev) => [
        ...prev,
        {
          title: '',
          authority: '',
          country: '',
          fromDate: '',
          toDate: '',
          certificate: '',
          submittedBy: userDetails?.UserName,
          submittedDate: today,
          isEdit: true,
          isDefault: false,
        },
      ]);
    }
  };

  //* Edit row details
  const changeRowDetails = (rowIndex, column, value) => {
    const updatedRecords = [...lscRecords];
    updatedRecords[rowIndex] = { ...updatedRecords[rowIndex], [column]: value };
    setLSCRecords(updatedRecords);
  };

  //* Delete row details
  const deleteRecord = (index) => {
    const records = [...lscRecords];
    setLSCRecords(records.filter((e, i) => i !== index));
  };

  //* Save row details
  const saveRecord = (index) => {
    const records = [...lscRecords];
    if (!records[index]?.title) {
      showToastAlert({
        type: 'custom_info',
        text: `Enter Title in Experience Tab row no ${index + 1}`,
        gif: 'InfoGif',
      });
    } else if (!records[index]?.institution) {
      showToastAlert({
        type: 'custom_info',
        text: `Enter Institution in Experience Tab row no ${index + 1}`,
        gif: 'InfoGif',
      });
    } else if (!records[index]?.country) {
      showToastAlert({
        type: 'custom_info',
        text: `Enter Country in Experience Tab row no ${index + 1}`,
        gif: 'InfoGif',
      });
    } else if (!records[index]?.fromDate) {
      showToastAlert({
        type: 'custom_info',
        text: `Enter From Date in Experience Tab row no ${index + 1}`,
        gif: 'InfoGif',
      });
    } else if (!records[index]?.toDate) {
      showToastAlert({
        type: 'custom_info',
        text: `Enter To Date in Experience Tab row no ${index + 1}`,
        gif: 'InfoGif',
      });
    } else {
      records[index] = {
        ...records[index],
        ['isEdit']: false,
      };
      setLSCRecords(records);
    }
  };

  return (
    <FlexContainer flexDirection="column" width="100%">
      <TableContainer component={Paper} style={{ border: '1px solid #03bce4' }}>
        <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
          <StyledTableHead backgroundColor="#03bce4" borderLeft="none">
            {educationColumnsList
              ?.filter((col) => col.isShow)
              ?.map((column) => (
                <StyledTableHeaderCell key={column.id}>
                  {getlabel(column.translationId, labels, i18n.language)}
                </StyledTableHeaderCell>
              ))}
            {checkAccess(
              isSuperAdmin,
              roleMenu?.IsView,
              roleMenu?.IsEdit || roleMenu?.IsDelete
            ) && (
              <StyledTableHeaderCell>{t('RowOptions')}</StyledTableHeaderCell>
            )}
          </StyledTableHead>

          {lscRecords?.length > 0 ? (
            <TableBody>
              {lscRecords?.map((row, rowIndex) => (
                <StyledTableRow key={rowIndex}>
                  {educationColumnsList
                    ?.filter((col) => col.isShow)
                    .map((column) => (
                      <StyledTableBodyCell
                        key={column.id}
                        textAlign="center !important"
                      >
                        {(column.id === 'submittedBy' ||
                          column.id === 'submittedDate') &&
                          row[column.id]}
                        {column.id === 'title' &&
                          (row['isDefault'] ? (
                            row[column.id]
                          ) : (
                            <SearchDropdown
                              disabled={!row['isEdit']}
                              disableClearable={true}
                              name={'title'}
                              options={[
                                { text: 'Select', value: '' },
                                ...(countryList || []),
                              ]}
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
                                    fontSize: '13px',
                                    minHeight: '30px',
                                    display: 'flex',
                                    alignItems: 'center',
                                  },
                                },
                              }}
                              value={
                                countryList?.find(
                                  (option) => option.value === row[column.id]
                                ) || null
                              }
                              onChange={(event, value) => {
                                if (value?.value) {
                                  changeRowDetails(
                                    rowIndex,
                                    column.id,
                                    value?.value
                                  );
                                }
                              }}
                            />
                          ))}

                        {column.id === 'authority' && (
                          <TextArea
                            disabled={!row['isEdit']}
                            value={row[column.id]}
                            onChange={(event) => {
                              changeRowDetails(
                                rowIndex,
                                column.id,
                                event?.target?.value
                              );
                            }}
                          />
                        )}
                        {column.id === 'selectLatest' && (
                          <FormControlLabel
                            value="option1"
                            control={
                              <Radio
                                checked={row[column.id]}
                                onChange={(event) =>
                                  changeRowDetails(
                                    rowIndex,
                                    column.id,
                                    event?.target?.value
                                  )
                                }
                              />
                            }
                            label="Latest"
                          />
                        )}
                        {(column.id === 'fromDate' ||
                          column.id === 'toDate') && (
                          <Date
                            disabled={!row['isEdit']}
                            name={row[column.id]}
                            value={row[column.id]}
                            onChange={(date) => {
                              changeRowDetails(rowIndex, column.id, date);
                            }}
                          />
                        )}
                        {column.id === 'country' && (
                          <SearchDropdown
                            disabled={!row['isEdit']}
                            disableClearable={true}
                            name={'country'}
                            options={[
                              { text: 'Select', value: '' },
                              ...(countryList || []),
                            ]}
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
                                  fontSize: '13px',
                                  minHeight: '30px',
                                  display: 'flex',
                                  alignItems: 'center',
                                },
                              },
                            }}
                            value={
                              countryList?.find(
                                (option) => option.value === row[column.id]
                              ) || null
                            }
                            onChange={(event, value) => {
                              if (value?.value) {
                                changeRowDetails(
                                  rowIndex,
                                  column.id,
                                  value?.value
                                );
                              }
                            }}
                          />
                        )}
                      </StyledTableBodyCell>
                    ))}
                  {checkAccess(
                    isSuperAdmin,
                    roleMenu?.IsView,
                    roleMenu?.IsEdit || roleMenu?.IsDelete
                  ) && (
                    <ActionCell>
                      <FlexContainer className="action-icons">
                        {!row['isEdit'] && (
                          <Tooltip title="Edit" arrow>
                            <StyledImage
                              cursor="pointer"
                              height="15px"
                              width="15px"
                              src={EditIcon}
                              alt="Edit"
                              onClick={() =>
                                changeRowDetails(rowIndex, 'isEdit', true)
                              }
                            />
                          </Tooltip>
                        )}
                        {row['isEdit'] && (
                          <Tooltip title="Save" arrow>
                            <StyledImage
                              cursor="pointer"
                              height="20px"
                              width="20px"
                              src={SaveIcon}
                              alt="Delete"
                              onClick={() => saveRecord(rowIndex)}
                            />
                          </Tooltip>
                        )}
                        {row['isEdit'] && (
                          <Tooltip title="Delete" arrow>
                            <StyledImage
                              cursor="pointer"
                              height="20px"
                              width="20px"
                              src={DeleteIcon}
                              alt="Delete"
                              onClick={() => deleteRecord(rowIndex)}
                            />
                          </Tooltip>
                        )}
                      </FlexContainer>
                    </ActionCell>
                  )}
                </StyledTableRow>
              ))}
            </TableBody>
          ) : (
            <TableBody>
              <StyledTableRow>
                <StyledTableBodyCell
                  colSpan={
                    educationColumnsList?.filter((col) => col.isShow).length + 2
                  }
                  style={{ textAlign: 'center' }}
                >
                  {t('NoDataAvailable')}
                </StyledTableBodyCell>
              </StyledTableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>
      <FlexContainer width="100%" marginTop="20px" justifyContent="flex-end">
        <StyledButton
          variant="contained"
          padding={'6px 10px'}
          width="fit-content"
          onClick={addMore}
          startIcon={
            <StyledImage
              height="14px"
              width="14px"
              src={PlusIcon}
              alt="Add New Icon"
              style={{ marginInlineEnd: 8 }}
            />
          }
        >
          {t('AddMore')}
        </StyledButton>
      </FlexContainer>
    </FlexContainer>
  );
};

export default LSCDataTable;
