import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import SchoolIcon from '@mui/icons-material/School';

import MainHomepageTab from './classroom/MainHomepageTab';
import TeachingTab from './classroom/TeachingTab';
import JoinedClassTab from './classroom/JoinedClassTab';
import ClassDetailTab from './classroom/ClassDetailTab';
import SidebarContainer from "./tab and sidebar/SidebarContainer";
import SidebarItem from "./tab and sidebar/SidebarItem";
import MainContent from "./tab and sidebar/MainContent";
import GradeReviewDetail from './classroom/GradeReviewDetail';

import { Container } from '@mui/material';
import NotificationJoinClass from './classroom/NotificationJoinClass';
import AssignmentDetail from './classroom/AssignmentDetail';
import {useAuth as useAuthContext} from '../api/AuthContext';
import Forbidden from './Forbidden';



const Classroom = () => {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = React.useState('/classroom/home');
  const navigate = useNavigate();
  const { isLoggedIn, isAdmin } = useAuthContext();
  const handleTabChange = (path) => {
    setCurrentTab(path);
    navigate(path)
  };

  const handleClassClick = (classId) => {
    // Chuyển hướng đến trang chi tiết lớp học
    navigate(`/classroom/class-detail/${classId}`);
  };
  const handleReturnAssignmentList = (classId) => {
    // Chuyển hướng đến trang chi tiết lớp học
    navigate(`/classroom/class-detail/${classId}`);
  };

  return (
    <>
      {!isAdmin ?
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          {/* Sidebar */}
          <SidebarContainer>
            <Typography variant="h6" sx={{ marginBottom: 2, color: theme.palette.primary.main }}>
              Class Room
            </Typography>
            {[
              { text: 'Home', path: '/classroom/home', icon: <HomeIcon />, component: MainHomepageTab },
              { text: 'Teaching', path: '/classroom/teaching',icon: <SupervisorAccountIcon />, component: TeachingTab },
              { text: 'Joined Class', path: '/classroom/joined-class',icon: <SchoolIcon />, component: JoinedClassTab },
            ].map(({ text, path, icon }, index) => (

              <SidebarItem
                key={text}
                onClick={() => handleTabChange(path)}
                sx={{
                  color: currentTab === path ? theme.palette.primary.main : 'inherit',
                }}
              >

               {icon} {text}

              </SidebarItem>
            ))}
          </SidebarContainer>

          {/* Main Content */}
          <MainContent>
            <Routes>
              <Route path="/" element={<MainHomepageTab onClassClick={handleClassClick} />} />
              <Route path="/home" element={<MainHomepageTab onClassClick={handleClassClick} />} />
              <Route path="/teaching" element={<TeachingTab onClassClick={handleClassClick} />} />
              <Route path="/joined-class" element={<JoinedClassTab onClassClick={handleClassClick}/>} />
              <Route path="/class-detail/:classId" element={<ClassDetailTab />} />
              <Route path="/class-code/:classCode" element={<NotificationJoinClass />} />
              <Route path="/class-detail/:classId/assignment-detail/:assignmentId" 
                    element={<AssignmentDetail />} />
              <Route path="/class-detail/:classId/assignment-detail/:assignmentId/gradeReview-detail/:gradeReviewId" 
                    element={<GradeReviewDetail />} />
            </Routes>

          </MainContent>
        </Box>
        :
        <Forbidden />
      }
    </>
  );
};

export default Classroom;
