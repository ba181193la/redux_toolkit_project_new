import React, { useEffect, useState } from 'react';
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
import EditIcon from '../../../../../../assets/Icons/EditIcon.png';
import { useSelector, useDispatch } from 'react-redux'
import { setIncidentPatientInvolved } from '../../../../../../redux/features/IncidentManagement/reportIncidentSlice'
import { ReadOnlyText } from '../../../../IncidentInvestigation/IncidentInvestigation.styled';

const PatientTable = ({ IncidentData }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const { values, setFieldValue } = useFormikContext();
  const dispatch = useDispatch()
  const { id } = useParams();
  const { incidentPatientInvolved, pageLoadData } = useSelector(state => state.reportIncident)

  const handleOnDelete = (patientId, index) => {
    if (id) {
      const checkNewPatient = incidentPatientInvolved?.find((item => item.patientId === patientId && item.isNewRow == true))
      if (!checkNewPatient) {
        const updatedArray = incidentPatientInvolved?.map((item, i) =>
          (item.patientId === patientId) ? { ...item, isDelete: true } : item
        );
        dispatch(setIncidentPatientInvolved(updatedArray))
      } else {
        const updatedArray = [...incidentPatientInvolved];
        updatedArray.splice(index, 1);
        dispatch(setIncidentPatientInvolved(updatedArray))
      }
    } else {
      const updatedArray = [...incidentPatientInvolved];
      updatedArray.splice(index, 1);
      if (updatedArray?.length > 0) {
        const newArray = updatedArray?.map((item, i) => ({ ...item, rowNo: i + 1 }));
        dispatch(setIncidentPatientInvolved(newArray))
      } else {
        dispatch(setIncidentPatientInvolved(updatedArray))
      }
    }

  };
  const handleEditRow = (row) => {
    setFieldValue('patientId', row?.patientId || '')
    setFieldValue('designation', row?.designation || '')
    setFieldValue('patientName', row?.patientName || '')
    setFieldValue('PatientRoomNo', row?.roomNo || '')
    setFieldValue('age', row?.age || '')
    setFieldValue('gender', row?.gender || '')
    setFieldValue('diagnosis', row?.diagnosis || '')
    setFieldValue('visitId', row?.visitId || '')
    setFieldValue('physicianName', row?.physicianName || '')
    setFieldValue('isPhysicianNotified', row?.isPhysicianNotified || '')
    setFieldValue('NotifiedPhysician', row?.NotifiedPhysician || '')
    setFieldValue('PhysicianDepartment', row?.departmentId || '')

  };


  return (
    <FlexContainer flexDirection="column" width="100%">
      <TableContainer component={Paper}>
        <Table>
          <StyledTableHead backgroundColor="rgb(52, 152, 219)">
            <StyledTableRow>
              <StyledTableHeaderCell>S.No</StyledTableHeaderCell>
              <StyledTableHeaderCell>Patient Id</StyledTableHeaderCell>
              <StyledTableHeaderCell>patient Name</StyledTableHeaderCell>
              <StyledTableHeaderCell>Age</StyledTableHeaderCell>
              <StyledTableHeaderCell>Gender</StyledTableHeaderCell>
              <StyledTableHeaderCell>PhysicianDepartment</StyledTableHeaderCell>
              <StyledTableHeaderCell>Room No</StyledTableHeaderCell>
              <StyledTableHeaderCell>Physician Name</StyledTableHeaderCell>
              <StyledTableHeaderCell>Diagnosis </StyledTableHeaderCell>
              <StyledTableHeaderCell>Visit Id</StyledTableHeaderCell>
              <StyledTableHeaderCell>Physician Notified</StyledTableHeaderCell>
              <StyledTableHeaderCell>Notified Physician</StyledTableHeaderCell>
              <StyledTableHeaderCell>Actions</StyledTableHeaderCell>
            </StyledTableRow>
          </StyledTableHead>
          <TableBody>
            {incidentPatientInvolved?.length === 0 ? (
              <StyledTableRow>
                <StyledTableBodyCell colSpan={8} align="center">
                  No data Found
                </StyledTableBodyCell>
              </StyledTableRow>
            ) : (
              incidentPatientInvolved?.filter(item => item.isDelete == false)?.map((row, index) => {
                const departmentName = pageLoadData?.Data?.DepartmentList?.find((item) => item.DepartmentId == row?.departmentId)?.DepartmentName
                return (
                  <StyledTableRow key={index}>
                    <StyledTableBodyCell>{row?.rowNo}</StyledTableBodyCell>
                    <StyledTableBodyCell>
                      <ReadOnlyText name="patientId">
                        {row.patientId}
                      </ReadOnlyText>
                    </StyledTableBodyCell>
                    <StyledTableBodyCell>
                      <ReadOnlyText name="patientName">
                        {row.patientName}
                      </ReadOnlyText>
                    </StyledTableBodyCell>
                    <StyledTableBodyCell>
                      <ReadOnlyText name="age">{row.age}</ReadOnlyText>
                    </StyledTableBodyCell>
                    <StyledTableBodyCell>
                      <ReadOnlyText name="gender">{row.gender}</ReadOnlyText>
                    </StyledTableBodyCell>
                    <StyledTableBodyCell>
                      <ReadOnlyText name="designation"> {departmentName}</ReadOnlyText>
                    </StyledTableBodyCell>
                    <StyledTableBodyCell>
                      <ReadOnlyText name="roomNo">{row.roomNo}</ReadOnlyText>
                    </StyledTableBodyCell>
                    <StyledTableBodyCell>
                      <ReadOnlyText name="physicianName">
                        {row.physicianName}
                      </ReadOnlyText>
                    </StyledTableBodyCell>
                    <StyledTableBodyCell>
                      <ReadOnlyText name="diagonosis">{row.diagnosis} </ReadOnlyText>
                    </StyledTableBodyCell>
                    <StyledTableBodyCell>
                      <ReadOnlyText name="visitId">{row.visitId}</ReadOnlyText>
                    </StyledTableBodyCell>
                    <StyledTableBodyCell>
                      <ReadOnlyText name="isPhysicianNotified">
                        {row.isPhysicianNotified ? "Yes" : "No"}
                      </ReadOnlyText>
                    </StyledTableBodyCell>
                    <StyledTableBodyCell>
                      <ReadOnlyText name="NotifiedPhysician">
                        {row.NotifiedPhysician}
                      </ReadOnlyText>
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
                        {/* {row.isEditing ? (
                                    <Tooltip title="Save" arrow>
                                      <StyledImage
                                        cursor="pointer"
                                        height="15px"
                                        width="15px"
                                        src={SaveIcon}
                                        alt="SaveIcon"
                                        onClick={() => handleSaveRow(index)}
                                      />
                                    </Tooltip>
                                  ) : (
                                    <Tooltip title="Edit" arrow>
                                      <StyledImage
                                        cursor="pointer"
                                        height="15px"
                                        width="15px"
                                        src={EditIcon}
                                        alt="Edit"
                                        onClick={() => handleEditRow(index)}
                                      />
                                    </Tooltip>
                                  )} */}
                        <Tooltip title="Delete" arrow>
                          <StyledImage
                            cursor="pointer"
                            height="15px"
                            width="15px"
                            src={DeleteIcon}
                            alt="Delete"
                            onClick={() => handleOnDelete(row?.patientId, index)}
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

export default PatientTable;
