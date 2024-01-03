import Box from '@mui/material/Box';
import Sidebar from './Sidebar';
import MainContent from './tab and sidebar/MainContent';
import {Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import * as React from 'react';
import ClassListTab from './admin pages/class management/ClassListTab';
import ActiveClassListTab from './admin pages/class management/ActiveClassListTab';
import ArchivedClassListTab from './admin pages/class management/ArchivedClassListTab';
import ClassDetailsTab from './admin pages/class management/ClassDetailsTab';
import {useEffect, useState} from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InventoryIcon from '@mui/icons-material/Inventory';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ClassIcon from '@mui/icons-material/Class';
import Admin from './Admin';

const classListTabs = [
  { text: 'List', path: '/management/class/list', icon: <ClassIcon />, component: ClassListTab },
  { text: 'Active', path: '/management/class/active', icon: <CheckCircleIcon />, component: ActiveClassListTab },
  { text: 'Archived', path: '/management/class/archived',icon: <InventoryIcon />, component: ArchivedClassListTab },
  { text: 'Back', path: '/admin', icon: <KeyboardBackspaceIcon />, component: Admin }
];
export default function AdminClassManagement() {
  const [currentTab, setCurrentTab] = React.useState('/management/class/list');
  const [isFirstLoading, setIsFirstLoading] = useState(true);
  const [isBack, setIsBack] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isDetailsPage = location.pathname.includes("/details/");

  const handleTabChange = (path) => {
    setCurrentTab(path);
    navigate(path);
  };
  useEffect(() => {
    if (location.pathname === "/management/class") {
      if (isFirstLoading) {
        setIsFirstLoading(false);
      } else if (isBack) {
        setIsBack(false);
        navigate(currentTab);
      } else {
        setCurrentTab("/management/class/list");
      }
    } else {
      if (isDetailsPage) {
        setIsBack(true);
      } else {
        setCurrentTab(location.pathname);
      }
    }
  }, [location.pathname]);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      {!isDetailsPage &&
        <Sidebar
          title="Class Management"
          tabs={classListTabs}
          currentTab={currentTab}
          onTabChange={handleTabChange}
        />
      }

      {/* Main Content */}
      <MainContent>
        <Routes>
          <Route path="/" element={<ClassListTab />} />
          <Route path="/list" element={<ClassListTab />} />
          <Route path="/active" element={<ActiveClassListTab />} />
          <Route path="/archived" element={<ArchivedClassListTab />} />
          <Route path="/details/:classId/*" element={<ClassDetailsTab />} />
        </Routes>
      </MainContent>
    </Box>
  );
}