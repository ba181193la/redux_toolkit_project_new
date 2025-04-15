import React from "react";
import Chart from "react-apexcharts";

export const IncidentContributingFactorChart = ({ data, onBarClick }) => {
  const sortedData = [...data].sort((a, b) => b.Count - a.Count);

  const labels = sortedData.map((item) => item.ContributingFactor);
  const counts = sortedData.map((item) => item.Count);
  
  const barColor = '#7cb5ec';

  const chartOptions = {
    chart: {
      type: "bar",
      toolbar: { show: true },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          if (onBarClick && typeof onBarClick === 'function') {
            const clickedIndex = config.dataPointIndex;
            const selectedFactor = sortedData[clickedIndex];
            onBarClick(selectedFactor.ContributingFactorCode, selectedFactor);
          }
        }
      }
    },
    xaxis: {
      categories: labels,
      labels: {
        style: { fontSize: "12px", colors: "#333" }
      }
    },
    colors: [barColor], 
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "60%",
        borderRadius: 0,
        distributed: false 
      }
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    grid: { borderColor: "#e0e0e0", strokeDashArray: 3 }
  };

  const chartSeries = [
    {
      name: "Incidents",
      data: counts,
    },
  ];

  return (
    <Chart options={chartOptions} series={chartSeries} type="bar" height={350} style={{ width: "100%" }} />
  );
};
