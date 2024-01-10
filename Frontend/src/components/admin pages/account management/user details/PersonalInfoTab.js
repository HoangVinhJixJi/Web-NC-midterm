import {Avatar, Box, Container, Grid, IconButton, Typography} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import {useEffect, useState} from "react";
import api, {setAuthToken} from "../../../../api/api";
import {useNavigate} from "react-router-dom";

const NO_DATA = '<No Data>';
export default function PersonalInfoTab({ username }) {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async (username) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Error fetching user data:', Error);
          navigate('/admin-signin');
        }
        setAuthToken(token);
        const response = await api.get(`/admin/management/account/personal-info?username=${username}`);
        console.log('response.data: ', response.data);
        setUser(response.data);
      } catch (error) {
        console.log("Error fetching data: ", error);
      }
    };
    fetchData(username);
  }, []);

  const displayBirthday= (day)=>{
    if (!day) {
      return "";
    }
    const [year, month, date] = day.split('-');
    return `${date}/${month}/${year}`;
  }

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '55em' }}>
      <Grid container spacing={3} sx={{ marginTop: '20px',paddingBottom: '20px',  overflowY: 'auto', maxHeight: 'calc(100vh - 100px)' }}>
        <Grid item xs={12} md={3}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <Avatar alt={user.fullName ?? NO_DATA} src={user.avatar} sx={{ width: 150, height: 150, marginBottom: 2, border: '0.5px solid lightgray' }} />
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Box sx={{ textAlign: 'left' }}>
            <Typography variant="h5" gutterBottom>
              {user.fullName ?? NO_DATA}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <b>Email:</b> {user.email ?? NO_DATA}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <b>Birthday:</b> {user.birthday ? displayBirthday(user.birthday) : NO_DATA}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <b>Gender:</b> {user.gender ?? NO_DATA}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={1}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
            <IconButton color="gray" aria-label="settings">
              <SettingsIcon />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}