import React from 'react';
import { Typography, Button, Container, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

function Profile() {
    return (
        <Container maxWidth="xs">
            <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h5" gutterBottom>
                    Your Profile
                </Typography>
                <Typography variant="body1" paragraph>
                    Welcome to your profile page! Here you can view and update your personal information.
                </Typography>
                <div>
                    <Typography variant="subtitle1">Username: JohnDoe</Typography>
                    <Typography variant="subtitle1">Email: johndoe@example.com</Typography>
                    {/* Add more profile information here */}
                </div>
                <Button variant="contained" color="primary" component={Link} to="/profile/edit" style={{ marginTop: '20px' }}>
                    Edit Profile
                </Button>
            </Paper>
        </Container>
    );
}

export default Profile;
