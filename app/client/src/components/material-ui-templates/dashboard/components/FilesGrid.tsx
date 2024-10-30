import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent'; // Ajout de CardContent
import Copyright from '../internals/components/Copyright';
import ChartUserByCountry from './ChartUserByCountry';
import CustomizedTreeView from './CustomizedTreeView';
import CustomizedDataGrid from './CustomizedDataGrid';
import HighlightedCard from './HighlightedCard';
import PageViewsBarChart from './PageViewsBarChart';
import SessionsChart from './SessionsChart';
import StatCard, { StatCardProps } from './StatCard';
import { Card, useTheme } from '@mui/material';
import StorageGauge from './StorageGauge';
import { FieldValueType } from '@mui/x-date-pickers';
import ElementCard from './ElementCard';

export interface File {
    id: string;
    name: string;
    type: 'image' | 'video' | 'audio' | 'document' | 'other';
    previewImage?: string;
    lastOpenedAt?: Date;
} 

export interface Directory {
    name: string;
    lastOpenedAt: Date;
}

interface treeViewData {
    elements: (File | Directory)[];
}

const data: treeViewData = {
    elements: [
        { name: 'dossier 1', lastOpenedAt: new Date() },
        { name: 'dossier 2', lastOpenedAt: new Date() },
        { name: 'dossier 3', lastOpenedAt: new Date() },
        { name: 'dossier 4', lastOpenedAt: new Date() },
        {
            id: 'image1',
            name: 'image1',
            type: 'image',
            previewImage: 'https://via.placeholder.com/150',
            lastOpenedAt: new Date()
        },
        {
            id: 'image2',
            name: 'image2',
            type: 'image',
            previewImage: 'https://via.placeholder.com/150',
            lastOpenedAt: new Date()
        },
        { id: 'pdf1', name: 'pdf1', type: 'document', lastOpenedAt: new Date() },
        { id: 'pdf2', name: 'pdf2', type: 'document', lastOpenedAt: new Date() },
        { id: 'fichierTexte1', name: 'fichierTexte1', type: 'document', lastOpenedAt: new Date() }
    ]
};

export default function FilesGrid() {
  const theme = useTheme();

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' }, minHeight: "100vh", minWidth:"100%" }}>
      <Typography component="h1" variant="h6" sx={{ mb: 2 }}>
        Bonjour <span style={{ fontWeight: 'bold', color: theme.palette.primary.main }}>NOMUTILISATEUR</span> !
      </Typography>

      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>

      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: theme.spacing(2) }}
      >
        {data.elements?.map((element, index) => (
          <Grid item key={index} xs={12} sm={6} lg={3}>
              <ElementCard element={element} />
          </Grid>
        ))}
      </Grid>
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
