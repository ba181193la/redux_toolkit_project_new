
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
  {
    id: 'FacilityName',
    name: 'FacilityName',
  },
  {
    id: 'IncidentNo',
    name: 'Incident Number',
  },
  {
    id: 'IncidentDate',
    name: 'Incident Date',
  },
  {
    id: 'IncidentDetails',
    name: 'Incident Detail',
  },
    {
      id: 'IncidentType',
      name: 'Incident Type',
    },
    {
      id: 'IncidentHarmLevel',
      name: 'Incident Harm Level',
    },
    {
      id: 'IncidentRiskLevel',
      name: 'Incident Risk Level',
    },
  

]

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


export const HarmLevelChart = ({
  data = [], 
  selectedFacility, 
  selectedModuleId, 
  selectedMenu, 
  userDetails,
  onBarClick, 
  onReset
  }) => {

    const [selectedId, setSelectedId] = useState(null);
    const [totalPage, setTotalPage] = useState(null); 
    const [incidentData, setIncidentData] = useState(null);
    const [localColumns, setLocalColumns] = useState(columns); 
    const [generateReportDetails, { data: IncidentDashBoardData = [] }] = useGetIncidentDetailsMutation();
    const dispatch = useDispatch();
  
    const { tableFilters, filters } = useSelector((state) => state.incidentDashboard);
    const { pageIndex, pageSize } = tableFilters;
  
      
    const groupedData = Object.values(
      data.reduce((acc, item) => {
        if (!acc[item.HarmLevel]) {
          acc[item.HarmLevel] = { HarmLevel: item.HarmLevel, Count: 0, HarmLevelId: item.HarmLevelId };
        }
        acc[item.HarmLevel].Count += item.Count;
        return acc;
      }, {})
    );
  
    const sortedData = groupedData.sort((a, b) => b.Count - a.Count);
  
    const series = [{ name: "Count", data: sortedData.map(item => item.Count || 0) }];
    const barColors = sortedData.map((_, index) => PREDEFINED_COLORS[index % PREDEFINED_COLORS.length]);
  
    const options = {
      ...commonOptions,
      xaxis: { categories: sortedData.map(item => item.HarmLevel || "N/A") },
      colors: barColors,
      chart: {
        toolbar: { show: true },
        events: {
          dataPointSelection: async (event, chartContext, config) => {
            const clickedIndex = config.dataPointIndex;
            console.log("clickedIndex",clickedIndex)
            const selectedIncident = groupedData[clickedIndex];
            console.log("HarmLevelId",selectedIncident)
            if (selectedIncident) {

              setSelectedId(null)
              setSelectedId(selectedIncident.HarmLevelId);
              dispatch(setTableFilters({ ...tableFilters, pageIndex: 0, selectedGraphType: "HarmLevel", customProperty: selectedIncident.HarmLevelId }));

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
                selectedGraphType: "HarmLevel",
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
      <SafeChartWrapper
        data={data}
        renderChart={() => <Chart options={options} series={series} type="bar" height={350} style={{ width: "100%" }} />}
      />
    );
  };
  
  
 