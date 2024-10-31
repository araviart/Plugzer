import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button'; // Import du bouton
import AddIcon from '@mui/icons-material/Add'; // Import de l'icône +
import MenuContent from './MenuContent';
import OptionsMenu from './OptionsMenu';
import StorageGauge from './StorageGauge';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)( {
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

export default function SideMenu() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
        },
      }}
    >
      {/* Remplacer SelectContent par un bouton "Ajouter un fichier" */}
      <Box
        sx={{
          display: 'flex',
          mt: 'calc(var(--template-frame-height, 0px) + 4px)',
          p: 1.5,
        }}
      >
        {/* <Button
          variant="contained" // Utiliser le style "contained" pour une couleur de fond
          color="primary" // Couleur primaire
          startIcon={<AddIcon />} // Ajouter l'icône "+" à gauche
          fullWidth // Rendre le bouton pleine largeur
        >
          Ajouter un fichier
        </Button> */}
        <StorageGauge/>
      </Box>
      <Divider />
      <MenuContent />
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Avatar
          sizes="small"
          alt="Riley Carter"
          src=""
          sx={{ width: 36, height: 36 }}
        />
        <Box sx={{ mr: 'auto' }}>
          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
            {JSON.parse(localStorage.getItem('authInfos')!).name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {JSON.parse(localStorage.getItem('authInfos')!).email}
          </Typography>
        </Box>
        <OptionsMenu />
      </Stack>
    </Drawer>
  );
}
