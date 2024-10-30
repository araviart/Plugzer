import * as React from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import IconButton, { IconButtonOwnProps } from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { GridExpandMoreIcon, GridMoreVertIcon } from '@mui/x-data-grid';
import { MoreHoriz, MoreHorizRounded } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

interface Props {
  fileName: string;
}

export default function CardDropdown(props: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const location = useLocation();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation(); // Empêche la propagation lors de la fermeture du menu
    setAnchorEl(null);
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
        <MenuItem onClick={handleClose}>
          <Typography color="error">Supprimer</Typography>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
