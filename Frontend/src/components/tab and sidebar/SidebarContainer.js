import {styled} from "@mui/material/styles";

const SidebarContainer = styled('div')(({ theme }) => ({
  width: 200,
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
  borderRight: `1px solid ${theme.palette.divider}`,
}));
export default SidebarContainer;