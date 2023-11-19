import React, { useEffect } from 'react';
import { Typography, Button, Container, Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth as useAuthContext } from '../api/AuthContext';

const Landing = () => {
  const { isLoggedIn } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập
    if (isLoggedIn) {
      // Nếu đã đăng nhập, điều hướng về trang Home
      navigate('/home');
    }
  }, [isLoggedIn, navigate]);

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Welcome to Our App
        </Typography>
        <Typography variant="body1" paragraph>
          This is the landing page of our application. Please sign in to access the full features.
        </Typography>
        <Button variant="contained" color="primary" component={Link} to="/signin">
          Sign In
        </Button>
        <Typography variant="body2" mt={2}>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Landing;
