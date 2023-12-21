import {Button, Container, Grid, IconButton, InputAdornment, Paper, TextField, Typography} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useAuth as useAuthContext} from "../api/AuthContext";
import api from "../api/api";

export default function AdminSignIn() {
  const { login, isLoggedIn } = useAuthContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập
    if (isLoggedIn) {
      // Nếu đã đăng nhập, điều hướng về trang Admin
      navigate('/admin');
    }
  }, [isLoggedIn, navigate]);

  const handleSignIn = async (event) => {
    navigate('/admin');
    // try {
    //   event.preventDefault();
    //
    //   // Validate inputs
    //   if (!username || !password) {
    //     setMessage('Please enter both username and password.');
    //     return;
    //   }
    //
    //   const u = {
    //     username: username,
    //     password: password,
    //   };
    //
    //   console.log(u);
    //
    //   // Call the login API from the backend
    //   const response = await api.post('/auth/admin-login', u);
    //
    //   // Handle API response
    //   if (response.data) {
    //     navigate('/admin');
    //     console.log(response.data);
    //     const { userData, access_token } = response.data;
    //
    //     // Save user information and token to localStorage or sessionStorage
    //     login(access_token, userData);
    //   }
    // } catch (error) {
    //   setMessage('Sign in failed. Try again!');
    //   console.error('Sign in failed:', error);
    // }
  };
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom style={{ color: '#2196F3', fontWeight: 'bold' }}>
          Administrator Sign In
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
          <Typography variant="body2" mt={2}>
            <Link to="/forgot-password">Forgot Password?</Link>
          </Typography>
          <Button variant="contained" color="primary" fullWidth onClick={(e) => handleSignIn(e)} style={{ marginTop: '20px' }}>
            Sign In
          </Button>
        </form>
        <Typography variant="body2" color="error" mt={2}>
          {message}
        </Typography>
        <Typography variant="body2" mt={2}>
          <Link to="/signin">Login as User</Link>
        </Typography>
      </Paper>
    </Container>
  );
}