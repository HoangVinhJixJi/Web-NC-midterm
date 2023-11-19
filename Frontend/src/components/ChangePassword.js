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
} from '@mui/material';


const ChangePassword = () => {
  const navigate = useNavigate();
  const { logout} = useAuthContext(); 
  const [pass, setPass] = useState({
    oldPassword: '',
    newPassword: '',
  });
  const [saveStatus, setSaveStatus] = useState('');

  const handleChange = (field, value) => {
    setPass({
      ...pass,
      [field]: value,
    });
  };

  const handleSave = async () => {
    try {
      console.log(pass);
      // Lấy token từ localStorage hoặc nơi lưu trữ khác
      const token = localStorage.getItem('token');
      if(!token){
        console.error('Error fetching user data:', Error);
        navigate('/signin');
      }
      console.log("token fetchUserData: ", token);
      // Đặt token cho mọi yêu cầu
      setAuthToken(token);
      // Gửi yêu cầu POST đến endpoint của server
      const response = await api.post('/users/update-password', pass);
      console.log("response: ", response);

      // Xử lý kết quả từ server
      if (response.status === 200) {
        setSaveStatus(`${response.data.message}!!!  Please Sign In again with New Password`);
        setTimeout(()=>{
          logout();
          navigate('/signin');
        }, 3000)
      } else {
        setSaveStatus(response.data.message);
      }
    } catch (error) {
      // Xử lý lỗi từ server
      console.error('Error updating user:', error);
      setSaveStatus('Update failed. Please try again.');
    }
  };

  
  
  console.log(" => PASSWORD after from /users/update-password : ", pass);
  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom mt={4}>
       Change Password
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Your Old Password: "
            fullWidth
            type="password"
            onChange={(e) => handleChange('oldPassword', e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} >
          <TextField
            label="Your New Password: "
            fullWidth
            type="password"
            onChange={(e) => handleChange('newPassword', e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        {saveStatus && <Grid item xs={12}>
          <Typography color='primary'>
              {saveStatus}
          </Typography>
        </Grid>}
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
