import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, {setAuthToken} from '../api/api';
import {useAuth as useAuthContext} from '../api/AuthContext';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  InputAdornment,
  IconButton,
  FormHelperText,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const ChangePassword = () => {
  const navigate = useNavigate();
  const { logout} = useAuthContext(); 
  const [pass, setPass] = useState({
    oldPassword: '',
    newPassword: '',
  });
  const [saveStatus, setSaveStatus] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [oldPasswordError, setOldPasswordError] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState(false);
  const handleClickShowPassword = (field) => {
    if (field === 'oldPassword') {
      setShowOldPassword(!showOldPassword);
    } else if (field === 'newPassword') {
      setShowNewPassword(!showNewPassword);
    }
  };

  const handleChange = (field, value) => {
    setPass({
      ...pass,
      [field]: value,
    });
    if (field === 'oldPassword') {
      setOldPasswordError(!value); // Nếu giá trị không tồn tại, đặt lỗi là true
    }
    // Kiểm tra nếu field là 'newPassword' và giá trị không tồn tại
    if (field === 'newPassword') {
      setNewPasswordError(!value); // Nếu giá trị không tồn tại, đặt lỗi là true
    }
  };

  const handleSave = async () => {
    if(oldPasswordError || newPasswordError){
      console.log('return failed');
      return ;
    }
    try {
      // Lấy token từ localStorage 
      const token = localStorage.getItem('token');
      if(!token){
        console.error('Error fetching user data:', Error);
        navigate('/signin');
      }
      // Đặt token cho mọi yêu cầu
      setAuthToken(token);
      // Gửi yêu cầu POST đến endpoint của server
      const response = await api.post('/users/update-password', pass);
      // Xử lý kết quả từ server
      if (response.status === 200) {
        setSaveStatus(`${response.data.message}!!!  Please Sign In again with New Password`);
        setTimeout(()=>{
          logout();
          navigate('/signin');
        }, 5000)
      } else {
        setSaveStatus(response.data.message);
      }
    } catch (error) {
      // Xử lý lỗi từ server
      console.error('Error updating user:', error);
      setSaveStatus('Update failed. Please try again.');
    }
  };
  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom my={4}>
       Change Password
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Your Old Password: "
            fullWidth
            type={showOldPassword ? 'text' : 'password'}
            onChange={(e) => handleChange('oldPassword', e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => handleClickShowPassword('oldPassword')}>
                    {showOldPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={oldPasswordError}
          />
        </Grid>
        {oldPasswordError && (
          <Grid item xs={12}>
            <FormHelperText error>
              Please enter your old password.
            </FormHelperText>
          </Grid>
        )}
        <Grid item xs={12}>
          <TextField
            label="Your New Password: "
            fullWidth
            type={showNewPassword ? 'text' : 'password'}
            onChange={(e) => handleChange('newPassword', e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => handleClickShowPassword('newPassword')}>
                    {showNewPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={newPasswordError}
          />
        </Grid>
        {newPasswordError && (
          <Grid item xs={12}>
            <FormHelperText error>
              Please enter your new password.
            </FormHelperText>
          </Grid>
        )}
        {saveStatus && (
          <Grid item xs={12}>
            <Typography color='primary'>
              {saveStatus}
            </Typography>
          </Grid>
        )}
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ChangePassword;
