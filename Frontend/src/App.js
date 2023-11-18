import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Container, Box } from '@mui/material';
import Landing from './components/Landing';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Home from './components/Home';
import Profile from './components/Profile';
import './App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleSignOut = () => {
    // Xử lý đăng xuất, có thể cần cập nhật trạng thái người dùng ở đây
    setIsLoggedIn(false);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Container maxWidth="md">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Button color="inherit" component={Link} to={isLoggedIn ? '/home' : '/'} sx={{ flexGrow: 1 }}>
                Home
              </Button>
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {isLoggedIn ? (
                <>
                  <Button color="inherit" component={Link} to="/profile">
                    Profile
                  </Button>
                  <Button color="inherit" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button color="inherit" component={Link} to="/signin">
                    Sign In
                  </Button>
                  <Button color="inherit" component={Link} to="/signup">
                    Sign Up
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="md" sx={{ marginTop: 4 }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
