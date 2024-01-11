import React, { useState, useEffect } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import api, {setAuthToken} from '../api/api';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Avatar, ListItemIcon, Stack,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import CakeIcon from '@mui/icons-material/Cake';
import PersonIcon from '@mui/icons-material/Person';
import TransgenderIcon from '@mui/icons-material/Transgender';
import SchoolIcon from '@mui/icons-material/School';
import AddStudentIdDialog from './dialogs/AddStudentIdDialog';


const Profile= () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: '',
    fullName: '',
    gender: '',
    birthday: null,
    email: '',
    avatar: '',
    studentId: null,
  });
  const [isOpenAddStudentIdDialog, setIsOpenAddStudentIdDialog] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const displayBirthday= (day)=>{
    if (!day) {
      return ""; 
    }
    const [year, month, date] = day.split('-');
    return `${date}/${month}/${year}`;
  }
  function handleAddStudentIdClick(event) {
    event.preventDefault();
    setIsOpenAddStudentIdDialog(true);
  }
  function handleCloseAddStudentIdDialog(studentId) {
    setIsOpenAddStudentIdDialog(false);
    if (isSuccess) {
      setUser({...user, studentId: studentId});
    }
    setIsSuccess(false);
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
        console.log(response.data);
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
              <Stack direction="row" alignItems="center">
                <ListItemIcon direction="row" alignItems="center" sx={{minWidth: "30px", color: "inherit"}}>
                  <PersonIcon />
                </ListItemIcon>
                {user.fullName}
              </Stack>
            </Typography>
            <Typography variant="h6" gutterBottom>
              <Stack direction="row" alignItems="center">
                <ListItemIcon direction="row" alignItems="center" sx={{minWidth: "30px", color: "inherit"}}>
                  <TransgenderIcon />
                </ListItemIcon>
                {user.gender}
              </Stack>
            </Typography>
            <Typography variant="h6" gutterBottom>
              <Stack direction="row" alignItems="center">
                <ListItemIcon direction="row" alignItems="center" sx={{minWidth: "30px", color: "inherit"}}>
                  <CakeIcon />
                </ListItemIcon>
                {displayBirthday(user.birthday)}
              </Stack>
            </Typography>
            <Typography variant="h6" gutterBottom>
              <Stack direction="row" alignItems="center">
                <ListItemIcon direction="row" alignItems="center" sx={{minWidth: "30px", color: "inherit"}}>
                  <EmailIcon />
                </ListItemIcon>
                {user.email}
              </Stack>
            </Typography>
            <Typography variant="h6" gutterBottom>
              <Stack direction="row" alignItems="center">
                <ListItemIcon direction="row" alignItems="center" sx={{minWidth: "30px", color: "inherit"}}>
                  <SchoolIcon />
                </ListItemIcon>
                {user.studentId ?? '<Student ID>'}
                <Link to='#' style={{ textDecoration: 'none', marginLeft: "15px" }} onClick={handleAddStudentIdClick}>
                  <Stack sx={{ color: "primary.main" }}>{user.studentId ? 'Change' : 'Add'}</Stack>
                </Link>
              </Stack>
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      <AddStudentIdDialog
        _studentId={user.studentId}
        isOpenDialog={isOpenAddStudentIdDialog}
        onCloseDialogClick={handleCloseAddStudentIdDialog}
        setIsSuccess={setIsSuccess}
      />
    </Container>
  );
};

export default Profile;
