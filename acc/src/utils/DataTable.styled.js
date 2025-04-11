import styled from 'styled-components';
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Button,
} from '@mui/material';

export const StyledTableBodyCell = styled(TableCell)`
  font-family: Lato !important;
  font-size: 12px !important;
  font-weight: 400 !important;
  line-height: 14.5px !important;
  text-align: center !important;
  border: 1px solid #ccc !important; 
  border-bottom: 0 !important;
  max-width:  ${(props) => props.width || '350px'};
  padding: 3px !important;
  padding-top: 10px !important;

  white-space: wrap;
  color: ${({ status }) =>
    status
      ? status === 'Active'
        ? '#099815'
        : '#D00000'
      : '#000000'} !important;
`;

export const StyledTableHeaderCell = styled(TableCell)`
  color: ${(props) => props.color || '#ffffff'} !important;
  font-family: Lato !important;
  font-size: 12px !important;
  font-weight: bold !important;
  padding: 10px !important;
  line-height: 15.6px !important;
  text-align: center !important; 
  border: 1px solid #fff !important;
  white-space: wrap;
  background-color: ${(props) => props.backgroundColor || '#DEF5FF'} !important;
`;

export const StyledTableHead = styled(TableHead)`
  border-left: ${(props) => props.borderLeft || '4px solid #0083c0'};
  tr,
  th {
    background-color: ${(props) =>
      props.backgroundColor || '#0083c0'} !important;
  }
`;

export const StyledTableRow = styled(TableRow)`
  font-family: Lato !important;
  font-size: 12px !important;
  font-weight: 700 !important;
  line-height: 14.4px !important;
  text-align: left !important;
  color: #444444 !important;
  white-space: nowrap;
  border-top: 1px solid ${(props) => props.borderColor || '#99cde6'};

  &:hover {
    cursor: pointer;
    background-color: ${(props) => props.hoverBgColor || '#def5ff'} !important;
    border-left: ${(props) =>
      `4px solid ${props.borderLeft}` || '4px solid #0083c0'};
    .action-icons {
      visibility: visible;
    }
  }
`;

export const ActionCell = styled(TableCell)`
  position: relative; 
  padding: 13px !important;
  border-bottom: 0 !important;
  text-align: center !important; 
  .action-icons {
    display: flex;
    gap: 16px;
    justify-content: ${(props) => props.justifyContent || 'center'} !important;
    align-items: center;
    width: 100%;
  }
`;
export const FormLabel = styled(Typography)`
  font-weight: 400 !important;
  color: #0083c0;
`;

export const StyledTableBody = styled(TableBody)`
  height: calc(100% - 200px);
  overflow: auto;
  border: 1px solid #99cde6;
`;

export const CustomPaginationContainer = styled.div`
  display: flex !important;
  justify-content: ${(props) => props.justifyContent} !important;
  flex-wrap: wrap;
  align-items: center !important;
  padding: 10px !important;
  background-color: #ffffff !important;
  border-radius: 0px !important;
`;

export const CustomPaginationLabel = styled.span`
  font-family: Lato;
  font-size: 14px;
  font-weight: 400;
  color: #444444;
  padding: 0 8px;
  padding: 0 12px;
`;

export const Styledspan = styled.span`
  font-family: Lato !important;
  font-size: 12px !important;
  font-weight: 700 !important;
  line-height: 14.4px !important;
  text-align: right !important;
  color: #000000 !important;
`;

export const ActionButton = styled(Button)`
  color: #fff !important;
  border-radius: 6px !important;
  text-transform: none !important;
  box-shadow: 0px 4px 4px 0px #00000040 !important;

  &:hover {
    transform: scale(1.05) !important;
    transition: transform 0.3s ease !important;
  }
`;
export const CustomStyledTableHead = styled(TableHead)`
  border-left: ${(props) => props.borderLeft || '4px solid #0083c0'};

  th {
    background-color: ${(props) =>
      props.backgroundColor || '#0083c0'} !important;
  }

  tr {
    height: 30px; /* Reduce row height */
    padding: 0; /* Ensure no extra padding is added */
  }

  th,
  td {
    padding-top: 0px; /* Fine-tune vertical padding */
    padding-bottom: 0px;
  }
`;

export const StyledTableHeaderBoldCell = styled(TableCell)`
  color: ${(props) => props.color || '#ffffff'} !important;
  font-family: Lato !important;
  font-weight: ${(props) => props.fontWeight || '900'} !important;
  line-height: 15.6px !important;
  text-align:  center;
  white-space: wrap;
  border-bottom: 0 !important;
  background-color: ${(props) => props.backgroundColor || '#DEF5FF'} !important;
`;