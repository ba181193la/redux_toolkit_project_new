import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/features/auth/authSlice';

//ToDo: Remove logout logic and add some fancy work in progress images
const NotFoundPage = () => {

  return <p>Page Not Found</p>;
};

export default NotFoundPage;
