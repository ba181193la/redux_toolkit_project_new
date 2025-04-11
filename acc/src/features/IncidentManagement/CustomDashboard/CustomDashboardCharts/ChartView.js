import React, { useEffect, useState } from 'react';
import CustomDashboardCharts from './CustomDashboardCharts';

const ChartView = () => {
  const [chartData, setChartData] = useState([]);
  const [chartType, setChartType] = useState('');
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');

  useEffect(() => {
    // Get query parameters from URL
    const params = new URLSearchParams(window.location.search);
    
    try {
      // Parse the data from URL
      const data = params.get('data');
      if (data) {
        setChartData(JSON.parse(decodeURIComponent(data)));
      }
      
      setChartType(decodeURIComponent(params.get('type') || 'Run Chart'));
      setTitle(decodeURIComponent(params.get('title') || 'Chart'));
      setYear(params.get('year') || '');
    } catch (error) {
      console.error('Error parsing chart data:', error);
    }
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#606369', margin: 0 }}>
          {title} - Year {year}
        </h1>
        {/* <button 
          onClick={() => window.print()}
          style={{
            padding: '8px 16px',
            backgroundColor: '#337ab7',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          <i className="fa fa-print" style={{ marginRight: '8px' }} />
          Print
        </button> */}
      </div>
      
      <div style={{ 
        backgroundColor: '#fff', 
        padding: '30px', 
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        height: 'calc(100vh - 120px)'
      }}>
        <CustomDashboardCharts
          data={chartData}
          chartType={chartType}
          fullscreen={true}
        />
      </div>
    </div>
  );
};

export default ChartView;