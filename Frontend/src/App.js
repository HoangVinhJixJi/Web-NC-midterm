import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Container, CssBaseline, Box } from '@mui/material';
import { AuthProvider } from './api/AuthContext';
import Header from './components/Header'; 
import Footer from './components/Footer'; 
import Landing from './components/Landing';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Home from './components/Home';
import EditUser from './components/EditUser';
import ChangePassword from './components/ChangePassword';
import Group from './components/Group';
import Profile from './components/Profile';
import './App.css';
import ActivateAccount from "./components/ActivateAccount";
import ForgotPassword from "./components/ForgotPassword";
import Classroom from './components/Classroom';
import ClassDetailTab from './components/classroom/ClassDetailTab';

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
        <Header isLoggedIn={isLoggedIn} handleSignOut={handleSignOut}/>
        <Container component="main" maxWidth="md" sx={{ flexGrow: 1, mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signup/:pendingInviteId" element={<SignUp />} />
            <Route path="/account/activate" element={<ActivateAccount />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/user/edit" element={<EditUser />} />
            <Route path="/user/change-password" element={<ChangePassword />} />
            <Route path="/about" element={<Group/>} />
            <Route path="/user/profile" element={<Profile />} />
            <Route path="/classroom/*" element={<Classroom />} />
            
          </Routes>
        </Container>
        <Footer />
      </Box>
    </AuthProvider>
    
  );
};

export default App;
