import * as React from 'react';
import { Button, Box, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Chip, useTheme } from '@mui/material';
import CustomizedDataGrid from '../CustomizedDataGrid';
import { GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { Close, AccessTime as TimeIcon } from '@mui/icons-material';

interface LinksDialogProps {
  open: boolean;
  handleClose: () => void;
}

// Colonnes du tableau
const columns: GridColDef[] = [
  { field: 'fileName', headerName: 'Nom du fichier', flex: 1.5, minWidth: 200 },
  {
    field: 'status',
    headerName: 'Status',
    flex: 0.5,
    minWidth: 80,
    renderCell: (params) => renderStatus(params.value as any),
  },
  {
    field: 'visites',
    headerName: 'Visites',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    minWidth: 80,
  },
  {
    field: 'fileLink',
    headerName: 'Lien du fichier',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    minWidth: 100,
  },
  {
    field: 'expirationDate',
    headerName: "Date d'expiration",
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    minWidth: 120,
  },
];

// Fonction pour afficher le statut du fichier
function renderStatus(status: 'Online' | 'Offline') {
  const colors: { [index: string]: 'success' | 'default' } = {
    Online: 'success',
    Offline: 'default',
  };
  return <Chip label={status} color={colors[status]} size="small" />;
}

// Données de test pour les fichiers
const initialRows: GridRowsProp = [
  { id: 1, fileName: 'Fichier 1', status: 'Online', visites: 10, fileLink: 'https://example.com/file1', expirationDate: '2023-12-31' },
  { id: 2, fileName: 'Fichier 2', status: 'Offline', visites: 5, fileLink: 'https://example.com/file2', expirationDate: '2023-12-31' },
  { id: 3, fileName: 'Fichier 3', status: 'Online', visites: 15, fileLink: 'https://example.com/file3', expirationDate: '2023-12-31' },
  { id: 4, fileName: 'Fichier 4', status: 'Offline', visites: 20, fileLink: 'https://example.com/file4', expirationDate: '2023-12-31' },
  { id: 5, fileName: 'Fichier 5', status: 'Online', visites: 25, fileLink: 'https://example.com/file5', expirationDate: '2023-12-31' },
];

export default function LinksDialog({ open, handleClose }: LinksDialogProps) {
  const [rows, setRows] = React.useState(initialRows);
  const [selectedLinks, setSelectedLinks] = React.useState<string[]>([]);
  const theme = useTheme();

  const handleMakeUnavailable = () => {
    const updatedRows = rows.map((row) =>
      selectedLinks.includes(row.id.toString()) ? { ...row, status: 'Offline' } : row
    );
    setRows(updatedRows);
    setSelectedLinks([]);
  };

  return (
    <Dialog
      onClick={(e) => e.stopPropagation()}  
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { backgroundImage: 'none', minWidth: '700px' },
      }}
    >
      <DialogTitle>Mes liens actifs</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
        <Typography component="h2" variant="h6">
          Liens sélectionnés : {selectedLinks.length > 0 && `(${selectedLinks.length} sélectionnés)`}
        </Typography>
        <CustomizedDataGrid rows={rows} columns={columns} setSelectedRows={setSelectedLinks} />
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          disabled={selectedLinks.length === 0}
          color="error"
          onClick={handleMakeUnavailable}
          startIcon={<Close />}
        >
          Rendre indisponible
        </Button>
        <Button onClick={handleClose} variant="contained">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
