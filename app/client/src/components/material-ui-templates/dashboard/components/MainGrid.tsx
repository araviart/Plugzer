import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Copyright from '../internals/components/Copyright';
import StatCard, { StatCardProps } from './StatCard';
import { useTheme } from '@mui/material';
import StorageGauge from './StorageGauge';

const data: StatCardProps[] = [
  {
    title: 'Liens actifs',
    value: '500', // Met à jour avec le nombre réel de liens actifs
    interval: 'Comparé au mois dernier',
    trend: 'up',
    data: [
      200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320, 360, 340, 380,
      360, 400, 380, 420, 400, 640, 340, 460, 440, 480, 460, 600, 880, 920,
    ],
  },
  {
    title: 'Téléchargements',
    value: '1.2k', // Met à jour avec le nombre réel de téléchargements
    interval: 'Comparé au mois dernier',
    trend: 'down',
    data: [
      1640, 1250, 970, 1130, 1050, 900, 720, 1080, 900, 450, 920, 820, 840, 600, 820,
      780, 800, 760, 380, 740, 660, 620, 840, 500, 520, 480, 400, 360, 300, 220,
    ],
  },  
];

export default function MainGrid() {

  const theme = useTheme();

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' }, minHeight: "100vh", minWidth:"100%" }}>
      {/* cards */}
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
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StorageGauge />
        </Grid>
        {data.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>

      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Récents
      </Typography>


      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
