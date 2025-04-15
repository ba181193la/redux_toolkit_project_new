import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  Tooltip,
  Box,
  Select,
  Grid,
  Collapse,
  TextField,
} from '@mui/material';
import {
  FlexContainer,
  StyledImage,
  StyledButton,
} from '../../../../utils/StyledComponents';
import {
  ActionCell,
  StyledTableBodyCell,
  StyledTableHead,
  StyledTableHeaderCell,
  StyledTableRow,
  FormLabel,
  ActionButton,
} from '../../../../utils/DataTable.styled';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import LoadingGif from '../../../../assets/Gifs/LoadingGif.gif';
import SearchDropdown from '../../../../components/SearchDropdown/SearchDropdown';
import AddIcon from '../../../../assets/Icons/AddSubMaster.png';
import useWindowDimension from '../../../../hooks/useWindowDimension';
import {
  useGetPageLoadDataQuery,
  useCreateReportNameMutation,
  useGetReportDetailsMutation,
  useSubmitReportFieldsMutation,
  useGenerateExcelReportMutation  
} from '../../../../redux/RTK/IncidentManagement/CustomReportsApi';
import { useDispatch, useSelector } from 'react-redux';
import CustomReportTransferList from './CustomReportTransferList';
import CheckIcon from '@mui/icons-material/Check';
import { showSweetAlert, showToastAlert } from '../../../../utils/SweetAlert';
import DeleteUserGif from '../../../../assets/Gifs/DeleteuserGif.gif';
import SuccessGif from '../../../../assets/Gifs/SuccessGif.gif';
import Error from '../../../../assets/Gifs/error.gif';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Date from '../../../../components/Date/Date';
import {
  useGetAllFacilitiesQuery,
} from '../../../../redux/RTK/userAssignmentApi';

const CustomReportViewer = ({allFacilities}) => {
  const { isMobile } = useWindowDimension();
  const { selectedModuleId, userDetails, selectedFacility, selectedMenu } = useSelector(
    (state) => state.auth
  );

  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedFacilityId, setSelectedFacilityId] = useState(null);
  const [reportDetails, setReportDetails] = useState(null);
  const [selectedFields, setSelectedFields] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [entryReport, setEntryReport] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const { data: pageLoadData } = useGetPageLoadDataQuery({
    menuId: 36,
    moduleId: selectedModuleId,
    loginUserId: userDetails?.UserId,
    facilityId: selectedFacility?.id,
  });

  const [triggerReportDetails] = useGetReportDetailsMutation();
  const [triggerDownloadData] = useGenerateExcelReportMutation();
  const [triggerSubmitReportFields] = useSubmitReportFieldsMutation();

  const ListData = pageLoadData?.Data || {};
  const { CustomReportList = [], ReportMenuList = [] } = ListData;

  const reportOptions = CustomReportList.map(({ BuilderId, ReportName }) => ({
    value: BuilderId,
    text: ReportName,
  }));


   
    
      const updatedFacilities =
      allFacilities?.Records?.filter((facility) => {
        return facility.FacilityName !== 'All';
      }) || [];
  
      const facilityOptions = updatedFacilities.map(({ FacilityId, FacilityName }) => ({
        value: FacilityId,
        text: FacilityName,
      }));
  
      console.log("...facilityOptions",facilityOptions);


  const handleDownload = async () => {
    if (!selectedReport) {
      showSweetAlert({
        type: 'warning',
        title: 'Oops!',
        text: 'Please select a report before downloading.',
        gif: Error,
        showConfirmButton: true,
        confirmButtonText: 'Close',
      });
      return;
    }
  
    if (!fromDate || !toDate) {
      showSweetAlert({
        type: 'warning',
        title: 'Missing Dates!',
        text: 'Please select both From Date and To Date.',
        gif: Error,
        showConfirmButton: true,
        confirmButtonText: 'Close',
      });
      return;
    }
  
    if (new Date(fromDate) > new Date(toDate)) {
      showSweetAlert({
        type: 'warning',
        title: 'Invalid Date Range!',
        text: 'From Date cannot be later than To Date.',
        gif: Error,
        showConfirmButton: true,
        confirmButtonText: 'Close',
      });
      return;
    }
  
    if (!selectedFacilityId) {
      showSweetAlert({
        type: 'warning',
        title: 'Oops!',
        text: 'Please select a facility before downloading.',
        gif: Error,
        showConfirmButton: true,
        confirmButtonText: 'Close',
      });
      return;
    }
  

    const payload = {
      builderId: selectedReport,
      fromDate: fromDate,
      toDate: toDate,
      headerFacility: selectedFacility?.id,
      searchedFacilityId: selectedFacilityId,
      loginUserId: userDetails?.UserId,
      moduleId: selectedModuleId,
      menuId: 36,
    };

    try {
      const blob = await triggerDownloadData(payload).unwrap();
     saveAs(blob, 'Custom_Report.xlsx');
      setIsModalOpen(false);
      setEntryReport(null);
      showToastAlert({
        type: 'custom_success',
        text: response?.Message,
        gif: SuccessGif,
      });

      
    } catch (error) {
      console.error('Error during submission:', {
        errormessage: error.message,
        errorStack: error.stack,
      });
      
    }
  };

  return (
    <FlexContainer justifyContent="center" style={{ marginTop: '20px' }}>
    <Grid container spacing={2} sx={{ maxWidth: 1200 }}>
      {/* Fields in the Same Row */}
      <Grid 
        item 
        container 
        spacing={2} 
        alignItems="center" 
        justifyContent="center"
        xs={12}
      >
        {/* Choose Report */}
        <Grid item xs={12} sm={3}>
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs="auto">
              <FormLabel sx={{ whiteSpace: 'nowrap' }}>Choose Report:</FormLabel>
            </Grid>
            <Grid item xs>
              <SearchDropdown
                name="ChooseReport"
                options={reportOptions}
                onChange={(event, value) => setSelectedReport(value?.value)}
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>
  
        {/* Choose Facility */}
        <Grid item xs={12} sm={3}>
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs="auto">
              <FormLabel sx={{ whiteSpace: 'nowrap' }}>Choose Facility:</FormLabel>
            </Grid>
            <Grid item xs>
              <SearchDropdown
                name="screens"
                options={[...facilityOptions]}
                onChange={(event, value) => setSelectedFacilityId(value?.value)}
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>
  
        {/* From Date */}
        <Grid item xs={12} sm={3}>
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs="auto">
              <FormLabel sx={{ whiteSpace: 'nowrap' }}>From Date:</FormLabel>
            </Grid>
            <Grid item xs>
              <Date
                name="FromDate"
                onChange={(event) => setFromDate(event)}
                value={fromDate}
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>
  
        {/* To Date */}
        <Grid item xs={12} sm={3}>
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs="auto">
              <FormLabel sx={{ whiteSpace: 'nowrap' }}>To Date:</FormLabel>
            </Grid>
            <Grid item xs>
              <Date
                name="Todate"
                onChange={(event) => setToDate(event)}
                value={toDate}
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
  
      {/* Button */}
      <Grid item xs={12} display="flex" justifyContent="center" mt={2}>
        <StyledButton
          variant="contained"
          color="success"
          padding={isMobile ? '6px 10px' : '6px 16px'}
          onClick={handleDownload}
        >
          Download Report
        </StyledButton>
      </Grid>
    </Grid>
  </FlexContainer>
  
  );
};

export default CustomReportViewer;
