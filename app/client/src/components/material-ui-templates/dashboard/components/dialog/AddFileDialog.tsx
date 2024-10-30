import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

interface AddFileDialogProps {
  open: boolean;
  handleClose: () => void;
}

export default function AddFileDialog({ open, handleClose }: AddFileDialogProps) {
  const [fileName, setFileName] = React.useState('');
  const [fileType, setFileType] = React.useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Logic to handle the file upload goes here
    console.log('New file added:', { fileName, fileType });
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
      <DialogTitle>Ajouter un fichier</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
      >
        <DialogContentText>
          Veuillez entrer le nom du fichier et sélectionner le type de fichier à ajouter.
        </DialogContentText>
        
        <OutlinedInput
          autoFocus
          required
          margin="dense"
          id="fileName"
          label="Nom du fichier"
          placeholder="Entrez le nom du fichier"
          fullWidth
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />
        
        <InputLabel id="file-type-label">Type de fichier</InputLabel>
        <Select
          labelId="file-type-label"
          value={fileType}
          onChange={(e) => setFileType(e.target.value)}
          fullWidth
        >
          <MenuItem value=""><em>Choisissez un type</em></MenuItem>
          <MenuItem value="image">Image</MenuItem>
          <MenuItem value="video">Vidéo</MenuItem>
          <MenuItem value="audio">Audio</MenuItem>
          <MenuItem value="document">Document</MenuItem>
          <MenuItem value="other">Autre</MenuItem>
        </Select>
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
