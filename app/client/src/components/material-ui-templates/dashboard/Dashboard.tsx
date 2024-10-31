import * as React from 'react';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import type {} from '@mui/x-charts/themeAugmentation';
import type {} from '@mui/x-data-grid/themeAugmentation';
import type {} from '@mui/x-tree-view/themeAugmentation';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from './components/AppNavbar';
import Header from './components/Header';
import MainGrid from './components/MainGrid';
import SideMenu from './components/SideMenu';
import AppTheme from '../shared-theme/AppTheme';
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from './theme/customizations';
import { Navigate, useLocation } from 'react-router-dom';
import FilesGrid from './components/FilesGrid';
import LinksGrid from './components/LinksGrid';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function Dashboard(props: { disableCustomTheme?: boolean }) {
  const location = useLocation();

  React.useEffect(() => {
    console.log('location changed', location);
  }, [location])

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex', width:"100vw", minHeight:"100vh" }}>
        <SideMenu />
        <AppNavbar />
        {/* Main content */}
        <Box
          component="main"
          sx={(_) => ({
            flexGrow: 1,  
            overflow: 'auto',
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header />
            {
              location.pathname === "/" ? (
                <Navigate 
                  to="/files" 
                  replace
                />
              )
              : location.pathname.startsWith("/files") ? (
                <FilesGrid/>
              )
              : location.pathname === "/links" ? (
                <LinksGrid/>
              )
              :
              <p>Page non trouvée</p>
            }
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
