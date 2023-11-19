import React from 'react';
import { Container, Typography, Grid, List, ListItemButton, ListItemText } from '@mui/material';


const Footer = () => {
  return (
    <div className='footer' style={{ marginTop: '50px', backgroundColor: '#3333'}}>
      <Container >
        <Grid container spacing={2}>
          {/* Cột 1: Danh sách các mục trên navbar */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Navbar Items
            </Typography>
            <List>
              <ListItemButton href='/home'>
                <ListItemText primary="Home"  />
              </ListItemButton>
              <ListItemButton  href='/signin'>
                <ListItemText primary="About" />
              </ListItemButton>
              <ListItemButton  href='/signup'>
                <ListItemText primary="Services" />
              </ListItemButton>
              {/* Thêm các mục khác theo cần thiết */}
            </List>
          </Grid>

          {/* Cột 2: Thông tin liên hệ */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            <Typography variant="body1">
              Address: 123 Main Street, Cityville
            </Typography>
            <Typography variant="body1">
              Phone: (123) 456-7890
            </Typography>
            <Typography variant="body1">
              Email: info@example.com
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Footer;
