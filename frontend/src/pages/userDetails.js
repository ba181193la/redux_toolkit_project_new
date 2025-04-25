import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
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
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { fetchUsers, deleteUser } from '../redux/slice/userSlice'


export default function BasicTable() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
    const [successOpen, setSuccessOpen] = useState(false);
  
  const { users, loading ,message} = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUsers())
  }, [])
  const deleteUserData = (id) => {
    dispatch(deleteUser(id))
    setTimeout(() => {
      dispatch(fetchUsers())
    }, 1000);
  }
  return (
    <Paper elevation={3} sx={{ maxWidth: '70%', mx: 'auto', mt: 5, p: 4 }}>
      <Typography variant="h5" mb={2}>
        User Details
      </Typography>
      {loading && <Typography variant="body2">Loading...</Typography>}
      {!loading && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>User Name</TableCell>
                <TableCell align="right">Age</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users?.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.userName}
                  </TableCell>
                  <TableCell align="right">{row.age}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      size="small"
                      endIcon={<EditIcon />}
                      onClick={() => navigate(`/${row._id}`)}
                    >
                      Edit
                    </Button>
                    <Button variant="outlined" size="small" endIcon={<DeleteIcon />}
                      onClick={() => deleteUserData(row._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

      )}

      {
        message &&
        <Alert onClose={() => setSuccessOpen(false)} severity="success" sx={{ width: '100%' }}>
          {message}
        </Alert>
      }
    </Paper>
  );
}
