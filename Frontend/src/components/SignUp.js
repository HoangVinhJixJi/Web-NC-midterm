import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Container, TextField, Typography, Paper, MenuItem } from '@mui/material';

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
  const navigate = useNavigate();

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

      const user = {
        username: username,
        password: password,
        email: email,
        fullName: fullname,
        birthday: dateOfBirth,
        gender: gender,
        avatar: avatar,
      }

      console.log(user);

      // Make API call
      const response = await axios.post('http://localhost:3456/users/register', user,
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'http://localhost:3000', // Replace with your frontend origin
          }
        });

      if (response.data) {
        setMessage('Sign up success. Sign in now!');
        console.log(response.data);
        navigate('/signin');
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
            <MenuItem value="Nam">Male</MenuItem>
            <MenuItem value="Nữ">Female</MenuItem>
            <MenuItem value="Khác">Other</MenuItem>
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
            type="password"
            variant="outlined"
            margin="normal"
            fullWidth
            onChange={(e) => setPassword(e.target.value)}
            required
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
