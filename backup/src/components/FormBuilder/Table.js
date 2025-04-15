import React, { useState } from 'react';

const CustomEditComponent = ({ element, updateElement }) => {
  const [rows, setRows] = useState(element?.rows || []);
  const [columns, setColumns] = useState(element?.columns || []);

  // Handle adding a new row
  const addRow = () => {
    setRows([...rows, Array(columns.length).fill('')]);
  };

  // Handle removing a row
  const removeRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  // Handle adding a new column
  const addColumn = () => {
    setColumns([...columns, `Column ${columns.length + 1}`]);
    setRows(rows.map((row) => [...row, ''])); // Add empty cell for each row
  };

  // Handle removing a column
  const removeColumn = (index) => {
    setColumns(columns.filter((_, i) => i !== index));
    setRows(rows.map((row) => row.filter((_, i) => i !== index)));
  };

  // Handle cell value change
  const updateCellValue = (rowIndex, colIndex, value) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex][colIndex] = value;
    setRows(updatedRows);
  };

  // Save the table changes back to the form element
  const saveTable = () => {
    const updatedElement = {
      ...element,
      rows,
      columns,
    };
    updateElement(updatedElement);
  };

  return (
    <div>
      <h3>Edit Table</h3>

      <div>
        <h4>Columns</h4>
        <button onClick={addColumn}>Add Column</button>
        {columns.map((col, index) => (
          <div key={index}>
            <span>{col}</span>
            <button onClick={() => removeColumn(index)}>Remove Column</button>
          </div>
        ))}
      </div>

      <div>
        <h4>Rows</h4>
        <button onClick={addRow}>Add Row</button>
        {rows.map((row, rowIndex) => (
          <div key={rowIndex}>
            {row.map((cell, colIndex) => (
              <input
                key={colIndex}
                value={cell}
                onChange={(e) =>
                  updateCellValue(rowIndex, colIndex, e.target.value)
                }
              />
            ))}
            <button onClick={() => removeRow(rowIndex)}>Remove Row</button>
          </div>
        ))}
      </div>

      <button onClick={saveTable}>Save Table</button>
    </div>
  );
};

export default CustomEditComponent;
