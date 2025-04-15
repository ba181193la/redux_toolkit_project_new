
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
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { setIncidentOthersInvolved } from '../../../../../../redux/features/IncidentManagement/reportIncidentSlice'
import EditIcon from '../../../../../../assets/Icons/EditIcon.png';
import { ReadOnlyText } from '../../../../IncidentInvestigation/IncidentInvestigation.styled';
import { map } from 'lodash';

const OthersTable = ({ }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const dispatch = useDispatch()
  const { id } = useParams();
  const {incidentOthersInvolved}=useSelector(state=>state.reportIncident) 
  const [forceRender, setForceRender] = useState(0);
  const { values, setFieldValue } = useFormikContext();

  // const handleOnDelete = (index) => {
  //   const updatedArray = [...incidentOthersInvolved];
  //   updatedArray.splice(index, 1);
  //   if(updatedArray?.length>0){
  //     const newUpdateArray=updatedArray?.map((item,index)=>{
  //       return{
  //         ...item,
  //         rowNo:index+1,
  //       }
  //     })
      
  //     dispatch(setIncidentOthersInvolved(newUpdateArray))
  //   }else{
  //     dispatch(setIncidentOthersInvolved(updatedArray))
  //   }
   
  // };
  const handleOnDelete = (rowNo, index) => {
    if (id) {
      const checkNewOthers = incidentOthersInvolved?.find((item => item.rowNo === rowNo && item.isNewRow == true))
      if (!checkNewOthers) {
        const updatedArray = incidentOthersInvolved?.map((item, i) =>
          (item.rowNo === rowNo) ? { ...item, isDelete: true } : item
        );
        dispatch(setIncidentOthersInvolved(updatedArray))
      } else {
        const updatedArray = [...incidentOthersInvolved];
        updatedArray.splice(index, 1);
        dispatch(setIncidentOthersInvolved(updatedArray))
      }
    } else {
      const updatedArray = [...incidentOthersInvolved];
      updatedArray.splice(index, 1);
      if (updatedArray?.length > 0) {
        const newArray = updatedArray?.map((item, i) => ({ ...item, rowNo: i + 1 }));
        dispatch(setIncidentOthersInvolved(newArray))
      } else {
        dispatch(setIncidentOthersInvolved(updatedArray))
      }
    }

  };
  const handleEditRow = (row) => {
    setFieldValue('othersRowNo', row?.rowNo)
    setFieldValue('othersName', row?.name);
    setFieldValue('othersAge', row?.age);
    setFieldValue('othersGender', row?.gender);
    setFieldValue('othersDetails', row?.details);
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
                Other Name
              </StyledTableHeaderCell>
              <StyledTableHeaderCell >
                Other Age
              </StyledTableHeaderCell>
              <StyledTableHeaderCell >
                Other Gender
              </StyledTableHeaderCell>
              <StyledTableHeaderCell >
                Other Details
              </StyledTableHeaderCell>
              <StyledTableHeaderCell >
                Actions
              </StyledTableHeaderCell>
            </StyledTableRow>
          </StyledTableHead>
          <TableBody>
            {incidentOthersInvolved?.filter(item=>item.isDelete==false)?.length === 0 ? (
              <StyledTableRow>
                <StyledTableBodyCell colSpan={6} align="center">
                  No data Found
                </StyledTableBodyCell>
              </StyledTableRow>
            ) : (
              incidentOthersInvolved?.filter(item=>item.isDelete==false)?.map((row, index) => {
                return (
                  <StyledTableRow key={index}>
                    <StyledTableBodyCell>{index+1}</StyledTableBodyCell>
                    <StyledTableBodyCell>
                      <ReadOnlyText name="name">{row.name}</ReadOnlyText>
                    </StyledTableBodyCell>
                    <StyledTableBodyCell>
                      <ReadOnlyText name="age">{row.age}</ReadOnlyText>
                    </StyledTableBodyCell>
                    <StyledTableBodyCell>
                      <ReadOnlyText name="gender">{row.gender}</ReadOnlyText>
                    </StyledTableBodyCell>
                    <StyledTableBodyCell>
                      <ReadOnlyText name="details">{row.details}</ReadOnlyText>
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

export default OthersTable;
