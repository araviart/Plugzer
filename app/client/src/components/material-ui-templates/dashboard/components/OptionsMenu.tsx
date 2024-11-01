import * as React from 'react';
import { styled } from '@mui/material/styles';
import { dividerClasses } from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MuiMenuItem from '@mui/material/MenuItem';
import { paperClasses } from '@mui/material/Paper';
import { listClasses } from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon, { listItemIconClasses } from '@mui/material/ListItemIcon';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import MenuButton from './MenuButton';
import { useAuth } from '../../../../AuthContext';
import AreYouSureDialog from './dialog/AreYouSureDialog';

const MenuItem = styled(MuiMenuItem)({
  margin: '2px 6px',
  padding: '8px 16px',
});

export default function OptionsMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const open = Boolean(anchorEl);

  const { logout } = useAuth();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    setConfirmOpen(true);
    handleClose();
  };

  const handleConfirmClose = () => setConfirmOpen(false);

  return (
    <React.Fragment>
      <MenuButton
        aria-label="Open menu"
        onClick={handleClick}
        sx={{ borderColor: 'transparent' }}
      >
        <MoreVertRoundedIcon />
      </MenuButton>
      <Menu
        anchorEl={anchorEl}
        id="menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={{
          [`& .${listClasses.root}`]: {
            padding: '4px',
          },
          [`& .${paperClasses.root}`]: {
            padding: 0,
          },
          [`& .${dividerClasses.root}`]: {
            margin: '4px -4px',
          },
        }}
      >
        {/* <MenuItem onClick={handleClose}>Modifier mon profil</MenuItem>
        <MenuItem onClick={handleClose}>Voir mes fichiers</MenuItem>
        <Divider /> */}
        <MenuItem
          onClick={handleLogoutClick}
          sx={{
            color: 'error.main', // Texte rouge pour déconnexion
            [`& .${listItemIconClasses.root}`]: {
              ml: 'auto',
              minWidth: 0,
            },
          }}
        >
          <ListItemText>Déconnexion</ListItemText>
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" color="error" />
          </ListItemIcon>
        </MenuItem>
      </Menu>
      <AreYouSureDialog
        open={confirmOpen}
        text="Êtes-vous sûr de vouloir vous déconnecter ?"
        onConfirm={logout}
        handleClose={handleConfirmClose}
      />
    </React.Fragment>
  );
}
