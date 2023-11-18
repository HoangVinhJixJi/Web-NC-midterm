import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Container, Button, Paper } from '@mui/material';

const Landing = () => {
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
