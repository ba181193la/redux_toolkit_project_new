// import React, { useState } from 'react';
// import {
//   Table,
//   TableBody,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
// } from '@mui/material';
// import {
//   StyledTableBodyCell,
//   StyledTableHeaderCell,
//   StyledTableRow,
//   StyledTableHead,
// } from '../../../../../utils/DataTable.styled';
// import { FlexContainer } from '../../../../../utils/StyledComponents';

// const AdditionalStaff = () => {
//   return (
//     <FlexContainer flexDirection="column" width="100%">
//       <TableContainer component={Paper}>
//         <Table>
//           <StyledTableHead backgroundColor="rgb(52, 152, 219)">
//             <StyledTableRow>
//               <StyledTableHeaderCell>S.No</StyledTableHeaderCell>
//               <StyledTableHeaderCell>Staff Name</StyledTableHeaderCell>
//               <StyledTableHeaderCell>Department</StyledTableHeaderCell>
//               <StyledTableHeaderCell>Designation</StyledTableHeaderCell>
//               <StyledTableHeaderCell>Action</StyledTableHeaderCell>
//             </StyledTableRow>
//           </StyledTableHead>
//           <TableBody>
//             <TableRow>
//               <StyledTableBodyCell colSpan={5} align="center">
//                 No Data Available
//               </StyledTableBodyCell>
//             </TableRow>
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </FlexContainer>
//   );
// };

// export default AdditionalStaff;
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
import { useParams } from 'react-router-dom'
import EditIcon from '../../../../../assets/Icons/EditIcon.png';
import WitnessedByStaffModal from './WitnessedByStaffModal';
import AdditionalStaffPopModal from './AdditionalStaffPopModal';

const WitnessedByTable = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const { values, setFieldValue } = useFormikContext();
  const { id } = useParams();

  const handleAddRow = () => {
    const lastRowIndex = values?.incidentAdditionalNotifyStaff?.length || 0;
    setFieldValue('incidentAdditionalNotifyStaff', [
      ...(values?.incidentAdditionalNotifyStaff || []),
      {
        rowNo: lastRowIndex + 1,
        staffId: 0,
        staffName: '',
        department: '',
        designation: '',
        isEditing: true,
        isNewRow: true,
        isDelete: false
      },
    ]);
  };

  // const handleSaveRow = (index) => {
  //   const row = values.incidentAdditionalNotifyStaff[index];
  //   if (
  //     !row.staffName ||
  //     !row.department ||
  //     !row.designation
  //   ) {
  //     alert('Please fill all fields before saving.');
  //     return;
  //   }

  //   const updatedArray = values.incidentAdditionalNotifyStaff.map((item, i) =>
  //     i === index ? { ...item, isEditing: false, isSaved: true } : item
  //   );
  //   setFieldValue('incidentAdditionalNotifyStaff', updatedArray);
  // };

  const handleOnDelete = (staffId, index) => {
    if (id) {
      const checkAdditionalStaff = values.incidentAdditionalNotifyStaff?.find((item => item.staffId === staffId && item.isNewRow == true))
      if (!checkAdditionalStaff) {
        const updatedArray = values.incidentAdditionalNotifyStaff?.map((item, i) =>
          (item.staffId === staffId) ? { ...item, isDelete: true } : item
        );
        setFieldValue('incidentAdditionalNotifyStaff', updatedArray);
      } else {
        const updatedArray = [...values.incidentAdditionalNotifyStaff];
        updatedArray.splice(index, 1);
        setFieldValue('incidentAdditionalNotifyStaff', updatedArray);
      }
    } else {
      const updatedArray = [...values.incidentAdditionalNotifyStaff];
      updatedArray.splice(index, 1);
      if (updatedArray?.length > 0) {
        const newArray = updatedArray?.map((item, i) => ({ ...item, rowNo: i + 1 }));
        setFieldValue('incidentAdditionalNotifyStaff', newArray);

      } else {
        setFieldValue('incidentAdditionalNotifyStaff', updatedArray);
      }
    }
    // const updatedArray = [...values.incidentAdditionalNotifyStaff];
    // updatedArray.splice(index, 1);
    // setFieldValue('incidentAdditionalNotifyStaff', updatedArray);
  };

  const handleEditRow = (index) => {
    const updatedArray = values.incidentAdditionalNotifyStaff.map((item, i) =>
      i === index ? { ...item, isEditing: true } : item
    );
    setFieldValue('incidentAdditionalNotifyStaff', updatedArray);
  };


  const handleSelectRow = (row) => {
    const index = values.incidentAdditionalNotifyStaff?.findIndex(staff => staff.staffId === row?.UserId)
    if (index === -1) {
      setFieldValue(`incidentAdditionalNotifyStaff.${selectedIndex}.staffId`, row?.UserId);
      setFieldValue(`incidentAdditionalNotifyStaff.${selectedIndex}.staffName`, row?.StaffName);
      setFieldValue(`incidentAdditionalNotifyStaff.${selectedIndex}.department`, row?.Department);
      setFieldValue(`incidentAdditionalNotifyStaff.${selectedIndex}.designation`, row?.PrimaryDesignation);
      setFieldValue(`incidentAdditionalNotifyStaff.${selectedIndex}.isDelete`, false);
      setFieldValue(`incidentAdditionalNotifyStaff.${selectedIndex}.isEditing`, false);
      setFieldValue(`incidentAdditionalNotifyStaff.${selectedIndex}.isNewRow`, true);
    } else {
      return
    }
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
            {!values?.incidentAdditionalNotifyStaff|| values?.incidentAdditionalNotifyStaff?.filter(item => item.isDelete == false)?.length === 0 ? (
              <StyledTableRow>
                <StyledTableBodyCell colSpan={6} align="center">
                  No data Found
                </StyledTableBodyCell>
              </StyledTableRow>
            ) : (
              values?.incidentAdditionalNotifyStaff?.filter(item => item.isDelete == false)?.map((row, index) => (
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
        <AdditionalStaffPopModal
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          handleSelectRow={handleSelectRow}
        />
      )}
    </FlexContainer>
  );
};

export default WitnessedByTable;


