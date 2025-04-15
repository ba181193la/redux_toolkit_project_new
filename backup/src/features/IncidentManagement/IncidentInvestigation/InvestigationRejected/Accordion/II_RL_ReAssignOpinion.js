import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableSortLabel,
  TableHead,
  TableRow,
  Paper,
  Button,
  Tooltip,
  TextField,
  Grid,
} from '@mui/material';
import {
  StyledTableBodyCell,
  StyledTableHeaderCell,
  StyledTableRow,
  StyledTableHead,
  ActionButton,
  ActionCell,
  FormLabel,
} from '../../../../../utils/DataTable.styled';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledSearch,
  StyledTypography,
} from '../../../../../utils/StyledComponents';
import { getlabel } from '../../../../../utils/language';
import { useTranslation } from 'react-i18next';
import AddSubMaster from '../../../../../assets/Icons/AddSubMaster.png';
import Date from '../../../../../components/Date/Date';
import AddStaffModel from './AddStaffModel';
import { useDispatch, useSelector } from 'react-redux';
import SaveIcon from '../../../../../assets/Icons/SaveIcon.png';
import DeleteIcon from '../../../../../assets/Icons/DeleteIcon.png';
import EditIcon from '../../../../../assets/Icons/EditIcon.png';
import formatDate from '../../../../../utils/FormatDate';
import { Snackbar } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { useCreateReAssignOpinionMutation } from '../../../../../redux/RTK/incidentInvestigationApi';
import { useNavigate, useParams } from 'react-router-dom';
import {
  showSweetAlert,
  showToastAlert,
} from '../../../../../utils/SweetAlert';
import Error from '../../../../../assets/Gifs/error.gif';
import SuccessGif from '../../../../../assets/Gifs/SuccessGif.gif';
import SubmitTik from '../../../../../assets/Icons/SubmitTik.png';
import DoNotDisturbAltIcon from '../../../../../assets/Icons/DoNotDisturbIcon.png';
import CheckIcon from '@mui/icons-material/Check';
import Label from '../../../../../components/Label/Label';

const ReAssignOpinion = ({ columns, labels, data, onCancelClick }) => {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const [isStaffModel, setIsStaffModel] = useState(false);
  const [staffFacilityId, setStaffFacilityId] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [editableRowId, setEditableRowId] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [triggerReassignOpinion] = useCreateReAssignOpinionMutation();
  const [rowIndex, setRowIndex] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const { id } = useParams();
  const [reason, setReason] = useState('');
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [color, setColor] = useState('');

  const { selectedMenu, userDetails, selectedFacility, selectedModuleId } =
    useSelector((state) => state.auth);

  useEffect(() => {
    if (data && data?.length > 0) {
      setTableData(data);
    }
  }, [data]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOnRowClick = (row) => {
    setIsStaffModel(true);
    setStaffFacilityId(row.StaffFacilityId);

    const formattedRow = {
      ResponsibleStaff: row.StaffName || '',
      DepartmentName: row.Department || '',
      ResponsibleStaffId: row.EmployeeId || '',
      Designation: row.PrimaryDesignation || '',
      UserId: row.UserId || '',
    };

    handleRowUpdate(formattedRow);
  };

  const handleRowUpdate = (updatedRow) => {
    const newRow = {
      ResponsibleStaff: updatedRow.ResponsibleStaff || '',
      DepartmentName: updatedRow.DepartmentName || '',
      ResponsibleStaffId: updatedRow.UserId || '',
      DesignationName: updatedRow.Designation || '',
      UserId: updatedRow.UserId || '',
    };
    const updatedRows = [...tableData];

    updatedRows[rowIndex] = {
      DepartmentName: newRow.DepartmentName || '',
      ReAssignedStaff: newRow.ResponsibleStaff || '',
      ResponsibleStaffId: newRow.ResponsibleStaffId || '',
      RespondentName: updatedRows[rowIndex].RespondentName || '',
      DesignationName: newRow.DesignationName || '',
      OpinionId: updatedRows[rowIndex].OpinionId || '',
      OpinionComments: updatedRows[rowIndex].OpinionComments || '',
      UserId: newRow.UserId || '',
    };

    setTableData(updatedRows);
    setIsStaffModel(false);
  };

  const handleInputChange = (e, rowId, field) => {
    const { value } = e.target;
    setTableData((prevData) =>
      prevData.map((row) =>
        row.RowNo === rowId ? { ...row, [field]: value } : row
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const opinionReassignData = tableData.map((row, index) => ({
      opinionId: data[index]?.OpinionId || '',
      opinionUserId: data[index]?.OpinionUserId || '',
      reAssignedOpinionUserId: row.ResponsibleStaffId || '',
    }));

    const payload = {
      incidentInvestigationId: data[0].incidentInvestigationId,
      reAssignedRemarks: reason || '',
      opinionReassign: opinionReassignData,
      loginUserId: userDetails?.UserId,
      moduleId: selectedModuleId,
      menuId: selectedMenu?.id,
      opinionNo: data[0].OpinionNo,
    };

    const invalidEntries = opinionReassignData.filter(
      (item) => !item.reAssignedOpinionUserId
    );

    if (invalidEntries.length > 0) {
      showSweetAlert({
        type: 'warning',
        title: 'Oops!',
        text: 'Re-Assign the respondant before submit',
        gif: Error,
        showConfirmButton: true,
        confirmButtonText: 'Close',
      });
      return;
    }

    try {
      const response = await triggerReassignOpinion(payload);

      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }

      if (response.data.Status === 'Success') {
        showToastAlert({
          type: 'custom_success',
          text: response.data.Message,
          gif: SuccessGif,
        });
        navigate('/IncidentManagement/IncidentInvestigation');
      } else {
        throw new Error(response.data.Message || 'Operation failed');
      }

      setMessage(response.Message);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      const errorMessage =
        error?.data?.Message || error.message || 'An error occurred';
      console.error('Error:', errorMessage);

      showSweetAlert({
        type: 'warning',
        title: 'Oops!',
        text: errorMessage,
        gif: Error,
        showConfirmButton: true,
        confirmButtonText: 'Close',
      });

      setColor('#e63a2e');
      setMessage('Failed');
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  return (
    <FlexContainer flexDirection="column" width="100%" padding="20px">
      <TableContainer component={Paper} style={{ marginBottom: '20px' }}>
        <Snackbar
          open={open}
          autoHideDuration={5000}
          onClose={handleClose}
          message={message}
        />
        <Table>
          <StyledTableHead backgroundColor="#3C8DBC">
            <StyledTableRow>
              <StyledTableHeaderCell color="#fff">
                {t('SNo')}
              </StyledTableHeaderCell>
              {columns?.map((column) => (
                <StyledTableHeaderCell color="#fff" key={column.name}>
                  {getlabel(column.translationId, labels, i18n.language)}
                </StyledTableHeaderCell>
              ))}
            </StyledTableRow>
          </StyledTableHead>
          <TableBody>
            {tableData?.length &&
              tableData?.length &&
              tableData.map((row, index) => (
                <StyledTableRow key={index}>
                  {
                    <>
                      <StyledTableBodyCell>{index + 1}</StyledTableBodyCell>
                      <StyledTableBodyCell>
                        {row.OpinionId ?? ''}
                      </StyledTableBodyCell>

                      <StyledTableBodyCell>
                        {row.RespondentName ?? '  '}
                      </StyledTableBodyCell>
                      <StyledTableBodyCell>
                        <div
                          style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: '#eee',
                          }}
                        >
                          <TextField
                            fullWidth
                            value={row.ReAssignedStaff || ''}
                            disabled
                            sx={{
                              '& .MuiInputBase-input.Mui-disabled': {
                                opacity: 1,
                                fontWeight: 'bold',
                                color: 'black',
                                WebkitTextFillColor: 'black',
                                backgroundColor: '#eee',
                              },
                            }}
                            InputProps={{
                              style: {
                                paddingRight: '40px',
                                backgroundColor: '#eee',
                              },
                            }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              right: '10px',
                              display: 'flex',
                              alignItems: 'center',
                              height: '100%',
                              borderLeft: '1px solid #ccc',
                              paddingLeft: '10px',
                              backgroundColor: '#eee',
                            }}
                          >
                            <i
                              className="fa fa-search"
                              onClick={() => {
                                setIsStaffModel(true);
                                setRowIndex(index);
                              }}
                              style={{
                                cursor: 'pointer',
                                fontSize: '15px',
                                color: '#555',
                                backgroundColor: '#eee',
                              }}
                            ></i>
                          </div>
                        </div>
                      </StyledTableBodyCell>
                      <StyledTableBodyCell>
                        {row.DepartmentName ?? ''}
                      </StyledTableBodyCell>

                      <StyledTableBodyCell>
                        {row.DesignationName ?? ''}
                      </StyledTableBodyCell>
                      <StyledTableBodyCell>
                        {row.OpinionComments ?? ''}
                      </StyledTableBodyCell>
                    </>
                  }
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <FlexContainer
        justifyContent="flex-start"
        flexDirection="row"
        gap="10px"
        width="100%"
      >
         <Label 
          value={getlabel('IM_II_ReasonForChange', labels, i18n.language)} 
          isRequired={true} 
        />
        <TextField
          multiline
          variant="outlined"
          fullWidth
          rows={4}
          onChange={(e) => {
            setReason(e.target.value);
          }}
        />
      </FlexContainer>
      <FlexContainer
        padding="20px"
        flexDirection="column"
        gap="20px"
        width="100%"
      >
        {/* Buttons Section */}
        <FlexContainer
          style={{
            gap: '20px',
            marginTop: '10px',
            marginLeft: '0px',
            justifyContent: 'center',
          }}
        >
          <ActionButton
            style={{
              backgroundColor: '#1976d2',
              color: 'white',
            }}
            startIcon={<CheckIcon sx={{ fontSize: 18, mr: 0.5 }} />}
            onClick={handleSubmit}
          >
            {t('Submit')}
          </ActionButton>

          <ActionButton
            sx={{
              backgroundColor: 'white',
              color: 'black !important',
              border: '1px solid #1976d2',
              '&:hover': {
                backgroundColor: 'white',
              },
            }}
            startIcon={
              <i
                className="fas fa-ban"
                style={{
                  color: '#1976d2',
                  marginInlineEnd: 8,
                  fontSize: '16px',
                }}
              />
            }
            onClick={() => onCancelClick?.(false)}
          >
            {t('Cancel')}
          </ActionButton>
        </FlexContainer>
      </FlexContainer>

      {isStaffModel && (
        <AddStaffModel
          open={isStaffModel}
          onClose={() => setIsStaffModel(false)}
          setIsStaffModel={setIsStaffModel}
          setStaffFacilityId={setStaffFacilityId}
          onSelectRow={handleOnRowClick}
        />
      )}
    </FlexContainer>
  );
};

export default ReAssignOpinion;
