import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Container, TextField, Typography, Paper } from '@mui/material';

import api from '../api/api';
import { useAuth as useAuthContext } from '../api/AuthContext';

const SignIn = () => {
  const { login } = useAuthContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // Thông báo thành công hoặc lỗi
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
      }
      
      console.log(u);

      // Gọi API đăng nhập từ phía backend
      const response = await api.post('/auth/login', u);

      // Xử lý phản hồi từ API
      if (response.data) {
        console.log(response.data);
        const { userData, access_token } = response.data;

        // Lưu thông tin người dùng và token vào localStorage hoặc sessionStorage
        login(access_token, userData);

        // Chuyển hướng sang trang home
        navigate('/home')
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
            type="password"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="contained" color="primary" fullWidth onClick={(e) => handleSignIn(e)} style={{ marginTop: '20px' }}>
            Sign In
          </Button>
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
