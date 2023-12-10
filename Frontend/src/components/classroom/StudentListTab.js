
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {  
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar,
  Divider,
  Button, 
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  Grid
} from '@mui/material';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import api, {setAuthToken} from '../../api/api';

const StudentListTab = ({classId, isTeaching}) => {
  const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = useState(false);
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [message, setMessage] = useState('');
  const [invitedEmails, setInvitedEmails] = useState([]);
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // Lấy token từ localStorage hoặc nơi lưu trữ khác
        const token = localStorage.getItem('token');
        if(!token){
          console.error('Error fetching user data:', Error);
          
          navigate('/signin');
        }
        
        // Đặt token cho mọi yêu cầu
        setAuthToken(token);
        // Gọi API để lấy dữ liệu danh sách toàn bộ các giáo viên của lớp học
        const response = await api.get(`/enrollments/student/${classId}`);
        //Lưu thông tin toàn bộ lớp học vào state
        console.log('List Students Data: ', response.data);
        //Kiểm tra lại thông tin teacher:
        const list = response.data.reduce((accumulator, obj) => {
          if (obj.memberInfo != null && obj.role === 'student') {
            accumulator.push(obj.memberInfo);
          }
          return accumulator;
        }, []);
        
        console.log("list: ", list);
        setStudents(list);
        
        
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
    fetchStudentData();

  }, []); 
  const handleAddStudentClick = () => {
    setIsAddStudentDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsAddStudentDialogOpen(false);
    setNewStudentEmail('');
    setMessage('');
  };

  const handleAddStudentConfirm = async() => {
    // Kiểm tra hợp lệ của địa chỉ email
    if (isValidEmail(newStudentEmail)) {
      const allEmails = await api.get(`/classes/email/${classId}`);
      const check = allEmails.data.includes(newStudentEmail);
      if (check) {
        setMessage('Email is already in the class!');
      }
      else {
        const u = await api.get('/auth/profile');
        const userData = {
          userEmail: u.data.email,
          invitedEmail: newStudentEmail,
          role: "student",
        }
        console.log(userData);
        const res = await api.post(`/classes/invite-email/${classId}`, userData);
        console.log(res);
        setInvitedEmails((prevInvitedEmails) => [...prevInvitedEmails, { email: newStudentEmail, invited: true }]);
        setMessage('Invitation sent successfully!');
      }
    } else {
      // Hiển thị thông báo lỗi hoặc thực hiện hành động phù hợp
      setMessage('Email is not valid!');
    }
  };
  const isValidEmail = (email) => {
    // Sử dụng biểu thức chính quy đơn giản để kiểm tra hợp lệ của địa chỉ email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  //Kiểm tra nếu là giáo viên thì hiển thị Button Thêm học sinh còn nếu là học sinh thì chỉ cho xem số lượng học sinh
    return (
      <div>
      <Grid container alignItems="center" justifyContent="space-between">
        <Typography variant="h6" gutterBottom>
          Danh sách học sinh
        </Typography>
        <Grid item >
          <Grid container alignItems="center" spacing={1}>
          {students && <Grid item>
            <Typography variant="body1">
            {isTeaching ? students.length : students.length + 1} học sinh
            </Typography>
          </Grid>}
          { isTeaching &&
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddStudentClick}
            >
              Thêm
            </Button>
          </Grid>
          }
          </Grid>
          
        </Grid>
      </Grid>

        <Divider sx={{ margin: '16px 0' }} />

        {invitedEmails.map((teacher) => (
          <ListItem key={teacher.email} sx={{ opacity: teacher.invited ? 0.5 : 1 }}>
            <ListItemText primary={teacher.email} secondary={teacher.invited ? 'Đã gửi lời mời' : ''} />
          </ListItem>
        ))}
        {students && <List>
          {students.map((student) => (
            <ListItem key={student._id}>
              <ListItemAvatar>
                <Avatar alt={student.fullName} src={student.avatar} />
              </ListItemAvatar>
              <ListItemText primary={student.fullName} />
            </ListItem>
          ))}
        </List>
        }

        {/* Dialog để thêm học sinh */}
        <Dialog open={isAddStudentDialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>Thêm học sinh</DialogTitle>
          
          <DialogContent>
            <Typography textAlign={'center'} margin={2}>
              - Vui lòng nhập vào địa chỉ email người muốn thêm vào -
            </Typography>
            <TextField
              label="Email học sinh"
              fullWidth
              value={newStudentEmail}
              onChange={(e) => setNewStudentEmail(e.target.value)}
              required
            />
            <Typography variant="body2" color="error" mt={2}>
              {message}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Hủy</Button>
            <Button onClick={handleAddStudentConfirm} color="primary">Xác nhận</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };

export default StudentListTab