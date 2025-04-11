
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


export const RiskLevelChart = ({
  data = [],
  selectedFacility,
  selectedModuleId,
  selectedMenu,
  userDetails,
  onBarClick,
  onReset,
}) => {
  const [selectedId, setSelectedId] = useState(null);
  const [totalPage, setTotalPage] = useState(null);
  const [incidentData, setIncidentData] = useState(null);
  const [generateReportDetails] = useGetIncidentDetailsMutation();
  const dispatch = useDispatch();

  const { tableFilters, filters } = useSelector((state) => state.incidentDashboard);
  const { pageIndex, pageSize } = tableFilters;

  const isMultiFacility = filters?.facilityId?.length > 1;

  const uniqueRiskLevels = data.map(
    (item) => `${item.risklevel}___${item.risklevelid}`
  );

  const uniqueFacilities = [
    ...new Set(data.flatMap((item) => item.Facilities.map((f) => f.FacilityName))),
  ];

  const facilitySeries = uniqueFacilities.map((facilityName) => ({
    name: facilityName,
    data: uniqueRiskLevels.map((key) => {
      const [riskLevelName, riskLevelId] = key.split("___");
      const matchedItem = data.find(
        (i) =>
          i.risklevel === riskLevelName &&
          String(i.risklevelid) === riskLevelId &&
          i.Facilities.some((f) => f.FacilityName === facilityName)
      );

      return (
        matchedItem?.Facilities.find((f) => f.FacilityName === facilityName)?.RecordCount || 0
      );
    }),
  }));

  const groupedData = Object.values(
    data.reduce((acc, item) => {
      const key = `${item.risklevel}___${item.risklevelid}`;
      if (!acc[key]) {
        acc[key] = {
          risklevel: item.risklevel,
          Count: 0,
          risklevelid: item.risklevelid,
        };
      }
      acc[key].Count += item.Count;
      return acc;
    }, {})
  );

  const sortedData = groupedData.sort((a, b) => b.Count - a.Count);
  const singleFacilitySeries = [{ name: "Count", data: sortedData.map((item) => item.Count || 0) }];

  const series = isMultiFacility ? facilitySeries : singleFacilitySeries;

  const xCategories = isMultiFacility
    ? uniqueRiskLevels.map((key) => key.split("___")[0])
    : sortedData.map((item) => item.risklevel || "N/A");

  const fullRiskLevelNames = isMultiFacility
    ? uniqueRiskLevels.map((key) => key.split("___")[0])
    : sortedData.map((item) => item.risklevel);

  const barColors = PREDEFINED_COLORS;

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
          return fullRiskLevelNames[index] || "UNKNOWN";
        },
      },
    },
    colors: barColors,
    chart: {
      toolbar: { show: true },
      events: {
        dataPointSelection: async (event, chartContext, config) => {
          const clickedIndex = config.dataPointIndex;

          let selectedRiskId = null;

          if (isMultiFacility) {
            const selectedKey = uniqueRiskLevels[clickedIndex];
            selectedRiskId = selectedKey?.split("___")[1];
          } else {
            const selected = sortedData[clickedIndex];
            selectedRiskId = selected?.risklevelid;
          }

          if (selectedRiskId) {
            setSelectedId(null);
            dispatch(
              setTableFilters({
                ...tableFilters,
                pageIndex: 0,
                selectedGraphType: "",
                customProperty: null,
              })
            );

            setSelectedId(selectedRiskId);
            dispatch(
              setTableFilters({
                ...tableFilters,
                pageIndex: 0,
                selectedGraphType: "RiskLevel",
                customProperty: selectedRiskId,
              })
            );
          }
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
            selectedGraphType: "RiskLevel",
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
        <Chart options={options} series={series} type="bar" height={300} style={{ width: "100%" }} />
      )}
    />
  );
};

  
  
 