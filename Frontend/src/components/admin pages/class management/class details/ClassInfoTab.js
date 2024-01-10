import {Box, Container, Grid, IconButton, Typography} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import api, {setAuthToken} from '../../../../api/api';
import RenderFunctions from '../../table functions/RenderFunctions';

const NO_DATA = '<No Data>';
export default function ClassInfoTab({ classId }) {
  const [_class, setClass] = useState({});
  const navigate = useNavigate();
  const { renderStatus } = RenderFunctions();

  useEffect(() => {
    const fetchData = async (classId) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Error fetching class data:', Error);
          navigate('/admin-signin');
        }
        setAuthToken(token);
        const response = await api.get(`/admin/management/class/class-info?classId=${classId}`);
        console.log('response.data: ', response.data);
        setClass(response.data);
      } catch (error) {
        console.log("Error fetching data: ", error);
      }
    };
    fetchData(classId);
  }, []);

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '55em' }}>
      <Grid container spacing={3} sx={{ marginTop: '20px',paddingBottom: '20px',  overflowY: 'auto', maxHeight: 'calc(100vh - 100px)' }}>
        <Grid item xs={12} md={10}>
          <Box sx={{ textAlign: 'left' }}>
            <Typography variant="h5" gutterBottom>
              {_class.className ?? NO_DATA}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <b>Description:</b> {_class.description ?? NO_DATA}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <b>Class Code:</b> {_class.classCode ?? NO_DATA}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <b>Status:</b> {_class.status ? renderStatus(_class.status) : NO_DATA}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={2}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
            <IconButton color="gray" aria-label="settings">
              <SettingsIcon />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}