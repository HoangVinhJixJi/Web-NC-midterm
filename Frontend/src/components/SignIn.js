import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Container, TextField, Typography, Paper } from '@mui/material';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // Thông báo thành công hoặc lỗi
  const navigate = useNavigate();
  const avatarURL = 'https://sm.ign.com/ign_nordic/cover/a/avatar-gen/avatar-generations_prsz.jpg';

  const handleSignIn = async (event) => {
    try {
      event.preventDefault();

      // Validate inputs
      if (!username || !password) {
        setMessage('Please enter both username and password.');
        return;
      }

      const user = {
        username: username,
        password: password,
      }
      
      console.log(user);

      // Gọi API đăng nhập từ phía backend
      const response = await axios.post('http://localhost:5000/auth/login', user,
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'http://localhost:3000', // Replace with your frontend origin
          }
        });

      // Xử lý phản hồi từ API
      if (response.data) {
        console.log(response.data);
        const { accessToken } = response.data;

        // Lưu thông tin người dùng và token vào localStorage hoặc sessionStorage
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('accessToken', accessToken);

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
