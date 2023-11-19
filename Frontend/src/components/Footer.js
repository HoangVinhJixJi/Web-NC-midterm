import React from 'react';
import { Container, Typography, Grid, List, ListItemButton, ListItemText, AppBar, Toolbar } from '@mui/material';

const Footer = () => {
    return (
        <AppBar position="static" color="primary">
            <Container>
                <Toolbar>
                    <Grid container spacing={2} justifyContent="center" alignItems="center" p={2}>
                        {/* Cột 1: Danh sách các mục trên navbar */}
                        <Grid item xs={12} md={8}>
                            <Typography variant="h6" gutterBottom>
                                FIT - HCMUS
                            </Typography>
                            <List>
                                <ListItemButton href='/home'>
                                    <ListItemText primary="Home" />
                                </ListItemButton>
                                <ListItemButton href='/about'>
                                    <ListItemText primary="About" />
                                </ListItemButton>
                                
                                {/* Thêm các mục khác theo cần thiết */}
                            </List>
                        </Grid>

                        {/* Cột 2: Thông tin liên hệ */}
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" gutterBottom>
                                Thông tin liên hệ
                            </Typography>
                            <Typography variant="body1">
                                Đại diện: Nguyễn Minh Trí
                            </Typography>
                            <Typography variant="body1">
                                Địa chỉ: KTX khu B ĐHQGHCM
                            </Typography>
                            <Typography variant="body1">
                                Số điện thoại: 0392129065
                            </Typography>
                            <Typography variant="body1">
                                Email: 20120602@student.hcmus.edu.vn
                            </Typography>
                        </Grid>
                    </Grid>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Footer;
