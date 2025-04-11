import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DoneIcon from '../../../../assets/Icons/DoneIcon.png';
import LoadingGif from '../../../../assets/Gifs/LoadingGif.gif';
import DndIcon from '../../../../assets/Icons/DoNotDisturbIcon.png';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
} from '../../../../utils/StyledComponents';
import {
  StyledTableBody,
  StyledTableBodyCell,
  StyledTableHead,
  StyledTableHeaderCell,
  StyledTableRow,
} from '../../../../utils/DataTable.styled';
import { useTranslation } from 'react-i18next';
import { getlabel } from '../../../../utils/language';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  useGetIncidentTypeDetailsQuery,
  useReorderIncidentTypeMutation,
} from '../../../../redux/RTK/IncidentManagement/incidentSubMasterApi';
import { showToastAlert } from '../../../../utils/SweetAlert';
import { useGetCategoryDetailsQuery, useReorderCategoryAffectedMutation } from '../../../../redux/RTK/incidentRiskLevelApi';

const ITEM_TYPE = 'ROW';
var handleSubmit;
var reorderedList = [];

// Draggable Row Component
const DraggableRow = ({ item, index, moveRow, tableColumnList }) => {
  const [, drag] = useDrag({
    type: ITEM_TYPE, // Defining the item type here
    item: { index }, // Attach the index of the dragged row to the item
  });

  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    hover: (draggedItem, monitor) => {
      if (!monitor.isOver({ shallow: true })) return;
      if (draggedItem.index === index) return;
      const hoverBoundingRect = monitor.getClientOffset();
      const hoverMiddleY =
        (hoverBoundingRect.top + hoverBoundingRect.bottom) / 2;
      if (draggedItem.index < index && hoverBoundingRect.y < hoverMiddleY)
        return;
      if (draggedItem.index > index && hoverBoundingRect.y > hoverMiddleY)
        return;
      moveRow(draggedItem.index, index);
      draggedItem.index = index;
    },
  });

  return (
    <StyledTableRow
      borderColor="#0083c0"
      ref={(node) => drag(drop(node))}
      sx={{
        cursor: 'grab',
        transition: 'background-color 0.2s ease',
        '&:hover': { backgroundColor: '#f1f1f1' },
      }}
    >
      <StyledTableBodyCell>{index + 1}</StyledTableBodyCell>
      {tableColumnList?.find((x) => x.id === 'CategoryAffected') && (
        <StyledTableBodyCell>{item?.CategoryAffected}</StyledTableBodyCell>
      )}
    </StyledTableRow>
  );
};

const DraggableTable = ({
  tableColumnList,
  fieldLabels,
  labelsStatus,
  filteredFacility,
}) => {
  //* Hooks declaration
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  //* Selectors
  const { selectedMenu, userDetails, selectedFacility, selectedModuleId } =
    useSelector((state) => state.auth);

  //* State variables
  const [tableData, setTableData] = useState([]);
  const [data, setData] = useState(tableData);

  //* RTK Queries

  const [triggerReorderTable, { isLoading: reordering }] =
  useReorderCategoryAffectedMutation();

  const {
    data: getCategoryData=[],
    isFetching,
    refetch,
  } = useGetCategoryDetailsQuery(
    {
      payload: {
        pageIndex: 1,
        pageSize: 100,
        headerFacility: 2,
        loginUserId: 1,
        moduleId: 2,
        menuId: 22,
      },
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    const sortedData = [...tableData].sort(
      (a, b) => a.OrderSequence - b.OrderSequence
    );
    setData(sortedData);
  }, [tableData]);

  useEffect(() => {
    if (getCategoryData?.Records) {
      setTableData(getCategoryData?.Records);
    }
  }, [getCategoryData]);

  // Move row function
  const moveRow = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    const updatedData = [...data];
    const [movedItem] = updatedData.splice(fromIndex, 1);
    updatedData.splice(toIndex, 0, movedItem);
    reorderedList = [...updatedData];
    setData(updatedData);
  };

  

  handleSubmit = async () => {
    const rowsWithOrder = reorderedList.map((item, index) => ({
      categoryAffectedId: item.CategoryAffectedId,
      facilityId: item.FacilityId,
      orderSequence: index + 1,
      moduleId: 2,
      menuId: selectedMenu?.id,
      loginUserId: userDetails?.UserId,
    }));

    try {
      let response;
      response = await triggerReorderTable({
        payload: rowsWithOrder,
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
        navigate('/IncidentManagement/IncidentRisklevelCalculation');
      }
    } catch (e) {
      console.error('Failed to reorder Incident Type', e);
    }
  };

  return (
    <FlexContainer padding="0 20px" flex="1">
      {reordering || isFetching ? (
        <FlexContainer
          height="100%"
          width="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          style={{ top: '0', left: '0', marginTop: '50px' }}
        >
          <StyledImage src={LoadingGif} alt="LoadingGif" />{' '}
        </FlexContainer>
      ) : (
        <TableContainer
          component={Paper}
          style={{ border: '1px solid #0083c0' }}
        >
          <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
            <StyledTableHead backgroundColor="#0083c0" borderLeft="#0083c0">
              <TableRow>
                <StyledTableHeaderCell>{t('SNo')}</StyledTableHeaderCell>
                {tableColumnList
                  ?.filter((x) => x.isShow)
                  ?.map((column) => (
                    <StyledTableHeaderCell key={column.id}>
                      {getlabel(
                        column.translationId,
                        {
                          Data: fieldLabels,
                          Status: labelsStatus,
                        },
                        i18n.language
                      )}
                    </StyledTableHeaderCell>
                  ))}
              </TableRow>
            </StyledTableHead>
            {data.length > 0 ? (
              <TableBody>
                {data?.map((item, index) => (
                  <DraggableRow
                    key={item.id}
                    index={index}
                    item={item}
                    moveRow={moveRow}
                    tableColumnList={tableColumnList}
                  />
                ))}
              </TableBody>
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={7} style={{ textAlign: 'center' }}>
                    {t('NoDataAvailable')}
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>
      )}
    </FlexContainer>
  );
};

// App Component with DndProvider
const ReorderDataTable = ({
  tableColumnList,
  fieldLabels,
  labelsStatus,
  // filteredFacility,
}) => {
  //* Hooks declaration
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  return (
    <DndProvider backend={HTML5Backend}>
      <DraggableTable
        tableColumnList={tableColumnList}
        fieldLabels={fieldLabels}
        labelsStatus={labelsStatus}
        // filteredFacility={filteredFacility}
      />
      <FlexContainer
        display={'flex'}
        width="100%"
        justifyContent={'flex-end'}
        gap={'10px'}
        style={{ marginBlock: '1rem', padding: '0 20px' }}
      >
        <StyledButton
          borderRadius="6px"
          gap="4px"
          padding="6px 10px"
          variant="contained"
          backgroundColor="#0083c0"
          type="button"
          style={{ display: 'inline-flex', gap: '5px' }}
          onClick={handleSubmit}
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
          sx={{ marginLeft: '10px' }}
          style={{ display: 'inline-flex', gap: '5px' }}
          onClick={() => navigate('/IncidentManagement/IncidentRisklevelCalculation')}
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
      </FlexContainer>
    </DndProvider>
  );
};

export default ReorderDataTable;
