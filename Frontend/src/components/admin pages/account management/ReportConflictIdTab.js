import {
  Container,
  Grid,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import api, {setAuthToken} from '../../../api/api';
import LoadingDataItem from '../LoadingDataItem';
import NoResultsFoundItem from '../NoResultsFoundItem';
import RenderFunctions from '../table functions/RenderFunctions';
import ConflictIdAccountItem from './table item/account item/ConflictIdAccountItem';

const NO_DATA = '<NO DATA>';
const titleNames = ["User ID", "User Info", "Student ID", "Active Student ID", "Details"];
export default function ReportConflictIdTab() {
  const { reportInfo } = useParams();
  const navigate = useNavigate();
  const reportInfoElements = reportInfo.split('&&');
  const reportId = reportInfoElements[0];
  const sendId = reportInfoElements[1];
  const studentId= reportInfoElements[2];
  const extraInfo = reportInfoElements[3];
  const [conflictUsers, setConflictUsers] = useState([]);
  const { renderTableColumnTitle } = RenderFunctions();
  const [isLoading, setIsLoading] = useState(false);
  const [disabledActiveIdButton, setDisabledActiveIdButton] = useState(false);

  async function handleActiveIdClick(userId, studentId, reportId, conflictAccounts) {
    const conflictUserIds = conflictAccounts.map(account => account['userId']);
    console.log(conflictUserIds);
    try {
      setDisabledActiveIdButton(true);
      const data = {
        notificationId: reportId,
        selectedUserId: userId,
        userIdList: conflictUserIds,
        studentId: studentId
      };
      console.log(data);
      const response = await api.post('/admin/management/account/resolve-conflict-id', data);
      console.log(response);
      if (response.data) {
        setConflictUsers(response.data);
      }
    } catch (error) {
      console.log("Error fetching data: ", error);
    }
  }
  function renderAccountList(conflictAccounts) {
    return conflictAccounts.map((account) => (
      <ConflictIdAccountItem
        account={account}
        disabledActiveIdButton={disabledActiveIdButton}
        sendId={sendId}
        onActiveIdClick={() => handleActiveIdClick(account['userId'], studentId, reportId, conflictUsers)}
      />
    ));
  }

  useEffect(() => {
    const fetchData = async (sendId, studentId) => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Error fetching user data:', Error);
          navigate('/admin-signin');
        }
        setAuthToken(token);
        const response = await api.get(`/admin/management/account/report-conflict-id?sendId=${sendId}&&studentId=${studentId}`);
        console.log(response.data);
        setIsLoading(false);
        if (response.data) {
          setConflictUsers(response.data);
        }
      } catch (error) {
        console.log("Error fetching data: ", error);
      }
    }
    fetchData(sendId, studentId);
  }, [reportId]);

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '60em' }}>
      <Container sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="subtitle1" gutterBottom>
          <b>Report ID:</b> {reportId ?? NO_DATA}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          <b>Sender ID:</b> {sendId ?? NO_DATA}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          <b>Extra Information:</b> {extraInfo ?? NO_DATA}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          <div>These are accounts that have student ID conflicts with the user sending this report.</div>
          <div>{`Choosing to activate one of these accounts means you will assign student ID '${studentId}' to that account 
          and other accounts will have their current student code unassigned.`}</div>
        </Typography>
      </Container>
      <Grid container spacing={3} sx={{ marginTop: '20px',paddingBottom: '20px',  overflowY: 'auto', maxHeight: 'calc(100vh - 120px)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {renderTableColumnTitle(titleNames, [])}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading
                ? <LoadingDataItem colSpan={titleNames.length} />
                : conflictUsers.length > 0
                  ? renderAccountList(conflictUsers) : <NoResultsFoundItem colSpan={titleNames.length} />}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Container>
  );
}