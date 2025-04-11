
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  Paper,
  Tooltip,
  InputAdornment,
} from '@mui/material';
import {useSelector,useDispatch} from 'react-redux'
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
import {useParams} from 'react-router-dom'
import {setIncidentStaffInvolved} from '../../../../../../redux/features/IncidentManagement/reportIncidentSlice'
import AddSubMaster from '../../../../../../assets/Icons/AddSubMaster.png';
import { TextField } from '../../../../../../components/TextField/TextField';
import DeleteIcon from '../../../../../../assets/Icons/DeleteIcon.png';
import SaveIcon from '../../../../../../assets/Icons/SaveIcon.png';
import Search from '../../../../../../assets/Icons/Search.png';
import { useFormikContext } from 'formik';
import EditIcon from '../../../../../../assets/Icons/EditIcon.png';
import { ReadOnlyText } from '../../../../IncidentInvestigation/IncidentInvestigation.styled';

const StaffTable = ({ IncidentData }) => {
  const { id } = useParams();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const dispatch=useDispatch()
  const { values, setFieldValue } = useFormikContext();
  const {incidentStaffInvolved}=useSelector(state=>state.reportIncident) 
  const handleOnDelete = (staffId) => {
    if(id){
      const updatedArray = incidentStaffInvolved?.map((item, i) => 
        item.staffId === staffId ? { ...item, isDelete: true } : item
      );
      dispatch(setIncidentStaffInvolved(updatedArray))
    }else{
      const updatedArray = [...incidentStaffInvolved];
      updatedArray.splice(index, 1);
      dispatch(setIncidentStaffInvolved(updatedArray))
    }
   
  };
  //  useEffect(() => {

  //        if (IncidentData?.Data?.incidentStaffInvolved?.length > 0) {

  //          const personalStaffArray = IncidentData?.Data?.incidentStaffInvolved?.map(
  //            (item) => {
  //              return {
  //               staffId: item.StaffId,
  //                staffName: item.StaffName,
  //            department: item.DepartmentName,
  //            designation: item.DesignationName,
  //            staffCategory: item.staffCategory
  //              };
  //            }
  //          );
  //          setFieldValue('incidentStaffInvolved', personalStaffArray);
  //        }
  //        else {
  //          setFieldValue('incidentStaffInvolved', []);
  //        }
  //      }, [IncidentData]);

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
                Staff Id
              </StyledTableHeaderCell>
              <StyledTableHeaderCell >
                Staff Name
              </StyledTableHeaderCell>
              <StyledTableHeaderCell >
                Department
              </StyledTableHeaderCell>
              <StyledTableHeaderCell >
                Designation
              </StyledTableHeaderCell>
              <StyledTableHeaderCell >
                StaffCategory
              </StyledTableHeaderCell>
              <StyledTableHeaderCell >
                Actions
              </StyledTableHeaderCell>
            </StyledTableRow>
          </StyledTableHead>
          <TableBody>

            {incidentStaffInvolved?.length === 0 ? (
              <StyledTableRow>
                <StyledTableBodyCell colSpan={6} align="center">
                  No data Found
                </StyledTableBodyCell>
              </StyledTableRow>
            ) : (
              incidentStaffInvolved?.filter((item)=>item.isDelete==false)?.map((row, index) => {                
                return (
                  <StyledTableRow key={index}>
                    <StyledTableBodyCell>{index + 1}</StyledTableBodyCell>
                    <StyledTableBodyCell>
                      <ReadOnlyText name="staffId">{row.employeeId}</ReadOnlyText>
                    </StyledTableBodyCell>
                    <StyledTableBodyCell>
                      <ReadOnlyText name="staffName">{row.staffName}</ReadOnlyText>
                    </StyledTableBodyCell>
                    <StyledTableBodyCell>
                      <ReadOnlyText name="department">{row.department}</ReadOnlyText>
                    </StyledTableBodyCell>
                    <StyledTableBodyCell>
                      <ReadOnlyText name="designation">{row.designation}</ReadOnlyText>
                    </StyledTableBodyCell>
                    <StyledTableBodyCell>
                      <ReadOnlyText name="staffCategory">{row.staffCategory}</ReadOnlyText>
                    </StyledTableBodyCell>

                    <ActionCell>
                      <FlexContainer className="action-icons">
                        <Tooltip title="Delete" arrow>
                          <StyledImage
                            cursor="pointer"
                            height="15px"
                            width="15px"
                            src={DeleteIcon}
                            alt="Delete"
                            onClick={() => handleOnDelete(row.staffId)}
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
    </FlexContainer>
  );
};

export default StaffTable;
