import React from 'react';
import ReactApexChart from 'react-apexcharts';

const CustomDashboardCharts = ({ data, chartType }) => {

  console.log('CustomDashboardCharts data:', data);
  const dataArray = Array.isArray(data) ? data : [];
  if (!dataArray.length) return null;

  // const chartType = dataArray[0]?.ChartType;
  const isBar = chartType === 'Bar Chart';

  const monthShortMap = {
    January: 'Jan',
    February: 'Feb',
    March: 'Mar',
    April: 'Apr',
    May: 'May',
    June: 'Jun',
    July: 'Jul',
    August: 'Aug',
    September: 'Sep',
    October: 'Oct',
    November: 'Nov',
    December: 'Dec',
  };

  const categories = dataArray.map((item) => {
    const month = item?.MonthName ?? '';
    return monthShortMap[month] || month;
  });

  const seriesData = dataArray.map((item) => item?.IncidentCount ?? 0);

  const chartOptions = {
    chart: {
      id: 'custom-dashboard-chart',
      toolbar: {
        show: true, 
        tools: {
          download: true, 
          selection: true,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
          customIcons: [],
        },
      },
        },
    legend: {
      show: false,
    },
    xaxis: {
      categories,
      labels: {
        rotate: 0,
        style: {
          fontSize: '12px',
          fontWeight: 'bold',
        },
      },
    },
    dataLabels: { enabled: false },
    ...(isBar
      ? {
          plotOptions: {
            bar: {
              distributed: true,
              columnWidth: '50%',
            },
          },
          colors: [
            '#e74c3c', '#f39c12', '#27ae60', '#8e44ad',
            '#3498db', '#d35400', '#2ecc71', '#1abc9c',
            '#9b59b6', '#34495e', '#e67e22', '#16a085',
          ],
        }
      : {
          stroke: {
            width: 3,
            curve: 'smooth',
            colors: ['#e919a1'],
          },
          markers: {
            size: 5,
            colors: ['#e919a1'],
            strokeColors: '#e919a1',
            strokeWidth: 2,
          },
          colors: ['#e919a1'],
        }),
  };

  const series = [
    {
      name: 'Incidents',
      data: seriesData,
    },
  ];

  return (
    <ReactApexChart
      options={chartOptions}
      series={series}
      type={isBar ? 'bar' : 'line'}
      height={350}
    />
  );
};

export default CustomDashboardCharts;