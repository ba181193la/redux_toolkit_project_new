// import React, { useState } from 'react';
// import {
//   Table,
//   TableBody,
//   TableContainer,
//   Paper,
//   Tooltip,
//   InputAdornment,
// } from '@mui/material';
// import {
//   StyledTableBodyCell,
//   StyledTableHeaderCell,
//   StyledTableRow,
//   StyledTableHead,
//   ActionCell,
// } from '../../../../../utils/DataTable.styled';
// import {
//   FlexContainer,
//   StyledButton,
//   StyledImage,
// } from '../../../../../utils/StyledComponents';
// import AddSubMaster from '../../../../../assets/Icons/AddSubMaster.png';
// import { TextField } from '../../../../../components/TextField/TextField';
// import DeleteIcon from '../../../../../assets/Icons/DeleteIcon.png';
// import SaveIcon from '../../../../../assets/Icons/SaveIcon.png';
// import StaffDetailsList from './StaffDetailsList';
// import Search from '../../../../../assets/Icons/Search.png';
// import { useFormikContext } from 'formik';
// import EditIcon from '../../../../../assets/Icons/EditIcon.png';

// const ImmediateActionTakenTable = () => {
//   const [selectedIndex, setSelectedIndex] = useState(null);
//   const { values, setFieldValue } = useFormikContext();

//   const handleAddRow = () => {
//     const lastRow =
//       values?.incidentActionTaken?.[values.incidentActionTaken.length - 1];

//     if (
//       !lastRow ||
//       !lastRow.immediateActionTaken?.trim() ||
//       !lastRow.responsibleStaffName?.trim()
//     ) {
//       return;
//     }
//     setFieldValue('incidentActionTaken', [
//       ...(values?.incidentActionTaken || []),
//       {
//         immediateActionId: '',
//         immediateActionTaken: '',
//         incidentId: '',
//         rowNo: '',
//         responsibleStaffId: '',
//         responsibleStaffName: '',
//         department: '',
//         designation: '',
//         isEditing: true,
//         isSaved: false,
//       },
//     ]);
//   };

//   const handleSaveRow = (index) => {
//     const row = values.incidentActionTaken[index];

//     if (
//       !row.immediateActionTaken ||
//       !row.responsibleStaffName ||
//       !row.department ||
//       !row.designation
//     ) {
//       alert('Please fill all fields before saving.');
//       return;
//     }

//     const updatedArray = values.incidentActionTaken.map((item, i) =>
//       i === index ? { ...item, isEditing: false, isSaved: true } : item
//     );
//     setFieldValue('incidentActionTaken', updatedArray);
//   };

//   const handleOnDelete = (index) => {
//     const updatedArray = [...values.incidentActionTaken];
//     updatedArray.splice(index, 1);
//     setFieldValue('incidentActionTaken', updatedArray);
//   };

//   const handleEditRow = (index) => {
//     const updatedArray = values.incidentActionTaken.map((item, i) =>
//       i === index ? { ...item, isEditing: true } : item
//     );
//     setFieldValue('incidentActionTaken', updatedArray);
//   };

//   return (
//     <FlexContainer flexDirection="column" width="100%">
//       <TableContainer component={Paper}>
//         <Table>
//           <StyledTableHead backgroundColor="rgb(52, 152, 219)">
//             <StyledTableRow>
//               <StyledTableHeaderCell color="#000000A6">
//                 S.No
//               </StyledTableHeaderCell>
//               <StyledTableHeaderCell color="#000000A6">
//                 Immediate Action Taken
//               </StyledTableHeaderCell>
//               <StyledTableHeaderCell color="#000000A6">
//                 Responsible Staff
//               </StyledTableHeaderCell>
//               <StyledTableHeaderCell color="#000000A6">
//                 Department / Speciality
//               </StyledTableHeaderCell>
//               <StyledTableHeaderCell color="#000000A6">
//                 Designation
//               </StyledTableHeaderCell>
//               <StyledTableHeaderCell color="#000000A6">
//                 Action
//               </StyledTableHeaderCell>
//             </StyledTableRow>
//           </StyledTableHead>
//           <TableBody>
//             {values?.incidentActionTaken?.length === 0 ? (
//               <StyledTableRow>
//                 <StyledTableBodyCell colSpan={6} align="center">
//                   No data Found
//                 </StyledTableBodyCell>
//               </StyledTableRow>
//             ) : (
//               values?.incidentActionTaken?.map((row, index) => (
//                 <StyledTableRow>
//                   <StyledTableBodyCell>{index + 1}</StyledTableBodyCell>
//                   <StyledTableBodyCell>
//                     {row.isEditing ? (
//                       <TextField
//                         name={`incidentActionTaken.${index}.immediateActionTaken`}
//                         value={row.immediateActionTaken}
//                         onChange={(e) => {
//                           const updatedArray = values?.incidentActionTaken?.map(
//                             (item, i) =>
//                               i === index
//                                 ? {
//                                     ...item,
//                                     immediateActionTaken: e.target.value,
//                                   }
//                                 : item
//                           );
//                           setFieldValue('incidentActionTaken', updatedArray);
//                         }}
//                       />
//                     ) : (
//                       <span>{row.immediateActionTaken}</span>
//                     )}
//                   </StyledTableBodyCell>
//                   <StyledTableBodyCell>
//                     <TextField
//                       name={'responsibleStaffName'}
//                       value={row.responsibleStaffName}
//                       InputProps={{
//                         readOnly: !row.isEditing,
//                         endAdornment: row.isEditing && (
//                           <InputAdornment position="start">
//                             <StyledImage
//                               src={Search}
//                               alt="Search Icon"
//                               onClick={() => setSelectedIndex(index)}
//                             />
//                           </InputAdornment>
//                         ),
//                       }}
//                     />
//                   </StyledTableBodyCell>
//                   <StyledTableBodyCell>
//                     <TextField
//                       name="department"
//                       value={row.department}
//                       disabled={!row.isEditing}
//                     />
//                   </StyledTableBodyCell>
//                   <StyledTableBodyCell>
//                     <TextField
//                       name="designation"
//                       value={row.designation}
//                       disabled={!row.isEditing}
//                     />
//                   </StyledTableBodyCell>

//                   <ActionCell>
//                     <FlexContainer className="action-icons">
//                       {row.isEditing ? (
//                         <Tooltip title="Save" arrow>
//                           <StyledImage
//                             cursor="pointer"
//                             height="15px"
//                             width="15px"
//                             src={SaveIcon}
//                             alt="SaveIcon"
//                             onClick={() => handleSaveRow(index)}
//                           />
//                         </Tooltip>
//                       ) : (
//                         <Tooltip title="Edit" arrow>
//                           <StyledImage
//                             cursor="pointer"
//                             height="15px"
//                             width="15px"
//                             src={EditIcon}
//                             alt="Edit"
//                             onClick={() => handleEditRow(index)}
//                           />
//                         </Tooltip>
//                       )}
//                       <Tooltip title="Delete" arrow>
//                         <StyledImage
//                           cursor="pointer"
//                           height="15px"
//                           width="15px"
//                           src={DeleteIcon}
//                           alt="Delete"
//                           onClick={() => handleOnDelete(index)}
//                         />
//                       </Tooltip>
//                     </FlexContainer>
//                   </ActionCell>
//                 </StyledTableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <FlexContainer
//         style={{
//           marginTop: '20px',
//           justifyContent: 'flex-end',
//           gap: '10px',
//         }}
//       >
//         <StyledButton
//           onClick={handleAddRow}
//           variant="contained"
//           marginTop={'10px'}
//           startIcon={
//             <StyledImage
//               height="14px"
//               width="14px"
//               src={AddSubMaster}
//               alt="Add New Icon"
//               style={{ marginInlineEnd: 8 }}
//             />
//           }
//         >
//           Add More
//         </StyledButton>
//       </FlexContainer>

//       {selectedIndex !== null && (
//         <StaffDetailsList
//           selectedIndex={selectedIndex}
//           setSelectedIndex={setSelectedIndex}
//         />
//       )}
//     </FlexContainer>
//   );
// };

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
import StaffDetailsList from './StaffDetailsList';
import Search from '../../../../../assets/Icons/Search.png';
import { useFormikContext } from 'formik';
import EditIcon from '../../../../../assets/Icons/EditIcon.png';
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const ImmediateActionTakenTable = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const { values, setFieldValue,errors } = useFormikContext();
  const { id } = useParams();

  const { staffDetails, IncidentData } = useSelector(state => state.reportIncident)

  const handleAddRow = () => {
    setFieldValue('isActionTakenTable',true)
    const lastRowIndex = values?.incidentActionTaken?.length || 0;
    setFieldValue('incidentActionTaken', [
      ...(values?.incidentActionTaken || []),
      {
        immediateActionId: '',
        immediateActionTaken: '',
        incidentId: values?.incidentId,
        rowNo: lastRowIndex + 1,
        responsibleStaffId: '',
        responsibleStaffName: '',
        department: '',
        designation: '',
        isEditing: true,
        isNewRow:true,
        isDelete: false
      },
    ]);
  };

  const handleSaveRow = (index) => {
    const row = values.incidentActionTaken[index];
    if (
      !row.immediateActionTaken ||
      !row.responsibleStaffName ||
      !row.department ||
      !row.designation
    ) {
      alert('Please fill all fields before saving.');
      return;
    }

    const updatedArray = values.incidentActionTaken.map((item, i) =>
      i === index ? { ...item, isEditing: false, isSaved: true } : item
    );
    setFieldValue('incidentActionTaken', updatedArray);
  };

  const handleOnDelete = (staffId, index) => {
    if (id) {
      const checkAction = values.incidentActionTaken?.find(item => item.responsibleStaffId === staffId && item.isNewRow == true)
      if (!checkAction) {
        const updatedArray = values.incidentActionTaken?.map((item, i) =>
          (item.responsibleStaffId === staffId) ? { ...item, isDelete: true } : item
        );        
        setFieldValue('incidentActionTaken', updatedArray);
      } else {
        const updatedArray = [...values.incidentActionTaken];
        updatedArray.splice(index, 1);
       setFieldValue('isActionTakenTable',false)
        setFieldValue('incidentActionTaken', updatedArray);
      }
    } else {
      const updatedArray = [...values.incidentActionTaken];
      updatedArray.splice(index, 1);
      if (updatedArray?.length > 0) {
        const newArray = updatedArray?.map((item, i) => ({ ...item, rowNo: i + 1 }));
        setFieldValue('incidentActionTaken', newArray);
      } else {
        setFieldValue('isActionTakenTable',false)
        setFieldValue('incidentActionTaken', updatedArray);
      }
    }
  };
  const handleEditRow = (index) => {
    const updatedArray = values.incidentActionTaken.map((item, i) =>
      i === index ? { ...item, isEditing: true } : item
    );
    setFieldValue('incidentActionTaken', updatedArray);
  };
  
  useEffect(() => {
    if(IncidentData){      
      setFieldValue('isActionTakenTable',IncidentData?.reportIncident?.IsActionTakenTable)
    if (IncidentData?.incidentActionTaken?.length > 0) {
      const imediateTakenArray = IncidentData?.incidentActionTaken?.map(
        (item) => {
          const filterData = staffDetails?.find(staff => staff.UserId === item.ResponsibleStaffId)
          // const filterData = staffDetails?.find(staff => staff.UserId === 243)        
          return {
            rowNo: item.RowNo,
            responsibleStaffId: item.ResponsibleStaffId,
            immediateActionTaken: item.ImmediateActionTaken || '',
            responsibleStaffName: filterData?.StaffName || '',
            department: item.DepartmentName || '',
            designation: item.DesignationName || '',
            isEditing: false,
            isDelete: item.IsDelete,
            isNewRow:false
          };
        }
      );
      setFieldValue('incidentActionTaken', imediateTakenArray);
    }
    else {
      setFieldValue('incidentActionTaken', []);
    }
  }        


  }, [IncidentData?.incidentActionTaken, staffDetails]);

  const handleSelectRow = (row) => {
    const index = values.incidentActionTaken?.findIndex(staff => staff.responsibleStaffId === row?.UserId)
    if (index === -1) {
      setFieldValue(`incidentActionTaken.${selectedIndex}.responsibleStaffName`, row?.StaffName);
      setFieldValue(`incidentActionTaken.${selectedIndex}.responsibleStaffId`, row?.UserId);
      setFieldValue(`incidentActionTaken.${selectedIndex}.department`, row?.Department);
      setFieldValue(`incidentActionTaken.${selectedIndex}.designation`, row?.PrimaryDesignation);
      setFieldValue(`incidentActionTaken.${selectedIndex}.isDelete`, false);
      setFieldValue(`incidentActionTaken.${selectedIndex}.isEditing`, false);
      setFieldValue(`incidentActionTaken.${selectedIndex}.isNewRow`, true);

    } else {
      setSelectedIndex(null); // Reset after selection
      return
    }
  };

  // useEffect(() => {
  //   setFieldValue('incidentActionTaken', IncidentData);
  // }, [IncidentData, setFieldValue]);

  return (
    <FlexContainer flexDirection="column" width="100%">
      <TableContainer component={Paper}>
        <Table>
          <StyledTableHead backgroundColor="rgb(52, 152, 219)">
            <StyledTableRow>
              <StyledTableHeaderCell>S.No</StyledTableHeaderCell>
              <StyledTableHeaderCell>
                Immediate Action Taken
              </StyledTableHeaderCell>
              <StyledTableHeaderCell>Responsible Staff</StyledTableHeaderCell>
              <StyledTableHeaderCell>Department</StyledTableHeaderCell>
              <StyledTableHeaderCell>Designation</StyledTableHeaderCell>
              <StyledTableHeaderCell>Action</StyledTableHeaderCell>
            </StyledTableRow>
          </StyledTableHead>
          <TableBody>
            {values?.incidentActionTaken?.filter(item => item.isDelete == false)?.length === 0 ? (
              <StyledTableRow>
                <StyledTableBodyCell colSpan={6} align="center">
                  No data Found
                </StyledTableBodyCell>
              </StyledTableRow>
            ) : (
              values?.incidentActionTaken?.filter(item => item.isDelete == false)?.map((row, index) => (
                <>
                  <StyledTableRow>
                    <StyledTableBodyCell>{index + 1}</StyledTableBodyCell>
                    <StyledTableBodyCell>
                      {row.isEditing ? (
                        <TextField
                          name={`incidentActionTaken.${index}.immediateActionTaken`}
                          value={row.immediateActionTaken}
                          onChange={(e) => {
                            const updatedArray =
                              values?.incidentActionTaken?.map((item, i) =>
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
                    </StyledTableBodyCell>
                    <StyledTableBodyCell>
                      <TextField
                        // name={'ResponsibleStaffName'}
                        name={`incidentActionTaken.${index}.responsibleStaffName`}
                        value={row.responsibleStaffName}
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
                        // name="DepartmentName"
                        name={`incidentActionTaken.${index}.department`}
                        value={row.department}
                        disabled={!row.isEditing}
                      />
                    </StyledTableBodyCell>
                    <StyledTableBodyCell>
                      <TextField
                        // name="DesignationName"
                        name={`incidentActionTaken.${index}.designation`}
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
                            onClick={() => handleOnDelete(row.responsibleStaffId, index)}
                          />
                        </Tooltip>
                      </FlexContainer>
                    </ActionCell>
                  </StyledTableRow>
                </>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {errors ["isActionTakenTable"] && (
                          <div style={{ color: 'red', fontSize: '11px' }}>
                            {errors ["isActionTakenTable"]}
                          </div>
                        )}
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
        <StaffDetailsList
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          handleSelectRow={handleSelectRow}
        />
      )}
    </FlexContainer>
  );
};

export default ImmediateActionTakenTable;
