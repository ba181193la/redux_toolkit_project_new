// PasswordRequirements.js
import React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import styled from 'styled-components';
import LoadingGif from '../../assets/Gifs/LoadingGif.gif';
import { FlexContainer, StyledImage } from '../../utils/StyledComponents';

const PasswordRequirementsContainer = styled(Box)`
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fff;
  width: 100%;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
`;

const PasswordRequirements = ({
  passwordPolicyInitialValues,
  isPasswordPolicyFetching,
}) => {
  return (
    <PasswordRequirementsContainer>
      <Typography
        sx={{
          color: 'red',
          fontWeight: 'bold',
          marginBottom: '8px',
        }}
      >
        * Password Policy
      </Typography>
      {isPasswordPolicyFetching ? (
        <FlexContainer justifyContent="center">
          <StyledImage src={LoadingGif} alt="LoadingGif" />
        </FlexContainer>
      ) : (
        <List dense>
          <ListItem disablePadding>
            <ListItemText
              primary={` ✓ Length must be greater than or equal to ${passwordPolicyInitialValues?.minLength} characters.`}
            />
          </ListItem>
          <ListItem disablePadding>
            <ListItemText
              primary={` ✓ Password must contain ${passwordPolicyInitialValues?.minLowercase} lowercase letters.`}
            />
          </ListItem>
          <ListItem disablePadding>
            <ListItemText
              primary={` ✓ Password must contain  ${passwordPolicyInitialValues?.minUppercase} uppercase letters.`}
            />
          </ListItem>
          <ListItem disablePadding>
            <ListItemText
              primary={` ✓ Password must contain  ${passwordPolicyInitialValues?.minDigits} numbers.`}
            />
          </ListItem>
          <ListItem disablePadding>
            <ListItemText
              primary={` ✓ Do not reuse any of the last five passwords.`}
            />
          </ListItem>
        </List>
      )}
    </PasswordRequirementsContainer>
  );
};

export default PasswordRequirements;
