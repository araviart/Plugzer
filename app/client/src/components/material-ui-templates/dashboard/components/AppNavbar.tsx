import * as React from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import MuiToolbar from '@mui/material/Toolbar';
import { tabsClasses } from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import SideMenuMobile from './SideMenuMobile';
import MenuButton from './MenuButton';
import ColorModeIconDropdown from '../../shared-theme/ColorModeIconDropdown';

const Toolbar = styled(MuiToolbar)({
  width: '100%',
  padding: '12px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  justifyContent: 'center',
  gap: '12px',
  flexShrink: 0,
  [`& ${tabsClasses.flexContainer}`]: {
    gap: '8px',
    p: '8px',
    pb: 0,
  },
});

export default function AppNavbar() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        display: { xs: 'auto', md: 'none' },
        boxShadow: 0,
        bgcolor: 'background.paper',
        backgroundImage: 'none',
        borderBottom: '1px solid',
        borderColor: 'divider',
        top: 'var(--template-frame-height, 0px)',
      }}
    >
      <Toolbar variant="regular">
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            flexGrow: 1,
            width: '100%',
            gap: 1,
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{ justifyContent: 'center', mr: 'auto' }}
          >
            <CustomIcon />
            <Typography variant="h4" component="h1" sx={{ color: 'text.primary' }}>
              Dashboard
            </Typography>
          </Stack>
          <ColorModeIconDropdown />
          <MenuButton aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuRoundedIcon />
          </MenuButton>
          <SideMenuMobile open={open} toggleDrawer={toggleDrawer} />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export function CustomIcon() {
  return (
    <Box
      sx={{
        width: '1.5rem',
        height: '1.5rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
      }}
    >
      <svg width="69" height="69" viewBox="0 0 69 69" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_9_3532)">
          <path d="M20.1291 51.7506C16.5419 51.7506 13.1016 50.3875 10.5651 47.9613C8.02853 45.535 6.60352 42.2443 6.60352 38.8131C6.60352 35.3818 8.02853 32.0911 10.5651 29.6649C13.1016 27.2386 16.5419 25.8756 20.1291 25.8756C20.9763 22.1012 23.4548 18.7843 27.0193 16.6546C28.7842 15.6001 30.7627 14.8688 32.8417 14.5024C34.9207 14.136 37.0595 14.1418 39.136 14.5193C41.2126 14.8969 43.1861 15.6388 44.944 16.7028C46.702 17.7668 48.2098 19.132 49.3815 20.7205C50.5532 22.3089 51.3658 24.0896 51.7729 25.9607C52.18 27.8317 52.1736 29.7567 51.7541 31.6256H54.6291C57.2978 31.6256 59.8573 32.6857 61.7443 34.5728C63.6314 36.4599 64.6916 39.0193 64.6916 41.6881C64.6916 44.3568 63.6314 46.9162 61.7443 48.8033C59.8573 50.6904 57.2978 51.7506 54.6291 51.7506H51.7541" stroke="#3266FF" stroke-width="4.3125" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M25.8873 56.25V26.9773H36.8645C39.1133 26.9773 41.0001 27.3965 42.5247 28.2351C44.0588 29.0736 45.2166 30.2266 45.998 31.6941C46.7889 33.152 47.1843 34.81 47.1843 36.6681C47.1843 38.5453 46.7889 40.2129 45.998 41.6708C45.2071 43.1287 44.0398 44.277 42.4961 45.1155C40.9524 45.9445 39.0514 46.359 36.7931 46.359H29.5178V41.9996H36.0784C37.3934 41.9996 38.4701 41.7709 39.3087 41.3135C40.1472 40.8561 40.7666 40.2272 41.1668 39.4268C41.5766 38.6263 41.7814 37.7068 41.7814 36.6681C41.7814 35.6295 41.5766 34.7147 41.1668 33.9238C40.7666 33.1329 40.1425 32.5183 39.2944 32.08C38.4558 31.6321 37.3743 31.4082 36.0498 31.4082H31.1901V56.25H25.8873Z" fill="white" />
        </g>
        <defs>
          <clipPath id="clip0_9_3532">
            <rect width="69" height="69" fill="white" />
          </clipPath>
        </defs>
      </svg>

    </Box>
  );
}
