
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

const StudentListTab = ({students}) => {
  const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = useState(false);
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleAddStudentClick = () => {
    setIsAddStudentDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsAddStudentDialogOpen(false);
    setNewStudentEmail('');
    setMessage('');
  };

  const handleAddStudentConfirm = () => {
    // Kiểm tra hợp lệ của địa chỉ email
    if (isValidEmail(newStudentEmail)) {
      // Xử lý logic khi xác nhận thêm học sinh với địa chỉ email newStudentEmail
      // ...
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
  //Kiểm tra nếu là giáo viên thì hiển thị Button Thêm học sinh còn nếu là học sinh thì chỉ cho xem số lượng học sinh
    return (
      <div>
      <Grid container alignItems="center" justifyContent="space-between">
        <Typography variant="h6" gutterBottom>
          Danh sách học sinh
        </Typography>
        <Grid item >
          <Grid container alignItems="center" spacing={1}>
          <Grid item>
            <Typography variant="body1">
              {students.length} học sinh
            </Typography>
          </Grid>
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
          </Grid>
          
        </Grid>
      </Grid>

        <Divider sx={{ margin: '16px 0' }} />

        {/* Danh sách học sinh */}
        <List>
          {students.map((student) => (
            <ListItem key={student._id}>
              <ListItemAvatar>
                <Avatar alt={student.fullName} src={student.avatar} />
              </ListItemAvatar>
              <ListItemText primary={student.fullName} />
            </ListItem>
          ))}
        </List>

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