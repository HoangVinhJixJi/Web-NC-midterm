import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Container, TextField, Typography, Paper } from '@mui/material';
import Cookies from 'js-cookie';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // Thông báo thành công hoặc lỗi
  const navigate = useNavigate();

  const handleSignIn = async (event) => {
    try {
      event.preventDefault();
      console.log('handle Sign in');
      console.log('username: ', username);
      console.log('password: ', password);

      // Gọi API đăng ký từ phía backend
      const response = await axios.post('http://localhost:3001/auth/login', {
        username: username,
        password: password,
      });

      // Xử lý phản hồi từ API
      if (response.data) {
        console.log(response.data);
        const { user, accessToken, refreshToken } = response.data;

        // Lưu thông tin người dùng và token vào localStorage hoặc sessionStorage
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('accessToken', accessToken);
        Cookies.set('refreshToken', refreshToken, { expires: 30 });

        // Chuyển hướng sang trang home
        navigate('/home');
      }
    } catch (error) {
      setMessage('Đăng nhập thất bại. Vui lòng thử lại.');
      console.error('Đăng nhập thất bại:', error);
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
            style={{ marginBottom: '20px' }}
          />
          <Button variant="contained" color="primary" fullWidth onClick={(e) => handleSignIn(e)}>
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
