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
import { showSweetAlert,showToastAlert } from '../../../../utils/SweetAlert';
import Error from '../../../../assets/Gifs/error.gif';
import SuccessGif from '../../../../assets/Gifs/SuccessGif.gif';
import SubmitTik from '../../../../assets/Icons/SubmitTik.png';
import DoNotDisturbAltIcon from '../../../../assets/Icons/DoNotDisturbIcon.png';

const RejectedByInvestigatorTable = ({ columns, labels, data, viewData }) => {
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

  const [isLoading, setIsLoading] = useState(false);
    const [color, setColor] = useState('');
  

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
      UserId: row.UserId || '',
    };

    handleRowUpdate(formattedRow);
  };

  const handleRowUpdate = (updatedRow) => {
    const newRow = {
      ResponsibleStaff: updatedRow.ResponsibleStaff || '',
      PrevInvDepartment: updatedRow.DepartmentName || '',
      ResponsibleStaffId: updatedRow.ResponsibleStaffId || '',
      PrevInvDesignation: updatedRow.Designation || '',
      UserId: updatedRow.UserId || '',
    };

    const updatedRows = tableData.map((row, index) => {
      return {
        PrevInvDepartment: newRow.PrevInvDepartment || '',
        ReAssignedStaff: newRow.ResponsibleStaff || '',
        ResponsibleStaffId: newRow.ResponsibleStaffId,
        PrevInvestigatorName: row.PrevInvestigatorName || '',
        PrevInvDesignation: newRow.PrevInvDesignation || '',
        Comments: row.Comments || '',
        UserId: newRow.UserId || '',
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
    if (
      !viewData?.assignedInvestigatorList ||
      viewData.assignedInvestigatorList.length === 0 ||
      !viewData.assignedInvestigatorList[0]?.AssignedInvestigatorsId ||
      !viewData?.rejectedHistory ||
      viewData.rejectedHistory.length === 0 ||
      !viewData.rejectedHistory[0]?.RejectedInvestigatorId ||
      !tableData ||
      tableData.length === 0 ||
      !tableData[0]?.UserId
    ) {
      showSweetAlert({
        type: 'warning',
        title: 'Select an Investigator',
        text: 'Please select investigator to replace',
        gif: Error,
        showConfirmButton: true,
        confirmButtonText: 'Close',
      });
      return;
    }
  
    if (!tableData[0]?.Comments || tableData[0].Comments.trim() === '') {
      showSweetAlert({
        type: 'warning',
        title: 'Enter Reassignment Remarks',
        text: 'Please enter remarks for reassignment.',
        gif: Error,
        showConfirmButton: true,
        confirmButtonText: 'Close',
      });
      return;
    }
  
    try {
      const response = await triggerReassignInvestigator({
        payload: {
          "incidentApprovalId": viewData.IncidentApprovalId,
          "incidentId": id,
          "facilityId": selectedFacility?.id,
          "incidentNo": viewData?.IncidentNo,
          "investigatorList": [
            {
              "id": viewData?.assignedInvestigatorList[0].AssignedInvestigatorsId,
              "prevUserId": viewData?.rejectedHistory[0].RejectedInvestigatorId,
              "userId": tableData[0].UserId,
              "comments": tableData[0].Comments ?? '',
            }
          ],
            "moduleId": selectedModuleId,
            "menuId": selectedMenu?.id,
            "loginUserId": userDetails?.UserId,
            "reassignRemarks": tableData[0].Comments ?? '',
            "IsReplace" : true
        },
      }).unwrap();

      showToastAlert({
        type: 'custom_success',
        text: response.Message,
        gif: SuccessGif,
      });
      setMessage(response.Message);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      navigate("/IncidentManagement/IncidentApproval");


    } catch (error) {

      if (error && error.data) {
        showSweetAlert({
          type: 'warning',
          title: 'Oops!',
          text: error.data,
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
                        onChange={(e) =>
                          handleInputChange(e, row.RowNo, 'Comments')
                        }
                        sx={{
                          '& .MuiInputBase-input': {
                            height: '45px', // Set the height for the input area
                          },
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
                                      style={{ backgroundColor: 'rgba(0, 131, 192, 1)' }}
                                      variant="outlined"
                                      sx={{
                                        boxShadow: '0px 4px 4px 0px #00000040',
                                        '&:hover': {
                                          transform: 'scale(1.05) !important',
                                          transition: 'transform 0.3s ease !important',
                                        },
                                      }}
                                      startIcon={
                                        <StyledImage
                                          src={SubmitTik}
                                          style={{
                                            marginBottom: '1px',
                                            marginInlineEnd: 8,
                                            color: '#FFFFFF',
                                          }}
                                        />
                                      }
                    
                                      onClick={handleSubmit}
                                    >
                                      <StyledTypography
                                        textTransform="none"
                                        marginTop="1px"
                                        color="#ffff"
                                      >
                                        {/* Submit */}
                                        {t('Submit')}
                                      </StyledTypography>
                                    </ActionButton>
                                    <ActionButton
                                      variant="outlined"
                                      sx={{
                                        boxShadow: '0px 4px 4px 0px #00000040',
                                        '&:hover': {
                                          transform: 'scale(1.05) !important',
                                          transition: 'transform 0.3s ease !important',
                                        },
                                      }}
                                      startIcon={
                                        <StyledImage
                                          src={DoNotDisturbAltIcon}
                                          style={{
                                            marginBottom: '1px',
                                            marginInlineEnd: 8,
                                          }}
                                        />
                                      }
                                    >
                                      <StyledTypography textTransform="none" marginTop="1px">
                                      {t('Cancel')}
                                      </StyledTypography>
                                    </ActionButton>


                    {/* <ActionButton
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
                    </ActionButton> */}
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

export default RejectedByInvestigatorTable;
