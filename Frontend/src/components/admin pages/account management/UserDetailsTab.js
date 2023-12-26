import * as React from "react";
import {Route, Routes, useLocation, useNavigate, useParams} from "react-router-dom";
import Box from "@mui/material/Box";
import MainContent from "../../tab and sidebar/MainContent";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonalInfoTab from "./user details/PersonalInfoTab";
import AccountInfoTab from "./user details/AccountInfoTab";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import TeachingClassListTab from "./user details/TeachingClassListTab";
import JoinedClassListTab from "./user details/JoinedClassListTab";
import SchoolIcon from "@mui/icons-material/School";
import Sidebar from "../../Sidebar";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import AccountManagement from "../../AccountManagement";
import {useEffect, useState} from "react";

export default function UserDetailsTab() {
  const { username } = useParams();
  const [currentTab, setCurrentTab] = React.useState(`/management/account/details/${username}/personal-info`);
  const [isFirstLoading, setIsFirstLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const detailsTabs = [
    { text: 'Personal Info', path: `/management/account/details/${username}/personal-info`, icon: <AccountBoxIcon />, component: PersonalInfoTab },
    { text: 'Account Info', path: `/management/account/details/${username}/account-info`, icon: <AdminPanelSettingsIcon />, component: AccountInfoTab },
    { text: 'Teaching Class', path: `/management/account/details/${username}/teaching-class`, icon: <SupervisorAccountIcon />, component: TeachingClassListTab },
    { text: 'Joined Class', path: `/management/account/details/${username}/joined-class`, icon: <SchoolIcon />, component: JoinedClassListTab },
    { text: 'Back', path: '/management/account', icon: <KeyboardBackspaceIcon />, component: AccountManagement }
  ];

  const handleTabChange = (path) => {
    setCurrentTab(path);
    navigate(path);
  };
  useEffect(() => {
    if (location.pathname === `/management/account/details/${username}`) {
      if (isFirstLoading) {
        setIsFirstLoading(false);
      } else {
        setCurrentTab(`/management/account/details/${username}/personal-info`);
      }
    } else {
      setCurrentTab(location.pathname);
    }
  }, [location.pathname]);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Sidebar title="User Details" tabs={detailsTabs} currentTab={currentTab} onTabChange={handleTabChange} />

      {/* Main Content */}
      <MainContent>
        <Routes>
          <Route path="/" element={<PersonalInfoTab username={username} />} />
          <Route path="/personal-info" element={<PersonalInfoTab username={username} />} />
          <Route path="/account-info" element={<AccountInfoTab username={username} />} />
          <Route path="/teaching-class" element={<TeachingClassListTab />} />
          <Route path="/joined-class" element={<JoinedClassListTab />} />
        </Routes>
      </MainContent>
    </Box>
  );
}