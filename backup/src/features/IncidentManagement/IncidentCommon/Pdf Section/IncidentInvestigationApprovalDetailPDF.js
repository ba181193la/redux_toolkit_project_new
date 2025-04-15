import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { useGetApprovalDetailsByIdQuery } from '../../../../redux/RTK/IncidentManagement/incidentInvestigationApprovalApi';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import formatDate from '../../../../utils/FormatDate';
import { useEffect, useState } from 'react';

const IncidentInvestigationApprovalDetailPDF = () => {
  //* Hooks Declaration
  const { id } = useParams();

  //* State variables
  const [invApprovalDetails, setInvApprovalDetails] = useState({
    action: '',
    department: '',
    approvedDate: '',
    approverRemarks: '',
    submittedBy: '',
  });

  //* Selectors
  const { selectedMenu, regionCode, selectedModuleId, userDetails } =
    useSelector((state) => state.auth);

  const { data: approvalDetails } = useGetApprovalDetailsByIdQuery({
    incidentId: id,
    loginUserId: userDetails?.UserId,
    menuId: selectedMenu?.id,
  });

  useEffect(() => {
    if (approvalDetails) {
      setInvApprovalDetails({
        action: approvalDetails?.Data?.ApproverStatus || '',
        department: approvalDetails?.Data?.DepartmentName || '',
        approvedDate: formatDate(approvalDetails?.Data?.SubmittedDate) || '',
        approverRemarks: approvalDetails?.Data?.ApproverRemarks || '',
        submittedBy: approvalDetails?.Data?.SubmittedBy || '',
      });
    }
  }, [approvalDetails]);

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
                    Incident Investigation Approval
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
                Action:
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid black',
                  padding: '8px',
                  backgroundColor: 'white',
                  width: '25%',
                }}
              >
                {invApprovalDetails?.action}
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
                Submitted By:
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid black',
                  padding: '8px',
                  backgroundColor: 'white',
                  width: '25%',
                }}
              >
                {invApprovalDetails?.submittedBy}
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
                Incident Department:
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid black',
                  padding: '8px',
                  backgroundColor: 'white',
                  width: '25%',
                }}
              >
                {invApprovalDetails?.department}
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
                Approved Date:
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid black',
                  padding: '8px',
                  backgroundColor: 'white',
                  width: '25%',
                }}
              >
                {formatDate(invApprovalDetails?.approvedDate)}
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
                Approver Remarks:
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid black',
                  padding: '8px',
                  backgroundColor: 'white',
                  width: '75%',
                }}
                colSpan={3}
              >
                {invApprovalDetails?.approverRemarks}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </>
  );
};

export default IncidentInvestigationApprovalDetailPDF;
