import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Typography, Paper, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Diversity3Icon from '@mui/icons-material/Diversity3';

const NotificationJoinClass = () => {
  const [joining, setJoining] = useState(false);
  //Gọi API kiểm tra thông tin lớp học
  const {classCode} = useParams();
  console.log(classCode);
  const handleJoinClass = async () => {
    // Gọi API để tham gia lớp học

    setJoining(true);

    // try {
    //   // Gọi API tham gia lớp học
    //   //await onJoinClass(); // Thực hiện xác nhận tham gia lớp học

    //   // Nếu tham gia lớp học thành công, chuyển hướng đến trang chính của classroom
    //   // Đây là nơi bạn muốn chuyển hướng, có thể sử dụng hook useNavigate hoặc history.push
    //   // Ví dụ: navigate('/classroom/main');
    // } catch (error) {
    //   console.error('Error joining class:', error);
    //   // Xử lý lỗi nếu cần
    // } finally {
    //   setJoining(false);
    // }
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
      
      
      <Typography variant="body1" color="textSecondary" marginY={'60px'}>
        classInfo.className
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
