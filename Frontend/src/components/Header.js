import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Container, Box } from '@mui/material';

const Header = ({ isLoggedIn, handleSignOut }) => (
    <AppBar position="static" color="primary">
        <Container maxWidth="md">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Button color="inherit" component={Link} to={isLoggedIn ? '/home' : '/'}>
                        Home
                    </Button>
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    {isLoggedIn ? (
                        <>
                            <Button color="inherit" component={Link} to="/profile">
                                Profile
                            </Button>
                            <Button color="inherit" onClick={handleSignOut}>
                                Sign Out
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" component={Link} to="/signin">
                                Sign In
                            </Button>
                            <Button color="inherit" component={Link} to="/signup">
                                Sign Up
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </Container>
    </AppBar>
);

export default Header;
