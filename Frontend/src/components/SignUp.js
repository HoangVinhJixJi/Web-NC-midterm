import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Container, TextField, Typography, Paper } from '@mui/material';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullname, setFullname] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState(''); // Thông báo thành công hoặc lỗi
  const [isDateOfBirthFocused, setIsDateOfBirthFocused] = useState(false);
  const navigate = useNavigate();

  const handleDateOfBirthFocus = () => {
    setIsDateOfBirthFocused(true);
  };

  const handleDateOfBirthBlur = () => {
    setIsDateOfBirthFocused(false);
  };

  const handleSignUp = async (event) => {
    try {
      event.preventDefault();
      // Gọi API đăng ký từ phía backend
      const response = await axios.post('http://localhost:3001/auth/register', {
        username: username,
        password: password,
        email: email,
        fullname: fullname,
        dateOfBirth: dateOfBirth,
        phoneNumber: phoneNumber,
      });
      // Xử lý phản hồi từ API
      if (response.data) {
        // Nếu đăng ký thành công, hiển thị thông báo thành công
        setMessage('Đăng ký thành công. Hãy đăng nhập ngay bây giờ.');
        console.log(response.data);
        // Chuyển hướng sang trang đăng nhập sau khi đăng ký thành công
        navigate('/signin');
      }
    } catch (error) {
      setMessage('Đăng ký thất bại. Vui lòng thử lại.');
      console.error('Đăng ký thất bại:', error);
    }
  };

  useEffect(() => {
    // Khi component được tải lại, bật trường nhập và nút
  }, []);

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom style={{ color: '#2196F3', fontWeight: 'bold' }}>
          Sign Up
        </Typography>
        <form>
          <TextField
            label="Full Name"
            type="text"
            variant="outlined"
            margin="normal"
            fullWidth
            onChange={(e) => setFullname(e.target.value)}
            required
          />
          <TextField
            label="Username"
            type="text"
            variant="outlined"
            margin="normal"
            fullWidth
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            fullWidth
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            margin="normal"
            fullWidth
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {isDateOfBirthFocused ? (
            <TextField
              label="Date of Birth"
              type="date"
              variant="outlined"
              margin="normal"
              fullWidth
              onChange={(e) => setDateOfBirth(e.target.value)}
              onBlur={handleDateOfBirthBlur}
              required
            />
          ) : (
            <TextField
              label="Date of Birth"
              type="text"
              variant="outlined"
              margin="normal"
              fullWidth
              onFocus={handleDateOfBirthFocus}
              required
            />
          )}
          <TextField
            label="Phone Number"
            type="tel"
            variant="outlined"
            margin="normal"
            fullWidth
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            style={{ marginBottom: '20px' }}
          />
          <Button variant="contained" color="primary" fullWidth onClick={(e) => handleSignUp(e)}>
            Sign Up
          </Button>
        </form>
        <Typography variant="body2" color="error" mt={2}>
          {message}
        </Typography>
        <Typography variant="body2" mt={2}>
          Already have an account? <Link to="/signin">Sign In</Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default SignUp;
