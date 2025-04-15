import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  IconButton,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '../../assets/Icons/CloseIcon.png';
import {
  CommonStyledButton,
  FlexContainer,
  StyledImage,
  StyledTypography,
} from '../../utils/StyledComponents';
import Label from '../../components/Label/Label';
import { TextField } from '../../components/TextField/TextField';
import DoneIcon from '../../assets/Icons/DoneIcon.png';
import DoNotDisturbIcon from '../../assets/Icons/DoNotDisturbIcon.png';
import { showSweetAlert } from '../../utils/SweetAlert';
import Admin from '../../assets/Icons/Admin.png';
import {
  useForgetPasswordMailTriggerMutation,
  useLazyGetResetPasswordUserDetailQuery,
} from '../../redux/RTK/resetPasswordApi';
import SuccessGif from '../../assets/Gifs/SuccessGif.gif';
import { showToastAlert } from '../../utils/SweetAlert';
import { useDispatch } from 'react-redux';
import { setResetPasswordUserDetail } from '../../redux/features/auth/resetPasswordSlice';
import { useRef } from 'react';

const validationSchema = Yup.object().shape({
  employeeId: Yup.string().required('Employee ID is required'),
});

const ForgotPasswordPopup = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const initialValues = { employeeId: '' };
  const [triggerForgetPasswordMailTrigger] =
    useForgetPasswordMailTriggerMutation();
  const [triggerResetPasswordUserDetails] =
    useLazyGetResetPasswordUserDetailQuery();
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (values, { resetForm }) => {
    setIsLoading(true);

    const encodedEmpId = btoa(values?.employeeId);

    let userDetailResponse = await triggerResetPasswordUserDetails({
      employeeId: encodedEmpId,
    });
    dispatch(setResetPasswordUserDetail(userDetailResponse?.data.Data));

    if (userDetailResponse?.data.Status === 'Success') {
      let response = await triggerForgetPasswordMailTrigger({
        employeeId: values?.employeeId,
      });
      if (response?.data.Status === 'Success') {
        setIsLoading(false);
        onClose();
        showToastAlert({
          type: 'custom_success',
          text: 'Mail Sent Successfully',
          gif: SuccessGif,
        });
        resetForm();
      }
    } else if (userDetailResponse?.data.Status === 'Failure') {
      setIsLoading(false);
      onClose();
      showSweetAlert({
        type: 'warning',
        title: 'Invalid User',
        timer: 2000,
        icon: Admin,
      });
      resetForm();
    }
  };
  const inputRef = useRef(null);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '8px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
        },
      }}
      TransitionProps={{
        onEntered: () => inputRef.current?.focus(),
      }}
    >
      <Box sx={{ width: 400 }}>
        <DialogTitle
          sx={{
            backgroundColor: '#205475',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            height: 40,
            alignItems: 'center',
            padding: '0 8px',
          }}
        >
          <StyledTypography
            fontSize="18px"
            fontWeight="300"
            lineHeight="18px"
            padding="0 12px"
            color="#fff"
          >
            Forgot Password
          </StyledTypography>

          <IconButton
            onClick={onClose}
            sx={{
              color: '#fff',
              '&:hover': {
                transform: 'scale(1.05)',
                transition: 'transform 0.3s ease',
                backgroundColor: 'rgba(15, 108, 189, 0.2)',
              },
            }}
          >
            <StyledImage src={CloseIcon} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ border: '4px solid #205475' }}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, handleChange }) => {
              return (
                <Form>
                  <Box
                    sx={{
                      marginBottom: 2,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <FlexContainer
                      padding={'20px'}
                      gap="20px"
                      alignItems="center"
                    >
                      <Label value="Employee ID" isRequired={true} />
                      {/* <Field
                        name="employeeId"
                        component={TextField}
                        slotProps={{ htmlInput: { maxLength: 100 } }}
                        error={touched.employeeId && Boolean(errors.employeeId)}
                        helperText={touched.employeeId && errors.employeeId}
                      /> */}
                      <TextField
                        inputRef={inputRef}
                        autoFocus
                        name="employeeId"
                        slotProps={{ htmlInput: { maxLength: 100 } }}
                        error={touched.employeeId && Boolean(errors.employeeId)}
                        helperText={touched.employeeId && errors.employeeId}
                        onChange={handleChange}
                      />
                    </FlexContainer>
                  </Box>

                  <FlexContainer
                    gap="16px"
                    justifyContent="center"
                    padding="0px 15px 15px 15px"
                    width="100%"
                  >
                    <CommonStyledButton
                      type="submit"
                      variant="contained"
                      text-color="#0083C0"
                      startIcon={
                        isLoading ? (
                          <CircularProgress
                            size={24}
                            sx={{ color: '#FFFFFF' }}
                          />
                        ) : (
                          <StyledImage
                            src={DoneIcon}
                            style={{ marginInlineEnd: 8 }}
                            sx={{
                              marginBottom: '1px',
                              color: '#FFFFFF',
                            }}
                          />
                        )
                      }
                      disabled={isLoading}
                    >
                      <StyledTypography marginTop="1px" color="#FFFFFF">
                        Submit
                      </StyledTypography>
                    </CommonStyledButton>
                    <CommonStyledButton
                      onClick={onClose}
                      type="button"
                      variant="outlined"
                      startIcon={
                        <StyledImage
                          src={DoNotDisturbIcon}
                          style={{ marginInlineEnd: 8 }}
                        />
                      }
                    >
                      <StyledTypography marginTop="1px">
                        Cancel
                      </StyledTypography>
                    </CommonStyledButton>
                  </FlexContainer>
                </Form>
              );
            }}
          </Formik>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default ForgotPasswordPopup;
