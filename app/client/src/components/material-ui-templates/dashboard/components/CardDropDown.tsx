import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { MoreHorizRounded } from '@mui/icons-material';
import { Directory, File } from './FilesGrid';
import AreYouSureDialog from './dialog/AreYouSureDialog';
import AskTextDialog from './dialog/AskTextDialog';
import GenerateLinkDialog from './dialog/GenerateLinkDialog';
import LinksDialog from './dialog/LinksDialog';

interface Props {
  element: Directory | File;
  onChange: () => void;
}

export default function CardDropdown(props: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [askTextDialogOpen, setAskTextDialogOpen] = React.useState(false); // État pour le dialogue AskText
  const [generateLinkDialogOpen, setGenerateLinkDialogOpen] = React.useState(false); // État pour le dialogue de génération de lien
  const [LinksDialogOpen, setLinksDialogOpen] = React.useState(false); // État pour le dialogue de génération de lien
  const [newName, setNewName] = React.useState(''); // État pour stocker le nouveau nom du dossier
  const open = Boolean(anchorEl);

  const handleCloseLinkDialogOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setLinksDialogOpen(false); // Fermer le dialogue de génération de lien
  }

  const handleCloseGenerateLinkDialog = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setGenerateLinkDialogOpen(false); // Fermer le dialogue de génération de lien
  }

  const handleCloseTextDialog = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setAskTextDialogOpen(false); // Fermer le dialogue AskText
  }

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

  const isFile = (element: Directory | File): element is File => (element as File).taille_fichier !== undefined;

  const deleteElement = async ({ force }: { force: boolean }) => {
    const authInfos = localStorage.getItem('authInfos');
    if (authInfos) {
      const { token } = JSON.parse(authInfos);

      const path = location.pathname == "/files" ? null : location.pathname.split('/files/').pop() ?? null;

      console.log(path)

      console.log(token)
      try {
        const response = await fetch(`http://localhost:3000/api/${isFile(props.element) ? 'file' : 'folder'}/${props.element.id}`, {
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
          if (response.status == 401 && !force) {
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

    deleteElement({ force: false });

    console.log('Suppression de', props.element);
    setAnchorEl(null);
  }

  const changeElementName = async (newName: string) => {
    const authInfos = localStorage.getItem('authInfos');
    if (authInfos) {
      const { token } = JSON.parse(authInfos);

      try {
        const response = await fetch(`http://localhost:3000/api/folder/${props.element.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ folderName: newName }),
        });

        console.log(response)

        const result = await response.json();
        if (response.ok) {
          console.log(result);
          props.onChange();
          // on ferme le dialogue
          //setFolderName(''); // Réinitialiser le champ de saisie
          //handleClose();
        } else {
          // si c'est unauthorized on demande une confirmation
          if (response.status == 401) {
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

  const handleEditName = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setNewName(props.element.nom); // Initialiser avec le nom actuel
    setAskTextDialogOpen(true); // Ouvrir le dialogue AskText
    setAnchorEl(null); // Fermer le menu
  };

  const handleTextDialogConfirm = (inputText: string) => {
    changeElementName(inputText); // Changer le nom avec le texte saisi
    setAskTextDialogOpen(false); // Fermer le dialogue
  };

  const handleGenerateLink = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setGenerateLinkDialogOpen(true); // Ouvrir le dialogue de génération de lien
    setAnchorEl(null); // Fermer le menu
  }

  const handleShowActiveLinks = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setLinksDialogOpen(true); // Ouvrir le dialogue de génération de lien
    setAnchorEl(null); // Fermer le menu
  }

  const handleShowFile = async () => {
    console.log('File clicked:', props.element);

    const authInfos = localStorage.getItem('authInfos');
    if (authInfos) {
      const { token } = JSON.parse(authInfos);

      try {
        const response = await fetch(`http://localhost:3000/api/file/${props.element.id}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const blob = await response.blob();
          const fileURL = URL.createObjectURL(blob);
          window.open(fileURL, '_blank'); // Ouvre le fichier dans un nouvel onglet
        } else {
          console.error("Erreur lors de la récupération du fichier:", response.statusText);
        }
      } catch (error) {
        console.error("Erreur réseau:", error);
      }
    }

  };


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
        <MoreHorizRounded />
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
        {
          isFile(props.element) ? (
            <>
              <MenuItem onClick={handleShowFile}>Afficher le fichier</MenuItem>
              <MenuItem onClick={handleGenerateLink}>Générer un lien de partage</MenuItem>
              {//<MenuItem onClick={handleShowActiveLinks}>Voir les liens actif</MenuItem>
              }
            </>
          )
            :
            (
              <MenuItem onClick={handleEditName}>Modifier le nom du dossier</MenuItem>
            )
        }
        <Divider />
        <MenuItem onClick={handleDelete}>
          <Typography
            color="error">Supprimer</Typography>
        </MenuItem>
      </Menu>
      <AreYouSureDialog
        open={confirmOpen}
        text="Ce dossier n'est pas vide voulez vous vraiment le supprimer?"
        onConfirm={() => deleteElement({ force: true })}
        // @ts-ignore
        handleClose={handleCloseConfirm}
      />
      <AskTextDialog
        open={askTextDialogOpen}
        description="Entrez le nouveau nom du dossier :"
        onConfirm={handleTextDialogConfirm}
        // @ts-ignore
        handleClose={handleCloseTextDialog}
      />
      <GenerateLinkDialog
        open={generateLinkDialogOpen}
        description="Voici le lien de partage généré :"
        // @ts-ignore
        file={props.element}
        // @ts-ignore
        handleClose={handleCloseGenerateLinkDialog}
      />
      <LinksDialog
        open={LinksDialogOpen}
        // @ts-ignore
        handleClose={handleCloseLinkDialogOpen}
      />
    </React.Fragment>
  );
}