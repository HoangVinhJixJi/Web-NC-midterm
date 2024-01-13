import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Box, 
  Tab, 
  Tabs, 
  Typography, 
  Grid, 
  Paper, 
  Container, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar,
  MenuItem,
  Menu,
  IconButton,
  Snackbar,
  Divider,
} from '@mui/material';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import api, {setAuthToken} from '../../api/api';
const ClassInfoTab = ({ classInfo, isTeaching }) => {
    console.log('classInfo in ClassInfotab: ', classInfo);
    const [anchorEl, setAnchorEl] = useState(null);
    const [isSnackbarOpen, setSnackbarOpen] = useState(false);
    

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    const handleCopyCode = (classCode) => {
      navigator.clipboard.writeText(classCode);
      setSnackbarOpen(true);
      handleClose();
    };
    const handleCopyLink = (classCode) => {
      const currentURL = window.location.origin;
      // Tạo link mời với mã lớp
      const inviteLink = `${currentURL}/classroom/class-code/${classCode}`;
      console.log(inviteLink);
      // Xử lý logic sao chép đường link mời tham gia lớp học
      navigator.clipboard.writeText(inviteLink);
      setSnackbarOpen(true);
      handleClose();
    };
    const handleSnackbarClose = () => {
      setSnackbarOpen(false);
    };
    //Kiểm tra đúng là lớp do mình làm giáo viên thì cho hiển thị code
    
    return (
      <div>
        <Divider sx={{ margin: '16px 0' }} />
        {/* Thông tin cơ bản của lớp học */}
        <Grid container spacing={2}>
        { isTeaching &&
          <Grid item xs={4}>
          <Paper elevation={3} sx={{ padding: '16px 32px', position: 'relative', float: 'left' }}>
            {/* Mã code của lớp học */}
            <Typography variant="h6" gutterBottom >
              Class Code
            </Typography> 
            <Typography variant="body1" color="textSecondary">
              {classInfo.classCode}
            </Typography>
  
            {/* Nút 3 chấm */}
            <IconButton aria-controls="menu" aria-haspopup="true" onClick={handleClick} sx={{ position: 'absolute', top: '8px', right: '4px' }}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => handleCopyCode(classInfo.classCode)}>Copy Class Code</MenuItem>
              <MenuItem onClick={() => handleCopyLink(classInfo.classCode)}>Copy Invitation Link</MenuItem>
            </Menu>
          </Paper>
          </Grid>
        }
        { isTeaching ? <Grid item xs={8} >
          <Typography variant="h5" gutterBottom>
            {classInfo.className}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {classInfo.description}
          </Typography>
          </Grid> : <Grid item xs={12} >
          <Typography variant="h5" gutterBottom >
            {classInfo.className}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {classInfo.description}
          </Typography>
          </Grid> }
          
        
          <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={isSnackbarOpen}
          autoHideDuration={3000} // Thời gian hiển thị Snackbar (milliseconds)
          onClose={handleSnackbarClose}
          message="Copied successfully!"
          action={
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
        </Grid>
        
      </div>
    );
  };

  export default ClassInfoTab;