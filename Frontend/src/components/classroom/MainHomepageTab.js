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
  CircularProgress,
  
} from '@mui/material';
import { Add as AddIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import api, {setAuthToken} from '../../api/api';
import BannedInfoDialog from '../dialogs/BannedInfoDialog';
import { useAuth as useAuthContext } from '../../api/AuthContext';
import ForbiddenDialog from '../dialogs/ForbiddenDialog';


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
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isOpenBannedInfoDialog, setIsOpenBannedInfoDialog] = useState(false);
  const [bannedInfo, setBannedInfo] = useState({});
  const [isOpenForbiddenDialog, setIsOpenForbiddenDialog] = useState(false);
  const { logout } = useAuthContext();

  const openCreateClassPopup = () => setCreateClassOpen(true);
  const closeCreateClassPopup = () => {
    setCreateClassOpen(false);
    setMessage('');
  };

  const openJoinClassPopup = () => setJoinClassOpen(true);
  const closeJoinClassPopup = () => {
    setJoinClassOpen(false);
    setMessage('');
  }
  const navigate = useNavigate();

  function handleCloseBannedInfoDialog() {
    setIsOpenBannedInfoDialog(false);
    logout();
    navigate('/home');
  }
  function handleCloseForbiddenDialog() {
    setIsOpenForbiddenDialog(false);
  }
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
      const list = response.data.reduce((accumulator, obj) => {
        if (obj !== null) {
          accumulator.push(obj);
        }
        return accumulator;
      }, []);

      setClassList(list);
      console.log('list: ', list);
      setIsLoading(false);
      
    } catch (error) {
      // Xử lý lỗi
      console.error('Error fetching user data:', error);

      // Nếu lỗi là do xác thực (ví dụ: token hết hạn), chuyển hướng về trang đăng nhập
      if (error.response) {
        switch (error.response.status) {
          case 401:
            navigate('/signin');
            break;
          case 403:
            if (error.response.data['message'] === 'Forbidden') {
              setIsOpenForbiddenDialog(true);
            } else {
              console.log('Im here');
              setBannedInfo(error.response.data);
              setIsOpenBannedInfoDialog(true);
            }
            break;
          default:
        }
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
        setMessage('Enter Class name!');
        // Hiển thị thông báo hoặc thực hiện xử lý khi tên lớp học không hợp lệ
        return;
      }
      setMessage('');
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
        setMessage('Enter Class code!');
        return;
      }
      setMessage('');
      console.log({classCode});
      
      // Lấy token từ localStorage
      const token = localStorage.getItem('token');
      if(!token){
        console.error('Error fetching user data:', Error);
        navigate('/signin');
      }
      
      // Đặt token cho mọi yêu cầu
      setAuthToken(token);
      const response = await api.post(`/classes/class-code/${classCode}`);
      
  
      //Kiểm tra trạng thái của yêu cầu
      if (response.status === 201 || response.status === 200) {
        // Nếu tạo mới lớp học thành công, có thể thực hiện các bước tiếp theo
        if(response.data.classInfo && response.data.joined){
          console.log(response.data);
          navigate(`/classroom/class-detail/${response.data.classInfo._id}`)
        }
      } else {
        // Xử lý khi có lỗi từ server
        console.error('Error creating class:', response.data);
        // Có thể hiển thị thông báo lỗi hoặc xử lý lỗi khác tùy ý
      }
    } catch (error) {
      setMessage('Invalid class code!');
      // Xử lý khi có lỗi không mong muốn
      console.error('Unexpected error:', error);
      // Có thể hiển thị thông báo lỗi hoặc xử lý lỗi khác tùy ý
    }
  };
 

  return (
    <>
    { isLoading ? 
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </div>
        :
    <Container sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div>
        <CustomListItemButton color="inherit" onClick={openCreateClassPopup}>
          <AddIcon /> Create Class
        </CustomListItemButton>
        <CustomListItemButton color="inherit" onClick={openJoinClassPopup}>
          <PersonAddIcon /> Join Class
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
        <DialogTitle variant="h5" > <AddIcon />Create Class</DialogTitle>
        <DialogContent>
        <Typography textAlign={'center'} margin={2}>
            - Please enter the basic information of the class  -
        </Typography>
          <TextField id='textfield-className' label="Class name*" fullWidth sx={{ marginY: 2 }}/>
          <Typography variant="body2" color="error">
            {message}
          </Typography>
          <TextField id='textfield-description' label="Description" fullWidth sx={{ marginY: 2 }}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCreateClassPopup} color="primary">
            Cancel
          </Button>
          <Button onClick={submitCreateClass} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Popup Tham gia lớp học */}
      <Dialog open={isJoinClassOpen} onClose={closeJoinClassPopup}>
        <DialogTitle variant="h5" > <PersonAddIcon />  Join Class </DialogTitle>
        <DialogContent>

        <Typography margin={2}> 

        Joining by Class Code<br/>
        - Use an authorized account<br/>
        - Use your class code<br/>
          </Typography>
          <TextField id='textfield-classCode' label="Class code" fullWidth />
          <Typography variant="body2" color="error" mt={2}>
            {message}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeJoinClassPopup} color="primary">
            Cancel
          </Button>
          <Button onClick={submitJoinClass} color="primary">
            Join
          </Button>
        </DialogActions>
      </Dialog>
      <BannedInfoDialog
        bannedInfo={bannedInfo}
        isOpenDialog={isOpenBannedInfoDialog}
        onCloseDialogClick={handleCloseBannedInfoDialog}
      />
      <ForbiddenDialog isOpenDialog={isOpenForbiddenDialog} onCloseDialogClick={handleCloseForbiddenDialog} />

    </Container>
    }</>
  );
};

export default MainHomepageTab;
