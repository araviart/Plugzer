import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface AreYouSureDialogProps {
  open: boolean;
  text: string;
  onConfirm: () => void;
  handleClose: () => void;
}

export default function AreYouSureDialog({
  open,
  text,
  onConfirm,
  handleClose,
}: AreYouSureDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: { backgroundImage: 'none', minWidth: '500px' }, // Styles de AddFolderDialog
      }}
    >
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
      >
        <DialogContentText>
          {text}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Annuler</Button>
        <Button onClick={handleConfirm} variant="contained" color="error">
          Confirmer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
