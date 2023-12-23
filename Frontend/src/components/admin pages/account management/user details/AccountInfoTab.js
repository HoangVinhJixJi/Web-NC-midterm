import {Avatar, Box, Container, Grid, IconButton, Typography} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import {useState} from "react";
import RenderFunctions from "../table functions/RenderFunctions";

export default function PersonalInfoTab() {
  const { renderStatus } = RenderFunctions();
  const [user, setUser] = useState({
    userId: "182130350350365060",
    avatar: "https://nhadepso.com/wp-content/uploads/2023/03/cap-nhat-99-hinh-anh-avatar-gau-cute-de-thuong-ngo-nghinh_1.jpg",
    fullName: "Nguyễn Văn Anh",
    status: "Banned",
    username: "nht2610",
    gender: "Male",
    birthday: "26/10/2002",
    password: "abc12345",
    email: "nguyenhuutruc26102002@gmail.com",
    numOfDaysBanned: "1",
    bannedTime: "Sat Dec 23 2023 10:30:30 GMT+0700 (Indochina Time)",
    unbanTime: "Sat Dec 24 2023 10:30:30 GMT+0700 (Indochina Time)"
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
              <b>ID:</b> {user.userId}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <b>Username:</b> {user.username}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <b>Status:</b> {renderStatus(user.status)}
            </Typography>
            {user.status === "Banned" && (
              <>
                <Typography variant="subtitle1" gutterBottom>
                  <b>Number of days banned:</b> {user.numOfDaysBanned}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <b>Banned Time:</b> {user.bannedTime}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <b>Unban Time:</b> {user.unbanTime}
                </Typography>
              </>
            )}
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