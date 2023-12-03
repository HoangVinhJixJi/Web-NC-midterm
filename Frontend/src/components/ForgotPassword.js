import {Avatar, Button, Container, Paper, TextField, Typography} from "@mui/material";
import React, {useState} from "react";
import api from '../api/api';
import {Link} from "react-router-dom";

export default function ForgotPassword() {
  const [displayForm, setDisplayForm] = useState(true);
  const [notice, setNotice] = useState('Please enter your email address below');
  const [email, setEmail] = useState('');
  const [warningMessage, setWarningMessage] = useState('');

  async function handleSubmitForm(e) {
    try {
      e.preventDefault();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setWarningMessage('Please enter a valid email address.');
        return;
      }
      const userData = { userEmail: email };
      const response = await api.post('/auth/forgot-password', userData);
      if (response.data) {
        setNotice(`The password reset link has been sent to email ${email}, please check your email.`);
        setDisplayForm(false);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function handleResendMail(e) {
    try {
      e.preventDefault();
      const userData = { email: email };
      const response = await api.post('/auth/forgot-password/resend-mail', userData);
      if (response.data) {
        setNotice(`The mail has been sent back to your email ${userData.email}, please check your email.`);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar src="/images/forgot-password.png" alt="Activation Image" sx={{ width: '16.5rem', height: '15rem', borderRadius: '0px', marginBottom: 2 }} />
        <Typography variant="h4" gutterBottom style={{ color: '#2196F3', fontWeight: 'bold' }}>
          Forgot Password?
        </Typography>
        <Typography variant="body" gutterBottom style={{ fontWeight: 'bold' }}>
          { notice }
        </Typography>
        { displayForm ?
          <form>
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              margin="normal"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Typography variant="body2" color="error" mt={2}>
              { warningMessage }
            </Typography>
            <Button variant="contained" color="primary" fullWidth onClick={(e) => handleSubmitForm(e)} style={{ marginTop: '20px' }}>
              Next
            </Button>
          </form>
          :
          <Button variant="contained" color="primary" fullWidth onClick={(e) => handleResendMail(e)} style={{ marginTop: '20px' }}>
            Resend The Mail To Me
          </Button>
        }
        <Typography variant="body" mt={2}>
          <Link to="/signin">Back to Sign In</Link>
        </Typography>
      </Paper>
    </Container>
  );
}