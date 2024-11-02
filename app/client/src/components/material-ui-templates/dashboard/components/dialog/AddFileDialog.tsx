import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import { Box, Typography } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile'; // Icône de fichier
import { useLocation } from 'react-router-dom';
import { useStorage } from '../../context/StorageContext';

interface AddFileDialogProps {
  open: boolean;
  handleClose: () => void;
  onChange: () => void;
}

export default function AddFileDialog({ open, handleClose, onChange }: AddFileDialogProps) {
  const [file, setFile] = React.useState<File | null>(null); // État pour le fichier
  const[errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const location = useLocation();
  const { setStorageUsageNeedsRefresh } = useStorage();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    event.preventDefault();
    
    // Logic to handle the file upload goes here
    if (file) {
      console.log('New file added:', {  file });
      // Vous pouvez également ajouter une logique pour télécharger le fichier ici
    }

    const authInfos = localStorage.getItem('authInfos');
    if (authInfos) {
      const { token } = JSON.parse(authInfos);
      console.log(token)
      const path = location.pathname == "/files" ? null : location.pathname.split('/files/').pop()??null;
  
      try {
        const formData = new FormData();
        if (file) {
          formData.append('file', file);
        }
        if (path !== null) {
          formData.append('path', path);
        }

        console.log(path)

        console.log(formData.get('file'));
        console.log(formData.get('path'));
    
        const response = await fetch('/api/file', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
  
        const result = await response.json();
        if (response.ok) {
          // on ferme le dialogue
          setFile(null); // Réinitialiser le fichier sélectionné
          handleClose();
          onChange();
          setStorageUsageNeedsRefresh(true);
        } else {
          setErrorMessage(result.message || 'Échec de l\'ajout du dossier.');
        }
      } catch (error) {
        setErrorMessage('Erreur du serveur. Veuillez réessayer plus tard.');
      }
    }

    //handleClose(); // Fermer le dialogue
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

        {
          errorMessage && (
              <Typography variant="body2"
              color="error">
                {errorMessage}
              </Typography>
          )
        }

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
