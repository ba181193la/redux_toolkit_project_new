// StyledDivider.js
import { Divider } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledDivider = styled(Divider)(
  ({ margin, width, borderBottomWidth, borderColor }) => ({
    margin: margin || '0 auto 5px',
    width: width || '100%',
    borderBottomWidth: borderBottomWidth || '2px',
    borderColor: borderColor || '#ddd',
  })
);

export default StyledDivider;
