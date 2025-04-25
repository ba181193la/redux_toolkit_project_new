
// src/components/UserForm.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
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

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { message,singleUser, loading, error } = useSelector((state) => state.user);
  //   const [createUser] = useCreateUserMutation();
  const [form, setForm] = useState({
    userName: '',
    age: '',
    password: '',
  });
  const [successOpen, setSuccessOpen] = useState(false); 

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      ///    await createUser(form).unwrap();
      dispatch(createUser(form))
        setForm({ userName: '', age: '', password: '' });
        !loading ? setSuccessOpen(true) : setSuccessOpen(false);
    } catch (err) {
      console.log("..err",err);
      
    }
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 400, mx: 'auto', mt: 5, p: 4 }}>
      <Typography variant="h5" mb={2}>
        Login 
      </Typography>

      {error && (
        <Typography color="error" variant="body2" mb={2}>
          {error}
        </Typography>
      )}
      {loading && <Typography variant="body2">Loading...</Typography>}

      {
        !loading && (

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
              name="password"
              label="Password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              fullWidth
            />
           
            <Button variant="contained" color="primary" type="submit">
                Login
            </Button>
          </Box>
        )}
      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {
          error&&
          <Alert onClose={() => setSuccessOpen(false)} severity="error" sx={{ width: '100%' }}>
          { error}
        </Alert>
        }
        {

        }
      </Snackbar>
    </Paper>
  );
};

export default Login;
