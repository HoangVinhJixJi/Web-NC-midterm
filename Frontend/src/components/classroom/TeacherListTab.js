
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
  Grid,
  CircularProgress
} from '@mui/material';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import api, {setAuthToken} from '../../api/api';

const TeacherListTab = ({classId, isTeaching}) => {
  const [isAddTeacherDialogOpen, setIsAddTeacherDialogOpen] = useState(false);
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [message, setMessage] = useState('');
  const [invitedEmails, setInvitedEmails] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchTeacherData = async () => {
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
        const response = await api.get(`/enrollments/teacher/${classId}`);
        //Lưu thông tin toàn bộ lớp học vào state
        console.log('List teachers Data: ', response.data);
        //Kiểm tra lại thông tin teacher:
        const list = response.data.reduce((accumulator, obj) => {
          if (obj.memberInfo != null && obj.role === 'teacher') {
            accumulator.push(obj.memberInfo);
          }
          return accumulator;
        }, []);
        
        console.log("list: ", list);
        setTeachers(list);
        setIsLoading(false);
        
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
    fetchTeacherData();

  }, []); 

  const handleAddTeacherClick = () => {
    setIsAddTeacherDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsAddTeacherDialogOpen(false);
    setNewTeacherEmail('');
    setMessage('');
  };

  const handleAddTeacherConfirm = async () => {
    // Kiểm tra hợp lệ của địa chỉ email
    if (isValidEmail(newTeacherEmail)) {
      const allEmails = await api.get(`/classes/email/${classId}`);
      const check = allEmails.data.includes(newTeacherEmail);
      if (check) {
        setMessage('Email is already in the class!');
      }
      else {
        const u = await api.get('/auth/profile');
        const userData = {
          userEmail: u.data.email,
          invitedEmail: newTeacherEmail,
          role: "teacher",
        }
        console.log(userData);
        const res = await api.post(`/classes/invite-email/${classId}`, userData);
        console.log(res);
        setInvitedEmails((prevInvitedEmails) => [...prevInvitedEmails, { email: newTeacherEmail, invited: true }]);
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
  //Kiểm tra nếu là giáo viên thì hiển thị Button Thêm giáo viên còn nếu là học sinh thì chỉ cho xem số lượng học sinh
    return (
      <>
      { teachers && isLoading ? 
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </div>
        :
      <div>
      <Grid container alignItems="center" justifyContent="space-between">
        <Typography variant="h6" gutterBottom>
          Teacher List
        </Typography>
        <Grid item >
          <Grid container alignItems="center" spacing={1}>
          <Grid item>
            <Typography variant="body1">
              {teachers.length > 1 ? 
              `${teachers.length} teachers`
              :`${teachers.length} teacher`}
            </Typography>
          </Grid>
          { isTeaching &&
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddTeacherClick}
            >
              Add
            </Button>
          </Grid>
          }
          </Grid>
          
        </Grid>
      </Grid>

        <Divider sx={{ margin: '16px 0' }} />
        
        {invitedEmails.map((teacher) => (
          <ListItem key={teacher.email} sx={{ opacity: teacher.invited ? 0.5 : 1 }}>
            <ListItemText primary={teacher.email} secondary={teacher.invited ? 'Invitation sent' : ''} />
          </ListItem>
        ))}
        {teachers && 
        <List>
          {teachers.map((teacher) => (
            <ListItem key={teacher._id}>
              <ListItemAvatar>
                <Avatar alt={teacher.fullName} src={teacher.avatar} />
              </ListItemAvatar>
              <ListItemText primary={teacher.fullName} />
            </ListItem>
          ))}
        </List>
        }

        {/* Dialog để thêm giáo viên */}
        <Dialog open={isAddTeacherDialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>Add Teacher</DialogTitle>
          
          <DialogContent>
            <Typography textAlign={'center'} margin={2}>
              - Please enter the email address -
            </Typography>
            <TextField
              label="Email Teacher"
              fullWidth
              value={newTeacherEmail}
              onChange={(e) => setNewTeacherEmail(e.target.value)}
              required
            />
            <Typography variant="body2" color="error" mt={2}>
              {message}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleAddTeacherConfirm} color="primary">Send</Button>
          </DialogActions>
        </Dialog>
      </div>
      }
      </>
    );
  };

export default TeacherListTab