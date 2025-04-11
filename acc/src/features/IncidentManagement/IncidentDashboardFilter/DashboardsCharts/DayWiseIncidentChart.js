import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
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

export const DayWiseIncidentChart = ({
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

  const weekdaysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const categories = weekdaysOrder;
  const barColors = categories.map(
    (_, index) => PREDEFINED_COLORS[index % PREDEFINED_COLORS.length]
  );
  const facilityMap = new Map();
  data.forEach((dayItem) => {
    dayItem.Facilities?.forEach((f) => {
      facilityMap.set(f.FacilityId, f.FacilityName);
    });
  });
  const facilityList = Array.from(facilityMap.entries());
  const isSingleFacility = facilityList.length === 1;

  const series = facilityList.map(([facilityId, facilityName]) => {
    const dayWiseCounts = weekdaysOrder.map((day) => {
      const dayItem = data.find((d) => d.Day === day);
      const facilityData = dayItem?.Facilities?.find((f) => f.FacilityId === facilityId);
      return facilityData?.RecordCount || 0;
    });

    return {
      name: facilityName,
      data: dayWiseCounts,
    };
  });


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
      },
      events: {
        dataPointSelection: async (event, chartContext, config) => {
          const dayIndex = config.dataPointIndex;
          const seriesIndex = config.seriesIndex;

          const selectedDay = weekdaysOrder[dayIndex];
          const facilityId = facilityList[seriesIndex]?.[0];

          if (selectedDay && facilityId) {
            setSelectedId(selectedDay);
            dispatch(
              setTableFilters({
                ...tableFilters,
                pageIndex: 0,
                selectedGraphType: 'DayWise',
                customProperty: selectedDay,
              })
            );
          }
        },
      },
    },
    xaxis: {
      categories: weekdaysOrder,
      labels: {
        rotate: -45,
        style: {
          fontSize: '12px',
          colors: weekdaysOrder.map(() => '#333'),
        },
      },
    },
    plotOptions: {
      bar: {
        columnWidth: '55%',
        borderRadius: 2,
        distributed: isSingleFacility
      },
    },
    colors: isSingleFacility
    ? weekdaysOrder.map((_, i) => PREDEFINED_COLORS[i % PREDEFINED_COLORS.length])
    : facilityList.map((_, i) => PREDEFINED_COLORS[i % PREDEFINED_COLORS.length]),   
    legend: { show: !isSingleFacility },

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
            selectedGraphType: 'DayWise',
            customProperty: selectedId, // only day passed here
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
      data={data}
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

