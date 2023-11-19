import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container, CssBaseline, Box } from '@mui/material';
import Header from './components/Header'; // Update import path
import Footer from './components/Footer'; // Update import path
import Landing from './components/Landing';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Home from './components/Home';
import Profile from './components/Profile';
import EditUser from './components/EditUser';
import { AuthProvider } from './api/AuthContext';
import './App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSignOut = () => {
    // Handle sign out logic
    setIsLoggedIn(false);
  };

  return (
    <AuthProvider>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <CssBaseline />
        <Header isLoggedIn={isLoggedIn} handleSignOut={handleSignOut} />
        <Container component="main" maxWidth="md" sx={{ flexGrow: 1, mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/users/profile" element={<EditUser />} />
          </Routes>
        </Container>
        <Footer />
      </Box>
    </AuthProvider>
    
  );
};

export default App;
