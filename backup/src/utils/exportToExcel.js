import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const exportToExcel = (data, filename = 'data.xlsx') => {
  // Create a new workbook and a worksheet
  const ws = XLSX.utils.json_to_sheet(data); // Convert JSON data to a worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  // Generate a buffer and create a Blob
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const dataBlob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  // Trigger download
  saveAs(dataBlob, filename);
};

export default exportToExcel;
