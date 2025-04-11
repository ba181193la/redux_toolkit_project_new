import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Chart from "react-apexcharts";
import { useGetIncidentDetailsMutation } from "../../../../redux/RTK/IncidentManagement/IncidentDashboardApi";
import {
  FlexContainer,
  StyledTypography,
} from "../../../../utils/StyledComponents";
import DetailsDataTable from "../IncidentDashboardView/DetailsDataTable";
import { setTableFilters } from "../../../../redux/features/mainMaster/IncidentDashboardSlice";

const PREDEFINED_COLORS = [
  "#e919a1", "#fd9d25", "#bed32c", "#25d6ff", "#a367dc",
  "#d91239", "#11be7f", "#56565b", "#fce001", "#00CED1"
];

const columns = [
  { id: 'FacilityName', name: 'Facility Name' },
  { id: 'IncidentNo', name: 'Incident Number' },
  { id: 'IncidentDate', name: 'Incident Date' },
  { id: 'IncidentTime', name: 'Incident Time' },
  { id: 'ReportingDate', name: 'Reporting Date' },
  { id: 'ReportingTime', name: 'Reporting Time' },
  { id: 'IncidentDetails', name: 'Incident Detail' },
  { id: 'IncidentReportingTAT', name: 'Incident Reporting TAT'},
];

const commonOptions = {
  chart: { type: "bar", toolbar: { show: false } },
  plotOptions: { bar: { borderRadius: 8, horizontal: true, barHeight: "50%" },
   },
  grid: { borderColor: "#e0e0e0", strokeDashArray: 3 },
  dataLabels: { enabled: false },
};

export const IncidentReportingTATChart = ({
  data = [],
  selectedFacility,
  selectedModuleId,
  selectedMenu,
  userDetails,
  onBarClick,
}) => {
  const [selectedId, setSelectedId] = useState(null);
  const [totalPage, setTotalPage] = useState(null);
  const [incidentData, setIncidentData] = useState(null);

  const [generateReportDetails] = useGetIncidentDetailsMutation();
  const dispatch = useDispatch();

  const { tableFilters, filters } = useSelector((state) => state.incidentDashboard);
  const { pageIndex, pageSize } = tableFilters;

  const isMultiFacility = filters?.facilityId?.length > 1;

  const categories = data.map((item) => item.Category || 'UNKNOWN');

  const allFacilities = [
    ...new Set(
      data.flatMap((item) =>
        item.Facilities?.map((f) => f.FacilityName)
      )
    ),
  ];

  const groupedSeries = isMultiFacility
    ? allFacilities.map((facilityName, idx) => ({
        name: facilityName,
        data: categories.map((category) => {
          const cat = data.find((c) => c.Category === category);
          const fac = cat?.Facilities?.find((f) => f.FacilityName === facilityName);
          return fac?.RecordCount || 0;
        }),
        color: PREDEFINED_COLORS[idx % PREDEFINED_COLORS.length],
      }))
    : [
        {
          name: 'Incidents',
          data: data.map((item) => item.Count || 0),
          color: PREDEFINED_COLORS[0],
        },
      ];

  const options = {
    ...commonOptions,
    chart: {
      type: 'bar',
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
        zoom: { enabled: false },
      },
      events: {
        dataPointSelection: async (event, chartContext, config) => {
          const clickedCategory = categories[config.dataPointIndex];
          if (clickedCategory) {
            setSelectedId(null);
            setSelectedId(clickedCategory);

            dispatch(
              setTableFilters({
                ...tableFilters,
                pageIndex: 0,
                selectedGraphType: 'ReportingTAT',
                customProperty: clickedCategory,
              })
            );
          }
        },
      },
    },
    xaxis: {
      categories,
      labels: {
        style: {
          fontSize: '12px',
          colors: '#333',
        },
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 2,
        columnWidth: '55%',
        dataLabels: {
          position: 'top',
        },
        distributed: !isMultiFacility,
      },
    },
    dataLabels: {
      enabled: false,
      
    },
    legend: {
      show: isMultiFacility,
    },
    colors: PREDEFINED_COLORS,
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
            selectedGraphType: 'ReportingTAT',
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
          console.error('Error fetching incident details', error);
        }
      };

      fetchData();
    }
  }, [selectedId, pageIndex, pageSize]);

  return (
    <FlexContainer width="100%" flexDirection="column">
      <Chart options={options} series={groupedSeries} type="bar" height={300} />
    </FlexContainer>
  );
};

