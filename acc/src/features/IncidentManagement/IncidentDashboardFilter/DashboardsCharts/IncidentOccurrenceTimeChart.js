import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { useDispatch, useSelector } from 'react-redux';
import { setTableFilters } from '../../../../redux/features/mainMaster/IncidentDashboardSlice';
import {
  useGetIncidentDetailsMutation,
} from '../../../../redux/RTK/IncidentManagement/IncidentDashboardApi';

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
  { id: 'ReportingDate', name: 'Reporting Date' },
  { id: 'IncidentDetails', name: 'Incident Details' },
  { id: 'IncidentDay', name: 'Incident Day'},
  { id: 'ReportingTime', name: 'Reporting Time' },
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

export const IncidentOccurrenceTimeChart = ({
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

  const facilityMap = new Map();
  data.forEach((item) => {
    item.Facilities?.forEach((f) => {
      facilityMap.set(f.FacilityId, f.FacilityName);
    });
  });
  const facilityList = Array.from(facilityMap.entries());

  const timeIntervals = data.map((item) => item.TimeInterval);

  const series = isMultiFacility
    ? facilityList.map(([facilityId, facilityName]) => {
        const facilityCounts = data.map((item) => {
          const foundFacility = item.Facilities?.find((f) => f.FacilityId === facilityId);
          return foundFacility?.RecordCount || 0;
        });
        return {
          name: facilityName,
          data: facilityCounts,
        };
      })
    : [
        {
          name: facilityList[0]?.[1],
          data: data.map((item) => item.Facilities?.[0]?.RecordCount || 0),
        },
      ];

  const barColors = isMultiFacility
    ? facilityList.map((_, i) => PREDEFINED_COLORS[i % PREDEFINED_COLORS.length])
    : timeIntervals.map((_, i) => PREDEFINED_COLORS[i % PREDEFINED_COLORS.length]);

  const options = {
    ...commonOptions,
    chart: {
      type: "bar",
      toolbar: { show: true },
      events: {
        dataPointSelection: async (event, chartContext, config) => {
          const index = config.dataPointIndex;
          const selectedTime = timeIntervals[index];
          if (selectedTime) {
            setSelectedId(selectedTime);
            dispatch(
              setTableFilters({
                ...tableFilters,
                pageIndex: 0,
                selectedGraphType: "OccurrenceTime",
                customProperty: selectedTime,
              })
            );
          }
        },
      },
    },
    xaxis: {
      categories: timeIntervals,
      labels: {
        rotate: -45,
        style: {
          fontSize: "12px",
          colors: timeIntervals.map(() => "#333"),
        },
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 2,
        columnWidth: "60%",
        distributed: !isMultiFacility,
      },
    },
    colors: barColors,
    legend: { show: isMultiFacility},
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
            selectedGraphType: "OccurrenceTime",
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
      renderChart={() => (
        <Chart
          options={options}
          series={series}
          type="bar"
          height={350}
          style={{ width: "100%" }}
        />
      )}
    />
  );
};

