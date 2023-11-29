import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Container, TextField, Typography, Paper, IconButton, InputAdornment, Grid } from '@mui/material';
import { Visibility, VisibilityOff, Facebook, Google } from '@mui/icons-material'; // Import icons

import api from '../api/api';
import { useAuth as useAuthContext } from '../api/AuthContext';

const SignIn = () => {
  const { login } = useAuthContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (event) => {
    try {
      event.preventDefault();

      // Validate inputs
      if (!username || !password) {
        setMessage('Please enter both username and password.');
        return;
      }

      const u = {
        username: username,
        password: password,
      };

      console.log(u);

      // Call the login API from the backend
      const response = await api.post('/auth/login', u);

      // Handle API response
      if (response.data) {
        console.log(response.data);
        const { userData, access_token } = response.data;

        // Save user information and token to localStorage or sessionStorage
        login(access_token, userData);

        // Redirect to the home page
        navigate('/home');
      }
    } catch (error) {
      setMessage('Sign in failed. Try again!');
      console.error('Sign in failed:', error);
    }
  };
  

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom style={{ color: '#2196F3', fontWeight: 'bold' }}>
          Sign In
        </Typography>
        <form>
          <TextField
            label="Username"
            type="text"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'} // Toggle visibility based on showPassword state
            variant="outlined"
            margin="normal"
            fullWidth
            required
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button variant="contained" color="primary" fullWidth onClick={(e) => handleSignIn(e)} style={{ marginTop: '20px' }}>
            Sign In
          </Button>
          <Grid container spacing={1} style={{ marginTop: '10px' }}>
            <Grid item xs={6}>
            <Link to="https://passport-v2.vercel.app">
              <Button variant="outlined"  fullWidth sx={{  color: '#DB4437'}}>
                <Google/> Google
              </Button>
            </Link>
            </Grid>
            <Grid item xs={6}>
            <Link to="https://passport-v2.vercel.app">
              <Button variant="outlined" fullWidth  sx={{  color:'#3B5998' }}>
                <Facebook/> Facebook
              </Button>
            </Link>
            </Grid>
          </Grid>
        </form>
        <Typography variant="body2" color="error" mt={2}>
          {message}
        </Typography>
        <Typography variant="body2" mt={2}>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default SignIn;
