import {useTheme} from "@mui/material/styles";
import * as React from "react";
import {Route, Routes, useNavigate} from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import BlockIcon from '@mui/icons-material/Block';
import AccountListTab from "./account management/AccountListTab";
import PendingAccountListTab from "./account management/PendingAccountListTab";
import ActivatedAccountListTab from "./account management/ActivatedAccountListTab";
import BannedAccountListTab from "./account management/BannedAccountListTab";
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import SidebarContainer from "./tab and sidebar/SidebarContainer";
import SidebarItem from "./tab and sidebar/SidebarItem";
import MainContent from "./tab and sidebar/MainContent";
import UserDetails from "./account management/UserDetails";

export default function AccountManagement() {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = React.useState('/management/account/list');
  const navigate = useNavigate();
  const handleTabChange = (path) => {
    setCurrentTab(path);
    navigate(path);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <SidebarContainer>
        <Typography variant="h6" sx={{ marginBottom: 2, color: theme.palette.primary.main }}>
          Account Management
        </Typography>
        {[
          { text: 'List', path: '/management/account/list', icon: <ManageAccountsIcon />, component: AccountListTab },
          { text: 'Pending', path: '/management/account/pending', icon: <PendingOutlinedIcon />, component: PendingAccountListTab },
          { text: 'Active', path: '/management/account/active', icon: <CheckCircleOutlinedIcon />, component: ActivatedAccountListTab },
          { text: 'Banned', path: '/management/account/banned',icon: <BlockIcon />, component: BannedAccountListTab },
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
          <Route path="/" element={<AccountListTab />} />
          <Route path="/list" element={<AccountListTab />} />
          <Route path="pending" element={<PendingAccountListTab />} />
          <Route path="/active" element={<ActivatedAccountListTab />} />
          <Route path="/banned" element={<BannedAccountListTab />} />
          <Route path="details/:username" element={<UserDetails />} />
        </Routes>
      </MainContent>
    </Box>
  );
}