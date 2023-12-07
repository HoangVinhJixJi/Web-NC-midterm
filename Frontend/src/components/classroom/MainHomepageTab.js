import React , { useState, useEffect }from 'react';
import {useNavigate} from 'react-router-dom'
import {
  Container,
  Typography,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  styled,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  
} from '@mui/material';
import { Add as AddIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material';
import Diversity3Icon from '@mui/icons-material/Diversity3';

import AllClassTab from './AllClassTab';

const CustomListItemButton = styled(ListItemButton)(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(2),
    '&:hover': {
      borderColor: theme.palette.primary.main,
    },
  }));
  
const MainHomepageTab = ({ onClassClick }) => {
    const [isCreateClassOpen, setCreateClassOpen] = useState(false);
    const [isJoinClassOpen, setJoinClassOpen] = useState(false);

    const openCreateClassPopup = () => setCreateClassOpen(true);
    const closeCreateClassPopup = () => setCreateClassOpen(false);

    const openJoinClassPopup = () => setJoinClassOpen(true);
    const closeJoinClassPopup = () => setJoinClassOpen(false);



  const classList = [
    { id: 1, name: 'Lớp học 1', description: 'Mô tả lớp học 1' },
    { id: 2, name: 'Lớp học 2', description: 'Mô tả lớp học 2' },
    { id: 3, name: 'Lớp học 3', description: 'Mô tả lớp học 2' },
    { id: 4, name: 'Lớp học 4', description: 'Mô tả lớp học 2' },
  ];

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div>
        <CustomListItemButton color="inherit" onClick={openCreateClassPopup}>
          <AddIcon /> Tạo lớp học
        </CustomListItemButton>
        <CustomListItemButton color="inherit" onClick={openJoinClassPopup}>
          <PersonAddIcon /> Tham gia lớp học
        </CustomListItemButton>
      </div>
        
      {/* Thành phần chính */}
      <Grid container spacing={3} sx={{ marginTop: '20px',paddingBottom: '20px',  overflowY: 'auto', maxHeight: 'calc(100vh - 160px)' }}>
        {classList.map((classItem) => (
          <Grid item key={classItem.id} xs={12} sm={6} md={4}>
            <Paper elevation={3} style={{ padding: '16px', margin: '8px', height: '100%', position: 'relative' }} onClick={() => onClassClick(classItem.id)}>
           
              <Diversity3Icon fontSize="large" style={{ marginBottom: '8px' }}/>

              {/* Nội dung thông tin */}
              <div style={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  {classItem.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {classItem.description}
                </Typography>
                
              </div>
            </Paper>
          </Grid>
        ))}
      </Grid>
      
    {/* Popup Tạo lớp học */}
    <Dialog open={isCreateClassOpen} onClose={closeCreateClassPopup}>
        <DialogTitle variant="h5" > <AddIcon />Tạo lớp học</DialogTitle>
        <DialogContent>
        <Typography textAlign={'center'} margin={2}>
            - Vui lòng nhập vào các thông tin cơ bản của lớp học -
        </Typography>
          <TextField label="Tên lớp học" fullWidth sx={{ marginY: 2 }}/>
          <TextField label="Chủ đề" fullWidth sx={{ marginY: 2 }}/>
          <TextField label="Phòng" fullWidth sx={{ marginY: 2 }}/>
          <TextField label="Mô tả" fullWidth sx={{ marginY: 2 }}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCreateClassPopup} color="primary">
            Hủy
          </Button>
          <Button onClick={closeCreateClassPopup} color="primary">
            Tạo
          </Button>
        </DialogActions>
      </Dialog>

      {/* Popup Tham gia lớp học */}
      <Dialog open={isJoinClassOpen} onClose={closeJoinClassPopup}>
        <DialogTitle variant="h5" > <PersonAddIcon /> Tham gia lớp học </DialogTitle>
        <DialogContent>

        <Typography margin={2}> 

          Cách đăng nhập bằng mã lớp học<br/>
                - Sử dụng tài khoản được cấp phép<br/>
                - Sử dụng mã lớp học gồm 5-7 chữ cái hoặc số, không có dấu cách hoặc ký hiệu<br/>
          </Typography>
          <TextField label="Mã lớp học" fullWidth />
          
        </DialogContent>
        <DialogActions>
          <Button onClick={closeJoinClassPopup} color="primary">
            Hủy
          </Button>
          <Button onClick={closeJoinClassPopup} color="primary">
            Tham gia
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
};

export default MainHomepageTab;
