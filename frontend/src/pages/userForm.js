// src/components/UserForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {useDispatch} from 'react-redux'
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import { createUser } from '../redux/slice/userSlice';

const UserForm = () => {
      const navigate = useNavigate();
      const dispatch=useDispatch()
//   const [createUser] = useCreateUserMutation();
  const [form, setForm] = useState({
    userName: '',
    age: '',
    password: '',
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [successOpen, setSuccessOpen] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
  ///    await createUser(form).unwrap();
      dispatch( createUser(form))
      setForm({ userName: '', age: '', password: '' });
      setSuccessOpen(true);
    //   setTimeout(() => navigate('/users'), 1500);
    } catch (err) {
      setErrorMsg(err?.data?.message || 'Something went wrong');
    }
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 400, mx: 'auto', mt: 5, p: 4 }}>
      <Typography variant="h5" mb={2}>
        Create New User
      </Typography>

      {errorMsg && (
        <Typography color="error" variant="body2" mb={2}>
          {errorMsg}
        </Typography>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <TextField
          name="userName"
          label="Username"
          value={form.userName}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          name="age"
          label="Age"
          type="number"
          value={form.age}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
          fullWidth
        />
        <Button variant="contained" color="primary" type="submit">
          Create User
        </Button>
      </Box>

      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccessOpen(false)} severity="success" sx={{ width: '100%' }}>
          User created successfully!
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default UserForm;
