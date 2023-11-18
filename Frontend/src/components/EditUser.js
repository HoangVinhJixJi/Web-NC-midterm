import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';

const EditUser = () => {
  const [user, setUser] = useState({
    name: '',
    age: '',
    gender: 'male',
    dob: null,
    email: '',
    avatar: '',
  });
  const [emailError, setEmailError] = useState(false);

  const handleChange = (field, value) => {
    setUser({
      ...user,
      [field]: value,
    });
    // Kiểm tra validation email
    if (field === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setEmailError(!emailRegex.test(value));
      }
  };

  const handleSave = () => {
    // Thực hiện lưu thông tin người dùng
    console.log(user);
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom mt={4}>
        Edit User
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Name"
            fullWidth
            value={user.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </Grid>
        
        
        <Grid item xs={12} sm={6}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Gender</FormLabel>
            <RadioGroup
              row
              value={user.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
            >
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel value="female" control={<Radio />} label="Female" />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Birth Date"
            fullWidth
            type="date"
            value={user.birthDate}
            onChange={(e) => handleChange('dob', e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} >
          <TextField
            label="Email"
            fullWidth
            type="email"
            value={user.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={emailError}
            helperText={emailError ? 'Invalid email format' : ''}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Avatar URL"
            fullWidth
            value={user.avatar}
            onChange={(e) => handleChange('avatar', e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EditUser;
