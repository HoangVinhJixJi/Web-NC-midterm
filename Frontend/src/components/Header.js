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
import api, { setAuthToken } from '../api/api';
import io from 'socket.io-client';

const pages = ['home', 'about', 'classroom'];
const adminPages = ['admin', 'management'];
const managements = ['account', 'class'];

function Header() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [anchorElManagement, setAnchorElManagement] = React.useState(null);
    const [anchorElNoti, setAnchorElNoti] = React.useState(null);
    const [isChange, setIsChange] = React.useState(false);
    const [notifications, setNotifications] = React.useState([]);
    const [classId, setClassId] = React.useState(null);
    const [assignmentId, setAssignmentId] = React.useState(null);
    const [gradeReviewId, setGradeReviewId] = React.useState(null);
    const [message, setMessage] = React.useState('');
    const [unreadCount, setUnreadCount] = React.useState(0);
    const { isLoggedIn, isAdmin, user, logout } = useAuthContext();
    const navigate = useNavigate();
    //console.log(isAdmin);
    // Fetch danh sách thông báo 
    const fetchNotiData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Error fetching user data:', Error);
                navigate('/signin');
            }
            setAuthToken(token);
            // Gọi API để lấy dữ liệu danh sách toàn bộ các thông báo
            const response = await api.get(`/notifications/get/receive`);
            console.log('List Notifications Data response.data: ', response.data);

            // kiểm tra thông tin học sinh
            const list = response.data.reduce((accumulator, obj) => {
                if (obj != null) {
                    const match = obj.message.match(/classId: (.+),assignmentId: (.+),gradeReviewId: (.+),message: (.+)/);
                    if (match) {
                        setClassId(match[1]);
                        setAssignmentId(match[2]);
                        setGradeReviewId(match[3])
                        setMessage(match[4]);

                        console.log('classId:', match[1]);
                        console.log('assignmentId:', match[2]);
                        console.log('gradeReviewId:', match[3]);
                        console.log('message:', match[4]);
                        obj.classId = match[1];
                        obj.assignmentId = match[2];
                        obj.gradeReviewId = match[3];
                        obj.message = match[4];
                        // Sử dụng classId, assignmentId, và message ở đây
                    } else {
                        console.log('Không tìm thấy thông tin cần thiết trong message hoặc định dạng không đúng.');

                    }
                    accumulator.push(obj);
                }
                return accumulator;
            }, []);
            list.reverse();
            setNotifications(list);
            setUnreadCount(list.filter((noti) => { return noti.status === 'unread' }).length);
            return list;

        } catch (error) {
            // Xử lý lỗi
            console.error('Error fetching user data:', error);

        }
    };
    // update status noti
    const updateNotiStatus = async (notiId) => {
        try {
            const data = {
                notificationId: notiId,
                status: 'read',
            }
            const response = await api.post(`/notifications/update/status`, data);
            console.log('List Notifications Data response.data: ', response.data);

            return response.data;
        } catch (error) {
            // Xử lý lỗi
            console.error('Error fetching user data:', error);

        }
    };

    React.useEffect(() => {
        // Kiểm tra nếu đã đăng nhập và có token
        if (isLoggedIn) {
            const token = localStorage.getItem('token');

            // Khởi tạo socket và kết nối
            const socket = io('http://localhost:5000', {
                auth: { token },
            });
            // const socket = io('https://ptudwnc-final-project.vercel.app', {
            //     auth: { token },
            // });
            console.log('dã đăng nhập');

            // Lắng nghe sự kiện 'public_grade' từ server
            socket.on('public_grade', (data) => {
                console.log('******* New Notification public_grade socket io :', data);
                // Cập nhật số lượng thông báo chưa đọc
                setUnreadCount((prevCount) => prevCount + 1);
            });
            socket.on('request_gradeReview', (data) => {
                console.log('******* New Notification request_gradeReview socket io :', data);
                // Cập nhật số lượng thông báo chưa đọc
                setUnreadCount((prevCount) => prevCount + 1);
            });
            socket.on('teacher_comment_gradeReview', (data) => {
                console.log('******* New Notification teacher_comment_gradeReview socket io :', data);
                // Cập nhật số lượng thông báo chưa đọc
                setUnreadCount((prevCount) => prevCount + 1);
            });
            socket.on('fellow_teacher_comment_gradeReview', (data) => {
                console.log('******* New Notification fellow_teacher_comment_gradeReview socket io :', data);
                // Cập nhật số lượng thông báo chưa đọc
                setUnreadCount((prevCount) => prevCount + 1);
            });
            socket.on('student_comment_gradeReview', (data) => {
                console.log('******* New Notification student_comment_gradeReview socket io :', data);
                // Cập nhật số lượng thông báo chưa đọc
                setUnreadCount((prevCount) => prevCount + 1);
            });
            socket.on('mark_final_decision_gradeReview', (data) => {
                console.log('******* New Notification mark_final_decision_gradeReview socket io :', data);
                // Cập nhật số lượng thông báo chưa đọc
                setUnreadCount((prevCount) => prevCount + 1);
            });
            socket.on('fellow_mark_final_decision_gradeReview', (data) => {
                console.log('******* New Notification fellow_mark_final_decision_gradeReview socket io :', data);
                // Cập nhật số lượng thông báo chưa đọc
                setUnreadCount((prevCount) => prevCount + 1);
            });
            //
            // socket.on('message', (data) => {
            //     console.log('******* New Notification socket io :', data);
            //     // Cập nhật số lượng thông báo chưa đọc
            //     setUnreadCount((prevCount) => prevCount + 1);
            // });

            const notiData = fetchNotiData();
            notiData.then((result) => {
                console.log("result: ", result);
            });

            // Trả về hàm cleanup để ngắt kết nối socket khi component unmount hoặc người dùng đăng xuất
            return () => {
                socket.disconnect();
            };
        }

        // Người dùng không đăng nhập, không cần kết nối socket
        return () => { };
    }, [isLoggedIn]);


    function notificationsLabel(count) {
        if (count === 0) {
            return 'no notifications';
        }
        if (count > 99) {
            return 'more than 99 notifications';
        }
        return `${count} notifications`;
    }
    const handleOpenNoti = (event) => {
        setAnchorElNoti(event.currentTarget);
        setIsChange(true);
        const notiData = fetchNotiData();
        notiData.then((result) => {
            console.log("result: ", result);
        });
    };

    const handleClose = () => {
        setAnchorElNoti(null);
        setIsChange(false);
    };

    const handleNotificationClick = async (notificationId) => {
        // Xử lý khi click vào một thông báo, chuyển hướng đến đường dẫn của nội dung thông báo
        console.log(`Redirect to notification ${notificationId}`);
        //Thông tin notification
        const noti = notifications.filter((noti) => noti._id === notificationId)[0];
        console.log(noti);
        //Cập nhật status notification
        if (noti.status === 'unread') {
            const updated = await updateNotiStatus(notificationId);
            if (updated && updated.status !== 'read') {
                setUnreadCount((prevCount) => prevCount - 1);
            }
        }


        //Navigate
        const timestamp = new Date().getTime();
        if (noti.type === 'public_grade') {
            console.log('public_grade');
            navigate(`/classroom/class-detail/${noti.classId}/assignment-detail/${noti.assignmentId}?timestamp=${timestamp}`, { state: { isTeaching: false } });
        }
        else if (noti.type === 'request_gradeReview') {
            console.log('request_gradeReview');
            navigate(`/classroom/class-detail/${noti.classId}/assignment-detail/${noti.assignmentId}/gradeReview-detail/${noti.gradeReviewId}`, { state: { isTeaching: true } });
        }
        else if (noti.type === 'teacher_comment_gradeReview') {
            console.log('teacher_comment_gradeReview');
            navigate(`/classroom/class-detail/${noti.classId}/assignment-detail/${noti.assignmentId}/gradeReview-detail/${noti.gradeReviewId}`, { state: { isTeaching: false } });
        }
        else if (noti.type === 'fellow_teacher_comment_gradeReview') {
            console.log('fellow_teacher_comment_gradeReview');
            navigate(`/classroom/class-detail/${noti.classId}/assignment-detail/${noti.assignmentId}/gradeReview-detail/${noti.gradeReviewId}`, { state: { isTeaching: true } });
        }
        else if (noti.type === 'student_comment_gradeReview') {
            console.log('student_comment_gradeReview');
            navigate(`/classroom/class-detail/${noti.classId}/assignment-detail/${noti.assignmentId}/gradeReview-detail/${noti.gradeReviewId}`, { state: { isTeaching: true } });
        }
        else if (noti.type === 'mark_final_decision_gradeReview') {
            console.log('mark_final_decision_gradeReview');
            navigate(`/classroom/class-detail/${noti.classId}/assignment-detail/${noti.assignmentId}/gradeReview-detail/${noti.gradeReviewId}`, { state: { isTeaching: false } });
        }
        else if (noti.type === 'fellow_mark_final_decision_gradeReview') {
            console.log('fellow_mark_final_decision_gradeReview');
            navigate(`/classroom/class-detail/${noti.classId}/assignment-detail/${noti.assignmentId}/gradeReview-detail/${noti.gradeReviewId}`, { state: { isTeaching: true } });
        }
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
    function handleCloseManagementMenu() {
        setAnchorElManagement(null);
    }
    function handleOpenManagementMenu(event) {
        setAnchorElManagement(event.currentTarget);
    }
    function renderTabsOnHeader(tabNames) {
        return tabNames.map((page) => (
            page === 'management' ? (
                <>
                    <Button
                        key={page}
                        onClick={handleOpenManagementMenu}
                        sx={{ my: 2, color: 'white', display: 'block' }}
                    >
                        {page}
                    </Button>
                    <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElManagement}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElManagement)}
                        onClose={handleCloseManagementMenu}
                    >
                        {managements.map((type) => (
                            <Link style={{ textDecoration: 'none', color: 'black' }} to={`/management/${type}`} >
                                <MenuItem key={type} onClick={handleCloseManagementMenu}>
                                    <Typography textAlign="center" >
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </Typography>
                                </MenuItem>
                            </Link>
                        ))}
                    </Menu>
                </>
            )
                : (<Button
                    key={page}
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                >
                    <Link style={{ textDecoration: 'none', color: 'white' }} to={`/${page}`} >{page}</Link>
                </Button>)
        ));
    }

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
                        {isAdmin ? renderTabsOnHeader(adminPages) : renderTabsOnHeader(pages)}
                    </Box>

                    <Box sx={{ flexGrow: 0 }} >
                        {isLoggedIn ? (
                            <>
                                <IconButton color="inherit" onClick={handleOpenNoti} aria-label={notificationsLabel(100)}>
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
                                    <List sx={{ maxWidth: '30vw', maxHeight: '300px', overflowY: 'auto' }}>
                                        {notifications && notifications.length === 0 ?
                                            <ListItemButton>
                                                <Typography
                                                    style={{
                                                        display: '-webkit-box',
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                        WebkitLineClamp: 2, // Số dòng tối đa muốn hiển thị
                                                    }}
                                                >Không có thông báo!</Typography>
                                            </ListItemButton>
                                            :
                                            notifications.map((notification, index) => (
                                                <ListItemButton
                                                    key={notification._id}
                                                    onClick={() => handleNotificationClick(notification._id)}
                                                    sx={{ borderTop: index === 0 ? 'none' : '1px solid #ccc' }}
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
                                            ))
                                        }
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
