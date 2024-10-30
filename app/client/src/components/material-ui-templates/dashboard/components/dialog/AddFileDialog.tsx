import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import { Box, Typography } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile'; // Icône de fichier

interface AddFileDialogProps {
  open: boolean;
  handleClose: () => void;
}

export default function AddFileDialog({ open, handleClose }: AddFileDialogProps) {
  const [file, setFile] = React.useState<File | null>(null); // État pour le fichier

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Logic to handle the file upload goes here
    if (file) {
      console.log('New file added:', {  file });
      // Vous pouvez également ajouter une logique pour télécharger le fichier ici
    }

    handleClose();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null; // Récupérer le premier fichier sélectionné
    setFile(selectedFile);  
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit,
        sx: { backgroundImage: 'none', minWidth: '500px' }, 
      }}
    >
      <DialogTitle>Ajouter un fichier</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
      >
        <DialogContentText>
          Veuillez sélectionner le fichier à ajouter.
        </DialogContentText>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "center", gap: 5, my:2 }}>
            <InputLabel htmlFor="file-upload" sx={{ mt: 2, width: "fit-content" }}>
            Sélectionner un fichier
            </InputLabel>
            <input
            accept="*/*" // Peut être limité à certains types de fichiers si nécessaire
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            style={{ display: 'none' }} // Masquer l'input pour le styliser avec un bouton
            />
            <label htmlFor="file-upload" style={{width: "fit-content"}}>
            <Button variant="contained" component="span">
                Choisir un fichier
            </Button>
            </label>
        </Box>

        {/* Aperçu du fichier sélectionné */}
        {file && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mt: 2,
              p: 1,
              border: '1px dashed grey',
              borderRadius: '4px',
            }}
          >
            <AttachFileIcon sx={{ mr: 1 }} />
            <Typography variant="body1">{file.name}</Typography>
          </Box>
        )}
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
