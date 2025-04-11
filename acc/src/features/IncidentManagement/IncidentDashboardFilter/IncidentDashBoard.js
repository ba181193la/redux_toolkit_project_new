import React, { useState, useEffect } from 'react';
import {
  FlexContainer,
  StyledTypography,
} from '../../../utils/StyledComponents';
import { useTranslation } from 'react-i18next';
import IncidentDashBoardView from './IncidentDashboardView/IncidentDashboardView';
import DetailsDataTable from './IncidentDashboardView/DetailsDataTable';
import useWindowDimension from '../../../hooks/useWindowDimension';
import {
  useGenerateIncidentDashBoardFilterReportMutation,
  useGetIncidentDetailsMutation,
  useDownloadDashboardFilterReportsMutation,
} from '../../../redux/RTK/IncidentManagement/IncidentDashboardApi';
import { useDispatch, useSelector } from 'react-redux';
import { IncidentTypeChart } from './DashboardsCharts/IncidentChart';
import { HarmLevelChart } from './DashboardsCharts/HarmLevelChart';
import { PersonInvolvedChart } from './DashboardsCharts/PersonInvolvedChart';
import { IncidentByStatusChart } from './DashboardsCharts/IncidentByStatusChart';
import { IncidentOccurrenceTimeChart } from './DashboardsCharts/IncidentOccurrenceTimeChart';
import { DayWiseIncidentChart } from './DashboardsCharts/DayWiseIncidentChart';
import { Top20IncidentDetailsChart } from './DashboardsCharts/Top20IncidentDetailsChart';
import { IncidentOccuringDepartmentsChart } from './DashboardsCharts/IncidentOccuringDepartmentsChart';
import { IncidentContributingMainFactorChart } from './DashboardsCharts/IncidentContributingMainFactor';
import { IncidentContributingSubFactorChart } from './DashboardsCharts/IncidentContributingSubFactor';
import { IncidentActionClosureChart } from './DashboardsCharts/IncidentActionClosureChart';
import { IncidentReportingTATChart } from './DashboardsCharts/IncidentReportingTATChart';
import { IncidentClosureTATChart } from './DashboardsCharts/IncidentClosureTATReport';
import { RiskLevelChart } from './DashboardsCharts/RiskLevelChart';
import { setTableFilters } from '../../../redux/features/mainMaster/IncidentDashboardSlice';

const IncidentDashBoard = () => {
  const { t } = useTranslation();
  const { isMobile } = useWindowDimension();

  const { selectedFacility, selectedMenu, selectedModuleId, userDetails } =
    useSelector((state) => state.auth);

  const { filters, tableFilters } = useSelector(
    (state) => state.incidentDashboard
  );

  const [generateReport, { data: IncidentDashBoardData = [] }] =
    useGenerateIncidentDashBoardFilterReportMutation();

  useEffect(() => {
    if (selectedFacility?.id && selectedModuleId && selectedMenu?.id) {
      generateReport({
        ...filters,
        pageIndex: (filters.pageIndex || 0) + 1,
        headerFacilityId: selectedFacility?.id || 0,
        loginUserId: userDetails?.UserId || 0,
        moduleId: selectedModuleId,
        menuId: selectedMenu?.id,
      });
    }
  }, [
    filters,
    selectedFacility?.id,
    selectedModuleId,
    selectedMenu?.id,
    generateReport,
  ]);

  const chartComponents = {
    IncidentTypeData: IncidentTypeChart,
    HarmLevelData: HarmLevelChart,
    Incidentrisklevel: RiskLevelChart,
    PersonInvolved: PersonInvolvedChart,
    IncidentByStatus: IncidentByStatusChart,
    IncidentOccurrenceTime: IncidentOccurrenceTimeChart,
    DayWiseIncident: DayWiseIncidentChart,
    Top20IncidentDetails: Top20IncidentDetailsChart,
    IncidentOccuringDepartments: IncidentOccuringDepartmentsChart,
    IncidentContributingMainFactor: IncidentContributingMainFactorChart,
    IncidentContributingSubFactor: IncidentContributingSubFactorChart,
    IncidentActionClosure: IncidentActionClosureChart,
    IncidentReportingTAT: IncidentReportingTATChart,
    IncidentClosureTATReport: IncidentClosureTATChart,
  };

  const getChartTitle = (key) => {
    const titles = {
      IncidentTypeData: 'INCIDENT TYPE',
      HarmLevelData: 'HARM LEVEL',
      Incidentrisklevel: 'INCIDENT RISK LEVEL',
      PersonInvolved: 'PERSON INVOLVED IN THE INCIDENT',
      IncidentByStatus: 'INCIDENT BY STATUS',
      IncidentOccurrenceTime: 'INCIDENT OCCURRENCE TIME',
      DayWiseIncident: 'DAY WISE INCIDENT',
      Top20IncidentDetails: 'TOP 20 INCIDENT DETAILS',
      IncidentOccuringDepartments: 'INCIDENT OCCURRING DEPARTMENTS',
      IncidentContributingMainFactor: 'INCIDENT CONTRIBUTING MAIN FACTOR',
      IncidentContributingSubFactor: 'INCIDENT CONTRIBUTING SUB FACTOR',
      IncidentActionClosure: 'INCIDENT ACTION CLOSURE',
      IncidentReportingTAT: 'INCIDENT REPORTING TAT',
      IncidentClosureTATReport: 'INCIDENT CLOSURE TAT',
    };
    return titles[key] || key;
  };
  const [selectedId, setSelectedId] = useState(null);
  const [selectedChartKey, setSelectedChartKey] = useState(null);
  const [selectedChartData, setSelectedChartData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [totalPage, setTotalPage] = useState(null);
  const dispatch = useDispatch();

  console.log('columns', columns);
  console.log('selectedChartKey', selectedChartKey);

  const fullWidthChartKeys = [
    'IncidentTypeData',
    'Incidentrisklevel',
    'DayWiseIncident',
    'IncidentOccurrenceTime',
    'IncidentByStatus',
    'IncidentActionClosure',
    'PersonInvolved',
    'IncidentReportingTAT',
    'IncidentClosureTATReport',
  ];

  const groupRows = (entries, itemsPerRow = 2) => {
    const rows = [];
    const fullWidthRows = [];
    const regularEntries = [];
  
    const isMultipleFacility = filters?.facilityId?.length > 1;
  
    const validEntries = entries.filter(
      ([key, value]) =>
        Array.isArray(value) && value.length > 0 && chartComponents[key]
    );
  
    if (isMultipleFacility) {
      for (let [key, value] of validEntries) {
        const isFullWidth =
          key === 'Top20IncidentDetails' ||
          (fullWidthChartKeys.includes(key));
  
        if (isFullWidth) {
          fullWidthRows.push([[key, value]]); // Each full-width chart in its own row
        } else {
          regularEntries.push([key, value]);
        }
      }
  
      // Add full-width charts first
      rows.push(...fullWidthRows);
  
      // Then group non-full-width charts
      let currentRow = [];
      for (let i = 0; i < regularEntries.length; i++) {
        currentRow.push(regularEntries[i]);
        if (currentRow.length === itemsPerRow) {
          rows.push([...currentRow]);
          currentRow = [];
        }
      }
      if (currentRow.length > 0) {
        rows.push(currentRow);
      }
    } else {
      // If not multiple facility, preserve original order
      let currentRow = [];
      for (let [key, value] of validEntries) {
        const isFullWidth = key === 'Top20IncidentDetails';
  
        if (isFullWidth) {
          if (currentRow.length > 0) {
            rows.push([...currentRow]);
            currentRow = [];
          }
          rows.push([[key, value]]);
        } else {
          currentRow.push([key, value]);
          if (currentRow.length === itemsPerRow) {
            rows.push([...currentRow]);
            currentRow = [];
          }
        }
      }
      if (currentRow.length > 0) {
        rows.push(currentRow);
      }
    }
  
    return rows;
  };
  
  

  const entries = IncidentDashBoardData?.Data
    ? Object.entries(IncidentDashBoardData.Data)
    : [];
  const rows = groupRows(entries, 2);
  console.log('rows', rows);

  const handleClose = (e) => {
    e.stopPropagation();
    dispatch(
      setTableFilters({
        ...tableFilters,
        pageIndex: 0,
        selectedGraphType: '',
        customProperty: null,
      })
    );
    setSelectedChartKey(null);
  };
  const [triggerDownloadData] = useDownloadDashboardFilterReportsMutation();

  const handleExport = async () => {
    try {
      const fileName = `${getChartTitle(selectedChartKey) || 'Details'}.xlsx`;

      const blob = await triggerDownloadData({
        downloadType: 'Excel',
        payload: {
          ...tableFilters,
          headerFacility: selectedFacility?.id || 0,
          loginUserId: userDetails?.UserId || 0,
          moduleId: selectedModuleId,
          menuId: selectedMenu?.id,
          facilityId: filters.facilityId,
          year: filters.year,
          pageSize: 100,
        },
      }).unwrap();

      saveAs(blob, fileName);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <FlexContainer
      width="100%"
      height="100%"
      flexDirection="column"
      gap="24px"
      style={{ paddingBottom: '20px' }}
    >
      <FlexContainer
        justifyContent="space-between"
        style={{ paddingBottom: '15px' }}
      >
        <StyledTypography
          fontSize={isMobile ? '24px' : '36px'}
          fontWeight="900"
          lineHeight={isMobile ? '32px' : '44px'}
          color="#0083C0"
          whiteSpace="nowrap"
        >
          {t('IM_IncidentDashboard-DashboardFIlter')}
        </StyledTypography>
      </FlexContainer>

      {/* Dashboard Content */}
      <FlexContainer height="auto" flex="1" flexDirection="column" gap="24px">
        <FlexContainer
          height="100%"
          width="100%"
          padding="25px"
          borderRadius="8px"
          flexDirection="column"
          backgroundColor="#fff"
        >
          <IncidentDashBoardView />
        </FlexContainer>

        {/* Render each row of charts */}
        {rows.map((row, rowIndex) => {
          const isFullWidthRow = row.length === 1 && (
            row[0][0] === 'Top20IncidentDetails' ||
            (filters?.facilityId?.length > 1 && fullWidthChartKeys.includes(row[0][0]))
          );
                    const isLastRow = rowIndex === rows.length - 1;
          const singleChartInLastRow = isLastRow;
          const isPartialRow = isLastRow && row.length < 2 && !isFullWidthRow;

          return (
            <React.Fragment key={rowIndex}>
              <FlexContainer
                width="100%"
                justifyContent={isPartialRow ? 'flex-start' : 'space-between'}
                gap="40px"
              >
                {row.map(([key, value]) => {
                  if (
                    !Array.isArray(value) ||
                    value.length === 0 ||
                    !chartComponents[key]
                  ) {
                    console.warn(
                      `Skipping ${key}: Invalid or empty data`,
                      value
                    );
                    return null;
                  }

                  const isFullWidth =
                    key === 'Top20IncidentDetails' ||
                    (filters?.facilityId?.length > 1 &&
                      fullWidthChartKeys.includes(key));

                  return (
                    <FlexContainer
                      key={key}
                      width={isFullWidth ? '100%' : '48%'}
                      flexDirection="column"
                      gap="6px"
                    >
                      {/* Chart Container */}
                      <FlexContainer
                        backgroundColor="#fff"
                        padding="20px"
                        borderRadius="8px"
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        style={{ minHeight: '400px', marginBottom: '20px' }}
                      >
                        <h3
                          style={{
                            marginBottom: '15px',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            textAlign: 'center',
                          }}
                        >
                          {getChartTitle(key)}
                        </h3>

                        {React.createElement(chartComponents[key], {
                          data: value,
                          filters,
                          selectedFacility,
                          selectedModuleId,
                          selectedMenu,
                          userDetails,
                          onBarClick: (
                            incidentTypeId,
                            data,
                            columns,
                            totalPage
                          ) => {
                            setSelectedChartKey(key);
                            setSelectedChartData(data);
                            setColumns(columns);
                            setTotalPage(totalPage);
                          },
                          onReset: () => setResetSelection(() => () => {}),
                        })}
                      </FlexContainer>
                    </FlexContainer>
                  );
                })}
              </FlexContainer>
              {row.some(([key]) => {
                return key === selectedChartKey;
              }) && (
                <FlexContainer
                  width="100%"
                  padding="20px"
                  borderRadius="8px"
                  backgroundColor="#fff"
                  style={{
                    marginTop: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <FlexContainer
                    style={{ width: '100%', marginBottom: '10px' }}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <StyledTypography fontSize="20px" fontWeight="bold">
                      {getChartTitle(selectedChartKey)}
                    </StyledTypography>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      {/* Export Button */}
                      <i
                        className="fa fa-file"
                        style={{
                          cursor: 'pointer',
                          fontSize: '15px',
                          backgroundColor: '#5cb85c',
                          color: '#fff',
                          padding: '5px',
                          borderRadius: '4px',
                          display: 'inline-block',
                          width: '30px',
                          height: '30px',
                          textAlign: 'center',
                          lineHeight: '20px',
                        }}
                        onClick={handleExport}
                      ></i>

                      {/* Close Button */}
                      <i
                        className="fa fa-times"
                        style={{
                          cursor: 'pointer',
                          fontSize: '15px',
                          backgroundColor: '#0083C0', // Blue color for close
                          color: '#fff',
                          padding: '5px',
                          borderRadius: '4px',
                          display: 'inline-block',
                          width: '30px',
                          height: '30px',
                          textAlign: 'center',
                          lineHeight: '20px',
                        }}
                        onClick={handleClose}
                      ></i>
                    </div>
                  </FlexContainer>

                  <div style={{ width: '100%' }}>
                    {console.log('Selected Chart Data:', selectedChartData)}
                    <DetailsDataTable
                      columns={columns || []}
                      records={selectedChartData || []}
                      totalRecords={totalPage}
                    />
                  </div>
                </FlexContainer>
              )}
            </React.Fragment>
          );
        })}
      </FlexContainer>
    </FlexContainer>
  );
};

export default IncidentDashBoard;
