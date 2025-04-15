import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import {
  useGetIncidentDetailsMutation,
} from '../../../../redux/RTK/IncidentManagement/IncidentDashboardApi';
import {
  FlexContainer,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import DetailsDataTable from '../IncidentDashboardView/DetailsDataTable'
import { useDispatch, useSelector } from 'react-redux';
import { setTableFilters } from '../../../../redux/features/mainMaster/IncidentDashboardSlice';

const PREDEFINED_COLORS = [
  '#e919a1', '#fd9d25', '#bed32c', '#25d6ff', '#a367dc', 
  '#d91239', '#11be7f', '#56565b', '#fce001', '#00CED1',
  '#FF6347', '#6A5ACD', '#20B2AA', '#FFD700', '#FF1493',
  '#00FF7F', '#8A2BE2', '#FF4500', '#7B68EE', '#48D1CC'
];

const columns = [
  { id: 'FacilityName', name: 'Facility Name' },
  { id: 'IncidentNo', name: 'Incident Number' },
  { id: 'IncidentDate', name: 'Incident Date' },
  { id: 'IncidentDetails', name: 'Incident Detail' },
  { id: 'IncidentType', name: 'Incident Type' },
  { id: 'IncidentHarmLevel', name: 'Incident Harm Level'},
  { id: 'IncidentRiskLevel', name: 'Incident Risk Level' },
];

const commonOptions = {
  chart: { type: "bar", toolbar: { show: false } },
  plotOptions: { bar: { borderRadius: 8, horizontal: false, columnWidth: "50%" } },
  grid: { borderColor: "#e0e0e0", strokeDashArray: 3 },
  dataLabels: { enabled: false },
};

const SafeChartWrapper = ({ data, renderChart }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <div>No Data Available</div>;
  }
  return renderChart();
};

export const Top20IncidentDetailsChart = ({ 
    data = [], 
    selectedFacility, 
    selectedModuleId, 
    selectedMenu, 
    userDetails,
    onBarClick 
  }) => {  

    const [selectedId, setSelectedId] = useState(null);
    const [totalPage, setTotalPage] = useState(null);
    const [incidentData, setIncidentData] = useState(null);
    const dispatch = useDispatch();
    const { tableFilters, filters } = useSelector((state) => state.incidentDashboard);
    const { pageIndex, pageSize } = tableFilters;
    const [generateReportDetails] = useGetIncidentDetailsMutation();
  
    const groupedData = Object.values(
      data.reduce((acc, item) => {
        if (!acc[item.IncidentDetailId]) {
          acc[item.IncidentDetailId] = { 
            IncidentDetail: item.IncidentDetail, 
            IncidentDetailId: item.IncidentDetailId, 
            Count: 0 
          };
        }
        acc[item.IncidentDetailId].Count += item.Count;
        return acc;
      }, {})
    ).sort((a, b) => b.Count - a.Count);
  
    const series = [{ name: "Count", data: groupedData.map(item => item.Count || 0) }];
    const barColors = groupedData.map((_, index) => PREDEFINED_COLORS[index % PREDEFINED_COLORS.length]);
  
    const options = {
      ...commonOptions,
      xaxis: { 
        categories: groupedData.map(item => item.IncidentDetail || "UNKNOWN"),
        labels: { 
          show: true, 
        //   rotate: -45, 
        //   rotateAlways: true, 
          hideOverlappingLabels: false, 
          style: { fontSize: "12px", colors: "#333" }
        }
      },
      colors: barColors,
      chart: {
        toolbar: { show: true },
        events: {
          dataPointSelection: async (event, chartContext, config) => {
            const clickedIndex = config.dataPointIndex;
            const selectedIncident = groupedData[clickedIndex];
            if (selectedIncident) {
              
              setSelectedId(null)
  
              // setTableFilters({
              //             ...tableFilters,
              //             pageIndex: 0,
              //             selectedGraphType: "",
              //             customProperty: null,
              
              //           })
  
              setSelectedId(selectedIncident.IncidentDetailId);
              dispatch(setTableFilters({ ...tableFilters, pageIndex: 0, selectedGraphType: "IncidentDetail", customProperty: selectedIncident.IncidentDetailId }));
  
            }
          },
        },
      },
      plotOptions: { bar: { borderRadius: 2, columnWidth: "60%", distributed: true } },
      legend: { show: false },
    };

      useEffect(() => {
        if (selectedId) {
          const fetchData = async () => {
            try {
              const response = await generateReportDetails({
                ...tableFilters,
                headerFacility: selectedFacility?.id || 0,
                loginUserId: userDetails?.UserId || 0,
                moduleId: selectedModuleId,
                menuId: selectedMenu?.id,
                selectedGraphType: "IncidentDetail",
                customProperty: selectedId,
                year: filters.year,
                facilityId: filters.facilityId,
                pageIndex: (tableFilters.pageIndex || 0) + 1,
                pageSize: pageSize,
    
              }).unwrap();
    
              const newTotalPage = response?.Data?.TotalRecords;
              const newIncidentData = response?.Data?.Records;
    
              setIncidentData(newIncidentData);
              setTotalPage(newTotalPage);
    
              onBarClick(selectedId, newIncidentData, columns, newTotalPage);
            } catch (error) {
              console.error("Error fetching incident details", error);
            }
          };
    
          fetchData();
        }
      }, [selectedId, pageIndex, pageSize]); 
    
  
    return (
      <FlexContainer width="100%" flexDirection="column">
        <Chart options={options} series={series} type="bar" height={350} style={{ width: "100%" }} />
      </FlexContainer>
    );
  };
  



