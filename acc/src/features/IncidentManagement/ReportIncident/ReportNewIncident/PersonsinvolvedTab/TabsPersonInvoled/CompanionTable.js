
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
import {useSelector,useDispatch} from 'react-redux'
import { useParams } from 'react-router-dom'
import {setIncidentRelativeInvolved} from '../../../../../../redux/features/IncidentManagement/reportIncidentSlice'
import EditIcon from '../../../../../../assets/Icons/EditIcon.png';
import { ReadOnlyText } from '../../../../IncidentInvestigation/IncidentInvestigation.styled';
import { find } from 'lodash';

const CompanionTable = ({department}) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const dispatch=useDispatch()
  const { id } = useParams();
  const {incidentRelativeInvolved,pageLoadData}=useSelector(state=>state.reportIncident) 
  const { values, setFieldValue } = useFormikContext();
  const handleOnDelete = (patientId, index) => {
    if (id) {
      const checkNewPatient = incidentRelativeInvolved?.find((item => item.patientId === patientId && item.isNewRow == true))
      if (!checkNewPatient) {
        const updatedArray = incidentRelativeInvolved?.map((item, i) =>
          (item.patientId === patientId) ? { ...item, isDelete: true } : item
        );
        dispatch(setIncidentRelativeInvolved(updatedArray))
      } else {
        const updatedArray = [...incidentRelativeInvolved];
        updatedArray.splice(index, 1);
        dispatch(setIncidentRelativeInvolved(updatedArray))
      }
    } else {
      const updatedArray = [...incidentRelativeInvolved];
      updatedArray.splice(index, 1);
      if (updatedArray?.length > 0) {
        const newArray = updatedArray?.map((item, i) => ({ ...item, rowNo: i + 1 }));
        dispatch(setIncidentRelativeInvolved(newArray))
      } else {
        dispatch(setIncidentRelativeInvolved(updatedArray))
      }
    }

  };
  // const handleOnDelete = (index) => {
  //   const updatedArray = [...incidentRelativeInvolved];
  //   updatedArray.splice(index, 1);
  //   dispatch(setIncidentRelativeInvolved(updatedArray))
  // };

  const handleEditRow = (row) => {    
  setFieldValue('relativePatientId', row?.patientId || '');
  setFieldValue('relativePatientName', row?.patientName || '');
  setFieldValue('relativeName', row?.relativeName || '');
  setFieldValue('relativeGender', row?.relativeGender || '');
  setFieldValue('relativeAge', row?.relativeAge || 0);
  setFieldValue('relativedepartmentId', row?.departmentId || '');
  setFieldValue('relativeRoomNo', row?.roomNo || '');
  setFieldValue('relationship', row?.relationship || '');  
  };
  



//  useEffect(() => {
 
//      if (IncidentData?.Data?.incidentRelativeInvolved?.length > 0) {
//        const CompanionArray = IncidentData?.Data?.incidentRelativeInvolved?.map(
//          (item) => {
//            return {
//              patientId: item.PatientId,
//              patientName: item.PatientName,
//              department: item.Department,
//              designation: item.Designation,
//              roomNo: item.RoomNo,
//              age: item.Age,
//              gender: item.Gender,
//              physicianName: item.PhysicianName,
//              diagnosis: item.Diagnosis,
//              visitId: item.VisitId,
//              isPhysicianNotified: item.IsPhysicianNotified,
//              notifiedPhysicianUser: item.NotifiedPhysician,
//              staffCategory: item.StaffCategory,
//              isEditing: true, // Set isEditing to false when adding new row
//              isSaved: true,
//              isDelete: false,
//            };
//          }
//        );
 
//        setFieldValue('incidentPatientInvolved', PatientArray);
//      } else {
//        setFieldValue('incidentPatientInvolved', []);
//      }
//    }, [IncidentData]);

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
              Patient Id
              </StyledTableHeaderCell>
              <StyledTableHeaderCell >
              Patient Name
              </StyledTableHeaderCell>
              <StyledTableHeaderCell >
              Department
              </StyledTableHeaderCell>
              <StyledTableHeaderCell >
              Room No
              </StyledTableHeaderCell>
              <StyledTableHeaderCell >
              Companion Name
              </StyledTableHeaderCell>
              <StyledTableHeaderCell >
                Companion Age
              </StyledTableHeaderCell>
              <StyledTableHeaderCell >
                Companion Gender
              </StyledTableHeaderCell>
              <StyledTableHeaderCell >
                Relationship
              </StyledTableHeaderCell>
              <StyledTableHeaderCell >
                Actions
              </StyledTableHeaderCell>
            </StyledTableRow>
          </StyledTableHead>
          <TableBody>
  {incidentRelativeInvolved?.length === 0 ? (
    <StyledTableRow>
      <StyledTableBodyCell colSpan={6} align="center">
        No data Found
      </StyledTableBodyCell>
    </StyledTableRow>
  ) : (
    incidentRelativeInvolved?.filter(item=>item.isDelete==false)?.map((row, index) => {  
      const departmentName=pageLoadData?.Data?.DepartmentList?.find((item)=>item.DepartmentId==row?.departmentId)?.DepartmentName   
      return (
        <StyledTableRow key={index}>
          <StyledTableBodyCell>{row.rowNo}</StyledTableBodyCell>
          <StyledTableBodyCell>
            <ReadOnlyText name="patientId">{row.patientId}</ReadOnlyText>
          </StyledTableBodyCell>
          <StyledTableBodyCell>
            <ReadOnlyText name="patientName">{row.patientName}</ReadOnlyText>
          </StyledTableBodyCell>
          <StyledTableBodyCell>
            <ReadOnlyText name="departmentName">{departmentName}</ReadOnlyText>
          </StyledTableBodyCell>
          <StyledTableBodyCell>
            <ReadOnlyText name="roomNo">{row.roomNo}</ReadOnlyText>
            </StyledTableBodyCell>  
          <StyledTableBodyCell>
            <ReadOnlyText name="relativeName"> {row.relativeName} </ReadOnlyText>
            </StyledTableBodyCell>
          <StyledTableBodyCell>
            <ReadOnlyText name="relativeAge">{row.relativeAge}</ReadOnlyText>
          </StyledTableBodyCell>
          <StyledTableBodyCell>
            <ReadOnlyText name="relativeGender">{row.relativeGender}</ReadOnlyText>
          </StyledTableBodyCell>
          <StyledTableBodyCell>
            <ReadOnlyText name="relationship">{row.relationship}</ReadOnlyText>
          </StyledTableBodyCell>
          <ActionCell>
            <FlexContainer className="action-icons">
              <Tooltip title="Edit" arrow>
                  <StyledImage
                    cursor="pointer"
                    height="15px"
                    width="15px"
                    src={EditIcon}
                    alt="SaveIcon"
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
                  onClick={() => handleOnDelete(row.patientId, index)}
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

export default CompanionTable;
