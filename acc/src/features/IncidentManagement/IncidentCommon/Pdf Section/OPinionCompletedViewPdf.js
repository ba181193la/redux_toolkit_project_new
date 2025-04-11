import React, { useEffect, useState } from 'react'
import { useGetIncidentOpinionCompletedByIdQuery, useGetIncidentOpinionPendingByIdQuery } from '../../../../redux/RTK/IncidentOinionApi';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box } from '@mui/system';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

function OpinionRequestedViewPDF() {

    const { id, opID } = useParams();
    const { selectedMenu, regionCode, selectedModuleId, userDetails } =
        useSelector((state) => state.auth);

        const [opinionDetails, setOpinionDetails] = useState({
            DepartmentName: "",
            EmployeeName: "",
            OpinionComments: "",
            EmployeeID: "",
            Comments: "",
            OpinionNo: "",
            RequestedDate: "",
            Response: "", 
            SubmittedBy: "",
            SubmittedDate: ""
          });

    const { data: CompletedOpinionRequest, isFetching: isFetchingStaffData } =
          useGetIncidentOpinionCompletedByIdQuery(
            {
              opinionId: opID,
              loginUserId: userDetails?.UserId,
              menuId: selectedMenu?.id,
              moduleId: selectedModuleId,
            },
            // { skip: !opID }
          );
      

      useEffect(() => {
          if (CompletedOpinionRequest) {
            const dateStr = CompletedOpinionRequest?.Data?.RequestedDate;
      const date = new Date(dateStr);
      const formattedDate =
        date.getDate().toString().padStart(2, '0') +
        '-' +
        (date.getMonth() + 1).toString().padStart(2, '0') +
        '-' +
        date.getFullYear();
            setOpinionDetails({
                DepartmentName: CompletedOpinionRequest?.Data?.DepartmentName,

                EmployeeName: CompletedOpinionRequest?.Data?.EmployeeName,
                EmployeeID: CompletedOpinionRequest?.Data?.EmployeeID,
                Comments: CompletedOpinionRequest?.Data?.Comments,
                OpinionNo: CompletedOpinionRequest?.Data?.OpinionNo,
                RequestedDate: formattedDate,
                Response:  CompletedOpinionRequest?.Data?.Response,
                SubmittedBy: CompletedOpinionRequest?.Data?.SubmittedBy,
                SubmittedDate: CompletedOpinionRequest?.Data?.SubmittedDate
                
            });
          }
        }, [CompletedOpinionRequest]);

  return (
    <>
      <Box
        sx={{ display: 'flex', justifyContent: 'center', padding: 2, gap: 3 }}
      >
        <TableContainer sx={{ width: '100%', maxWidth: 1200 }}>
          <Table id="textTable">
            <TableHead>
              <TableRow style={{ backgroundColor: '#c0c0c0' }}>
                <TableCell
                  colSpan={12}
                  align="center"
                  sx={{
                    border: '1px solid black',
                    width: '100%',
                    padding: '8px',
                  }}
                >
                  <Typography variant="h6">
                    Opinion Requested
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
          </Table>
        </TableContainer>
      </Box>
      <Box sx={{ position: 'relative', minHeight: '100vh' }}>
        <Table
          id="Approval"
          sx={{
            border: '1px solid black',
            borderCollapse: 'collapse',
            width: '100%',
            marginBottom: '120px',
          }}
        >
          <TableBody>
            <TableRow>
              <TableCell
                className="bold-cell"
                sx={{
                  border: '1px solid black',
                  padding: '8px',
                  fontWeight: 'bold',
                  backgroundColor: '#f5f5f5',
                  width: '25%',
                }}
              >
                Opinion ID:
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid black',
                  padding: '8px',
                  backgroundColor: 'white',
                  width: '25%',
                }}
              >
                {opinionDetails?.OpinionNo}
              </TableCell>
              <TableCell
                className="bold-cell"
                sx={{
                  border: '1px solid black',
                  padding: '8px',
                  fontWeight: 'bold',
                  backgroundColor: '#f5f5f5',
                  width: '25%',
                }}
              >
                Opinion Comments
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid black',
                  padding: '8px',
                  backgroundColor: 'white',
                  width: '25%',
                }}
              >
                {opinionDetails?.Comments}
              </TableCell>
              
            </TableRow>
            <TableRow>
            <TableCell
                className="bold-cell"
                sx={{
                  border: '1px solid black',
                  padding: '8px',
                  fontWeight: 'bold',
                  backgroundColor: '#f5f5f5',
                  width: '25%',
                }}
              >
                Requested Opinion Date
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid black',
                  padding: '8px',
                  backgroundColor: 'white',
                  width: '25%',
                }}
              >
                {opinionDetails?.RequestedDate}
              </TableCell>
              <TableCell
                className="bold-cell"
                sx={{
                  border: '1px solid black',
                  padding: '8px',
                  fontWeight: 'bold',
                  backgroundColor: '#f5f5f5',
                  width: '25%',
                }}
              >
                Employee ID
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid black',
                  padding: '8px',
                  backgroundColor: 'white',
                  width: '25%',
                }}
              >
                {opinionDetails?.EmployeeID}
              </TableCell>
            </TableRow>
            <TableRow>
            <TableCell
                className="bold-cell"
                sx={{
                  border: '1px solid black',
                  padding: '8px',
                  fontWeight: 'bold',
                  backgroundColor: '#f5f5f5',
                  width: '25%',
                }}
              >
                Employee Name
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid black',
                  padding: '8px',
                  backgroundColor: 'white',
                  width: '25%',
                }}
              >
                {opinionDetails?.EmployeeName}
              </TableCell>
              <TableCell
                className="bold-cell"
                sx={{
                  border: '1px solid black',
                  padding: '8px',
                  fontWeight: 'bold',
                  backgroundColor: '#f5f5f5',
                  width: '25%',
                }}
              >
                Department
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid black',
                  padding: '8px',
                  backgroundColor: 'white',
                  width: '25%',
                }}
              >
                {opinionDetails?.DepartmentName}
              </TableCell>
              {/* <TableCell
                className="bold-cell"
                sx={{
                  border: '1px solid black',
                  padding: '8px',
                  fontWeight: 'bold',
                  backgroundColor: '#f5f5f5',
                  width: '25%',
                }}
              >
                Response
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid black',
                  padding: '8px',
                  backgroundColor: 'white',
                  width: '25%',
                }}
              >
                {opinionDetails?.Response}
              </TableCell> */}
            </TableRow>
            <TableRow>
              <TableCell
                className="bold-cell"
                sx={{
                  border: '1px solid black',
                  padding: '8px',
                  fontWeight: 'bold',
                  backgroundColor: '#f5f5f5',
                  width: '25%',
                }}
              >
                Response
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid black',
                  padding: '8px',
                  backgroundColor: 'white',
                  width: '25%',
                }}
              >
                {opinionDetails?.Response}
              </TableCell>
            </TableRow>
            
            
          </TableBody>
        </Table>
      </Box>
    </>
  )
}

export default OpinionRequestedViewPDF