import * as React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { Link, useLocation } from 'react-router-dom';

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
  },
}));

// Mapping for custom display names
const breadcrumbNameMap: { [key: string]: string } = {
  '': 'Home',
  'links': 'Liens',
  'files': 'Fichiers',
};

export default function NavbarBreadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  React.useEffect(() => {
    console.log('location changed', location);
  }, [location])  

  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      <Typography variant="body1">Dashboard</Typography>
      {
        // si on est sur /
        // on affiche Home pas clickable
        location.pathname === "/" && (
          <Typography variant="body1"  sx={{ color: 'text.primary', fontWeight: 600 }}>Home</Typography>
        )
      }
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        // Use custom name if available, otherwise fallback to the segment itself
        const displayName = breadcrumbNameMap[value as keyof typeof breadcrumbNameMap] || value;

        return isLast ? (
          <Typography
            key={to}
            variant="body1"
            sx={{ color: 'text.primary', fontWeight: 600 }}
          >
            {displayName}
          </Typography>
        ) : (
          <Link key={to} to={to} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography variant="body1">{displayName}</Typography>
          </Link>
        );
      })}
    </StyledBreadcrumbs>
  );
}
