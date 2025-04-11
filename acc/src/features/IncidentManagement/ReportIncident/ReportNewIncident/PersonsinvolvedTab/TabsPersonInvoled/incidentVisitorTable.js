
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
import {useSelector,useDispatch} from 'react-redux'
import {setIncidentVisitorInvolved} from '../../../../../../redux/features/IncidentManagement/reportIncidentSlice'
import EditIcon from '../../../../../../assets/Icons/EditIcon.png';
import { ReadOnlyText } from '../../../../IncidentInvestigation/IncidentInvestigation.styled';

const incidentVisitorTable = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const { values, setFieldValue } = useFormikContext();
  const dispatch=useDispatch()
  const { id } = useParams();
  const {incidentVisitorInvolved,pageLoadData}=useSelector(state=>state.reportIncident) 

 
  const handleOnDelete = (rowNo, index) => {
    if (id) {
      const checkNeVisitor = incidentVisitorInvolved?.find((item => item.rowNo === rowNo && item.isNewRow == true))
      if (!checkNeVisitor) {
        const updatedArray = incidentVisitorInvolved?.map((item, i) =>
          (item.rowNo === rowNo) ? { ...item, isDelete: true } : item
        );
        dispatch(setIncidentVisitorInvolved(updatedArray))
      } else {
        const updatedArray = [...incidentVisitorInvolved];
        updatedArray.splice(index, 1);
        dispatch(setIncidentVisitorInvolved(updatedArray))
      }
    } else {
      const updatedArray = [...incidentVisitorInvolved];
      updatedArray.splice(index, 1);
      if (updatedArray?.length > 0) {
        const newArray = updatedArray?.map((item, i) => ({ ...item, rowNo: i + 1 }));
        dispatch(setIncidentVisitorInvolved(newArray))
      } else {
        dispatch(setIncidentVisitorInvolved(updatedArray))
      }
    }

  };
  const handleEditRow = ( row) => {
    setFieldValue('visitorRowNo',row?.rowNo||0)
    setFieldValue('visitorName', row?.visitorName || '');
    setFieldValue('visitorAge', row?.visitorAge || '');
    setFieldValue('visitorGender', row?.visitorGender || '');
    setFieldValue('visitorDepartmentId', row?.departmentId || '');
    setFieldValue('reasonforVisit', row?.reasonforVisit || '');  
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
                Name
              </StyledTableHeaderCell>
              <StyledTableHeaderCell >
                Age
              </StyledTableHeaderCell>
              <StyledTableHeaderCell >
                Gender
              </StyledTableHeaderCell>
              <StyledTableHeaderCell >
                Department
              </StyledTableHeaderCell>
              <StyledTableHeaderCell >
                Reason for Visit
              </StyledTableHeaderCell>
              <StyledTableHeaderCell >
                Actions
              </StyledTableHeaderCell>
            </StyledTableRow>
          </StyledTableHead>
          <TableBody>
            {incidentVisitorInvolved?.filter(item=>item.isDelete==false)?.length === 0 ? (
              <StyledTableRow>
                <StyledTableBodyCell colSpan={6} align="center">
                  No data Found
                </StyledTableBodyCell>
              </StyledTableRow>
            ) : (
              incidentVisitorInvolved?.filter(item=>item.isDelete==false)?.map((row, index) => {
                const departmentName=pageLoadData?.Data?.DepartmentList?.find((item)=>item.DepartmentId==row?.departmentId)?.DepartmentName   
                return (
                  <StyledTableRow key={index}>
                    <StyledTableBodyCell>{index+1}</StyledTableBodyCell>
                    <StyledTableBodyCell>
                      <ReadOnlyText name="visitorName">{row.visitorName}</ReadOnlyText>
                    </StyledTableBodyCell>
                    <StyledTableBodyCell>
                      <ReadOnlyText name="visitorAge">{row.visitorAge}</ReadOnlyText>
                    </StyledTableBodyCell>
                    <StyledTableBodyCell>
                      <ReadOnlyText name="visitorGender">{row.visitorGender}</ReadOnlyText>
                    </StyledTableBodyCell>
                    <StyledTableBodyCell>
                      <ReadOnlyText name="departmentName">{departmentName}</ReadOnlyText>
                    </StyledTableBodyCell>
                    <StyledTableBodyCell>
                      <ReadOnlyText name="reasonforVisit">{row.reasonforVisit}</ReadOnlyText>
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
                            onClick={() => handleOnDelete(row.rowNo,index)}
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

export default incidentVisitorTable;
