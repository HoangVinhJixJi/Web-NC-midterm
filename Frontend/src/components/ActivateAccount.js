import {Avatar, Button, Container, Paper, Typography} from "@mui/material";
import React, {useState} from "react";
import api from '../api/api';
import { useAuth as useAuthContext } from '../api/AuthContext';

export default function ActivateAccount() {
  const { emailRegistration } = useAuthContext();
  const [notice, setNotice] = useState('You have successfully registered your account, please check your email and activate your account.');

  async function handleResendMail(e) {
    try {
      e.preventDefault();
      const userData = { email: emailRegistration };
      const response = await api.post('/auth/activate/resend-mail', userData);
      setNotice(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar src="/images/activate-account.png" alt="Activation Image" sx={{ width: '15rem', height: '10rem', borderRadius: '0px', marginBottom: 2 }} />
        <Typography variant="body" gutterBottom style={{ fontWeight: 'bold' }}>
          { notice }
        </Typography>
        <Button variant="contained" color="primary" onClick={(e) => handleResendMail(e)} style={{ marginTop: '20px' }}>
          Resend The Mail To Me
        </Button>
      </Paper>
    </Container>
  );
}