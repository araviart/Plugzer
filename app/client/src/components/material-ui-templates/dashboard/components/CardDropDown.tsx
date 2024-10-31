import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { MoreHorizRounded } from '@mui/icons-material';
import { Directory, File } from './FilesGrid';
import AreYouSureDialog from './dialog/AreYouSureDialog';

interface Props {
  element: Directory | File;
  onChange: () => void;
}

export default function CardDropdown(props: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const open = Boolean(anchorEl);

  const handleCloseConfirm = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setConfirmOpen(false);
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation(); // Empêche la propagation lors de la fermeture du menu
    setAnchorEl(null);
  };

  const deleteElement = async ({force}:{force:boolean}) => {
    const authInfos = localStorage.getItem('authInfos');
    if (authInfos) {
      const { token } = JSON.parse(authInfos);
      
      const path = location.pathname == "/files" ? null : location.pathname.split('/files/').pop()??null;

      console.log(path)

      console.log(token)
      try {
        const response = await fetch(`http://localhost:3000/api/folder/${props.element.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ force }), // Inclure le paramètre force dans le corps de la requête
        });

        console.log(response)
  
        const result = await response.json();
        if (response.ok) {
          console.log(result);
          props.onChange();
          setConfirmOpen(false); // Fermer la boîte de dialogue de confirmation
          // on ferme le dialogue
          //setFolderName(''); // Réinitialiser le champ de saisie
          //handleClose();
        } else {
          // si c'est unauthorized on demande une confirmation
          if(response.status == 401 && !force){
            setConfirmOpen(true);
          }
         // setErrorMessage(result.message || 'Échec de l\'ajout du dossier.');
        }
      } catch (error) {
        console.error("Erreur lors de l'ajout du dossier:", error);
       // setErrorMessage('Erreur du serveur. Veuillez réessayer plus tard.');
      }
    }
  }

  const handleDelete = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();

    deleteElement({force:false});
    
    console.log('Suppression de', props.element);
    setAnchorEl(null);
  }

  return (
    <React.Fragment
    >
      <IconButton
        onClick={handleClick}
        disableRipple
        size="small"
        aria-controls={open ? 'user-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        {...props}
      >
        <MoreHorizRounded/>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="user-menu"
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            variant: 'outlined',
            sx: { my: '4px' },
          },
        }}
      >
        <MenuItem onClick={handleClose}>Afficher le fichier</MenuItem>
        <MenuItem onClick={handleClose}>Générer un lien de partage</MenuItem>
        <MenuItem onClick={handleClose}>Voir les liens actif</MenuItem>
        <Divider />
        <MenuItem onClick={handleDelete}>
          <Typography 
          color="error">Supprimer</Typography>
        </MenuItem>
      </Menu>
      <AreYouSureDialog
        open={confirmOpen}
        text="Ce dossier n'est pas vide voulez vous vraiment le supprimer?"
        onConfirm={() => deleteElement({force: true})}
        // @ts-ignore
        handleClose={handleCloseConfirm}
      />
    </React.Fragment>
  );
}
