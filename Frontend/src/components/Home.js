import React from 'react';
import { Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <Typography variant="h3" gutterBottom>
        Welcome to the Home Page
      </Typography>
      <Typography variant="body1" paragraph>
        Congratulations! You have successfully signed in. Explore the features and make the most out of your experience.
      </Typography>
      <Typography variant="body1" paragraph>
        Here are a few things you can do:
      </Typography>
      <ul>
        <li>
          <Typography variant="body1">
            Update your profile information.
          </Typography>
        </li>
        <li>
          <Typography variant="body1">
            Discover exciting features and functionalities.
          </Typography>
        </li>
        <li>
          <Typography variant="body1">
            Connect with other users in the community.
          </Typography>
        </li>
        <li>
          <Typography variant="body1">
            Customize your preferences to make this platform truly yours.
          </Typography>
        </li>
      </ul>
      <Button variant="contained" color="primary" component={Link} to="/profile" style={{ marginTop: '20px' }}>
        Update Profile
      </Button>
    </div>
  );
}

export default Home;
