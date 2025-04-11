import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
} from '../../../../utils/StyledComponents';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import LoadingGif from '../../../../assets/Gifs/LoadingGif.gif';
import PlusIcon from '../../../../assets/Icons/AddSubMaster.png';
import ReorderIcon from '../../../../assets/Icons/reorder.png';
import EditIcon from '../../../../assets/Icons/EditIcon.png';
import DeleteIcon from '../../../../assets/Icons/DeleteIcon.png';
import ExpandIcon from '../../../../assets/Icons/ExpandIcon.png';
import DeleteUserGif from '../../../../assets/Gifs/DeleteuserGif.gif';
import SuccessGif from '../../../../assets/Gifs/SuccessGif.gif';
import CustomScrollbars from '../../../../components/CustomScrollbars/CustomScrollbars';
import {
  ActionCell,
  StyledTableBodyCell,
  StyledTableHead,
  StyledTableHeaderCell,
  StyledTableRow,
} from '../../../../utils/DataTable.styled';
import { checkAccess } from '../../../../utils/Auth';
import { useEffect, useState } from 'react';
import { getlabel } from '../../../../utils/language';
import CustomPagination from '../../../../components/Pagination/CustomPagination';
import {
  setRCAQuestionsPageIndex,
  setRCAQuestionsPageSize,
} from '../../../../redux/features/IncidentManagement/incidentSubMasterSlice';

import {
  useDeleteRCAQuestionMutation,
  useGetPageLoadDataQuery,
  useGetRCAQuestionQuery,
} from '../../../../redux/RTK/IncidentManagement/incidentSubMasterApi';
import { Grid } from '@mui/system';
import { showSweetAlert } from '../../../../utils/SweetAlert';
import AddEditRCAQuestions from './AddEditRCAQuestions';
import { useNavigate } from 'react-router-dom';

const RCAQuestions = ({ labels, fieldAccess, expandAll }) => {
  //* Hooks declaration
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //* Selectors
  const {
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
    isSuperAdmin,
    selectedRoleFacility,
  } = useSelector((state) => state.auth);

  const { rcaQuestionsPageIndex: pageIndex, rcaQuestionsPageSize: pageSize } =
    useSelector((state) => state.incidentSubMaster.rcaQuestions);

  //* State variables
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [selectedQuestionsId, setSelectedQuestionsId] = useState(null);
  const [roleMenu, setRoleMenu] = useState();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [totalRecords, setTotalRecords] = useState(0);
  const [fieldLabels, setFieldLabels] = useState([]);
  const [facilityList, setFacilityList] = useState([]);
  const [questionsList, setQuestionsList] = useState([]);
  const [expand, setExpand] = useState(expandAll);

  //* Handlers for pagination
  const handleOnPageChange = (event, newPage) => {
    dispatch(setRCAQuestionsPageIndex(newPage));
  };

  const handleOnPageSizeChange = (event) => {
    dispatch(setRCAQuestionsPageSize(parseInt(event.target.value, 10)));
    dispatch(setRCAQuestionsPageIndex(0));
  };

  //* Sorting table columns
  const handleSortRequest = (column) => {
    const isAsc = orderBy === column && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(column);
  };

  const orderedQuestionsList = [...questionsList].sort((a, b) => {
    const aValue = a[orderBy]?.toString().toLowerCase();
    const bValue = b[orderBy]?.toString().toLowerCase();

    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });

  //* Filtering fields access  data

  const pageFields = fieldAccess?.Data?.Menus?.find(
    (section) => section?.MenuId === selectedMenu?.id
  )
    ?.Sections?.find(
      (sectionName) =>
        sectionName?.SectionName === 'Incident RCA Questions-Page'
    )
    ?.Regions?.find((region) => region?.RegionCode === 'ALL')?.Fields;

  //* Variables declaration
  const tableColumnList = [
    {
      id: 'Questions',
      translationId: 'IM_IS_RQ_QuestionText',
      isShow: pageFields?.find((x) => x.FieldId === 'IS_RQ_P_QuestionText')
        ?.IsShow,
    },
  ];

  //* RTK Queries

  const [triggerDeleteQuestion] = useDeleteRCAQuestionMutation();

  const { data: pageLoadData } = useGetPageLoadDataQuery({
    menuId: selectedMenu?.id,
    loginUserId: userDetails?.UserId,
    headerFacilityId: selectedFacility?.id,
  });

  const {
    data: QuestionsDetails,
    isFetching,
    refetch,
  } = useGetRCAQuestionQuery(
    {
      payload: {
        pageIndex: pageIndex + 1,
        pageSize: pageSize,
        headerFacility: selectedFacility?.id,
        loginUserId: userDetails?.UserId,
        moduleId: 2,
        // moduleId: selectedModuleId,
        menuId: selectedMenu?.id,
      },
    },
    {
      skip: !selectedFacility?.id || !selectedModuleId || !selectedMenu?.id,
      refetchOnMountOrArgChange: true,
    }
  );

  //* Use Effects to bind data
  useEffect(() => {
    if (pageLoadData?.Data) {
      setFacilityList(
        pageLoadData?.Data?.Facilitylist?.map((facility) => {
          const facilityItem = userDetails?.ApplicableFacilities?.find(
            (x) => x.FacilityId === facility.FacilityId
          );
          if (facilityItem) {
            return {
              text: facility.FacilityName,
              value: facility.FacilityId,
            };
          }
          return null;
        }).filter((item) => item !== null)
      );
    }
    if (QuestionsDetails?.Records) {
      setQuestionsList(QuestionsDetails?.Records);
      setTotalRecords(QuestionsDetails?.TotalRecords);
    }
  }, [pageLoadData, QuestionsDetails]);

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
    setExpand(expandAll);
  }, [expandAll]);

  //* Edit Question
  const editQuestion = (questionId) => {
    setSelectedQuestionsId(questionId);
    setShowQuestionsModal(true);
  };

  //* Delete Question
  const deleteQuestion = (questionId) => {
    const callback = async () => {
      try {
        await triggerDeleteQuestion({
          RCAQuestionstId: questionId,
          loginUserId: userDetails?.UserId,
          menuId: selectedMenu?.id,
        }).unwrap();

        showSweetAlert({
          type: 'success',
          title: 'Deleted!',
          text: 'Incident RCA Question has been deleted.',
          timer: 3000,
          gif: SuccessGif,
          height: 250,
          width: 250,
        });
        refetch();
      } catch (error) {
        console.log({ error });
      }
    };
    showSweetAlert({
      type: 'delete',
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      gif: DeleteUserGif,
      callback,
      cancelButtonText: 'No, Keep it',
      confirmButtonText: 'Yes, delete it!',
    });
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
              'IM_IS_RQ_IncidentRCAQuestions',
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
            height: '100%',
            padding: '0px',
            border: '1px solid #0083c0',
          }}
        >
          <FlexContainer
            flexDirection="column"
            width="100%"
            justifyContent="center"
            alignItems="center"
          >
            <FlexContainer
              style={{
                margin: '10px',
                justifyContent: 'flex-end',
                width: '100%',
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              {checkAccess(
                isSuperAdmin,
                roleMenu?.IsView,
                roleMenu?.IsAdd || false
              ) && (
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={3}
                  xl={3}
                  padding={'10px'}
                  flexWrap="wrap"
                >
                  <StyledButton
                    onClick={() => {
                      setShowQuestionsModal(true);
                    }}
                    fontSize="12px"
                    style={{ display: 'inline-flex', gap: '8px' }}
                    disabled={isFetching}
                  >
                    <StyledImage
                      src={PlusIcon}
                      height={'0.8rem'}
                      width={'0.8rem'}
                    />
                    {t('AddIncidentRCAQuestions')}
                  </StyledButton>
                </Grid>
              )}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                padding={'10px'}
                gap="10px"
                display="flex"
                flexWrap="wrap"
              >
                {checkAccess(
                  isSuperAdmin,
                  roleMenu?.IsView,
                  roleMenu?.IsAdd || false
                ) && (
                  <Tooltip title="Reorder" arrow>
                    <StyledImage
                      height="40px"
                      width="40px"
                      gap="10px"
                      cursor="pointer"
                      borderRadius="40px"
                      src={ReorderIcon}
                      alt="Reorder"
                      animate={true}
                      onClick={() =>
                        navigate('/IncidentManagement/ReorderRCAQuestion')
                      }
                    />
                  </Tooltip>
                )}
              </Grid>
            </FlexContainer>
            <FlexContainer flexDirection="column" width="100%" padding="10px">
              <TableContainer
                component={Paper}
                style={{ border: '1px solid #99cde6' }}
              >
                <CustomScrollbars
                  style={{ height: '350px' }}
                  rtl={i18n.language === 'ar'}
                >
                  {isFetching ? (
                    <FlexContainer
                      justifyContent="center"
                      alignItems="center"
                      height="100%"
                      width="100%"
                      position="absolute"
                      style={{ top: '0', left: '0' }}
                    >
                      <StyledImage src={LoadingGif} alt="LoadingGif" />
                    </FlexContainer>
                  ) : (
                    <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
                      <StyledTableHead>
                        <TableRow>
                          <StyledTableHeaderCell>
                            {t('SNo')}
                          </StyledTableHeaderCell>
                          {tableColumnList
                            ?.filter((x) => x.isShow)
                            ?.map((column) => (
                              <StyledTableHeaderCell key={column.id}>
                                <TableSortLabel
                                  style={{ 'text-wrap-mode': 'nowrap' }}
                                  active={orderBy === column.id}
                                  direction={
                                    orderBy === column.id ? order : 'asc'
                                  }
                                  onClick={() => handleSortRequest(column.id)}
                                >
                                  {getlabel(
                                    column.translationId,
                                    {
                                      Data: fieldLabels,
                                      Status: labels?.Status,
                                    },
                                    i18n.language
                                  )}
                                </TableSortLabel>
                              </StyledTableHeaderCell>
                            ))}
                          {checkAccess(
                            isSuperAdmin,
                            roleMenu?.IsView,
                            roleMenu?.IsEdit || roleMenu?.IsDelete || false
                          ) && (
                            <StyledTableHeaderCell>
                              {t('Actions')}
                            </StyledTableHeaderCell>
                          )}
                        </TableRow>
                      </StyledTableHead>
                      <TableBody>
                        {orderedQuestionsList?.length > 0 ? (
                          orderedQuestionsList?.map((row, rowIndex) => (
                            <StyledTableRow
                              key={rowIndex}
                              borderColor="#0083c0"
                            >
                              <StyledTableBodyCell>
                                {pageIndex * pageSize + rowIndex + 1}
                              </StyledTableBodyCell>
                              {tableColumnList
                                ?.filter((x) => x.isShow)
                                ?.map((column) => {
                                  return (
                                    <StyledTableBodyCell
                                      key={column.id}
                                      status={
                                        column.id === 'Status'
                                          ? row[column.id]
                                          : ''
                                      }
                                    >
                                      {column.id === 'Added_EditedDate' &&
                                      row[column.id]
                                        ? formatDate(row[column.id])
                                        : (row[column.id] ?? null)}
                                    </StyledTableBodyCell>
                                  );
                                })}
                              {checkAccess(
                                isSuperAdmin,
                                roleMenu?.IsView,
                                roleMenu?.IsEdit || roleMenu?.IsDelete || false
                              ) && (
                                <ActionCell>
                                  <FlexContainer className="action-icons">
                                    {checkAccess(
                                      isSuperAdmin,
                                      roleMenu?.IsView,
                                      roleMenu?.IsEdit || false
                                    ) && (
                                      <Tooltip title="Edit" arrow>
                                        <StyledImage
                                          cursor="pointer"
                                          height="12.5px"
                                          width="12.5px"
                                          src={EditIcon}
                                          alt="Edit"
                                          onClick={() =>
                                            editQuestion(row.RCAQuestionstId)
                                          }
                                        />
                                      </Tooltip>
                                    )}
                                    {checkAccess(
                                      isSuperAdmin,
                                      roleMenu?.IsView,
                                      roleMenu?.IsDelete || false
                                    ) && (
                                      <Tooltip title="Delete" arrow>
                                        <StyledImage
                                          cursor="pointer"
                                          height="12.5px"
                                          width="12.5px"
                                          src={DeleteIcon}
                                          alt="Delete"
                                          onClick={() =>
                                            deleteQuestion(row?.RCAQuestionstId)
                                          }
                                        />
                                      </Tooltip>
                                    )}
                                  </FlexContainer>
                                </ActionCell>
                              )}
                            </StyledTableRow>
                          ))
                        ) : (
                          <FlexContainer
                            position="absolute"
                            style={{ top: '50%', left: '50%' }}
                          >
                            {t('NoDataAvailable')}
                          </FlexContainer>
                        )}
                      </TableBody>
                    </Table>
                  )}
                </CustomScrollbars>
              </TableContainer>
              <CustomPagination
                totalRecords={totalRecords}
                page={pageIndex}
                pageSize={pageSize}
                handleOnPageChange={handleOnPageChange}
                handleOnPageSizeChange={handleOnPageSizeChange}
              />
            </FlexContainer>
          </FlexContainer>
        </AccordionDetails>
      </Accordion>
      {showQuestionsModal && (
        <AddEditRCAQuestions
          showQuestionsModal={showQuestionsModal}
          setShowQuestionsModal={setShowQuestionsModal}
          selectedQuestionsId={selectedQuestionsId}
          setSelectedQuestionsId={setSelectedQuestionsId}
          labels={labels}
          refetch={refetch}
          fieldAccess={fieldAccess}
        />
      )}
    </>
  );
};

export default RCAQuestions;
