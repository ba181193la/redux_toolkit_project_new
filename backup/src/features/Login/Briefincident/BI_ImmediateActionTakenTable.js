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
} from '../../../utils/DataTable.styled';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
} from '../../../utils/StyledComponents';
import AddSubMaster from '../../../assets/Icons/AddSubMaster.png';
import { TextField } from '../../../components/TextField/TextField';
import DeleteIcon from '../../../assets/Icons/DeleteIcon.png';
import SaveIcon from '../../../assets/Icons/SaveIcon.png';
import StaffDetailsList from './StaffDetailsList';
import Search from '../../../assets/Icons/Search.png';
import { useFormikContext } from 'formik';
import EditIcon from '../../../assets/Icons/EditIcon.png';

const ImmediateActionTakenTable = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const { values, setFieldValue } = useFormikContext();
  const [facilityColumn, setFacilityColumn] = useState('');

  const handleAddRow = () => {
    const lastRow =
      values?.incidentActionTaken?.[values.incidentActionTaken.length - 1];

    if (
      !lastRow ||
      !lastRow.immediateActionTaken?.trim() ||
      !lastRow.responsibleStaffName?.trim()
    ) {
      return;
    }
    setFieldValue('incidentActionTaken', [
      ...(values?.incidentActionTaken || []),
      {
        immediateActionId: '',
        immediateActionTaken: '',
        incidentId: '',
        rowNo: '',
        responsibleStaffId: '',
        responsibleStaffName: '',
        facility: '',
        department: '',
        designation: '',
        isEditing: true,
        isSaved: false,
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

  const handleOnDelete = (index) => {
    const updatedArray = [...values.incidentActionTaken];
    updatedArray.splice(index, 1);
    setFieldValue('incidentActionTaken', updatedArray);
  };

  const handleEditRow = (index) => {
    const updatedArray = values.incidentActionTaken.map((item, i) =>
      i === index ? { ...item, isEditing: true } : item
    );
    setFieldValue('incidentActionTaken', updatedArray);
  };

  return (
    <FlexContainer flexDirection="column" width="100%">
      <TableContainer component={Paper}>
        <Table>
          <StyledTableHead backgroundColor="rgb(52, 152, 219)">
            <StyledTableRow>
              <StyledTableHeaderCell color="#FFFFFF">
                S.No
              </StyledTableHeaderCell>
             
              <StyledTableHeaderCell color="#FFFFFF">
                Immediate Action Taken
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#FFFFFF">
                Responsible Staff
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#FFFFFF">
                Facility
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#FFFFFF">
                Department
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#FFFFFF">
                Designation
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#FFFFFF">
                Action
              </StyledTableHeaderCell>
            </StyledTableRow>
          </StyledTableHead>
          <TableBody>
            {values?.incidentActionTaken?.length === 0 ? (
              <StyledTableRow>
                <StyledTableBodyCell colSpan={6} align="center">
                  No data Found
                </StyledTableBodyCell>
              </StyledTableRow>
            ) : (
              values?.incidentActionTaken?.map((row, index) => (
                <StyledTableRow>
                  <StyledTableBodyCell>{index + 1}</StyledTableBodyCell>
                  
                  <StyledTableBodyCell>
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
                  </StyledTableBodyCell>
                  
                  <StyledTableBodyCell>
                    <TextField
                      name={'responsibleStaffName'}
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
                    <Tooltip title={row.facility || ''} arrow>
                      <TextField
                        name="facility"
                        value={row.facility}
                        disabled={!row.isEditing}
                        fullWidth
                        inputProps={{
                          style: {
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          },
                        }}
                      />
                    </Tooltip>
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
                      {row.isEditing ? (
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
                      )}
                      <Tooltip title="Delete" arrow>
                        <StyledImage
                          cursor="pointer"
                          height="15px"
                          width="15px"
                          src={DeleteIcon}
                          alt="Delete"
                          onClick={() => handleOnDelete(index)}
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
        <StaffDetailsList
          facilityColumn={facilityColumn}
          setFacilityColumn={setFacilityColumn}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
        />
      )}
    </FlexContainer>
  );
};

export default ImmediateActionTakenTable;
