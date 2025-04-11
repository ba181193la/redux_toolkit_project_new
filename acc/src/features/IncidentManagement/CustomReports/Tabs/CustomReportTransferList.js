import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const CustomReportTransferList = ({
  screenwiseFieldList = [],
  selectedReportFieldList = [],
  onSelectedFieldsChange,
}) => {
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);
  const [selectedLeftItems, setSelectedLeftItems] = useState([]);
  const [selectedRightItems, setSelectedRightItems] = useState([]);

  useEffect(() => {
    const filteredLeftFields = screenwiseFieldList.filter(
      (field) =>
        !selectedReportFieldList.some(
          (selectedField) => selectedField.FieldLabelId === field.FieldLabelId
        )
    );

    setLeft(filteredLeftFields);
    setRight(selectedReportFieldList);
  }, [screenwiseFieldList, selectedReportFieldList]);

  const handleLeftItemClick = (item) => {
    setSelectedLeftItems((prev) =>
      prev.some((selected) => selected.FieldLabelId === item.FieldLabelId)
        ? prev.filter((selected) => selected.FieldLabelId !== item.FieldLabelId)
        : [...prev, item]
    );
    setSelectedRightItems([]);
  };

  const handleRightItemClick = (item) => {
    setSelectedRightItems((prev) =>
      prev.some((selected) => selected.FieldLabelId === item.FieldLabelId)
        ? prev.filter((selected) => selected.FieldLabelId !== item.FieldLabelId)
        : [...prev, item]
    );
    setSelectedLeftItems([]);
  };

  const handleMoveRight = () => {
    const newRight = [...right, ...selectedLeftItems];
    const newLeft = left.filter(
      (leftItem) =>
        !selectedLeftItems.some(
          (selectedItem) => selectedItem.FieldLabelId === leftItem.FieldLabelId
        )
    );

    setRight(newRight);
    setLeft(newLeft);
    setSelectedLeftItems([]);
    onSelectedFieldsChange(newRight);
  };

  const handleMoveLeft = () => {
    const newLeft = [...left, ...selectedRightItems];
    const newRight = right.filter(
      (rightItem) =>
        !selectedRightItems.some(
          (selectedItem) => selectedItem.FieldLabelId === rightItem.FieldLabelId
        )
    );

    setLeft(newLeft);
    setRight(newRight);
    setSelectedRightItems([]);
    onSelectedFieldsChange(newRight);
  };

  const handleAllRight = () => {
    setRight([...right, ...left]);
    setLeft([]);
    setSelectedLeftItems([]);
    onSelectedFieldsChange([...right, ...left]);
  };

  const handleAllLeft = () => {
    setLeft([...left, ...right]);
    setRight([]);
    setSelectedRightItems([]);
    onSelectedFieldsChange([]);
  };

  const customList = (title, items, onItemClick, selectedItems) => (
    <Grid container direction="column" alignItems="center" mt={0}>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
        {title}
      </Typography>
      <Paper
        sx={{
          width: 300,
          height: 300,
          overflow: 'auto',
          border: '1px solid #ccc',
          borderRadius: 2,
          p: 1,
        }}
      >
        <List dense component="div" role="list">
          {items.map((value) => {
            const labelId = `transfer-list-item-${value.FieldLabelId}-label`;
            const isSelected = selectedItems.some(
              (item) => item.FieldLabelId === value.FieldLabelId
            );

            return (
              <ListItemButton
              key={value.FieldLabelId}
              role="listitem"
              onClick={() => onItemClick(value)}
              selected={isSelected}
              sx={{
                backgroundColor: isSelected ? '#d6d6d6' : 'transparent',
                '&.Mui-selected': {
                  backgroundColor: '#bfbfbf', 
                  '&:hover': { backgroundColor: '#a6a6a6' }
                }
              }}
            >
              <ListItemText id={labelId} primary={value.FieldEnglishLabel} />
            </ListItemButton>
            );
          })}
        </List>
      </Paper>
    </Grid>
  );

  return (
    <Grid
      container
      spacing={2}
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        mt: 0,
      }}
    >
      <Grid >
        {customList('Applicable Fields', left, handleLeftItemClick, selectedLeftItems)}
      </Grid>
      <Grid item>
<Grid
  container
  direction="column"
  sx={{ alignItems: 'center', gap: 2 }} 
>
  <Button
    sx={{
      backgroundColor: '#1976d2',
      color: 'white',
      '&:hover': { backgroundColor: '#1565c0' },
      minWidth: '40px',
    }}
    variant="contained"
    size="small"
    onClick={handleMoveRight}
    disabled={selectedLeftItems.length === 0}
    aria-label="move selected right"
  >
    &gt;
  </Button>
  <Button
    sx={{
      backgroundColor: '#1976d2',
      color: 'white',
      '&:hover': { backgroundColor: '#1565c0' },
      minWidth: '40px',
    }}
    variant="contained"
    size="small"
    onClick={handleAllRight}
    disabled={left.length === 0}
    aria-label="move all right"
  >
    ≫
  </Button>
  <Button
    sx={{
      backgroundColor: '#1976d2',
      color: 'white',
      '&:hover': { backgroundColor: '#1565c0' },
      minWidth: '40px',
    }}
    variant="contained"
    size="small"
    onClick={handleMoveLeft}
    disabled={selectedRightItems.length === 0}
    aria-label="move selected left"
  >
    &lt;
  </Button>
  <Button
    sx={{
      backgroundColor: '#1976d2',
      color: 'white',
      '&:hover': { backgroundColor: '#1565c0' },
      minWidth: '40px',
    }}
    variant="contained"
    size="small"
    onClick={handleAllLeft}
    disabled={right.length === 0}
    aria-label="move all left"
  >
    ≪
  </Button>
</Grid>
</Grid>
      <Grid ml={2}>
        {customList('Selected Fields', right, handleRightItemClick, selectedRightItems)}
      </Grid>
    </Grid>
  );
};

export default CustomReportTransferList;
