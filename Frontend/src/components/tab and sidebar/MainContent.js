import {styled} from "@mui/material/styles";

const MainContent = styled('div')(({ theme }) => ({
  width: `calc(100% - 200px)`,
  padding: theme.spacing(3),
}));
export default MainContent;