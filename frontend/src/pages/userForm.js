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
import { createUser, updateUser,getUserDetails } from '../redux/slice/userSlice';

const UserForm = () => {
  const navigate = useNavigate();
  const {id}=useParams()
  const dispatch = useDispatch()
  const { message,singleUser, loading, error } = useSelector((state) => state.user);
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
useEffect(()=>{
  dispatch(getUserDetails(id))
},[])
useEffect(()=>{
if(singleUser){
  console.log("...singlruserrrr",singleUser);
  setForm((prev=>({...prev,userName:singleUser?.userName,age:singleUser?.age})))
  
}
},[singleUser])
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      ///    await createUser(form).unwrap();
      if(!id){
        dispatch(createUser(form))
        setForm({ userName: '', age: '', password: '' });
        !loading ? setSuccessOpen(true) : setSuccessOpen(false);
      }else{
        dispatch(updateUser({id,form}))
        !loading ? setSuccessOpen(true) : setSuccessOpen(false);
        setTimeout(() => navigate('/users'), 1500);
    }
    } catch (err) {
      setErrorMsg(err?.data?.message || 'Something went wrong');
    }
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 400, mx: 'auto', mt: 5, p: 4 }}>
      <Typography variant="h5" mb={2}>
       {id?"Update User": "Create New User"}
      </Typography>

      {errorMsg && (
        <Typography color="error" variant="body2" mb={2}>
          {errorMsg}
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
              name="age"
              label="Age"
              type="number"
              value={form.age}
              onChange={handleChange}
              required
              fullWidth
            />
            {
             ! id&&
              <TextField
              name="password"
              label="Password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              fullWidth
            />
            }
           
            <Button variant="contained" color="primary" type="submit">
             {id?"Update User": " Create User"}
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
          message&&
          <Alert onClose={() => setSuccessOpen(false)} severity="success" sx={{ width: '100%' }}>
          { message}
        </Alert>
        }
      </Snackbar>
    </Paper>
  );
};

export default UserForm;
