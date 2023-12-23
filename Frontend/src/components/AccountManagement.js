import * as React from "react";
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import Box from "@mui/material/Box";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import BlockIcon from '@mui/icons-material/Block';
import AccountListTab from "./account management/AccountListTab";
import PendingAccountListTab from "./account management/PendingAccountListTab";
import ActivatedAccountListTab from "./account management/ActivatedAccountListTab";
import BannedAccountListTab from "./account management/BannedAccountListTab";
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import MainContent from "./tab and sidebar/MainContent";
import UserDetailsTab from "./account management/UserDetailsTab";
import Sidebar from "./Sidebar";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import Admin from "./Admin";

const accountListTabs = [
  { text: 'List', path: '/management/account/list', icon: <ManageAccountsIcon />, component: AccountListTab },
  { text: 'Pending', path: '/management/account/pending', icon: <PendingOutlinedIcon />, component: PendingAccountListTab },
  { text: 'Active', path: '/management/account/active', icon: <CheckCircleOutlinedIcon />, component: ActivatedAccountListTab },
  { text: 'Banned', path: '/management/account/banned',icon: <BlockIcon />, component: BannedAccountListTab },
  { text: 'Back', path: '/admin', icon: <KeyboardBackspaceIcon />, component: Admin }
];
export default function AccountManagement() {
  const [currentTab, setCurrentTab] = React.useState('/management/account/list');
  const navigate = useNavigate();
  const location = useLocation();
  const isDetailsPage = location.pathname.includes("/details/");

  const handleTabChange = (path) => {
    setCurrentTab(path);
    navigate(path);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      {!isDetailsPage &&
        <Sidebar
          title="Account Management"
          tabs={accountListTabs}
          currentTab={currentTab}
          onTabChange={handleTabChange}
        />
      }

      {/* Main Content */}
      <MainContent>
        <Routes>
          <Route path="/" element={<AccountListTab />} />
          <Route path="/list" element={<AccountListTab />} />
          <Route path="/pending" element={<PendingAccountListTab />} />
          <Route path="/active" element={<ActivatedAccountListTab />} />
          <Route path="/banned" element={<BannedAccountListTab />} />
          <Route path="/details/:username/*" element={<UserDetailsTab />} />
        </Routes>
      </MainContent>
    </Box>
  );
}