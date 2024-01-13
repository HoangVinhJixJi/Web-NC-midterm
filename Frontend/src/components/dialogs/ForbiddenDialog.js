import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from '@mui/material';

export default function ForbiddenDialog({ isOpenDialog, onCloseDialogClick }) {
  return (
    <Dialog open={isOpenDialog} onClose={onCloseDialogClick}>
      <DialogTitle><strong>Forbidden!</strong></DialogTitle>
      <DialogContent>
        <Typography>
          <div>Your account does not have this permission.</div>
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseDialogClick}><strong>Close</strong></Button>
      </DialogActions>
    </Dialog>
  );
}