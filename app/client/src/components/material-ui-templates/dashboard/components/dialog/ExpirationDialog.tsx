import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

interface ExpirationDialogProps {
  open: boolean;
  handleClose: () => void;
  onSelectExpiration: (selectedDate: Date | null) => void; // Modifiez ce type
}

export default function ExpirationDialog({
  open,
  handleClose,
  onSelectExpiration,
}: ExpirationDialogProps) {
  const [expirationDate, setExpirationDate] = React.useState<Dayjs | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSelectExpiration(expirationDate?.toDate() || null);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit,
        sx: { backgroundImage: 'none' },
      }}
    >
      <DialogTitle>Sélectionner la date d'expiration</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
        <DialogContentText>
          Veuillez choisir la date d'expiration souhaitée.
        </DialogContentText>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date d'expiration"
            value={expirationDate}
            onChange={(newDate) => setExpirationDate(newDate)}
            slotProps={{ textField: { fullWidth: true, required: true } }}
          />
        </LocalizationProvider>
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Annuler</Button>
        <Button variant="contained" type="submit">
          Confirmer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
