import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { useGetIncidentDetailsMutation } from '../../../../redux/RTK/IncidentManagement/IncidentDashboardApi';
import { useDispatch, useSelector } from 'react-redux';
import { setTableFilters } from '../../../../redux/features/mainMaster/IncidentDashboardSlice';


const columns = [
  { id: 'FacilityName', name: 'Facility Name' },
  { id: 'IncidentNo', name: 'Incident Number' },
  { id: 'IncidentDate', name: 'Incident Date' },
  { id: 'IncidentDetails', name: 'Incident Detail' },
  { id: 'IncidentType', name: 'Incident Type' },
  { id: 'IncidentHarmLevel', name: 'Incident Harm Level' },
  { id: 'IncidentRiskLevel', name: 'Incident Risk Level' },
  {
    id: 'ContributingMain',
    name: 'Contributing Main Factor',
  },
  {
    id: 'ContributingSub',
    name: 'Contributing Sub Factor',
  },
];

const commonOptions = {
  chart: { type: 'bar', toolbar: { show: false } },
  plotOptions: {
    bar: { borderRadius: 8, horizontal: false, columnWidth: '50%' },
  },
  grid: { borderColor: '#e0e0e0', strokeDashArray: 3 },
  dataLabels: { enabled: false },
};

export const IncidentContributingMainFactorChart = ({
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

  const { tableFilters, filters } = useSelector(
    (state) => state.incidentDashboard
  );
  const { pageIndex, pageSize } = tableFilters;

  const sortedData = [...data].sort((a, b) => b.Count - a.Count);

  const labels = sortedData.map((item) => item.MainFactorName || '');
  const counts = sortedData.map((item) => item?.Count || 0);

  const barColor = '#7cb5ec';

  const chartOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: true },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const clickedIndex = config.dataPointIndex;
          const selectedIncident = sortedData[clickedIndex];
          if (selectedIncident) {
            setSelectedId(null);
            setSelectedId(selectedIncident.MainFactorId);
            dispatch(
              setTableFilters({
                ...tableFilters,
                pageIndex: 0,
                selectedGraphType: 'MainFactor',
                customProperty: selectedIncident.MainFactorId,
              })
            );
          }
        },
      },
    },
    xaxis: {
      categories: labels,
      labels: {
        style: { fontSize: '12px', colors: '#333' },
      },
    },
    colors: [barColor],
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '60%',
        borderRadius: 2,
        distributed: false,
      },
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    grid: { borderColor: '#e0e0e0', strokeDashArray: 3 },
  };

  const chartSeries = [
    {
      name: 'Incidents',
      data: counts,
    },
  ];

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
            selectedGraphType: 'MainFactor',
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
    <Chart
      options={chartOptions}
      series={chartSeries}
      type="bar"
      height={350}
      style={{ width: '100%' }}
    />
  );
};
