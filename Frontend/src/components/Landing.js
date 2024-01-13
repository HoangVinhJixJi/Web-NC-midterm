import React, { useEffect, useState } from 'react';
import { Typography, Button, Container, Paper, Grid, CircularProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth as useAuthContext } from '../api/AuthContext';

const Landing = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isLoggedIn, isAdmin } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập
    if (isLoggedIn) {
      // Nếu đã đăng nhập, điều hướng về trang Home
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    }
    setIsLoading(false);
  }, [isLoggedIn, isAdmin, navigate]);

  return (
    <>
    {isLoading ?
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </div>
        :
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h2" gutterBottom>
          Welcome to Our Amazing App
        </Typography>
        <Typography variant="body1" paragraph>
          Discover the incredible features that await you. Sign in now!
        </Typography>
        <Button variant="contained" color="primary" size="large" component={Link} to="/signin">
          Sign In
        </Button>
        <Typography variant="body2" mt={2}>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </Typography>

        {/* Nội dung thêm */}
        <Grid container spacing={3} mt={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <Typography variant="h4">Explore Features</Typography>
              <Typography variant="body2" mt={2}>
                Discover a variety of features and functionalities designed to enhance your experience.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <Typography variant="h4">Manage Classes</Typography>
              <Typography variant="body2" mt={2}>
                Customize your preferences to personalize the classroom experience.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <Typography variant="h4">Customize Your Profile</Typography>
              <Typography variant="body2" mt={2}>
                Personalize your profile to make this platform truly yours.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>}
    </>
  );
};

export default Landing;