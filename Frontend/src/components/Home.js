import React from 'react';
import {useAuth as useAuthContext} from '../api/AuthContext';
import {
  Container,
  Typography,
} from '@mui/material';
const Home = () => {
  const { isLoggedIn, user} = useAuthContext();  
  
    // Thực hiện các hành động cập nhật dựa trên isLoggedIn và user
    console.log('Is logged in:', isLoggedIn);
    console.log('User:', user);
  
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
