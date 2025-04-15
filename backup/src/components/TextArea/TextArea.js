import { TextField as MUITextField } from '@mui/material';
import { styled } from 'styled-components';

const StyledTextArea = styled(MUITextField)`
  width: 100%;

  & .MuiInputBase-root {
    padding: 10px;
    font-size: 14px;
    line-height: 1.5; /* Ensure line-height is adjusted for proper vertical alignment */
    height: 135px; /* Ensure the height accommodates padding */
    box-sizing: border-box; /* Ensure padding is included in height */
    display: flex;
    align-items: flex-start; /* Align text at the start of the input */
  }

  & .MuiOutlinedInput-notchedOutline {
    border-radius: 8px;
  }
`;

const TextArea = ({ value, onChange, name,disabled }) => {
  return (
    <StyledTextArea
    disabled={disabled?true:false}
      name={name}
      value={value} 
      onChange={onChange} 
      multiline
      variant="outlined"
      autoComplete="off"
    />
  );
};

export default TextArea;