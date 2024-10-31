import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

interface AskTextDialogProps {
  open: boolean;
  description: string; // Description modifiable
  onConfirm: (inputText: string) => void; // Fonction de confirmation avec le texte
  handleClose: () => void;
}

export default function AskTextDialog({
  open,
  description,
  onConfirm,
  handleClose,
}: AskTextDialogProps) {
  const [inputText, setInputText] = useState('');

  const handleConfirm = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onConfirm(inputText);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: { backgroundImage: 'none', minWidth: '500px' },
      }}
    >
      <DialogTitle>Entrez un texte</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
      >
        <DialogContentText>
          {description}
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Texte"
          type="text"
          fullWidth
          variant="outlined"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Annuler</Button>
        <Button onClick={handleConfirm} variant="contained" color="primary">
          Confirmer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
