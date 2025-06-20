import * as React from 'react';
import { Button, Box, Typography, Grid, useTheme } from '@mui/material';
import CreateNewFolder from '@mui/icons-material/CreateNewFolder';
import FileUpload from '@mui/icons-material/FileUpload';
import Copyright from '../internals/components/Copyright';
import ElementCard from './ElementCard';
import AddFileDialog from './dialog/AddFileDialog';
import AddFolderDialog from './dialog/AddFolderDialog';
import { useLocation } from 'react-router-dom';

export interface File {
    id: string;
    nom: string;
    path: string;
    taille_fichier: number;
    previewImage?: string;
    lastOpenedAt?: Date;
} 

export interface Directory {
    nom: string;
    lastOpenedAt: Date;
    id: number;
    path: string;
    utilisateur_id: number;
}

export default function FilesGrid() {

  const [data, setData] = React.useState<(File | Directory)[]>([]);

  const [openFileDialog, setOpenFileDialog] = React.useState(false);
  const [openFolderDialog, setOpenFolderDialog] = React.useState(false);
  const theme = useTheme();

  const location = useLocation();
  
  const fetchData = async () => {
    const authInfos = localStorage.getItem('authInfos');
    if (authInfos) {
      const { token } = JSON.parse(authInfos);
      
      const path = location.pathname == "/files" ? null : location.pathname.split('/files/').pop()??null;

      console.log(path)

      console.log(token)
      try {
        const response = await fetch('/api/folder?path='+path, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        });

        console.log(response)
  
        const result = await response.json();
        if (response.ok) {
          console.log(result);
          setData(result);
          // on ferme le dialogue
          //setFolderName(''); // Réinitialiser le champ de saisie
          //handleClose();
        } else {
         // setErrorMessage(result.message || 'Échec de l\'ajout du dossier.');
        }
      } catch (error) {
        console.error("Erreur lors de l'ajout du dossier:", error);
       // setErrorMessage('Erreur du serveur. Veuillez réessayer plus tard.');
      }
    }
  };

  React.useEffect(() => {

    fetchData();
  }, [location.pathname])


  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' }, minHeight: "100vh", minWidth: "100%" }}>
      <Typography component="h1" variant="h6" sx={{ mb: 2 }}>
        Bonjour <span style={{ fontWeight: 'bold', color: theme.palette.primary.main }}>{JSON.parse(localStorage.getItem('authInfos')!).name}</span>  !
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography component="h2" variant="h6">
          Mes fichiers
        </Typography>
        <Box>
          <Button
            variant="outlined"
            onClick={() => setOpenFolderDialog(true)} // Ouvrir le dialogue pour ajouter un dossier
            startIcon={<CreateNewFolder />}
            sx={{ mr: 1 }}
          >
            Ajouter un dossier
          </Button>
          <Button
            variant="contained"
            onClick={() => setOpenFileDialog(true)} // Ouvrir le dialogue pour ajouter un fichier
            startIcon={<FileUpload />}
          >
            Ajouter un fichier
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2} columns={12} sx={{ mb: 2 }}>
        {data.map((element, index) => (
          <Grid item key={index} xs={12} sm={6} lg={3}>
            <ElementCard 
            onChange={fetchData}
            element={element} />
          </Grid>
        ))}
      </Grid>

      <Copyright sx={{ my: 4 }} />

      {/* Ajouter le Dialog pour les fichiers */}
      <AddFileDialog 
      onChange={fetchData}
      open={openFileDialog} handleClose={() => setOpenFileDialog(false)} />
      {/* Ajouter le Dialog pour les dossiers */}
      <AddFolderDialog open={openFolderDialog} handleClose={() => setOpenFolderDialog(false)} onAddFolder={fetchData} />
    </Box>
  );
}
