import { TextField as MUITextField } from '@mui/material';
import { styled } from 'styled-components';

// Styled component for number inputs
const StyledNumberField = styled(MUITextField)`
  width: 100%;

  & .MuiOutlinedInput-root {
    height: 32px; /* Match height of the TextField */
    padding: 0px 10px; /* Match padding of the TextField */

    & .MuiInputBase-input {
      height: 32px; /* Match height of the TextField */
      padding: 0px; /* Match padding of the TextField */
      font-size: 14px; /* Match font size of the TextField */
      line-height: 32px; /* Match line height of the TextField */
    }
  }

  & .MuiOutlinedInput-notchedOutline {
    border-radius: 4px; /* Match border radius of the TextField */
  }
`;

const NumberField = ({ field, form, label }) => {
  return (
    <StyledNumberField
      {...field}
      type="number" // Ensure only number input is accepted
      variant="outlined"
      autoComplete="off"
      inputProps={{ maxLength: 10 }}
    />
  );
};

export default NumberField;
