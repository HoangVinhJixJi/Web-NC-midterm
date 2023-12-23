import {Avatar, Box, Container, Grid, IconButton, Typography} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import {useState} from "react";

export default function AccountInfoTab() {
  const [user, setUser] = useState({
    userId: "182130350350365060",
    avatar: "https://nhadepso.com/wp-content/uploads/2023/03/cap-nhat-99-hinh-anh-avatar-gau-cute-de-thuong-ngo-nghinh_1.jpg",
    fullName: "Nguyễn Văn Anh",
    status: "Pending",
    username: "nht2610",
    gender: "Male",
    birthday: "26/10/2002",
    password: "abc12345",
    email: "nguyenhuutruc26102002@gmail.com",
  });

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '55em' }}>
      <Grid container spacing={3} sx={{ marginTop: '20px',paddingBottom: '20px',  overflowY: 'auto', maxHeight: 'calc(100vh - 100px)' }}>
        <Grid item xs={12} md={3}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <Avatar alt={user.fullName} src={user.avatar} sx={{ width: 150, height: 150, marginBottom: 2, border: '0.5px solid lightgray' }} />
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Box sx={{ textAlign: 'left' }}>
            <Typography variant="h5" gutterBottom>
              {user.fullName}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <b>Email:</b> {user.email}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <b>Birthday:</b> {user.birthday}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <b>Gender:</b> {user.gender}
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