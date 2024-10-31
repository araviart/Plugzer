import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded'; // New import
import LinkRoundedIcon from '@mui/icons-material/LinkRounded'; // New import
import { Link, useLocation } from 'react-router-dom';

const mainListItems = [
 // { text: 'Accueil', icon: <HomeRoundedIcon />, to: '/' },
  { text: 'Fichiers', icon: <FolderRoundedIcon />, to:'/files' }, // Updated icon
  { text: 'Liens', icon: <LinkRoundedIcon />, to:'/links' }, // Updated icon
];

const secondaryListItems = [
  //{ text: 'Settings', icon: <SettingsRoundedIcon /> },
  { text: 'About', icon: <InfoRoundedIcon /> },
  //{ text: 'Feedback', icon: <HelpRoundedIcon /> },
];

export default function MenuContent() {
  const location = useLocation();

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <Link
          to={item.to}
          >
            <ListItem key={index} disablePadding sx={{ display: 'block', mb: 1 }}> {/* Ajout de margin-bottom ici */}
              <ListItemButton selected={location.pathname === item.to || location.pathname.startsWith('/files') && item.to=="/files"}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>

      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block', mb: 1 }}> {/* Ajout de margin-bottom ici */}
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
