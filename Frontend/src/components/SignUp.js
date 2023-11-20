import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, TextField, Typography, Paper, MenuItem, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import api from '../api/api';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullname, setFullname] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [avatar, setAvatar] = useState('');
  const [message, setMessage] = useState('');
  const [isDateOfBirthFocused, setIsDateOfBirthFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleDateOfBirthFocus = () => {
    setIsDateOfBirthFocused(true);
  };

  const handleDateOfBirthBlur = () => {
    setIsDateOfBirthFocused(false);
  };

  const validateInputs = () => {
    // Validate Full Name
    if (!fullname) {
      setMessage('Please enter your full name.');
      return false;
    }

    // Validate Username
    if (!username) {
      setMessage('Please enter a username.');
      return false;
    }

    // Validate Password (add more complex checks if needed)
    if (!password) {
      setMessage('Please enter a password.');
      return false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Please enter a valid email address.');
      return false;
    }

    // Validate Date of Birth (you can add more specific checks based on your requirements)
    if (!dateOfBirth && !isDateOfBirthFocused) {
      setMessage('Please enter your date of birth.');
      return false;
    }

    const currentDate = new Date();
    const inputDate = new Date(dateOfBirth);

    if (inputDate > currentDate) {
      setMessage('Date of birth cannot be in the future.');
      return false;
    }

    // Validate Gender
    if (!gender) {
      setMessage('Please select your gender.');
      return false;
    }

    // Validate Avatar
    if (!avatar) {
      setMessage('Please enter an avatar URL.');
      return false;
    }

    // All validations passed
    return true;
  };

  const handleSignUp = async (event) => {
    try {
      event.preventDefault();

      // Validate inputs
      if (!validateInputs()) {
        return;
      }

      const u = {
        username: username,
        password: password,
        email: email,
        fullName: fullname,
        gender: gender,
        birthday: dateOfBirth,
        avatar: avatar,
      };

      console.log(u);

      // Make API call
      const response = await api.post('/users/register', u);

      if (response.data) {
        setMessage('Sign up success. Sign in now!');
        console.log(response.data);
      }
    } catch (error) {
      setMessage('Sign up failed. Try again!');
      console.error('Sign up failed:', error);
    }
  };

  useEffect(() => {
    // Component did mount logic
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
            select
            label="Gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            variant="outlined"
            margin="normal"
            fullWidth
            required
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </TextField>
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
            label="Avatar URL"
            type="text"
            variant="outlined"
            margin="normal"
            fullWidth
            onChange={(e) => setAvatar(e.target.value)}
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
            type={showPassword ? 'text' : 'password'} // Toggle visibility based on showPassword state
            variant="outlined"
            margin="normal"
            fullWidth
            onChange={(e) => setPassword(e.target.value)}
            required
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
          <Button variant="contained" color="primary" fullWidth onClick={(e) => handleSignUp(e)} style={{ marginTop: '20px' }}>
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
