import Typography from "@mui/material/Typography";
import SidebarItem from "./tab and sidebar/SidebarItem";
import {ListItemIcon, Stack} from "@mui/material";
import SidebarContainer from "./tab and sidebar/SidebarContainer";
import * as React from "react";
import {useTheme} from "@mui/material/styles";

export default function Sidebar({ title, tabs, onTabChange, currentTab }) {
  const theme = useTheme();

  return (
    <SidebarContainer>
      <Typography variant="h6" sx={{ marginBottom: 2, color: theme.palette.primary.main }}>
        {title}
      </Typography>
      {tabs.map(({ text, path, icon }, index) => (
        <SidebarItem
          key={text}
          onClick={() => onTabChange(path)}
          sx={{
            color: currentTab === path ? theme.palette.primary.main : 'inherit',
          }}
        >
          <Stack direction="row" alignItems="center">
            <ListItemIcon direction="row" alignItems="center" sx={{minWidth: "30px", color: "inherit"}}>
              {icon}
            </ListItemIcon>
            {text}
          </Stack>
        </SidebarItem>
      ))}
    </SidebarContainer>
  );
}