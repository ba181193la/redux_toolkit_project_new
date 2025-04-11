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
} from '@mui/material';
import {
  StyledTableBodyCell,
  StyledTableHeaderCell,
  StyledTableRow,
  StyledTableHead,
  ActionButton,
  ActionCell,
} from '../../../../utils/DataTable.styled';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledSearch,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import { getlabel } from '../../../../utils/language';
import { useTranslation } from 'react-i18next';
import AddSubMaster from '../../../../assets/Icons/AddSubMaster.png';
import Date from '../../../../components/Date/Date';
import AddStaffModel from './AddStaffModel';
import { useDispatch, useSelector } from 'react-redux';
import SaveIcon from '../../../../assets/Icons/SaveIcon.png';
import DeleteIcon from '../../../../assets/Icons/DeleteIcon.png';
import EditIcon from '../../../../assets/Icons/EditIcon.png';
import formatDate from '../../../../utils/FormatDate';
import { Snackbar } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { useReassignInvestigatorsMutation } from '../../../../redux/RTK/IncidentManagement/incidentApprovalApi';
import { useNavigate, useParams } from 'react-router-dom';


const ReAssignOpinion = ({ columns, labels, data }) => {
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
  const [triggerReassignInvestigator] = useReassignInvestigatorsMutation();

  const [openDialog, setOpenDialog] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const { id } = useParams();

 const {
    selectedMenu,
    userDetails,
    selectedFacility,
    selectedModuleId,
  } = useSelector((state) => state.auth);


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
    };

    handleRowUpdate(formattedRow);
  };

  const handleRowUpdate = (updatedRow) => {
    const newRow = {
      ResponsibleStaff: updatedRow.ResponsibleStaff || '',
      PrevInvDepartment: updatedRow.DepartmentName || '',
      ResponsibleStaffId: updatedRow.ResponsibleStaffId || '',
      PrevInvDesignation: updatedRow.Designation || '',
    };

    const updatedRows = tableData.map((row, index) => {
      return {
        PrevInvDepartment: newRow.PrevInvDepartment || '',
        ReAssignedStaff: newRow.ResponsibleStaff || '',
        ResponsibleStaffId: newRow.ResponsibleStaffId,
        PrevInvestigatorName: row.PrevInvestigatorName || '',
        PrevInvDesignation: newRow.PrevInvDesignation || '',
        Comments: row.Comments || '',
      };
    });

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

  
    try {
      await triggerReassignInvestigator({
        payload: {
          "incidentApprovalId": tableData[0].IncidentApprovalId,
          "incidentId": id,
          "facilityId": selectedFacility?.id,
          "incidentNo": "",
          "investigatorList": [
            {
              "id": 0,
              "prevUserId": tableData[0].ReAssignedInvestigatorId,
              "userId": tableData[0].ResponsibleStaffId,
              "comments": tableData[0].Comments ?? '',
            }
          ],
          "moduleId": selectedModuleId,
           "menuId": selectedMenu?.id,
           "loginUserId": userDetails?.UserId,
          "reassignRemarks": ""
        },
      }).unwrap();

      navigate("/IncidentManagement/IncidentApproval");
    } catch (error) {
      console.error('Error rejecting incident:', error);
    }
  };

  return (
    <FlexContainer flexDirection="column" width="100%">
      <TableContainer component={Paper} style={{ marginBottom: '20px' }}>
        <Snackbar
          open={open}
          autoHideDuration={5000}
          onClose={handleClose}
          message={message}
        />
        <Table>
          <StyledTableHead backgroundColor="#138e80">
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
            {tableData?.length && tableData?.length && (
              tableData.map((row, index) => (
                <StyledTableRow key={index}>
                  {
                    <>
                      <StyledTableBodyCell>{index + 1}</StyledTableBodyCell>
                      <StyledTableBodyCell>
                        {row.PrevInvestigatorName ?? ''}
                      </StyledTableBodyCell>

                      <StyledTableBodyCell>
                        {row.ReAssigneRemarks ?? '  '}
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
                            value={row.ReAssignedStaff}
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
                              onClick={() => setIsStaffModel(true)}
                              style={{
                                cursor: 'pointer',
                                fontSize: '15px',
                                color: '#555',
                                backgroundColor: '#eee',
                              }}
                            >

                            </i>
                          </div>
                        </div>
                      </StyledTableBodyCell>
                      <StyledTableBodyCell>
                        {row.PrevInvDepartment ?? ''}
                      </StyledTableBodyCell>

                      <StyledTableBodyCell>
                        {row.PrevInvDesignation ?? ''}
                      </StyledTableBodyCell>
                      <StyledTableBodyCell>
                        <TextField
                          multiline
                          fullWidth
                          value={row.Comments ?? ''}
                          rows={4}
                          onChange={(e) =>
                            handleInputChange(e, row.RowNo, 'Comments')
                          }
                          sx={{
                            '& .MuiInputBase-input.Mui-disabled': {
                              opacity: 1,
                              fontWeight: 'bold',
                              color: 'black',
                              WebkitTextFillColor: 'black',
                            },
                          }}
                        />
                      </StyledTableBodyCell>
                    </>
                  }
                </StyledTableRow>
              ))
            ) }
          </TableBody>
        </Table>

        
            
      </TableContainer>

      <FlexContainer
                    padding="0px"
                    justifyContent="center"
                    alignItems="center"
                    gap="20px"
                    
                  >
                    <ActionButton
                      style={{
                        backgroundColor: '#5cb85c',
                        color: 'white',
                      }}
                      startIcon={
                        <i className="fa fa-paper-plane" style={{ marginInlineEnd: 8 }} />
                      }
                      onClick={handleSubmit}
                    >
                      {t('Submit')}
                    </ActionButton>
      
        
                    <ActionButton
                      style={{
                        backgroundColor: '#6c757d',
                        color: 'white',
                      }}
                      startIcon={
                        <i
                          className="fas fa-ban"
                          style={{
                            color: 'white',
                            marginInlineEnd: 8,
                            fontSize: '16px',
                          }}
                        />
                      }
                    >
                      {t('Cancel')}
                    </ActionButton>
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
