
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  Paper,
  Tooltip,
  InputAdornment,
} from '@mui/material';
import {
  StyledTableBodyCell,
  StyledTableHeaderCell,
  StyledTableRow,
  StyledTableHead,
  ActionCell,
} from '../../../../../../utils/DataTable.styled';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
} from '../../../../../../utils/StyledComponents';
import AddSubMaster from '../../../../../../assets/Icons/AddSubMaster.png';
import { TextField } from '../../../../../../components/TextField/TextField';
import DeleteIcon from '../../../../../../assets/Icons/DeleteIcon.png';
import SaveIcon from '../../../../../../assets/Icons/SaveIcon.png';
import Search from '../../../../../../assets/Icons/Search.png';
import { useFormikContext } from 'formik';
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setIncidentOutStaffInvolved } from '../../../../../../redux/features/IncidentManagement/reportIncidentSlice'
import EditIcon from '../../../../../../assets/Icons/EditIcon.png';
import { ReadOnlyText } from '../../../../IncidentInvestigation/IncidentInvestigation.styled';

const OutSourcedStaffTable = ({ setEditOutStaffData }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const { values, setFieldValue } = useFormikContext();
  const dispatch = useDispatch()
  const { id } = useParams();

  const {incidentOutStaffInvolved,pageLoadData}=useSelector(state=>state.reportIncident) 
  
  const handleOnDelete = (outStaffId, index) => {
    if (id) {
      const checkNewOutStaff = incidentOutStaffInvolved?.find((item => item.outStaffId === outStaffId && item.isNewRow == true))
      if (!checkNewOutStaff) {
        const updatedArray = incidentOutStaffInvolved?.map((item, i) =>
          (item.outStaffId === outStaffId) ? { ...item, isDelete: true } : item
        );
        dispatch(setIncidentOutStaffInvolved(updatedArray))
      } else {
        const updatedArray = [...incidentOutStaffInvolved];
        updatedArray.splice(index, 1);
        dispatch(setIncidentOutStaffInvolved(updatedArray))
      }
    } else {
      const updatedArray = [...incidentOutStaffInvolved];
      updatedArray.splice(index, 1);
      if (updatedArray?.length > 0) {
        const newArray = updatedArray?.map((item, i) => ({ ...item, rowNo: i + 1 }));
        dispatch(setIncidentOutStaffInvolved(newArray))
      } else {
        dispatch(setIncidentOutStaffInvolved(updatedArray))
      }
    }

  };
  const handleEditRow = (row) => {
    setFieldValue('outStaffId', row?.outStaffId)
    setFieldValue('outStaffName', row?.outStaffName)
    setFieldValue('outStaffAge', row?.outStaffAge)
    setFieldValue('outStaffDepartmentId', row?.departmentId)
    setFieldValue('outStaffGender', row?.outStaffGender)
    setFieldValue('companyName', row?.companyName)
  };

  return (
    <FlexContainer flexDirection="column" width="100%">
      <TableContainer component={Paper}>
        <Table>
          <StyledTableHead backgroundColor="rgb(52, 152, 219)">
            <StyledTableRow>
              <StyledTableHeaderCell >
                S.No
              </StyledTableHeaderCell>
              <StyledTableHeaderCell >
                OutSourced Staff Id
              </StyledTableHeaderCell>
              <StyledTableHeaderCell >
                OutSourced Staff Name
              </StyledTableHeaderCell>
              <StyledTableHeaderCell >
                OutSourced Staff Age
              </StyledTableHeaderCell>
              <StyledTableHeaderCell >
                OutSourced Staff Gender
              </StyledTableHeaderCell>
              <StyledTableHeaderCell >
                Department
              </StyledTableHeaderCell>
              <StyledTableHeaderCell >
                Company
              </StyledTableHeaderCell>
              <StyledTableHeaderCell >
                Actions
              </StyledTableHeaderCell>
            </StyledTableRow>
          </StyledTableHead>
          <TableBody>
            {incidentOutStaffInvolved?.filter(item=>item.isDelete==false)?.length === 0 ? (
              <StyledTableRow>
                <StyledTableBodyCell colSpan={6} align="center">
                  No data Found
                </StyledTableBodyCell>
              </StyledTableRow>
            ) : (
              incidentOutStaffInvolved?.filter(item=>item.isDelete==false)?.map((row, index) => {
                const departmentName=pageLoadData?.Data?.DepartmentList?.find((item)=>item.DepartmentId==row?.departmentId)?.DepartmentName   
                return (
                  <StyledTableRow key={index}>
                    <StyledTableBodyCell>{index + 1}</StyledTableBodyCell>
                    <StyledTableBodyCell>
                      <ReadOnlyText name="outStaffId">{row.outStaffId}</ReadOnlyText>
                    </StyledTableBodyCell>
                    <StyledTableBodyCell>
                      <ReadOnlyText name="outStaffName">{row.outStaffName}</ReadOnlyText>
                    </StyledTableBodyCell>
                    <StyledTableBodyCell>
                      <ReadOnlyText name="outStaffAge">{row.outStaffAge}</ReadOnlyText>
                    </StyledTableBodyCell>
                    <StyledTableBodyCell>
                      <ReadOnlyText name="outStaffGender">{row.outStaffGender}</ReadOnlyText>
                    </StyledTableBodyCell>
                    <StyledTableBodyCell>
                      <ReadOnlyText name="departmentName">{departmentName}</ReadOnlyText>
                    </StyledTableBodyCell>
                    <StyledTableBodyCell>
                      <ReadOnlyText name="companyName">{row.companyName}</ReadOnlyText>
                    </StyledTableBodyCell>

                    <ActionCell>
                      <FlexContainer className="action-icons">
                        <Tooltip title="Edit" arrow>
                          <StyledImage
                            cursor="pointer"
                            height="15px"
                            width="15px"
                            src={EditIcon}
                            alt="Edit"
                            onClick={() => handleEditRow(row)}
                          />
                        </Tooltip>
                        <Tooltip title="Delete" arrow>
                          <StyledImage
                            cursor="pointer"
                            height="15px"
                            width="15px"
                            src={DeleteIcon}
                            alt="Delete"
                            onClick={() => handleOnDelete(row.outStaffId,index)}
                          />
                        </Tooltip>
                      </FlexContainer>
                    </ActionCell>
                  </StyledTableRow>
                );
              })
            )}
          </TableBody>

        </Table>
      </TableContainer>



      {/* {selectedIndex !== null && (
        <StaffDetailsList
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
        />
      )} */}
    </FlexContainer>
  );
};

export default OutSourcedStaffTable;
