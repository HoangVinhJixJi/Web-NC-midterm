
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

const TeacherListTab = ({teachers}) => {
  const [isAddTeacherDialogOpen, setIsAddTeacherDialogOpen] = useState(false);
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [message, setMessage] = useState('');
  const [invitedEmails, setInvitedEmails] = useState([]);


  const handleAddTeacherClick = () => {
    setIsAddTeacherDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsAddTeacherDialogOpen(false);
    setNewTeacherEmail('');
    setMessage('');
  };

  const handleAddTeacherConfirm = () => {
    // Kiểm tra hợp lệ của địa chỉ email
    if (isValidEmail(newTeacherEmail)) {
      // Xử lý logic khi xác nhận thêm giáo viên với địa chỉ email newTeacherEmail
      setInvitedEmails((prevInvitedEmails) => [...prevInvitedEmails, { email: newTeacherEmail, invited: true }]);
      setMessage('');
      handleCloseDialog();
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
      <div>
      <Grid container alignItems="center" justifyContent="space-between">
        <Typography variant="h6" gutterBottom>
          Danh sách giáo viên
        </Typography>
        <Grid item >
          <Grid container alignItems="center" spacing={1}>
          {teachers && <Grid item>
            <Typography variant="body1">
              {teachers.length} giáo viên
            </Typography>
          </Grid>}
          
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddTeacherClick}
            >
              Thêm
            </Button>
          </Grid>
          </Grid>
          
        </Grid>
      </Grid>

        <Divider sx={{ margin: '16px 0' }} />
        
        {invitedEmails.map((teacher) => (
          <ListItem key={teacher.email} sx={{ opacity: teacher.invited ? 0.5 : 1 }}>
            <ListItemText primary={teacher.email} secondary={teacher.invited ? 'Đã gửi lời mời' : ''} />
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
          <DialogTitle>Thêm giáo viên</DialogTitle>
          
          <DialogContent>
            <Typography textAlign={'center'} margin={2}>
              - Vui lòng nhập vào địa chỉ email người muốn thêm vào -
            </Typography>
            <TextField
              label="Email giáo viên"
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
            <Button onClick={handleCloseDialog}>Hủy</Button>
            <Button onClick={handleAddTeacherConfirm} color="primary">Xác nhận</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };

export default TeacherListTab