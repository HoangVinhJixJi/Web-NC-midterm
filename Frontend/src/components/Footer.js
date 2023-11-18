// Footer.js
import React from 'react';
import { AppBar, Toolbar, Typography, Container } from '@mui/material';

const Footer = () => {
    return (
        <AppBar position="static" color="primary">
            <Container maxWidth="md">
                <Toolbar>
                    <Typography variant="body2" color="inherit">
                        © 2023 FIT - HCMUS. All rights reserved.
                    </Typography>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Footer;
