import React, { useEffect, useState } from 'react'
import { useGetIncidentOpinionPendingByIdQuery } from '../../../../redux/RTK/IncidentOinionApi';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box } from '@mui/system';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

function OpinionRequestedViewPDF() {

    const { id, opID } = useParams();
    const { selectedMenu, regionCode, selectedModuleId, userDetails } =
        useSelector((state) => state.auth);

        const [opinionDetails, setOpinionDetails] = useState({
            DepartmentName:"",
            DesignationName: "",
            EmployeeName: "",
            EmployeeID: "",
            WebsiteURL: "",
            ContactPersonName: "",
            Comments: "",
            OpinionNo: "",
            RequestedDate: "",
            Response: "",
          });

    const { data: OpinionRequests, isFetching: isFetchingStaffData } =
        useGetIncidentOpinionPendingByIdQuery(
          {
            opinionId: opID,
            loginUserId: userDetails?.UserId,
            menuId: selectedMenu?.id,
            moduleId: selectedModuleId,
          }
          // { skip: !id }
        );

      useEffect(() => {
          if (OpinionRequests) {
            const dateStr = OpinionRequests?.Data?.RequestedDate;
      const date = new Date(dateStr);
      const formattedDate =
        date.getDate().toString().padStart(2, '0') +
        '-' +
        (date.getMonth() + 1).toString().padStart(2, '0') +
        '-' +
        date.getFullYear();
            setOpinionDetails({
                DepartmentName: OpinionRequests?.Data?.DepartmentName,
                DesignationName:  OpinionRequests?.Data?.DesignationName,
                EmployeeName: OpinionRequests?.Data?.EmployeeName,
                EmployeeID: OpinionRequests?.Data?.EmployeeID,
                WebsiteURL: OpinionRequests?.Data?.WebsiteURL,
                ContactPersonName: OpinionRequests?.Data?.ContactPersonName,
                Comments: OpinionRequests?.Data?.Comments,
                OpinionNo: OpinionRequests?.Data?.OpinionNo,
                RequestedDate: formattedDate,
                Response:  OpinionRequests?.Data?.Response,
            });
          }
        }, [OpinionRequests]);

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
                Staff Name
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
            </TableRow>
            
          </TableBody>
        </Table>
      </Box>
    </>
  )
}

export default OpinionRequestedViewPDF