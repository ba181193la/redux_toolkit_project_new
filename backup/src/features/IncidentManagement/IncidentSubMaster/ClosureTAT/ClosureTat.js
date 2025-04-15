import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Grid,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from '@mui/material';
import EditIcon from '../../../../assets/Icons/EditIconWhite.png';
import ExpandIcon from '../../../../assets/Icons/ExpandIcon.png';
import LoadingGif from '../../../../assets/Gifs/LoadingGif.gif';
import DoneIcon from '../../../../assets/Icons/DoneIcon.png';
import DndIcon from '../../../../assets/Icons/DoNotDisturbIcon.png';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTextField,
} from '../../../../utils/StyledComponents';
import { useTranslation } from 'react-i18next';
import { getlabel } from '../../../../utils/language';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { checkAccess } from '../../../../utils/Auth';
import Label from '../../../../components/Label/Label';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import {
  ActionCell,
  StyledTableBodyCell,
  StyledTableHead,
  StyledTableHeaderCell,
  StyledTableRow,
} from '../../../../utils/DataTable.styled';
import {
  useGetPageLoadDataQuery,
  useUpdateClosureTATMutation,
} from '../../../../redux/RTK/IncidentManagement/incidentSubMasterApi';
import MultiSelectDropdown from '../../../../components/Dropdown/MultiSelectDropdown';
import SearchDropdown from '../../../../components/SearchDropdown/SearchDropdown';
import { showToastAlert } from '../../../../utils/SweetAlert';

const ClosureTat = ({ labels, fieldAccess, expandAll }) => {
  //* Hooks Declaration
  const { t, i18n } = useTranslation();

  //* Selectors
  const {
    selectedRoleFacility,
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
    isSuperAdmin,
  } = useSelector((state) => state.auth);

  //State Variables
  const [roleMenu, setRoleMenu] = useState();
  const [fieldLabels, setFieldLabels] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [tatData, setTatData] = useState([]);
  const [expand, setExpand] = useState(expandAll);
  const [initialValues, setInitialValues] = useState({
    closureTATDays: '',
    workingDays: '',
  });
  const [workingDays, setWorkingDays] = useState([
    {
      id: 1,
      day: 'Monday',
    },
    {
      id: 2,
      day: 'Tuesday',
    },
    {
      id: 3,
      day: 'Wednesday',
    },
    {
      id: 4,
      day: 'Thursday',
    },
    {
      id: 5,
      day: 'Friday',
    },
    {
      id: 6,
      day: 'Saturday',
    },
    {
      id: 7,
      day: 'Sunday',
    },
  ]);

  const tatColculation = [
    { text: 'Calender Days', value: 1 },
    { text: 'Working Days', value: 2 },
  ];

  //* RTK Queries

  const {
    data: pageLoadData,
    isFetching,
    refetch,
  } = useGetPageLoadDataQuery({
    menuId: selectedMenu?.id,
    loginUserId: userDetails?.UserId,
    headerFacilityId: selectedFacility?.id,
  });

  const [triggerSubmit, { isLoading: submitting }] =
    useUpdateClosureTATMutation();

  //* Filtering fields access data
  const pageFields = fieldAccess?.Data?.Menus?.find(
    (section) => section?.MenuId === selectedMenu?.id
  )
    ?.Sections?.find(
      (sectionName) => sectionName?.SectionName === 'Incident Closure TAT-Page'
    )
    ?.Regions?.find((region) => region?.RegionCode === 'ALL')?.Fields;

  useEffect(() => {
    if (labels?.Data) {
      const regionList = labels?.Data?.find(
        (x) => x.MenuId === selectedMenu?.id
      )?.Regions;
      const labelsList = regionList?.find(
        (x) => x.RegionCode === 'ALL'
      )?.Labels;
      setFieldLabels(labelsList);
    }
  }, [labels]);

  useEffect(() => {
    const roleMenu = selectedRoleFacility?.Menu.find(
      (item) => item.MenuId === selectedMenu?.id
    );
    setRoleMenu(roleMenu);
  }, [selectedRoleFacility, selectedMenu]);

  useEffect(() => {
    if (pageLoadData?.Data) {
      const transformedData = pageLoadData?.Data?.IncidentClosureTAT?.map(
        (priority) => ({
          incidentPriority: priority.SLAPriority,
          incidentFlow: priority?.IncidentClosureTATDetails?.map((detail) => ({
            id: detail?.IncidentClosureTATId,
            menuId: detail?.MenuId,
            name: detail?.MenuName,
            days: detail?.ClosureTATDays || 0,
            SLAPriority: priority.SLAPriority,
          })),
        })
      );

      const firstPriority = pageLoadData?.Data?.IncidentClosureTAT[0];
      const firstDetail = firstPriority?.IncidentClosureTATDetails[0];
      setInitialValues({
        closureTATDays: parseInt(firstDetail?.TATCalculationType),
        workingDays: firstDetail?.WorkingDaysList
          ? firstDetail?.WorkingDaysList?.split(',')
          : '',
      });

      setTatData(transformedData);
    }
  }, [pageLoadData]);

  useEffect(() => {
    setExpand(expandAll);
  }, [expandAll]);

  //* Submit report customization
  const submitClosureTAT = async (values) => {
    let response;
    try {
      const flowArray = tatData.flatMap((x) => x.incidentFlow);

      const combinedData = flowArray.map((data) => ({
        incidentClosureTATId: parseInt(data?.id),
        facilityId: selectedFacility?.id,
        slaPriority: data?.SLAPriority,
        menuId: data?.menuId,
        closureTATDays: parseInt(data?.days),
        tatCalculationType: values?.closureTATDays,
        workingDaysList:
          values?.closureTATDays === 2
            ? values?.workingDays
              ? values?.workingDays?.join(',')
              : ''
            : '',
        loginUserId: userDetails?.UserId,
        moduleId: 2,
        // moduleId: selectedModuleId,
        pageMenuId: selectedMenu?.id,
      }));
      response = await triggerSubmit({
        payload: combinedData,
      });
      if (
        response &&
        response?.data?.Message === 'Record Updated Successfully'
      ) {
        showToastAlert({
          type: 'custom_success',
          text: response?.data?.Message,
          gif: 'SuccessGif',
        });
      }
      refetch();
      setIsEdit(false);
    } catch (error) {
      console.error('Failed to update Closure TAT', error);
    }
  };

  //* Validation Schema
  const closureTATValidation = Yup.object().shape({
    closureTATDays: Yup.string().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'IS_ICT_P_TATCalculation')
          ?.IsMandatory === true,
      then: (schema) =>
        schema.required(
          `${getlabel(
            'IM_IS_ICT_TATCalculation',
            { Data: fieldLabels, Status: labels?.Status },
            i18n.language
          )} ${t('IsRequired')}`
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
    workingDays: Yup.array().when(['closureTATDays'], {
      is: (closureTATDays) =>
        pageFields?.find((x) => x.FieldId === 'IS_ICT_P_WorkingDays')
          ?.IsMandatory === true && closureTATDays === '2',
      then: (schema) =>
        schema
          .min(
            1,
            `${getlabel(
              'IM_IS_ICT_WorkingDays',
              { Data: fieldLabels, Status: labels?.Status },
              i18n.language
            )} ${t('IsRequired')}`
          )
          .test(
            'is-zero',
            `${getlabel(
              'IM_IS_ICT_WorkingDays',
              { Data: fieldLabels, Status: labels?.Status },
              i18n.language
            )} ${t('IsRequired')}`,
            (value) => value && value.length > 0
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  //* Variables declaration
  const tableColumnList = [
    {
      id: 'SLAPriority',
      translationId: 'IM_IS_ICT_SLAPriority',
      isShow: pageFields?.find((x) => x.FieldId === 'IS_ICT_P_SLAPriority')
        ?.IsShow,
    },
    {
      id: 'ScreenName',
      translationId: 'IM_IS_ICT_ScreenName',
      isShow: pageFields?.find((x) => x.FieldId === 'IS_ICT_P_ScreenName')
        ?.IsShow,
    },
    {
      id: 'ClosureTATDays',
      translationId: 'IM_IS_ICT_ClosureTATDays',
      isShow: pageFields?.find((x) => x.FieldId === 'IS_ICT_P_ClosureTATDays')
        ?.IsShow,
    },
  ];

  // Handler to update the days value for a specific flowItem
  const handleChange = (e, incidentPriorityIndex, flowIndex) => {
    const updatedTatData = [...tatData];
    updatedTatData[incidentPriorityIndex].incidentFlow[flowIndex].days =
      e.target.value;
    setTatData(updatedTatData);
  };

  return (
    <>
      <Accordion
        sx={{ border: '5px', borderColor: '#0083c0' }}
        expanded={expand}
      >
        <AccordionSummary
          style={{ padding: '0 10px' }}
          onClick={() => {
            setExpand((prev) => !prev);
          }}
          expandIcon={
            <StyledImage
              src={ExpandIcon}
              alt="Expand Icon"
              height={'8px'}
              width={'15px'}
            />
          }
          sx={{
            backgroundColor: '#0083c0',
            borderRadius: '8px 8px 0px 0px',
            width: '100%',
            border: '1px solid #0083c0',
          }}
        >
          <Typography
            fontWeight="700"
            lineHeight="20px"
            textAlign="center"
            color="#FFFFFF"
            sx={{
              fontSize: {
                xs: '0.875rem',
                sm: '0.875rem',
                md: '1rem',
                lg: '1rem',
              },
            }}
          >
            {getlabel(
              'IM_IS_ICT_IncidentClosureTAT',
              {
                Data: fieldLabels,
                Status: labels?.Status,
              },
              i18n.language
            )}
          </Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            width: '100%',
            padding: '0px',
            border: '1px solid #0083c0',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {submitting || isFetching ? (
            <FlexContainer
              justifyContent="center"
              alignItems="center"
              height="50vh"
              width="100%"
              position="relative"
              style={{ top: '0', left: '0' }}
            >
              <StyledImage src={LoadingGif} alt="LoadingGif" />
            </FlexContainer>
          ) : (
            <FlexContainer width="100%" flexWrap="wrap">
              <FlexContainer width="100%">
                <Formik
                  enableReinitialize={true}
                  initialValues={initialValues}
                  validateOnBlur={false}
                  validationSchema={closureTATValidation}
                  onSubmit={(values) => {
                    submitClosureTAT(values);
                  }}
                >
                  {({ values, errors, setFieldValue, touched }) => (
                    <Form style={{ width: '100%' }}>
                      <Grid
                        container
                        width="100%"
                        item
                        xs={12}
                        padding={'20px'}
                        justifyContent={'center'}
                        spacing={2}
                      >
                        {pageFields?.find(
                          (x) => x.FieldId === 'IS_ICT_P_TATCalculation'
                        )?.IsShow && (
                          <Grid item xs={12} sm={12} md={5} lg={3}>
                            <Label
                              bold={true}
                              value={getlabel(
                                'IM_IS_ICT_TATCalculation',
                                {
                                  Data: fieldLabels,
                                  Status: labels?.Status,
                                },
                                i18n.language
                              )}
                              isRequired={
                                pageFields?.find(
                                  (x) => x.FieldId === 'IS_ICT_P_TATCalculation'
                                )?.IsMandatory
                              }
                            />
                            <SearchDropdown
                              disableClearable={true}
                              name="closureTATDays"
                              options={[
                                { text: 'Select', value: '' },
                                ...(tatColculation || []),
                              ]}
                              getOptionLabel={(option) => option.text || ''}
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
                                tatColculation?.find(
                                  (option) =>
                                    option.value === values['closureTATDays']
                                ) || null
                              }
                              onChange={(event, value) => {
                                setFieldValue(
                                  'closureTATDays',
                                  value?.value || ''
                                );
                              }}
                              disabled={!isEdit}
                            />

                            <ErrorMessage
                              name="closureTATDays"
                              component="div"
                              style={{
                                color: 'red',
                                fontSize: '12px',
                                marginTop: '4px',
                              }}
                            />
                          </Grid>
                        )}

                        {pageFields?.find(
                          (x) => x.FieldId === 'IS_ICT_P_WorkingDays'
                        )?.IsShow &&
                          values?.closureTATDays === 2 && (
                            <Grid item xs={12} sm={12} md={5} lg={3}>
                              <Label
                                bold={true}
                                value={getlabel(
                                  'IM_IS_ICT_WorkingDays',
                                  {
                                    Data: fieldLabels,
                                    Status: labels?.Status,
                                  },
                                  i18n.language
                                )}
                                isRequired={
                                  pageFields?.find(
                                    (x) => x.FieldId === 'IS_ICT_P_WorkingDays'
                                  )?.IsMandatory
                                }
                              />
                              <MultiSelectDropdown
                                name="workingDays"
                                options={
                                  workingDays
                                    ? workingDays?.map((day) => ({
                                        value: day?.id,
                                        text: day?.day,
                                      }))
                                    : []
                                }
                                disabled={!isEdit}
                              />
                              <ErrorMessage
                                name="workingDays"
                                component="div"
                                style={{
                                  color: 'red',
                                  fontSize: '12px',
                                  marginTop: '4px',
                                }}
                              />
                            </Grid>
                          )}
                      </Grid>
                      <FlexContainer width="100%">
                        <Grid
                          container
                          width="100%"
                          item
                          xs={12}
                          padding={'20px'}
                          justifyContent={'center'}
                          spacing={2}
                        >
                          <Grid item xs={12} sm={12} md={12} lg={10}>
                            <TableContainer
                              component={Paper}
                              style={{ border: '1px solid #99cde6' }}
                            >
                              {false ? (
                                <FlexContainer
                                  justifyContent="center"
                                  alignItems="center"
                                  height="100%"
                                  width="100%"
                                  position="absolute"
                                  style={{ top: '0', left: '0' }}
                                >
                                  <StyledImage
                                    src={LoadingGif}
                                    alt="LoadingGif"
                                  />
                                </FlexContainer>
                              ) : (
                                <Table
                                  stickyHeader
                                  style={{ borderCollapse: 'collapse' }}
                                >
                                  <StyledTableHead>
                                    <TableRow>
                                      {tableColumnList?.map((column) => (
                                        <StyledTableHeaderCell key={column.id}>
                                          {getlabel(
                                            column.translationId,
                                            {
                                              Data: fieldLabels,
                                              Status: labels?.Status,
                                            },
                                            i18n.language
                                          )}
                                        </StyledTableHeaderCell>
                                      ))}
                                    </TableRow>
                                  </StyledTableHead>
                                  <TableBody>
                                    {tatData.map((item, index) =>
                                      item.incidentFlow.map(
                                        (flowItem, rowIndex) => (
                                          <StyledTableRow
                                            key={`${index}-${rowIndex}`}
                                            borderColor="#0083c0"
                                            sx={{
                                              '&:hover': {
                                                backgroundColor:
                                                  'inherit !important',
                                              },
                                            }}
                                          >
                                            {/* First column - Incident Priority (Level 1, Level 2, etc.) */}
                                            {rowIndex === 0 && (
                                              <StyledTableBodyCell
                                                rowSpan={
                                                  item.incidentFlow.length
                                                }
                                                style={{
                                                  padding: '10px',
                                                  borderRight:
                                                    '1px solid #0083c0',
                                                }}
                                              >
                                                {item.incidentPriority}
                                              </StyledTableBodyCell>
                                            )}

                                            {/* Incident Flow name */}
                                            <StyledTableBodyCell
                                              style={{ padding: '10px' }}
                                            >
                                              {flowItem.name.trim()}
                                            </StyledTableBodyCell>

                                            {/* Editable Days field */}
                                            <StyledTableBodyCell
                                              style={{ padding: '10px' }}
                                            >
                                              <StyledTextField
                                                value={flowItem.days}
                                                style={{
                                                  padding:
                                                    '5px 10px !important',
                                                  fontSize: '13px',
                                                }}
                                                disabled={!isEdit}
                                                onChange={(e) =>
                                                  handleChange(
                                                    e,
                                                    index,
                                                    rowIndex
                                                  )
                                                }
                                                size="small"
                                                variant="outlined"
                                                fullWidth
                                              />
                                            </StyledTableBodyCell>
                                          </StyledTableRow>
                                        )
                                      )
                                    )}
                                  </TableBody>
                                </Table>
                              )}
                            </TableContainer>
                          </Grid>

                          <Grid item xs={12} sm={12} md={12} lg={10}>
                            <FlexContainer
                              gap="15px"
                              justifyContent="flex-end"
                              margin="10px 0"
                            >
                              <Grid item xs={12} sm={12} md={2} lg={2}>
                                <Box
                                  display="flex"
                                  justifyContent="center"
                                  alignItems="center"
                                  height="100%"
                                  marginTop="8px"
                                  sx={{
                                    float: 'right',
                                  }}
                                >
                                  {!isEdit &&
                                    checkAccess(
                                      isSuperAdmin,
                                      roleMenu?.IsView,
                                      roleMenu?.IsEdit || false
                                    ) && (
                                      <StyledButton
                                        borderRadius="6px"
                                        padding="6px 10px"
                                        variant="contained"
                                        color="primary"
                                        type="button"
                                        sx={{ marginLeft: '10px' }}
                                        style={{
                                          display: 'inline-flex',
                                          gap: '5px',
                                        }}
                                        onClick={() => {
                                          setIsEdit(true);
                                        }}
                                        startIcon={
                                          <StyledImage
                                            height="12px"
                                            width="12px"
                                            src={EditIcon}
                                            alt="WhiteSearch"
                                          />
                                        }
                                      >
                                        {t('Edit')}
                                      </StyledButton>
                                    )}
                                </Box>
                              </Grid>
                              {isEdit && (
                                <>
                                  <StyledButton
                                    borderRadius="6px"
                                    padding="6px 10px"
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    disabled={submitting || isFetching}
                                    sx={{ marginLeft: '10px' }}
                                    style={{
                                      display: 'inline-flex',
                                      gap: '5px',
                                    }}
                                    startIcon={
                                      <StyledImage
                                        height="16px"
                                        width="16px"
                                        src={DoneIcon}
                                        alt="WhiteSearch"
                                      />
                                    }
                                  >
                                    {t('Submit')}
                                  </StyledButton>
                                  <StyledButton
                                    variant="outlined"
                                    border="1px solid #0083c0"
                                    backgroundColor="#ffffff"
                                    type="button"
                                    colour="#0083c0"
                                    borderRadius="6px"
                                    disabled={submitting || isFetching}
                                    sx={{ marginLeft: '10px' }}
                                    style={{
                                      display: 'inline-flex',
                                      gap: '5px',
                                    }}
                                    onClick={() => {
                                      setIsEdit(false);
                                    }}
                                    startIcon={
                                      <StyledImage
                                        height="16px"
                                        width="16px"
                                        src={DndIcon}
                                        alt="WhiteSearch"
                                      />
                                    }
                                  >
                                    {t('Cancel')}
                                  </StyledButton>
                                </>
                              )}
                            </FlexContainer>
                          </Grid>
                        </Grid>
                      </FlexContainer>
                    </Form>
                  )}
                </Formik>
              </FlexContainer>
            </FlexContainer>
          )}
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default ClosureTat;
