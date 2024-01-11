import {Route, Routes, useLocation, useNavigate, useParams} from 'react-router-dom';
import {useEffect, useRef, useState} from 'react';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import SchoolIcon from '@mui/icons-material/School';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import AdminAccountManagement from '../../AdminAccountManagement';
import AdminClassManagement from '../../AdminClassManagement';
import * as React from 'react';
import TeacherTab from './class details/TeacherTab';
import StudentTab from './class details/StudentTab';
import ClassInfoTab from './class details/ClassInfoTab';
import Box from '@mui/material/Box';
import Sidebar from '../../Sidebar';
import MainContent from '../../tab and sidebar/MainContent';

export default function ClassDetailsTab() {
  const { classId } = useParams();
  const [currentTab, setCurrentTab] = useState(`/management/class/details/${classId}/class-info`);
  const [isFirstLoading, setIsFirstLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const isFromAccountManagement = useRef(location.state ? location.state.from.includes('/class') : false);
  const backPath = isFromAccountManagement.current ? '/management/class' : '/management/account';
  const detailsTabs = [
    { text: 'Class Info', path: `/management/class/details/${classId}/class-info`, icon: <AccountBoxIcon />, component: ClassInfoTab },
    { text: 'Teacher', path: `/management/class/details/${classId}/teacher`, icon: <SupervisorAccountIcon />, component: TeacherTab },
    { text: 'Student', path: `/management/class/details/${classId}/student`, icon: <SchoolIcon />, component: StudentTab },
    { text: 'Back', path: backPath, icon: <KeyboardBackspaceIcon />, component: isFromAccountManagement.current ? AdminClassManagement : AdminAccountManagement }
  ];

  const handleTabChange = (path) => {
    setCurrentTab(path);
    navigate(path);
  };
  useEffect(() => {
    if (location.pathname === `/management/class/details/${classId}`) {
      if (isFirstLoading) {
        setIsFirstLoading(false);
      } else {
        setCurrentTab(`/management/class/details/${classId}/class-info`);
      }
    } else {
      setCurrentTab(location.pathname);
    }
  }, [location.pathname]);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Sidebar title="Class Details" tabs={detailsTabs} currentTab={currentTab} onTabChange={handleTabChange} />

      {/* Main Content */}
      <MainContent>
        <Routes>
          <Route path="/" element={<ClassInfoTab classId={classId} />} />
          <Route path="/class-info" element={<ClassInfoTab classId={classId} />} />
          <Route path="/teacher" element={<TeacherTab classId={classId} />} />
          <Route path="/student" element={<StudentTab classId={classId} />} />
        </Routes>
      </MainContent>
    </Box>
  );
}