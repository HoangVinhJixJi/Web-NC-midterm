import React from 'react';
import {Routes, Route} from 'react-router-dom'
import {AuthProvider} from './api/AuthContext';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Home from './components/Home';
import Footer from './components/Footer';
import EditUser from './components/EditUser';
import ResponsiveAppBar from './components/ResponsiveAppBar';
import ChangePassword from './components/ChangePassword';
import Group from './components/Group';
import Profile from './components/Profile';

const App = () => {
 

  return (
    <div className='app'>
    <AuthProvider >
    <ResponsiveAppBar/>
    <div className='content' >
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/home" element={<Home />} />
        <Route path="/user/edit" element={<EditUser />} />
        <Route path="/user/change-password" element={<ChangePassword />} />
        <Route path="/group" element={<Group/>} />
        <Route path="/user/profile" element={<Profile />} />
      </Routes>
    </div>

    <Footer/>
    </AuthProvider>
    </div>

  );
};

export default App;
