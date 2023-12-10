import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Typography, Paper, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Diversity3Icon from '@mui/icons-material/Diversity3';
import api, {setAuthToken} from '../../api/api';

const NotificationJoinClass = () => {
  const [joining, setJoining] = useState(false);
  const [classInfo, setClassInfo] = useState([]);
  //Gọi API kiểm tra thông tin lớp học
  const {classCode} = useParams();
  const navigate = useNavigate();
  const fetchClassData = async () => {
    try {
      const token = localStorage.getItem('token');
      if(!token){
        console.error('Error fetching class data:', Error);
        navigate('/signin');
      }
      setAuthToken(token);
      // Gọi API để lấy dữ liệu class thông qua classCode
      const response = await api.get(`/classes/class-code/${classCode}`);

      //Lưu thông tin toàn bộ lớp học vào state
      console.log('Class By Class Code  : ', response.data);
      setClassInfo(response.data.classInfo);
      //Người dùng đã tham gia vào lớp học
      if(response.data && response.data.joined){
        navigate(`/classroom/class-detail/${response.data.classInfo._id}`);
      }
    } catch (error) {
      // Xử lý lỗi
      console.error('Error fetching class data:', error);
      // Nếu lỗi là do xác thực (ví dụ: token hết hạn), chuyển hướng về trang đăng nhập
      if (error.response && error.response.status === 401) {
        navigate('/signin');
      }
    }
  };
  useEffect(() => {
    fetchClassData();
  }, []); 
  console.log(classCode);
  const handleJoinClass = async () => {
    // Gọi API để tham gia lớp học
    try {
      // const token = localStorage.getItem('token');
      // if(!token){
      //   console.error('Error fetching class data:', Error);
      //   navigate('/signin');
      // }
      // setAuthToken(token);
      // Gọi API để lấy dữ liệu class thông qua classCode
      const response = await api.post(`/classes/class-code/${classCode}`);
      //redirect tới trang chi tiết lớp học
      if(response.data.classInfo && response.data.joined){
        console.log(response.data);
        navigate(`/classroom/class-detail/${response.data.classInfo._id}`)
      }
      
    } catch (error) {
      // Xử lý lỗi
      console.error('Error fetching class data:', error);
      // Nếu lỗi là do xác thực (ví dụ: token hết hạn), chuyển hướng về trang đăng nhập
      if (error.response && error.response.status === 401) {
        navigate('/signin');
      }
    }
    setJoining(true);
  };

  return (
    <Paper elevation={3} sx={{ padding: '16px', position: 'relative', textAlign: 'center' }}>
     

      {/* Icon trạng thái */}
      <Box sx={{ color: '#4CAF50', fontSize: 40, marginBottom: 1 }}>
        <CheckCircleOutlineIcon fontSize='large' />
      </Box>

      {/* Thông tin cơ bản của lớp học */}
      <Typography variant="h6" gutterBottom>
        Thông báo mời tham gia vào lớp học
      </Typography>

      
      <Diversity3Icon  color='primary' sx={{ marginTop: '24px' , fontSize: '80px'}}/>
      
      
      <Typography variant="h6"  marginBottom={'60px'}>
        {classInfo.className}
      </Typography>

      {/* Nút tham gia lớp học */}
      {joining ? (
        <Button variant="contained" color="primary" disabled>
          Đang vào lớp học...
        </Button>
      ) : (
        <Button variant="contained" color="primary" onClick={handleJoinClass}>
          Tham gia lớp học
        </Button>
      )}
    </Paper>
  );
};

export default NotificationJoinClass;
