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
  { id: 'IncidentHarmLevel', name: 'Incident Harm Level' },
  { id: 'IncidentRiskLevel', name: 'Incident Risk Level' },
  {
    id: 'PersonInvolvedintheIncident',
    name: 'Person Involved in the Incident',
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

const SafeChartWrapper = ({ data, renderChart }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <div>No Data Available</div>;
  }
  return renderChart();
};

export const PersonInvolvedChart = ({
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

  // Unique facilities
  const uniqueFacilities = [
    ...new Set(
      data.flatMap((item) =>
        item.Facilities?.map((f) => f.FacilityName)
      )
    ),
  ];

  // Unique person types
  const allPersonTypes = [
    ...new Set(
      data.flatMap((item) =>
        item.Facilities?.flatMap((f) =>
          f.PersonTypes?.map((p) => p.PersonType)
        )
      )
    ),
  ];

  // Grouped bar data for multi-facility
  const groupedBarSeries = uniqueFacilities.map((facilityName) => ({
    name: facilityName,
    data: allPersonTypes.map((personType) => {
      let count = 0;
      data.forEach((item) => {
        const facility = item.Facilities?.find(
          (f) => f.FacilityName === facilityName
        );
        const person = facility?.PersonTypes?.find(
          (p) => p.PersonType === personType
        );
        count += person?.Count || 0;
      });
      return count;
    }),
  }));

  // Single-facility mode (flat data)
  const groupedData = Object.values(
    data
      .flatMap((person) =>
        person.Facilities?.flatMap((facility) => facility.PersonTypes) || []
      )
      .reduce((acc, item) => {
        if (!acc[item.PersonType]) {
          acc[item.PersonType] = { PersonType: item.PersonType, Count: 0 };
        }
        acc[item.PersonType].Count += item.Count;
        return acc;
      }, {})
  );

  const sortedData = groupedData.sort((a, b) => b.Count - a.Count);

  const barColors = sortedData.map(
    (_, index) => PREDEFINED_COLORS[index % PREDEFINED_COLORS.length]
  );

  const series = isMultiFacility
    ? groupedBarSeries
    : [
        {
          name: 'Count',
          data: sortedData.map((item) => item.Count || 0),
        },
      ];

  const categories = isMultiFacility
    ? allPersonTypes
    : sortedData.map((item) => item.PersonType || 'N/A');

  const options = {
    ...commonOptions,
    xaxis: { categories },
    colors: isMultiFacility ? PREDEFINED_COLORS : barColors,
    chart: {
      toolbar: { show: true },
      events: {
        dataPointSelection: async (event, chartContext, config) => {
          const clickedIndex = config.dataPointIndex;
          const selectedType = categories[clickedIndex];
          if (selectedType) {
            setSelectedId(selectedType);
            dispatch(
              setTableFilters({
                ...tableFilters,
                pageIndex: 0,
                selectedGraphType: 'PersonInvolved',
                customProperty: selectedType,
              })
            );
          }
        },
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
            selectedGraphType: 'PersonInvolved',
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
    <SafeChartWrapper
      data={isMultiFacility ? groupedBarSeries : sortedData}
      renderChart={() => (
        <Chart
          options={options}
          series={series}
          type="bar"
          height={350}
          style={{ width: '100%' }}
        />
      )}
    />
  );
};

