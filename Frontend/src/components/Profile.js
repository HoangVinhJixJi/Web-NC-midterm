import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, {setAuthToken} from '../api/api';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Avatar,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import CakeIcon from '@mui/icons-material/Cake';
import PersonIcon from '@mui/icons-material/Person';
import TransgenderIcon from '@mui/icons-material/Transgender';


const Profile= () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: '',
    fullName: '',
    gender: '',
    birthday: null,
    email: '',
    avatar: '',
  }); 
  const displayBirthday= (day)=>{
    if (!day) {
      return ""; 
    }
    const [year, month, date] = day.split('-');
    return `${date}/${month}/${year}`;
  }
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Lấy token từ localStorage hoặc nơi lưu trữ khác
        const token = localStorage.getItem('token');
        if(!token){
          console.error('Error fetching user data:', Error);
          navigate('/signin');
        }
        
        // Đặt token cho mọi yêu cầu
        setAuthToken(token);
        // Gọi API để lấy dữ liệu người dùng
        const response = await api.get('/auth/profile');
        // Lưu thông tin người dùng vào state
        setUser(response.data);
        
      } catch (error) {
        // Xử lý lỗi
        console.error('Error fetching user data:', error);

        // Nếu lỗi là do xác thực (ví dụ: token hết hạn), chuyển hướng về trang đăng nhập
        if (error.response && error.response.status === 401) {
          navigate('/signin');
        }
      }
    };

    // Gọi hàm lấy dữ liệu người dùng
    fetchUserData();

  }, []); 
  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom mt={4}>
        User Information
      </Typography>
      <Paper elevation={3} sx={{ padding: 3, display: 'flex' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              src={user.avatar}
              alt={user.fullName}
              sx={{ width: 250, height: 250, margin: '20px', border: '5px dotted #3333' }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom >
              <PersonIcon /> {user.fullName}
            </Typography>
            <Typography variant="h6" gutterBottom>
              <TransgenderIcon /> {user.gender}
            </Typography>
            <Typography variant="h6" gutterBottom>
              <CakeIcon /> {displayBirthday(user.birthday)}
            </Typography>
            <Typography variant="h6" gutterBottom>
              <EmailIcon /> {user.email}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile;
