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
  { id: 'ResponsibleStaff', name: 'Responsible Staff' },
  { id: 'RequestReceivedDate', name: 'Request Received Date' },
  { id: 'ActionsClosure', name: 'Actions Closure' },
  
];
const PREDEFINED_COLORS = [
  '#e919a1',
  '#fd9d25',
  '#bed32c',
  '#25d6ff',
  '#a367dc',
  '#d91239',
  '#11be7f',
  '#56565b',
  '#fce001',
  '#00CED1',
  '#FF6347',
  '#6A5ACD',
  '#20B2AA',
  '#FFD700',
  '#FF1493',
  '#00FF7F',
  '#8A2BE2',
  '#FF4500',
  '#7B68EE',
  '#48D1CC',
];

export const IncidentActionClosureChart = ({
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

  const statusGroups = [
    { key: 'NotClosedCount', label: 'Not Closed', name: 'NotClosed', color: '#FF6384' },
    { key: 'ApprovalPendingCount', label: 'Approval Pending', name: 'ApprovalPending', color: '#FFCE56' },
    { key: 'ClosedOnTimeCount', label: 'Closed On Time', name: 'ClosedOnTime', color: '#36A2EB' },
    { key: 'NotClosedOnTimeCount', label: 'Not Closed On Time', name: 'NotClosedOnTime', color: '#4BC0C0' },
  ];

  const uniqueFacilities = [
    ...new Set(
      data.flatMap((item) =>
        item.Facilities?.map((f) => f.FacilityName)
      )
    ),
  ];

  const groupedBarSeries = uniqueFacilities.map((facilityName) => ({
    name: facilityName,
    data: statusGroups.map((group) => {
      let count = 0;
      data.forEach((entry) => {
        const facilityMatch = entry.Facilities?.find((f) => f.FacilityName === facilityName);
        if (facilityMatch) {
          count += entry[group.key] || 0;
        }
      });
      return count;
    }),
  }));

  const totals = data.reduce(
    (acc, entry) => {
      statusGroups.forEach((group) => {
        acc[group.key] += entry[group.key] || 0;
      });
      return acc;
    },
    Object.fromEntries(statusGroups.map((g) => [g.key, 0]))
  );

  const validGroups = statusGroups.filter((group) => totals[group.key] > 0);
  const hasData = validGroups.length > 0;

  const singleFacilitySeries = [
    {
      name: 'Count',
      data: validGroups.map((g) => totals[g.key]),
    },
  ];

  const series = isMultiFacility ? groupedBarSeries : singleFacilitySeries;

  const barOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: true },
      events: {
        dataPointSelection: async (event, chartContext, config) => {
          const clickedIndex = config.dataPointIndex;
          const group = statusGroups[clickedIndex];
          if (group) {
            setSelectedId(group.name);
            dispatch(
              setTableFilters({
                ...tableFilters,
                pageIndex: 0,
                selectedGraphType: 'Actionclosure',
                customProperty: group.name,
              })
            );
          }
        },
      },
    },
    xaxis: {
      categories: statusGroups.map((g) => g.label),
      labels: { rotate: -45 },
    },
    tooltip: {
      x: {
        formatter: (val, opts) => {
          const index = opts.dataPointIndex;
          return statusGroups[index]?.label || 'Unknown';
        },
      },
    },
    colors: PREDEFINED_COLORS,
    plotOptions: {
      bar: {
        columnWidth: '60%',
        borderRadius: 2,
        horizontal: false,
        distributed: !isMultiFacility,
      },
    },
    legend: { show: isMultiFacility },
  };

  const donutOptions = {
    chart: {
      type: 'donut',
      toolbar: { show: true },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const selectedIncident = validGroups[config.dataPointIndex];
          if (selectedIncident) {
            setSelectedId(selectedIncident.name);
            dispatch(setTableFilters({
              ...tableFilters,
              pageIndex: 0,
              selectedGraphType: 'Actionclosure',
              customProperty: selectedIncident.name,
            }));
          }
        },
      },
    },
    labels: validGroups.map((g) => g.label),
    colors: validGroups.map((g) => g.color),
    legend: { position: 'bottom', horizontalAlign: 'center', fontSize: '14px' },
    plotOptions: {
      pie: {
        donut: {
          size: '60%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Actions',
              formatter: () =>
                data.reduce((sum, entry) => sum + entry.TotalCount, 0),
            },
          },
        },
      },
    },
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
            selectedGraphType: 'Actionclosure',
            customProperty: selectedId,
            year: filters.year,
            facilityId: filters.facilityId,
            pageIndex: (tableFilters.pageIndex || 0) + 1,
            pageSize,
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
      options={isMultiFacility ? barOptions : donutOptions}
      series={
        isMultiFacility
          ? groupedBarSeries
          : hasData
            ? validGroups.map((g) => totals[g.key])
            : [1]
      }
      type={isMultiFacility ? 'bar' : 'donut'}
      height={365}
      style={{ width: '100%' }}
    />
  );
};


