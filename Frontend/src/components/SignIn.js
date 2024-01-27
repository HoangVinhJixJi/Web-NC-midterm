import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Container, TextField, Typography, Paper, IconButton, InputAdornment, Grid } from '@mui/material';
import { Visibility, VisibilityOff, Facebook, Google } from '@mui/icons-material'; // Import icons

import api, { setAuthToken } from '../api/api';
import { useAuth as useAuthContext } from '../api/AuthContext';
import BannedInfoDialog from './dialogs/BannedInfoDialog';

const SignIn = () => {
  const { login, isLoggedIn, isAdmin } = useAuthContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [isOpenBannedInfoDialog, setIsOpenBannedInfoDialog] = useState(false);
  const [bannedInfo, setBannedInfo] = useState({});
  
  const googleURL = `${process.env.REACT_APP_PUBLIC_URL}/auth/google`;
  const facebookURL = `${process.env.REACT_APP_PUBLIC_URL}/auth/facebook`;
  
  useEffect(() => {
    console.log('public url', process.env.REACT_APP_PUBLIC_URL);
    console.log('client url', process.env.REACT_APP_CLIENT_URL);
    // Kiểm tra trạng thái đăng nhập
    if (isLoggedIn) {
      // Nếu đã đăng nhập, điều hướng về trang Home
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    }
  }, [isLoggedIn, isAdmin, navigate]);

  function handleCloseBannedInfoDialog() {
    setIsOpenBannedInfoDialog(false);
  }
  const handleSignIn = async (event) => {
    try {
      event.preventDefault();

      // Validate inputs
      if (!username || !password) {
        setMessage('Please enter both username and password.');
        return;
      }

      const u = {
        username: username,
        password: password,
      };

      console.log(u);

      // Call the login API from the backend
      const response = await api.post('/auth/login', u);

      // Handle API response
      if (response.data) {
        console.log(response.data);
        if (response.data.status === 403) {
          setMessage('Your account does not have this permission.');
        } else {
          const { userData, access_token } = response.data;

          // Save user information and token to localStorage or sessionStorage
          login(access_token, userData);

          // Redirect to the home page
          navigate('/home');
        }
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        switch (error.response.status) {
          case 400:
            setMessage('Wrong password. Try again!');
            break;
          case 401:
            setMessage('Account has not been activated. Please check the email to active your account.');
            break;
          case 403:
            if (error.response.data['message'] === 'Forbidden') {
              setMessage('Your account does not have this permission.');
            } else {
              setBannedInfo(error.response.data);
              setIsOpenBannedInfoDialog(true);
            }
            break;
          default:
            setMessage('Sign in failed. Try again!');
            console.error('Sign in failed:', error);
        }
      } else {
        setMessage('Sign in failed. Try again!');
        console.error('Sign in failed:', error);
      }
    }
  };

  useEffect(() => {
    // Lấy token từ URL
    const fetchUserData = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        console.log("token in : ", token);
        if (!token) {
          console.error('Error get token from URL: NO-TOKEN', Error);
          throw Error;
        }
        // Đặt token cho mọi yêu cầu
        setAuthToken(token);
        // Gọi API để lấy dữ liệu người dùng
        const response = await api.get('/auth/profile');
        console.log("response: ", response.data);
        // Lưu trữ token vào localStorage
        const userData = { fullName: response.data.fullName, avatar: response.data.avatar };
        login(token, userData);
        // Chuyển hướng người dùng đến trang chính
        navigate('/home')
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
    fetchUserData();
  }, []);
  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom style={{ color: '#2196F3', fontWeight: 'bold' }}>
          Sign In
        </Typography>
        <form>
          <TextField
            label="Username"
            type="text"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'} // Toggle visibility based on showPassword state
            variant="outlined"
            margin="normal"
            fullWidth
            required
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Typography variant="body2" mt={2}>
            <Link to="/forgot-password">Forgot Password?</Link>
          </Typography>
          <Button variant="contained" color="primary" fullWidth onClick={(e) => handleSignIn(e)} style={{ marginTop: '20px' }}>
            Sign In
          </Button>
          <Grid container spacing={1} style={{ marginTop: '10px' }}>
            <Grid item xs={6}>
              <Link to={googleURL}>
                <Button variant="outlined" fullWidth sx={{ color: '#DB4437' }}>
                  <Google /> Google
                </Button>
              </Link>
            </Grid>
            <Grid item xs={6}>
              <Link to={facebookURL}>
                <Button variant="outlined" fullWidth sx={{ color: '#3B5998' }}>
                  <Facebook /> Facebook
                </Button>
              </Link>
            </Grid>
          </Grid>
        </form>
        <Typography variant="body2" color="error" mt={2}>
          {message}
        </Typography>
        <Typography variant="body2" mt={2}>
          <Link to="/admin-signin">Login as Administrator</Link>
        </Typography>
        <Typography variant="body2" mt={2}>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </Typography>
      </Paper>
      <BannedInfoDialog
        bannedInfo={bannedInfo}
        isOpenDialog={isOpenBannedInfoDialog}
        onCloseDialogClick={handleCloseBannedInfoDialog}
      />
    </Container>
  );
};

export default SignIn;
