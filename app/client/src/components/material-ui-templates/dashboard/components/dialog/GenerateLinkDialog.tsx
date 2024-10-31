import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Check } from '@mui/icons-material';

interface GenerateLinkDialogProps {
  open: boolean;
  description: string;
  handleClose: () => void;
}

export default function GenerateLinkDialog({
  open,
  description,
  handleClose,
}: GenerateLinkDialogProps) {
  const [linkText, setLinkText] = useState('https://default-link.com');
  const [hasCopied, setHasCopied] = useState(false);

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
                        <Check/>
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
