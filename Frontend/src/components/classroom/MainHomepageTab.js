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
import api, {setAuthToken} from '../../api/api';


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
  const [classList, setClassList] = useState([]);

  const openCreateClassPopup = () => setCreateClassOpen(true);
  const closeCreateClassPopup = () => setCreateClassOpen(false);

  const openJoinClassPopup = () => setJoinClassOpen(true);
  const closeJoinClassPopup = () => setJoinClassOpen(false);
  const navigate = useNavigate();


  const fetchClassData = async () => {
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
      const response = await api.get('/classes/');
      //Lưu thông tin toàn bộ lớp học vào state
      setClassList(response.data);
      console.log('response.data: ', response.data);
      
      
    } catch (error) {
      // Xử lý lỗi
      console.error('Error fetching user data:', error);

      // Nếu lỗi là do xác thực (ví dụ: token hết hạn), chuyển hướng về trang đăng nhập
      if (error.response && error.response.status === 401) {
        navigate('/signin');
      }
    }
  };

  useEffect(() => {
    // Gọi hàm lấy dữ liệu người dùng
    fetchClassData();
  }, []); 

  const submitCreateClass = async () => {
    try {
      // Lấy giá trị từ các trường nhập liệu
      const className = document.getElementById('textfield-className').value;
      const description = document.getElementById('textfield-description').value;
      
      // Kiểm tra xem các trường bắt buộc đã được điền đầy đủ hay chưa
      if (!className) {
        console.log('CHưa nhập class Name');
        // Hiển thị thông báo hoặc thực hiện xử lý khi tên lớp học không hợp lệ
        return;
      }
      console.log({className}, {description});
      
      // Lấy token từ localStorage
      const token = localStorage.getItem('token');
      if(!token){
        console.error('Error fetching user data:', Error);
        navigate('/signin');
      }
      
      // Đặt token cho mọi yêu cầu
      setAuthToken(token);
      const response = await api.post('/classes/create', {
        className,
        description,
      });
      console.log("response.data: ", response.data);
  
      //Kiểm tra trạng thái của yêu cầu
      if (response.status === 201 || response.status === 200) {
        // Nếu tạo mới lớp học thành công, có thể thực hiện các bước tiếp theo
        fetchClassData();
        closeCreateClassPopup();
        // Thực hiện các bước tiếp theo tùy thuộc vào yêu cầu của bạn
      } else {
        // Xử lý khi có lỗi từ server
        console.error('Error creating class:', response.data);
        // Có thể hiển thị thông báo lỗi hoặc xử lý lỗi khác tùy ý
      }
    } catch (error) {
      // Xử lý khi có lỗi không mong muốn
      console.error('Unexpected error:', error);
      // Có thể hiển thị thông báo lỗi hoặc xử lý lỗi khác tùy ý
    }
  };

  const submitJoinClass = async () => {
    try {
      // Lấy giá trị từ các trường nhập liệu
      const classCode = document.getElementById('textfield-classCode').value;
      if (!classCode) {
        console.log('CHưa nhập class Code');
        // Hiển thị thông báo hoặc thực hiện xử lý khi tên lớp học không hợp lệ
        return;
      }
      console.log({classCode});
      
      // Lấy token từ localStorage
      const token = localStorage.getItem('token');
      if(!token){
        console.error('Error fetching user data:', Error);
        navigate('/signin');
      }
      
      // Đặt token cho mọi yêu cầu
      setAuthToken(token);
      const response = await api.post(`/classes/join/${classCode}`,{
        classCode
      });
      console.log("response.data: ", response.data);
  
      //Kiểm tra trạng thái của yêu cầu
      if (response.status === 201 || response.status === 200) {
        // Nếu tạo mới lớp học thành công, có thể thực hiện các bước tiếp theo
        fetchClassData();
        closeCreateClassPopup();
        // Thực hiện các bước tiếp theo tùy thuộc vào yêu cầu của bạn
      } else {
        // Xử lý khi có lỗi từ server
        console.error('Error creating class:', response.data);
        // Có thể hiển thị thông báo lỗi hoặc xử lý lỗi khác tùy ý
      }
    } catch (error) {
      // Xử lý khi có lỗi không mong muốn
      console.error('Unexpected error:', error);
      // Có thể hiển thị thông báo lỗi hoặc xử lý lỗi khác tùy ý
    }
  };
 

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
          <Grid item key={classItem._id} xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ padding: '16px', margin: '8px', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} onClick={() => onClassClick(classItem._id)}>
           
              <Diversity3Icon fontSize="large" color='primary' sx={{ marginBottom: '8px'}}/>

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
      
    {/* Popup Tạo lớp học */}
    <Dialog open={isCreateClassOpen} onClose={closeCreateClassPopup}>
        <DialogTitle variant="h5" > <AddIcon />Tạo lớp học</DialogTitle>
        <DialogContent>
        <Typography textAlign={'center'} margin={2}>
            - Vui lòng nhập vào các thông tin cơ bản của lớp học -
        </Typography>
          <TextField id='textfield-className' label="Tên lớp học" fullWidth sx={{ marginY: 2 }}/>
          {/* <TextField label="Chủ đề" fullWidth sx={{ marginY: 2 }}/>
          <TextField label="Phòng" fullWidth sx={{ marginY: 2 }}/> */}
          <TextField id='textfield-description' label="Mô tả" fullWidth sx={{ marginY: 2 }}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCreateClassPopup} color="primary">
            Hủy
          </Button>
          <Button onClick={submitCreateClass} color="primary">
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
          <TextField id='textfield-classCode' label="Mã lớp học" fullWidth />
          
        </DialogContent>
        <DialogActions>
          <Button onClick={closeJoinClassPopup} color="primary">
            Hủy
          </Button>
          <Button onClick={submitJoinClass} color="primary">
            Tham gia
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
};

export default MainHomepageTab;
