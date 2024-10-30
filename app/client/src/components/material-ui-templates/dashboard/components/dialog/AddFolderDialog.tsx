import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';

interface AddFolderDialogProps {
  open: boolean;
  handleClose: () => void;
  onAddFolder: (folderName: string) => void; // Fonction pour gérer l'ajout du dossier
}

export default function AddFolderDialog({ open, handleClose, onAddFolder }: AddFolderDialogProps) {
  const [folderName, setFolderName] = React.useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (folderName.trim() === '') return; // Ne rien faire si le nom est vide
    onAddFolder(folderName); // Appeler la fonction pour ajouter le dossier
    setFolderName(''); // Réinitialiser le champ de saisie
    handleClose(); // Fermer le dialogue
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
      <DialogTitle>Ajouter un dossier</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
      >
        <DialogContentText>
          Veuillez entrer le nom du dossier que vous souhaitez ajouter.
        </DialogContentText>
        
        <OutlinedInput
          autoFocus
          required
          margin="dense"
          id="folderName"
          label="Nom du dossier"
          placeholder="Entrez le nom du dossier"
          fullWidth
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Annuler</Button>
        <Button variant="contained" type="submit">
          Ajouter
        </Button>
      </DialogActions>
    </Dialog>
  );
}
