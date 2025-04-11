import React, { useState } from 'react';

const TableComponent1 = ({ onChange, value }) => {
  const [rows, setRows] = useState(value?.rows || 3);
  const [cols, setCols] = useState(value?.cols || 3);
  const [headers, setHeaders] = useState(
    value?.headers || Array.from({ length: cols }, (_, i) => `Header ${i + 1}`)
  );

  const handleHeaderChange = (index, newHeader) => {
    const newHeaders = [...headers];
    newHeaders[index] = newHeader;
    setHeaders(newHeaders);
    onChange({ rows, cols, headers: newHeaders });
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>
                <input
                  type="text"
                  value={header}
                  onChange={(e) => handleHeaderChange(index, e.target.value)}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: cols }).map((_, colIndex) => (
                <td key={colIndex}>
                  Cell {rowIndex + 1}-{colIndex + 1}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TableComponent = ({ data }) => {
  const { rows, cols, headers } = data;

  return (
    <table>
      <thead>
        <tr>
          {headers?.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <tr key={rowIndex}>
            {Array.from({ length: cols }).map((_, colIndex) => (
              <td key={colIndex}>
                Cell {rowIndex + 1}-{colIndex + 1}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableComponent;
