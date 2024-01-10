import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from '@mui/material';
import RenderFunctions from '../admin pages/table functions/RenderFunctions';

const NO_DATA = '<NO DATA>';
export default function BannedInfoDialog({ bannedInfo, isOpenDialog, onCloseDialogClick }) {
  const { formatDateTime } = RenderFunctions();

  return (
    <Dialog open={isOpenDialog} onClose={onCloseDialogClick}>
      <DialogTitle><strong>{`Your account has been banned`}</strong></DialogTitle>
      <DialogContent>
        <Typography>
          <div><strong>Banned reason:</strong> {bannedInfo['bannedReason'] ?? NO_DATA}</div>
          <div><strong>Total days banned:</strong> {bannedInfo['numOfDaysBanned'] ?? NO_DATA}</div>
          <div><strong>Start time:</strong> {formatDateTime(bannedInfo['bannedStartTime']) ?? NO_DATA}</div>
          <div><strong>Expired time:</strong> {formatDateTime(bannedInfo['bannedEndTime']) ?? NO_DATA}</div>
        </Typography>
        <Typography>
          <div>A banned account could not log in and operate on the website.</div>
          <div>Please, click the CLOSE button to exit.</div>
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseDialogClick}><strong>Close</strong></Button>
      </DialogActions>
    </Dialog>
  );
}