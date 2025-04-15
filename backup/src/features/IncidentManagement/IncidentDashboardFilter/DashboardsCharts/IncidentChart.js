import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { useGetIncidentDetailsMutation } from '../../../../redux/RTK/IncidentManagement/IncidentDashboardApi';
import {
  FlexContainer,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import { useDispatch, useSelector } from 'react-redux';
import { setTableFilters } from '../../../../redux/features/mainMaster/IncidentDashboardSlice';

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

const columns = [
  { id: 'FacilityName', name: 'Facility Name' },
  { id: 'IncidentNo', name: 'Incident Number' },
  { id: 'IncidentDate', name: 'Incident Date' },
  { id: 'IncidentDetails', name: 'Incident Detail' },
  { id: 'IncidentType', name: 'Incident Type' },
];

const commonOptions = {
  chart: { type: 'bar', toolbar: { show: false } },
  plotOptions: {
    bar: { borderRadius: 8, horizontal: false, columnWidth: '50%' },
  },
  grid: { borderColor: '#e0e0e0', strokeDashArray: 3 },
  dataLabels: { enabled: false },
};

export const IncidentTypeChart = ({
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

  const isMultiFacility = filters?.facilityId?.length > 1;

  console.log('isMultiFacility::', isMultiFacility);

  const uniqueIncidents = data.map(
    (item) => `${item.IncidentType}___${item.IncidentTypeId}`
  );
    const uniqueFacilities = [
    ...new Set(
      data.flatMap((item) =>
        item.Facilities.map((f) => f.FacilityName)
      )
    ),
  ];

  const facilitySeries = uniqueFacilities.map((facilityName) => ({
    name: facilityName,
    data: uniqueIncidents.map((key) => {
      const [incidentType, incidentId] = key.split("___");
      const matchedItem = data.find(
        (i) =>
          i.IncidentType === incidentType &&
          String(i.IncidentTypeId) === incidentId &&
          i.Facilities.some((f) => f.FacilityName === facilityName)
      );

      return (
        matchedItem?.Facilities.find((f) => f.FacilityName === facilityName)
          ?.RecordCount || 0
      );
    }),
  }));

  const groupedData = [...data].sort((a, b) => b.Count - a.Count);
  console.log('groupedData::', groupedData);
  console.log('olddata::', data);

  const singleFacilitySeries = [
    {
      name: 'Count',
      data: groupedData.map((item) => item.Count || 0),
    },
  ];

  const series = isMultiFacility ? facilitySeries : singleFacilitySeries;

  const xCategories = isMultiFacility
    ? uniqueIncidents.map((key) => {
        const [name] = key.split("___");
        return name?.length > 8 ? name.slice(0, 8) + "..." : name;
      })
    : groupedData.map((item) =>
        item.IncidentType?.length > 8
          ? item.IncidentType.slice(0, 8) + "..."
          : item.IncidentType || "UNKNOWN"
      );

  const fullIncidentTypeNames = isMultiFacility
    ? uniqueIncidents.map((key) => key.split("___")[0])
    : groupedData.map((item) => item.IncidentType);

  const options = {
    ...commonOptions,
    xaxis: {
      categories: xCategories,
      labels: { rotate: -45 },
    },
    tooltip: {
      x: {
        formatter: function (_val, opts) {
          const index = opts.dataPointIndex;
          return fullIncidentTypeNames[index] || "UNKNOWN";
        },
      },
    },
    colors: PREDEFINED_COLORS,
    chart: {
      toolbar: { show: true },
      events: {
        dataPointSelection: async (event, chartContext, config) => {
          const clickedIndex = config.dataPointIndex;
        
          if (!isMultiFacility) {
            const selectedIncident = groupedData[clickedIndex];
            if (selectedIncident) {
              const incidentId = selectedIncident.IncidentTypeId;
              setSelectedId(incidentId);
              dispatch(
                setTableFilters({
                  ...tableFilters,
                  pageIndex: 0,
                  selectedGraphType: 'IncidentType',
                  customProperty: incidentId,
                })
              );
            }
          } else {
            const selectedKey = uniqueIncidents[clickedIndex];
            const incidentId = selectedKey?.split("___")[1];
        
            if (incidentId) {
              setSelectedId(incidentId);
              dispatch(
                setTableFilters({
                  ...tableFilters,
                  pageIndex: 0,
                  selectedGraphType: 'IncidentType',
                  customProperty: incidentId,
                })
              );
            }
          }
        }
        
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 2,
        columnWidth: '60%',
        distributed: !isMultiFacility,
      },
    },
    legend: { show: isMultiFacility },
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
            selectedGraphType: 'IncidentType',
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
      <Chart
        options={options}
        series={series}
        type="bar"
        height={350}
        style={{ width: '100%' }}
      />
    </FlexContainer>
  );
};

