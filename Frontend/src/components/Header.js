import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth as useAuthContext } from '../api/AuthContext';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Badge, List, ListItem, ListItemButton, Popover } from '@mui/material';
import api, {setAuthToken} from '../api/api';
import io from 'socket.io-client';

const pages = ['home', 'about', 'classroom'];

function Header() {
    
    const sampleNoti= [
        {
            id: '1',
            sendId: '123123',
            message : 'đây là thông báo về điểm: bạn được 10 điểm',
            status: 'unread',
            type: 'public',
        },
        {
            id: '2',
            sendId: '123123',
            message : 'đây là thông báo về điểm: bạn được 2 điểm',
            status: 'unread',
            type: 'public',
        },
        {
            id: '3',
            sendId: '123123',
            message : 'đây là thông báo về điểm: bạn được 3 điểm',
            status: 'unread',
            type: 'public',
        },
        {
            id: '4',
            sendId: '123123',
            message : 'đây là thông báo về điểm: bạn được 4 điểm',
            status: 'unread',
            type: 'public',
        },
        {
            id: '5',
            sendId: '123123',
            message : 'đây là thông báo về điểm: bạn được 5 điểm',
            status: 'unread',
            type: 'public',
        },
        {
            id: '6',
            sendId: '123123',
            message : 'đây là thông báo về điểm: bạn được 6 điểm',
            status: 'unread',
            type: 'public',
        },
        {
            id: '7',
            sendId: '123123',
            message : 'đây là thông báo về điểm: bạn được 7 điểm',
            status: 'unread',
            type: 'public',
        },
        {
            id: '8',
            sendId: '123123',
            message : 'đây là thông báo về điểm: bạn được 8 điểm',
            status: 'unread',
            type: 'public',
        },
    ]
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [anchorElNoti, setAnchorElNoti] = React.useState(null);
    const [isChange, setIsChange] = React.useState(false);
    const [notifications, setNotifications] = React.useState(sampleNoti); 
    
    const { isLoggedIn, user, logout } = useAuthContext();
    const [unreadCount, setUnreadCount] = React.useState(0);

    const navigate = useNavigate();
    React.useEffect(() => {
        // Kiểm tra nếu đã đăng nhập và có token
        if (isLoggedIn) {
            const token = localStorage.getItem('token');
    
            // Khởi tạo socket và kết nối
            const socket = io('http://localhost:5000', {
                auth: { token },
            });
    
            // Lắng nghe sự kiện 'public_grade' từ server
            socket.on('message', (data) => {
                console.log('******* New Notification socket io :', data);
                // Cập nhật số lượng thông báo chưa đọc
                setUnreadCount((prevCount) => prevCount + 1);
            });
    
            
    
            // Trả về hàm cleanup để ngắt kết nối socket khi component unmount hoặc người dùng đăng xuất
            return () => {
                socket.disconnect();
            };
        }
    
        // Người dùng không đăng nhập, không cần kết nối socket
        return () => {};
    }, [isLoggedIn]); 
    
    
    
    const handleOpenNoti = (event) => {
        setAnchorElNoti(event.currentTarget);
        setIsChange(true);
    };

    const handleClose = () => {
        setAnchorElNoti(null);
    };

    const handleNotificationClick = (notificationId) => {
        // Xử lý khi click vào một thông báo, ví dụ: chuyển hướng đến đường dẫn của nội dung thông báo
        console.log(`Redirect to notification ${notificationId}`);
        handleClose();
    };
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const handleLogout = () => {
        setAnchorElUser(null);
        // Thực hiện đăng xuất khi người dùng click vào nút Logout
        logout();
        navigate('/home');
    };
    // Fetch danh sách thông báo 
    const fetchNotiData = async () => {
        try {
          const token = localStorage.getItem('token');
          if(!token){
            console.error('Error fetching user data:', Error);
            navigate('/signin');
          }
          setAuthToken(token);
          // Gọi API để lấy dữ liệu danh sách toàn bộ các thông báo
          const response = await api.get(`/notifications/get/all`);
          console.log('List Notifications Data response.data: ', response.data);
          
          // kiểm tra thông tin học sinh
          const list = response.data.reduce((accumulator, obj) => {
            if (obj != null ) {
              accumulator.push(obj);
            }
            return accumulator;
          }, []);
          list.reverse();
          setNotifications(list);
          return list;
          
        } catch (error) {
          // Xử lý lỗi
          console.error('Error fetching user data:', error);
          
        }
    };
    React.useEffect( () => {
        if(isChange){
            const notiData = fetchNotiData();
            console.log('notiData: ', notiData);
            setIsChange(false);
        }
        
      }, [isChange]);

    console.log("list Notification: render:  ", notifications);
    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        LOGO
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page} onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center">
                                        <Link style={{ textDecoration: 'none', color: 'black' }} to={`/${page}`} >{page}</Link>

                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        LOGO
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page}
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                <Link style={{ textDecoration: 'none', color: 'white' }} to={`/${page}`} >{page}</Link>
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }} >
                        {isLoggedIn ? (
                            <>
                                <IconButton color="inherit" onClick={handleOpenNoti}>
                                    <Badge badgeContent={unreadCount} color='error'>
                                        <NotificationsIcon />
                                    </Badge>
                                </IconButton>
                                <Popover
                                    open={Boolean(anchorElNoti)}
                                    anchorEl={anchorElNoti}
                                    onClose={handleClose}
                                    anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                    }}
                                >
                                    <List sx={{maxWidth: '30vw',  maxHeight: '300px', overflowY: 'auto'}}>
                                    {notifications.map((notification, index) => (
                                        <ListItemButton
                                        key={notification._id}
                                        onClick={() => handleNotificationClick(notification._id)}
                                        sx={{ borderTop: index === 0 ? 'none':'1px solid #ccc'}}
                                        >
                                        <Typography
                                        style={{
                                            display: '-webkit-box',
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            WebkitLineClamp: 2, // Số dòng tối đa muốn hiển thị
                                            }}
                                        >{notification.message}</Typography>
                                        </ListItemButton>
                                        
                                    ))}
                                    </List>
                                </Popover>

                                <Tooltip title="Open settings">


                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Typography color={'white'} px={2}> {user.fullName} </Typography>
                                        <Avatar alt={user.fullName} src={user.avatar} />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    <Link style={{ textDecoration: 'none', color: 'black' }} to='/user/profile' >
                                        <MenuItem key='profile' onClick={handleCloseUserMenu}>
                                            <Typography textAlign="center" >
                                                Profile
                                            </Typography>
                                        </MenuItem>
                                    </Link>
                                    <Link style={{ textDecoration: 'none', color: 'black' }} to='/user/edit' >
                                        <MenuItem key='edit' onClick={handleCloseUserMenu}>
                                            <Typography textAlign="center" >
                                                Edit
                                            </Typography>
                                        </MenuItem>
                                    </Link>
                                    <Link style={{ textDecoration: 'none', color: 'black' }} to='/user/change-password' >
                                        <MenuItem key='change-password' onClick={handleCloseUserMenu}>
                                            <Typography textAlign="center" >
                                                Change Password
                                            </Typography>
                                        </MenuItem>
                                    </Link>
                                    <MenuItem key='logout' onClick={handleLogout}>
                                        <Typography textAlign="center" >
                                            Logout
                                        </Typography>
                                    </MenuItem>

                                </Menu>
                            </>
                        ) : (
                            <>
                                <Button variant='outlined' color='inherit' sx={{ mx: 2 }} >
                                    <Link to={'/signin'} style={{ textDecoration: 'none', color: 'white' }} >Sign In</Link>
                                </Button>
                                <Button variant='outlined' color='inherit' sx={{ mx: 2 }} >
                                    <Link to={'/signup'} style={{ textDecoration: 'none', color: 'white' }} >Sign Up</Link>
                                </Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default Header;
