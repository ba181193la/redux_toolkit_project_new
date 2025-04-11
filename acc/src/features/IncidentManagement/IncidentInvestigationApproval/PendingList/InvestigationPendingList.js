import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useWindowDimension from '../../../../hooks/useWindowDimension';
import FilterIcon from '../../../../assets/Icons/FilterIcon.png';
import FilterTable from '../../../../assets/Icons/FilterTable.png';
import DownloadFileIcon from '../../../../assets/Icons/DownloadFileIcon.png';
import FilterCloseIcon from '../../../../assets/Icons/FilterCloseIcon.png';
import WhiteSearch from '../../../../assets/Icons/WhiteSearch.png';
import PrintFileIcon from '../../../../assets/Icons/PrintFileIcon.png';
import Eraser from '../../../../assets/Icons/Eraser.png';
import Date from '../../../../components/Date/Date';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledSearch,
  StyledTypography,
  SuccessMessage,
} from '../../../../utils/StyledComponents';
import {
  Autocomplete,
  Badge,
  Checkbox,
  Collapse,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import {
  useDownloadPendingListMutation,
  useGetPendingListQuery,
} from '../../../../redux/RTK/IncidentManagement/incidentInvestigationApprovalApi';
import {
  resetPendingFilters,
  setIsPendingFilterApplied,
  setPendingFilters,
} from '../../../../redux/features/IncidentManagement/incidentInvestigationApprovalSlice';
import styled from 'styled-components';
import { getlabel } from '../../../../utils/language';
import { Form, Formik } from 'formik';
import Label from '../../../../components/Label/Label';
import MultiSelectDropdown from '../../../../components/Dropdown/MultiSelectDropdown';
import SearchDropdown from '../../../../components/SearchDropdown/SearchDropdown';
import InvestigationPendingDataTable from '../PendingList/InvestigationPendingDataTable';

const StyledCollapse = styled(Collapse)`
  padding: ${(props) => (props.openFilter ? '0 0 20px 0' : '0')};
`;

export const StyledDivider = styled(Divider)`
  width: 0px !important;
  height: 30px !important;
  border-left: 1px solid #99cde6 !important;
  opacity: 1 !important;
`;

const BorderBox = styled.div`
  border: 1px solid #0083c0;
  padding: 6px 8px 8px 8px;
  border-radius: 4px;
`;

const InvestigationPendingList = ({
  labelStatus,
  fieldLabels,
  pageFields,
  searchFields,
  pageLoadData,
}) => {
  //*Hooks declaration
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isMobile, isTablet } = useWindowDimension();

  //* Selectors
  const { pendingFilters, isPendingFilterApplied } = useSelector(
    (state) => state.investigationApproval
  );
  const { pageIndex, pageSize } = useSelector(
    (state) => state.investigationApproval.pendingFilters
  );

  const {
    selectedRoleFacility,
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
    roleFacilities,
    isSuperAdmin,
  } = useSelector((state) => state.auth);

  //* Pending column list
  const pendingColumnsList = [
    {
      id: 'FacilityName',
      translationId: 'IM_IIA_Facility',
      isSelected: true,
      isShow: pageFields?.find((x) => x.FieldId === 'IIA_P_Facility')?.IsShow,
      orderNo: 1,
    },
    {
      id: 'IncidentDate',
      translationId: 'IM_IIA_IncidentDate',
      isSelected: true,
      isShow: pageFields?.find((x) => x.FieldId === 'IIA_P_IncidentDate')
        ?.IsShow,
      orderNo: 2,
    },
    {
      id: 'ReportedDate',
      translationId: 'IM_IIA_ReportedDate',
      isSelected: true,
      isShow: pageFields?.find((x) => x.FieldId === 'IIA_P_ReportedDate')
        ?.IsShow,
      orderNo: 3,
    },

    {
      id: 'RequestReceivedDate',
      translationId: 'IM_IIA_RequestReceivedDate',
      isSelected: true,
      isShow: pageFields?.find((x) => x.FieldId === 'IIA_P_RequestReceivedDate')
        ?.IsShow,
      orderNo: 4,
    },
    {
      id: 'IncidentNumber',
      translationId: 'IM_IIA_IncidentNumber',
      isSelected: true,
      isShow: pageFields?.find((x) => x.FieldId === 'IIA_P_IncidentNumber')
        ?.IsShow,
      orderNo: 5,
    },
    {
      id: 'IncidentDetail',
      translationId: 'IM_IIA_IncidentDetails',
      isSelected: true,
      isShow: pageFields?.find((x) => x.FieldId === 'IIA_P_IncidentDetails')
        ?.IsShow,
      orderNo: 6,
    },
    {
      id: 'IncidentType',
      translationId: 'IM_IIA_IncidentType',
      isSelected: true,
      isShow: pageFields?.find((x) => x.FieldId === 'IIA_P_IncidentType')
        ?.IsShow,
      orderNo: 7,
    },
    {
      id: 'DepartmentName',
      translationId: 'IM_IIA_IncidentDepartment',
      isSelected: true,
      isShow: pageFields?.find((x) => x.FieldId === 'IIA_P_IncidentDepartment')
        ?.IsShow,
      orderNo: 8,
    },
    {
      id: 'InvestigatorName',
      translationId: 'IM_IIA_InvestigatorName',
      isSelected: true,
      isShow: pageFields?.find((x) => x.FieldId === 'IIA_P_InvestigatorName')
        ?.IsShow,
      orderNo: 9,
    },
  ];

  //* State Variables
  const formikRef = useRef(null);
  const [roleMenu, setRoleMenu] = useState();
  const [openPendingtFilter, setOpenPendingFilter] = useState(false);
  const [PendingColumnEl, setPendingColumnEl] = useState(null);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState(pendingColumnsList);
  const [isColumnToggled, setIsColumnToggled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  //*  RTK Queries
  const [triggerDownloadData] = useDownloadPendingListMutation();

  //* Effect to set role menu
  useEffect(() => {
    const roleMenu = selectedRoleFacility?.Menu.find(
      (item) => item.MenuId === selectedMenu?.id
    );
    setRoleMenu(roleMenu);
  }, [selectedRoleFacility, selectedMenu]);

  //* Pending filter fields
  const pendingFilterFields = [
    {
      fieldId: 'IIA_S_Facility',
      translationId: 'IM_IIA_Facility',
      component: 'MultiSelect',
      name: 'facilityId',
      options: userDetails?.ApplicableFacilities?.filter((facility) => {
        if (!facility.IsActive) return false;
        if (isSuperAdmin) return true;
        const facilityItem = roleFacilities
          ?.find((role) => role.FacilityId === facility.FacilityId)
          ?.Menu?.find((MenuItem) => MenuItem.MenuId === selectedMenu?.id);
        return facilityItem?.IsView;
      })?.map((facility) => ({
        text: facility.FacilityName,
        value: facility.FacilityId,
      })),
      isShow: searchFields?.find((x) => x.FieldId === 'IIA_S_Facility')?.IsShow,
      IsMandatory: searchFields?.find((x) => x.FieldId === 'IIA_S_Facility')
        ?.IsMandatory,
    },
    {
      fieldId: 'IIA_S_IncidentFromDate',
      translationId: 'IM_IIA_IncidentFromDate',
      component: 'DatePicker',
      name: 'incidentFromDate',
      isShow: searchFields?.find((x) => x.FieldId === 'IIA_S_IncidentFromDate')
        ?.IsShow,
      IsMandatory: searchFields?.find(
        (x) => x.FieldId === 'IIA_S_IncidentFromDate'
      )?.IsMandatory,
    },
    {
      fieldId: 'IIA_S_IncidentToDate',
      translationId: 'IM_IIA_IncidentToDate',
      component: 'DatePicker',
      name: 'incidentToDate',
      isShow: searchFields?.find((x) => x.FieldId === 'IIA_S_IncidentToDate')
        ?.IsShow,
      IsMandatory: searchFields?.find(
        (x) => x.FieldId === 'IIA_S_IncidentToDate'
      )?.IsMandatory,
    },
    {
      fieldId: 'IIA_S_IncidentNumber',
      translationId: 'IM_IIA_IncidentNumber',
      component: 'Dropdown',
      name: 'incidentNumber',
      options: pageLoadData?.Records?.IncidentListPending?.map((incident) => ({
        text: incident.IncidentNo,
        value: incident.IncidentId,
      })),
      isShow: searchFields?.find((x) => x.FieldId === 'IIA_S_IncidentNumber')
        ?.IsShow,
      IsMandatory: searchFields?.find(
        (x) => x.FieldId === 'IIA_S_IncidentNumber'
      )?.IsMandatory,
    },
    {
      fieldId: 'IIA_S_IncidentDetails',
      translationId: 'IM_IIA_IncidentDetails',
      component: 'Dropdown',
      name: 'incidentDetailId',
      options: pageLoadData?.Records?.incidentDetailsPending?.map((detail) => ({
        text: detail.IncidentDetail,
        value: detail.IncidentDetailId,
      })),
      isShow: searchFields?.find((x) => x.FieldId === 'IIA_S_IncidentDetails')
        ?.IsShow,
      IsMandatory: searchFields?.find(
        (x) => x.FieldId === 'IIA_S_IncidentDetails'
      )?.IsMandatory,
    },
    {
      fieldId: 'IIA_S_InvestigatorName',
      translationId: 'IM_IIA_InvestigatorName',

      component: 'Dropdown',
      name: 'investigatorId',
      options: pageLoadData?.Records?.investigatorListPending?.map((user) => ({
        value: user.InvestigatorId,
        text: user.UserName,
      })),
      isShow: searchFields?.find((x) => x.FieldId === 'IIA_S_InvestigatorName')
        ?.IsShow,
      IsMandatory: searchFields?.find(
        (x) => x.FieldId === 'IIA_S_InvestigatorName'
      )?.IsMandatory,
    },
    {
      fieldId: 'IIA_S_IncidentDepartment',
      translationId: 'IM_IIA_IncidentDepartment',
      component: 'Dropdown',
      name: 'departmentId',
      options: pageLoadData?.Records?.incidentDepartmentPending?.map(
        (department) => ({
          text: department.DepartmentName,
          value: department.DepartmentId,
        })
      ),
      isShow: searchFields?.find(
        (x) => x.FieldId === 'IIA_S_IncidentDepartment'
      )?.IsShow,
      IsMandatory: searchFields?.find(
        (x) => x.FieldId === 'IIA_S_IncidentDepartment'
      )?.IsMandatory,
    },
  ];

  //* Fetch pending list details
  const {
    data: getPendingList = [],
    isFetching,
    refetch,
  } = useGetPendingListQuery(
    {
      payload: {
        ...pendingFilters,
        pageIndex: pageIndex + 1,
        pageSize,
        headerFacilityId: selectedFacility?.id,
        loginUserId: userDetails?.UserId,
        moduleId: selectedModuleId,
        menuId: selectedMenu?.id,
      },
    },
    {
      skip: !selectedFacility?.id || !selectedModuleId || !selectedMenu?.id,
      refetchOnMountOrArgChange: true,
    }
  );

  //* Destructure the pending list
  const { TotalRecords, Records } = getPendingList || {
    TotalRecords: 0,
    Records: [],
  };

  useEffect(() => {
    setFilteredRecords([...(Records || [])]);
  }, [Records]);

  //* Toggle filter section
  const togglePendingFilter = () => {
    setOpenPendingFilter(!openPendingtFilter);
  };

  //* Download excel data
  const handleOnDownload = async (fileType) => {
    try {
      setLoading(true);
      setMessage('Downloading ...');
      const blob = await triggerDownloadData({
        downloadType: fileType,
        payload: {
          pageIndex,
          pageSize,
          headerFacilityId: selectedFacility?.id,
          loginUserId: userDetails?.UserId,
          moduleId: selectedModuleId,
          menuId: selectedMenu?.id,
          incidentId: pendingFilters?.incidentId || 0,
          incidentDetailId: pendingFilters?.incidentDetailId || 0,
          investigatorId: pendingFilters?.investigatorId || 0,
          departmentId: pendingFilters?.departmentId || 0,
          facilityId: pendingFilters?.facilityId || '',
          incidentFromDate: pendingFilters?.incidentFromDate || '',
          incidentToDate: pendingFilters?.incidentToDate || '',
          requestReceivedDate: pendingFilters?.requestReceivedDate || '',
        },
      }).unwrap();
      if (fileType === 'pdf') {
        saveAs(blob, 'Incident Investigation Approval - Pending.pdf');
      } else {
        saveAs(blob, 'Incident Investigation Approval - Pending.xlsx');
      }
      setMessage('Download completed');
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    } catch (error) {
      setMessage('Download Failed');
      setTimeout(() => {
        setLoading(false);
      }, 2000);
      console.error('Download failed:', error);
    }
  };

  //* Table columns toggle
  const handleSelectColumns = (event, column) => {
    const columnId = event.target.name;
    setSelectedColumns((prevSelectedColumns) => {
      const newSelectedColumns = prevSelectedColumns.some(
        (col) => col.id === columnId
      )
        ? prevSelectedColumns.filter((col) => col.id !== columnId)
        : [...prevSelectedColumns, column];
      return newSelectedColumns.sort((a, b) => a.orderNo - b.orderNo);
    });
  };

  useEffect(() => {
    if (selectedColumns?.length !== pendingColumnsList?.length) {
      setIsColumnToggled(true);
    } else {
      setIsColumnToggled(false);
    }
  }, [selectedColumns]);

  return (
    <FlexContainer
      width="100%"
      height="100%"
      flexWrap="wrap"
      style={{
        padding: '1rem',
        border: '1px solid #E0E0E0',
        borderBottomLeftRadius: '5px',
        borderBottomRightRadius: '5px',
      }}
    >
      <FlexContainer
        display="flex"
        justifyContent="space-between"
        width="100%"
        height="100%"
      >
        <FlexContainer
          display="flex"
          justifyContent="flex-end"
          flexWrap="wrap"
          width="100%"
          margin="10px 0"
        >
          <FlexContainer
            gap="0.8rem"
            alignItems="center"
            display="flex"
            flexWrap={isMobile || isTablet ? 'wrap' : ''}
            justifyContent={isMobile ? 'center' : ''}
          >
            <StyledButton
              backgroundColor="#ffffff"
              colour="#000000"
              onClick={() => {
                setOpenPendingFilter(false);
                setIsPendingFilterApplied(false);
                formikRef.current.resetForm();
                dispatch(resetPendingFilters());
              }}
            >
              {t('ClearAll')}
            </StyledButton>
            <Badge
              color="primary"
              overlap="circular"
              variant="dot"
              invisible={!isPendingFilterApplied}
            >
              <Tooltip title="Filter" arrow>
                <StyledImage
                  height="40px"
                  width="40px"
                  gap="10px"
                  borderRadius="40px"
                  cursor="pointer"
                  src={FilterIcon}
                  alt="Filter"
                  onClick={togglePendingFilter}
                  animate={true}
                />
              </Tooltip>
            </Badge>
            <StyledDivider />
            <StyledButton
              backgroundColor="#ffffff"
              colour="#000000"
              onClick={() => {
                setSelectedColumns(pendingColumnsList);
              }}
            >
              {t('ClearAll')}
            </StyledButton>
            <Badge
              color="primary"
              overlap="circular"
              variant="dot"
              invisible={!isColumnToggled}
            >
              <Tooltip title="Configure Columns" arrow>
                <StyledImage
                  height="40px"
                  width="40px"
                  gap="10px"
                  borderRadius="40px"
                  cursor="pointer"
                  src={FilterTable}
                  alt="Filter"
                  onClick={(event) => setPendingColumnEl(event.currentTarget)}
                  animate={true}
                />
              </Tooltip>
            </Badge>
            <Menu
              anchorEl={PendingColumnEl}
              open={Boolean(PendingColumnEl)}
              onClose={() => setPendingColumnEl(null)}
              sx={{
                '& .MuiPaper-root': {
                  width: '240px',
                },
              }}
            >
              {pendingColumnsList
                ?.filter((x) => x.isShow)
                ?.map((column) => (
                  <MenuItem>
                    <FormControlLabel
                      style={{ padding: '0px 0px 0px 10px' }}
                      key={column.id}
                      control={
                        <Checkbox
                          style={{ padding: '2px 5px 2px 2px' }}
                          checked={selectedColumns.some(
                            (col) => col.id === column.id
                          )}
                          onChange={(e) => handleSelectColumns(e, column)}
                          name={column.id}
                        />
                      }
                      label={getlabel(
                        column.translationId,
                        {
                          Data: fieldLabels,
                          Status: labelStatus,
                        },
                        i18n.language
                      )}
                    />
                  </MenuItem>
                ))}
            </Menu>
            <StyledDivider />
            {roleMenu?.IsView && roleMenu?.IsPrint && (
              <>
                <Tooltip title="Download" arrow>
                  <StyledImage
                    height="40px"
                    width="40px"
                    gap="10px"
                    cursor="pointer"
                    borderRadius="40px"
                    src={DownloadFileIcon}
                    disabled={!(TotalRecords !== 0)}
                    alt="Download"
                    animate={true}
                    onClick={() => handleOnDownload('excel')}
                  />
                </Tooltip>
                <StyledDivider />
                <Tooltip title="Print" arrow>
                  <StyledImage
                    height="40px"
                    width="40px"
                    gap="10px"
                    cursor="pointer"
                    borderRadius="40px"
                    src={PrintFileIcon}
                    disabled={!(TotalRecords !== 0 && roleMenu?.IsPrint)}
                    alt="Print"
                    animate={true}
                    onClick={() => handleOnDownload('pdf')}
                  />
                </Tooltip>
              </>
            )}
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
      <StyledCollapse
        in={openPendingtFilter}
        openFilter={openPendingtFilter}
        style={{ width: '100%' }}
      >
        <BorderBox>
          <FlexContainer flexDirection="column" style={{ padding: '10px' }}>
            <FlexContainer
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <StyledTypography
                fontSize={'18px'}
                color="#205475"
                padding="2px 0 2px 0"
                fontWeight="700"
                lineHeight="21.6px"
              >
                {t('SelectFilter')}
              </StyledTypography>
              <IconButton
                onClick={togglePendingFilter}
                sx={{
                  color: '#205475',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    transition: 'transform 0.3s ease',
                    backgroundColor: 'rgba(15, 108, 189, 0.2)',
                  },
                }}
              >
                <StyledImage
                  src={FilterCloseIcon}
                  alt="Filter Close Icon"
                  tooltip="Close"
                />
              </IconButton>
            </FlexContainer>
            <Divider
              sx={{
                marginY: '15px',
                borderColor: '#0083C0',
                width: 'calc(100% - 10px)',
              }}
            />
            <FlexContainer>
              <Formik
                innerRef={formikRef}
                initialValues={pendingFilters}
                onSubmit={async (values) => {
                  dispatch(
                    setPendingFilters({
                      pageIndex: pageIndex,
                      pageSize: pageSize,
                      headerFacilityId: selectedFacility?.id || 0,
                      loginUserId: userDetails?.UserId || 0,
                      moduleId: selectedModuleId || 0,
                      menuId: selectedMenu?.id || 0,
                      incidentId: values?.incidentNumber || 0,
                      incidentDetailId: values?.incidentDetailId || 0,
                      investigatorId: values?.investigatorId || 0,
                      departmentId: values?.departmentId || 0,
                      facilityId: Array.isArray(values?.facilityId)
                        ? values?.facilityId.join(',')
                        : values?.facilityId.toString(),
                      incidentFromDate: values?.incidentFromDate || '',
                      incidentToDate: values?.incidentToDate || '',
                      requestReceivedDate: values?.requestReceivedDate || '',
                    })
                  );
                  dispatch(setIsPendingFilterApplied(true));
                  setOpenPendingFilter(false);
                }}
              >
                {({ values, handleSubmit, resetForm, setFieldValue }) => (
                  <Form>
                    <Grid container spacing={2} display={'flex'}>
                      {pendingFilterFields.map((field) => {
                        const translatedLabel = getlabel(
                          field?.translationId,
                          {
                            Data: fieldLabels,
                            Status: labelStatus,
                          },
                          i18n.language
                        );
                        return (
                          field?.isShow && (
                            <Grid
                              item
                              xs={12}
                              sm={12}
                              md={6}
                              lg={3}
                              xl={3}
                              padding={'10px'}
                              key={field.fieldId}
                            >
                              <Label value={translatedLabel} />
                              {field.component === 'Dropdown' && (
                                <SearchDropdown
                                  disableClearable={true}
                                  name={field.name}
                                  options={[
                                    { text: 'Select', value: '' },
                                    ...(field.options || []),
                                  ]}
                                  getOptionLabel={(option) => option.text}
                                  dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
                                  sx={{
                                    '& .MuiAutocomplete-inputRoot': {
                                      fontSize: '13px',
                                      height: '100%',
                                    },
                                    '& .MuiOutlinedInput-root': {
                                      height: '34px',
                                      '& .MuiAutocomplete-input': {
                                        height: '34px',
                                        fontSize: '13px',
                                      },
                                    },
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      variant="outlined"
                                      placeholder="Select"
                                    />
                                  )}
                                  ListboxProps={{
                                    sx: {
                                      '& .MuiAutocomplete-option': {
                                        fontSize: '13px',
                                        minHeight: '30px',
                                        display: 'flex',
                                        alignItems: 'center',
                                      },
                                    },
                                  }}
                                  value={
                                    field?.options?.find(
                                      (option) =>
                                        option.value === values[field.name]
                                    ) || null
                                  }
                                  onChange={(event, value) => {
                                    setFieldValue(field.name, value?.value);
                                  }}
                                />
                              )}
                              {field.component === 'MultiSelect' && (
                                <MultiSelectDropdown
                                  name={field.name}
                                  options={field.options}
                                  required={field.IsMandatory}
                                />
                              )}
                              {field.component === 'DatePicker' && (
                                <Date
                                  name={field.name}
                                  value={values[field.name]}
                                  onChange={(date) => {
                                    setFieldValue(field.name, date);
                                  }}
                                />
                              )}
                            </Grid>
                          )
                        );
                      })}
                      <Grid
                        padding="10px"
                        item
                        xs={12}
                        display="flex"
                        justifyContent="flex-end"
                        gap="10px"
                        flexWrap="wrap"
                      >
                        <StyledButton
                          borderRadius="6px"
                          gap="4px"
                          padding="6px 10px"
                          variant="contained"
                          color="primary"
                          type="submit"
                          style={{ display: 'inline-flex', gap: '5px' }}
                          startIcon={
                            <StyledImage
                              height="16px"
                              width="16px"
                              src={WhiteSearch}
                              alt="WhiteSearch"
                            />
                          }
                        >
                          {t('Search')}
                        </StyledButton>
                        <StyledButton
                          variant="outlined"
                          border="1px solid #0083c0"
                          backgroundColor="#ffffff"
                          colour="#0083c0"
                          borderRadius="6px"
                          sx={{ marginLeft: '10px' }}
                          style={{ display: 'inline-flex', gap: '5px' }}
                          startIcon={
                            <StyledImage
                              height="16px"
                              width="16px"
                              src={Eraser}
                              alt="Eraser"
                            />
                          }
                          onClick={() => {
                            dispatch(resetPendingFilters());
                            resetForm();
                          }}
                        >
                          {t('ClearAll')}
                        </StyledButton>
                      </Grid>
                    </Grid>
                  </Form>
                )}
              </Formik>
            </FlexContainer>
          </FlexContainer>
        </BorderBox>
      </StyledCollapse>

      <InvestigationPendingDataTable
        columns={selectedColumns}
        records={filteredRecords}
        totalRecords={TotalRecords}
        fieldLabels={{
          Data: fieldLabels,
          Status: labelStatus,
        }}
        isEdit={roleMenu?.IsEdit}
        isView={roleMenu?.IsView}
        refetch={refetch}
      />
      <SuccessMessage show={loading}>{message}</SuccessMessage>
    </FlexContainer>
  );
};

export default InvestigationPendingList;
