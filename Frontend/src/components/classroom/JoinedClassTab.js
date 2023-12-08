import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Tab, Tabs, Typography, Grid, Paper, Container } from '@mui/material';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import api, {setAuthToken} from '../../api/api';


const JoinedClassTab = ({ onClassClick}) => {
    const [classList, setClassList] = useState([
      { _id: 1, className: 'Lớp học 1 kakjsdh aso doasd', description: 'Mô tả lớp học 1 Joined class aosdhoasi doas doasduh asodj asd' },
      { _id: 2, className: 'Lớp học 2 asdas', description: 'Mô tả lớp học 2 Joined class' },
      { _id: 3, className: 'Lớp học 3', description: 'Mô tả lớp học 3 Joined classdasd' },
      { _id: 4, className: 'Lớp học 4aosid oasdh asda ', description: 'Joined class' },
      { _id: 5, className: 'Lớp học 5', description: 'Mô tả lớp học 5 Joined class aosdhoasi doas doasduh asodj asd' },

  ]);
    const navigate = useNavigate();
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
          // Gọi API để lấy dữ liệu danh sách toàn bộ các lớp học của người dùng
          const response = await api.get('/class/joined-class');
          //Lưu thông tin toàn bộ lớp học vào state
          setClassList(response.data);
          
          
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
      //fetchUserData();
  
    }, []);   
  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Grid container spacing={3} sx={{ marginTop: '20px',paddingBottom: '20px',  overflowY: 'auto', maxHeight: 'calc(100vh - 160px)' }}>
    {classList.map((classItem) => (
      <Grid item key={classItem._id} xs={12} sm={6} md={4}>
        <Paper elevation={3} sx={{ padding: '16px', margin: '8px', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} onClick={() => onClassClick(classItem._id)}>
       
          <Diversity3Icon fontSize="large" style={{ marginBottom: '8px' }}/>

          {/* Nội dung thông tin */}
          <div style={{ textAlign: 'center' }}>
          <Typography
            variant="h6"
            gutterBottom
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              WebkitLineClamp: 2, // Số dòng tối đa muốn hiển thị
            }}
          >
            {classItem.className}
          </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                WebkitLineClamp: 2, // Số dòng tối đa muốn hiển thị
              }}
            >
              {classItem.description}
            </Typography>
            
          </div>
        </Paper>
      </Grid>
    ))}
  </Grid>
  </Container>
  );
};

export default JoinedClassTab;

