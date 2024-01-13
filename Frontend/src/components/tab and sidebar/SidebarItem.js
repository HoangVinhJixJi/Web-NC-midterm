import {styled} from "@mui/material/styles";

const SidebarItem = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(2),
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    cursor: 'pointer',
  },
}));
export default SidebarItem;