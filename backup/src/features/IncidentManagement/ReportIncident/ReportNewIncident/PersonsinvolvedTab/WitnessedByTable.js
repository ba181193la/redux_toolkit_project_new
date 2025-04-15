// export default ImmediateActionTakenTable;
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
} from '../../../../../utils/DataTable.styled';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
} from '../../../../../utils/StyledComponents';
import AddSubMaster from '../../../../../assets/Icons/AddSubMaster.png';
import { TextField } from '../../../../../components/TextField/TextField';
import DeleteIcon from '../../../../../assets/Icons/DeleteIcon.png';
import SaveIcon from '../../../../../assets/Icons/SaveIcon.png';
import StaffDetailsList from '../IncidentCategoryTab/StaffDetailsList';
import Search from '../../../../../assets/Icons/Search.png';
import { useFormikContext } from 'formik';
import {useSelector}  from 'react-redux'
import { useParams } from 'react-router-dom'
import EditIcon from '../../../../../assets/Icons/EditIcon.png';
import WitnessedByStaffModal from './WitnessedByStaffModal';
import Staff from './TabsPersonInvoled/Staff';

const WitnessedByTable = ({IncidentData}) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const { values, setFieldValue } = useFormikContext();  
  const { id } = useParams();

  const handleAddRow = () => {
    // const lastRow = values?.incidentWitnessedBy?.[values.incidentWitnessedBy.length - 1];
    const lastRowIndex = values?.incidentWitnessedBy?.length || 0;
    setFieldValue('incidentWitnessedBy', [
      ...(values?.incidentWitnessedBy || []),
      {
        rowNo: lastRowIndex+1,
        staffId: 0, 
        staffName: '',
        department: '',
        designation: '',
        isEditing: true,
        isNewRow:true,
        isDelete:false
      },
    ]);
  };

  const handleOnDelete = (staffId,index) => {
    if (id) {
      const checkWitnessBy = values.incidentWitnessedBy?.find((item => item.staffId === staffId && item.isNewRow == true))
      if (!checkWitnessBy) {
        const updatedArray = values.incidentWitnessedBy?.map((item, i) =>
          (item.staffId === staffId) ? { ...item, isDelete: true } : item
        );
        setFieldValue('incidentWitnessedBy', updatedArray);
      } else {
        const updatedArray = [...values.incidentWitnessedBy];
        updatedArray.splice(index, 1);
        setFieldValue('incidentWitnessedBy', updatedArray);
      }
    } else {
      const updatedArray = [...values.incidentWitnessedBy];
      updatedArray.splice(index, 1);
      if (updatedArray?.length > 0) {
        const newArray = updatedArray?.map((item, i) => ({ ...item, rowNo: i + 1 }));
        setFieldValue('incidentWitnessedBy', newArray);
      } else {
        setFieldValue('incidentWitnessedBy', updatedArray);
      }
    }
    // const updatedArray = [...values.incidentWitnessedBy];
    // updatedArray.splice(index, 1);
    // setFieldValue('incidentWitnessedBy', updatedArray);
  };

  const handleEditRow = (index) => {
    const updatedArray = values.incidentWitnessedBy.map((item, i) =>
      i === index ? { ...item, isEditing: true } : item
    );
    setFieldValue('incidentWitnessedBy', updatedArray);
  };

  const handleSelectRow = (row) => {
    const index=values.incidentWitnessedBy?.findIndex(staff=>staff.staffId===row?.UserId)
    if(index===-1){
      setFieldValue(`incidentWitnessedBy.${selectedIndex}.staffId`, row?.UserId);
      setFieldValue(`incidentWitnessedBy.${selectedIndex}.staffName`, row?.StaffName);
      setFieldValue(`incidentWitnessedBy.${selectedIndex}.department`, row?.Department);
      setFieldValue(`incidentWitnessedBy.${selectedIndex}.designation`, row?.PrimaryDesignation);
      setFieldValue(`incidentWitnessedBy.${selectedIndex}.isDelete`, false);
      setFieldValue(`incidentWitnessedBy.${selectedIndex}.isEditing`, false);
      setFieldValue(`incidentWitnessedBy.${selectedIndex}.isNewRow`, true);


    }else{
      return
    }  
  };

  //  useEffect(() => {
  //     const IM_TableData = IncidentData?.Data?.incidentWitnessedBy?.map((item)=>{
  //       return{
  //         staffName: item.StaffId,
  //         department: item.DepartmentName,
  //         designation: item.DesignationName
  //       }
  //     })
  //     // setFieldValue(
  //     //   'incidentActionTaken',
  //     //   IM_TableData
  //     // );
  //   }, [IncidentData, setFieldValue]);
  // useEffect(() => {      
  //     if (IncidentData?.Data?.incidentWitnessedBy?.length > 0) {
  
  //       const witnessedByArray = IncidentData?.Data?.incidentWitnessedBy?.map(
  //         (item) => {
  //           return {
  //             staffName: item.StaffId,
  //         department: item.DepartmentName,
  //         designation: item.DesignationName
  //           };
  //         }
  //       );  
  //       setFieldValue('incidentWitnessedBy', witnessedByArray);
  //     }
  //     else {
  //       setFieldValue('incidentWitnessedBy', []);
  //     }
  //   }, [IncidentData]);


 

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
                Staff Name
              </StyledTableHeaderCell>
              <StyledTableHeaderCell >
                Department
              </StyledTableHeaderCell>
              <StyledTableHeaderCell >
                Designation
              </StyledTableHeaderCell>
              <StyledTableHeaderCell >
                Action
              </StyledTableHeaderCell>
            </StyledTableRow>
          </StyledTableHead>
          <TableBody>
            {!values?.incidentWitnessedBy|| values?.incidentWitnessedBy?.filter(item=>item.isDelete==false)?.length === 0 ? (
              <StyledTableRow>
                <StyledTableBodyCell colSpan={6} align="center">
                  No data Found
                </StyledTableBodyCell>
              </StyledTableRow>
            ) : (
              values?.incidentWitnessedBy?.filter(item=>item.isDelete==false)?.map((row, index) => (
                <StyledTableRow>
                  <StyledTableBodyCell>{index + 1}</StyledTableBodyCell>
                  {/* <StyledTableBodyCell>
                    {row.isEditing ? (
                      <TextField
                        name={`incidentActionTaken.${index}.immediateActionTaken`}
                        value={row.immediateActionTaken}
                        onChange={(e) => {
                          const updatedArray = values?.incidentActionTaken?.map(
                            (item, i) =>
                              i === index
                                ? {
                                    ...item,
                                    immediateActionTaken: e.target.value,
                                  }
                                : item
                          );
                          setFieldValue('incidentActionTaken', updatedArray);
                        }}
                      />
                    ) : (
                      <span>{row.immediateActionTaken}</span>
                    )}
                  </StyledTableBodyCell> */}
                  <StyledTableBodyCell>
                    <TextField
                      name={'staffName'}
                      value={row.staffName}
                      InputProps={{
                        readOnly: !row.isEditing,
                        endAdornment: row.isEditing && (
                          <InputAdornment position="start">
                            <StyledImage
                              src={Search}
                              alt="Search Icon"
                              onClick={() => setSelectedIndex(index)}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </StyledTableBodyCell>
                  <StyledTableBodyCell>
                    <TextField
                      name="department"
                      value={row.department}
                      disabled={!row.isEditing}
                    />
                  </StyledTableBodyCell>
                  <StyledTableBodyCell>
                    <TextField
                      name="designation"
                      value={row.designation}
                      disabled={!row.isEditing}
                    />
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
                            onClick={() => handleEditRow(index)}
                          />
                        </Tooltip>
                      <Tooltip title="Delete" arrow>
                        <StyledImage
                          cursor="pointer"
                          height="15px"
                          width="15px"
                          src={DeleteIcon}
                          alt="Delete"
                          onClick={() => handleOnDelete(row.staffId, index)}
                        />
                      </Tooltip>
                    </FlexContainer>
                  </ActionCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <FlexContainer
        style={{
          marginTop: '20px',
          justifyContent: 'flex-end',
          gap: '10px',
        }}
      >
        <StyledButton
          onClick={handleAddRow}
          variant="contained"
          marginTop={'10px'}
          startIcon={
            <StyledImage
              height="14px"
              width="14px"
              src={AddSubMaster}
              alt="Add New Icon"
              style={{ marginInlineEnd: 8 }}
            />
          }
        >
          Add More
        </StyledButton>
      </FlexContainer>

      {selectedIndex !== null && (
        <WitnessedByStaffModal
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          handleSelectRow={handleSelectRow}
        />
      )}
    </FlexContainer>
  );
};

export default WitnessedByTable;
