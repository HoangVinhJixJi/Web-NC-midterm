import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl, FormControlLabel, MenuItem, Radio,
  RadioGroup, Select, TextField,
  Typography
} from '@mui/material';
import {useEffect, useState} from 'react';
import api from '../../../../api/api';

const reasons = [
  'Offensive, derogatory language, promoting hostility, regional discrimination.',
  'Sending malicious links.',
  'Impersonating others.'
];
const FOREVER_BAN_DAYS = 999999999999999;
export default function BanAccountDialog(
  {
    userId, username,
    isOpenBanAccountDialog, onCloseBanAccountDialog,
    setIsSuccess
  }) {
  const [reason, setReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [days, setDays] = useState(null);
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState("success");
  const [isDisabled, setIsDisabled] = useState(false);
  const [isDisplayCloseButton, setIsDisplayCloseButton] = useState(false);

  function renderReasonsForBanning(reasons) {
    return reasons.map(reason => (
      <FormControlLabel value={reason} control={<Radio />} label={reason} />
    ));
  }
  function handleReasonChange(event) {
    setReason(event.target.value);
  }
  function handleDaysChange(event) {
    setDays(event.target.value);
  }
  async function handleConfirmClick() {
    try {
      if (!reason) {
        setMessage('Please select a reason for banning.');
        setMessageColor("error");
        return;
      }
      if (reason === 'other' && !otherReason) {
        setMessage('Please provide a reason for banning.');
        setMessageColor("error");
        return;
      }
      if (!days) {
        setMessage('Please select a ban duration.');
        setMessageColor("error");
        return;
      }
      setIsDisabled(true);
      const data = {
        userId: userId,
        reason: reason,
        numOfDaysBanned: days.toString(),
      };
      const response = await api.post('/admin/management/account/ban', data);
      console.log('Banned account info: ', response.data);
      if (response.data) {
        setMessageColor("success");
        setMessage(`The account with username ${username} has been successfully banned`);
        setIsSuccess(true);
      } else {
        setMessageColor("error");
        setMessage(`Account ban failed, please try again.`);
        setIsSuccess(false);
      }
      setIsDisplayCloseButton(true);
    } catch (error) {
      console.log("Banning account error: ", error);
    }
  }

  useEffect(() => {
    setReason('')
    setOtherReason('');
    setDays('');
    setMessage('');
    setIsDisabled(false);
    setIsDisplayCloseButton(false);
  }, [userId]);

  return (
    <Dialog open={isOpenBanAccountDialog} onClose={() => onCloseBanAccountDialog(userId)}>
      <DialogTitle><strong>{`Ban account ${username}?`}</strong></DialogTitle>
      <DialogContent>
        <Typography gutterBottom><strong>Reason for banning:</strong></Typography>
        <FormControl component="fieldset">
          <RadioGroup value={reason} onChange={handleReasonChange}>
            {renderReasonsForBanning(reasons)}
            <FormControlLabel value="other" control={<Radio />} label="Other" />
          </RadioGroup>
        </FormControl>
        {reason === 'other' && (
          <TextField
            value={otherReason}
            label="Other reason" variant="outlined" fullWidth
            onChange={e => setOtherReason(e.target.value)}
          />
        )}
        <Typography style={{ marginTop: '16px' }}><strong>Select ban duration (in days):</strong></Typography>
        <FormControl variant="outlined" fullWidth>
          <Select value={days} onChange={handleDaysChange}>
            <MenuItem value="" disabled>Ban Duration</MenuItem>
            <MenuItem value={1}>1 day</MenuItem>
            <MenuItem value={7}>7 days</MenuItem>
            <MenuItem value={30}>30 days</MenuItem>
            <MenuItem value={FOREVER_BAN_DAYS}>Forever</MenuItem>
          </Select>
        </FormControl>
        <Typography>
          {`By clicking the confirmation button below, you will lock the account for this user for ${days} days`}
          A locked account will not be able to log in and operate on the website application.
        </Typography>
        <Typography color={messageColor}>{message}</Typography>
      </DialogContent>
      <DialogActions>
        {!isDisplayCloseButton
          ?
          <>
            <Button onClick={() => onCloseBanAccountDialog(userId)} disabled={isDisabled}>
              <strong>Cancel</strong>
            </Button>
            <Button onClick={handleConfirmClick} disabled={isDisabled}>
              <strong>Confirm</strong>
            </Button>
          </>
          :
          <Button onClick={() => onCloseBanAccountDialog(userId)}>
            <strong>
              Close
            </strong>
          </Button>
        }
      </DialogActions>
    </Dialog>
  );
}