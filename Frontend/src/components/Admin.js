import {Container, ImageListItem, Paper, Typography} from '@mui/material';
import React, {useEffect} from 'react';
import { useAuth as useAuthContext } from '../api/AuthContext';
import {useNavigate} from 'react-router-dom';
import Forbidden from './Forbidden';

export default function Admin() {
  const { isLoggedIn, isAdmin } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    // Nếu isLoggedIn là false, chuyển hướng đến trang đăng nhập
    if (!isLoggedIn) {
      navigate('/admin');
    }
  }, [isLoggedIn, navigate]);

  return (
    <>
      {isAdmin ?
        <Container maxWidth="lg">
          <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h3" gutterBottom>
              Welcome to the Administrator Page
            </Typography>
            <ImageListItem sx={{ width: 400, height: 400 }}>
              <img src="/images/developer.png" alt="Admin image"/>
            </ImageListItem>
          </Paper>
        </Container>
        :
        <Forbidden />
      }
    </>
  );
}