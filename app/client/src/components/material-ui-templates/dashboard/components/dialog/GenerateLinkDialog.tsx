import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Check } from '@mui/icons-material';
import { File } from '../FilesGrid';

interface GenerateLinkDialogProps {
  open: boolean;
  description: string;
  handleClose: () => void;
  file: File
}

export default function GenerateLinkDialog({
  open,
  description,
  handleClose,
  file
}: GenerateLinkDialogProps) {
  const [linkText, setLinkText] = useState('https://default-link.com');
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    const askForLink = async () => {
      const authInfos = localStorage.getItem('authInfos');
      if (authInfos) {
        const { token } = JSON.parse(authInfos);
        console.log(token)

        try {
          const response = await fetch(`http://localhost:3000/api/file/link?id=${file.id}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
          });

          const result = await response.json();
          console.log(result);
          if (response.ok) {
            // on ferme le dialogue
            setLinkText(result.link);
            handleClose();
          } else {
            //setErrorMessage(result.message || 'Échec de l\'ajout du dossier.');
          }
        } catch (error) {
          //setErrorMessage('Erreur du serveur. Veuillez réessayer plus tard.');
        }
      }
    }

    if (open) {
      askForLink();
    }
  }, [open])

  const handleCopyToClipboard = () => {
    setHasCopied(true);
    navigator.clipboard.writeText(linkText);
  };

  return (
    <Dialog
      onClick={(e) => e.stopPropagation()}
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: { backgroundImage: 'none', minWidth: '500px' },
      }}
    >
      <DialogTitle>Générer un lien</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
      >
        <DialogContentText>{description}</DialogContentText>
        <TextField
          margin="dense"
          label="Lien généré"
          type="text"
          fullWidth
          variant="outlined"
          value={linkText}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <Button
                sx={{
                  position: 'relative',
                  left: '12px',
                }}
                onClick={handleCopyToClipboard} variant="outlined" color="primary">
                {
                  !hasCopied ? (
                    <ContentCopyIcon />
                  )
                    :
                    (
                      <Check />
                    )
                }

              </Button>
            ),
          }}
        />
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
}
