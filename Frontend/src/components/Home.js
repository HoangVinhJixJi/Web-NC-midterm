import React from 'react';
import {
  Container,
  Typography,
} from '@mui/material';
const Home = () => {
  return (
    <div className='homepage' style={{
      backgroundImage: `url("https://unblast.com/wp-content/uploads/2021/01/Space-Background-Image-8.jpg")`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      height: '90vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Container>
        <Typography variant="h4" color={'white'}>
          Welcome to My Awesome Website
        </Typography>
        <Typography variant="subtitle1" color={'white'}>
          Explore our amazing features and services.
        </Typography>

      </Container>
    </div>
  );
};

export default Home;
