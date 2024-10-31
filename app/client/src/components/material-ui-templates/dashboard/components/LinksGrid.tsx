import * as React from 'react';
import { Button, Box, Typography, useTheme, Chip } from '@mui/material';
import Copyright from '../internals/components/Copyright';
import AddFileDialog from './dialog/AddFileDialog';
import ExpirationDialog from './dialog/ExpirationDialog'; // Importez le ExpirationDialog
import CustomizedDataGrid from './CustomizedDataGrid';
import Grid2 from '@mui/material/Grid2';
import { Close } from '@mui/icons-material';
import { GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { TimeIcon } from '@mui/x-date-pickers';

// Interface pour un fichier
export interface File {
    id: string;
    name: string;
    type: 'image' | 'video' | 'audio' | 'document' | 'other';
    previewImage?: string;
    lastOpenedAt?: Date;
}

// Interface pour un répertoire
export interface Directory {
    name: string;
    lastOpenedAt: Date;
}

// Fonction pour rendre le statut d'un fichier
function renderStatus(status: 'Online' | 'Offline') {
    const colors: { [index: string]: 'success' | 'default' } = {
        Online: 'success',
        Offline: 'default',
    };

    return <Chip label={status} color={colors[status]} size="small" />;
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

// Données de test pour les fichiers
const initialRows: GridRowsProp = [
    { id: 1, fileName: 'Fichier 1', status: 'Online', visites: 10, fileLink: 'https://example.com/file1', expirationDate: '2023-12-31' },
    { id: 2, fileName: 'Fichier 2', status: 'Offline', visites: 5, fileLink: 'https://example.com/file2', expirationDate: '2023-12-31' },
    { id: 3, fileName: 'Fichier 3', status: 'Online', visites: 15, fileLink: 'https://example.com/file3', expirationDate: '2023-12-31' },
    { id: 4, fileName: 'Fichier 4', status: 'Offline', visites: 20, fileLink: 'https://example.com/file4', expirationDate: '2023-12-31' },
    { id: 5, fileName: 'Fichier 5', status: 'Online', visites: 25, fileLink: 'https://example.com/file5', expirationDate: '2023-12-31' },
];

export default function LinksGrid() {
    const [openFileDialog, setOpenFileDialog] = React.useState(false);
    const [openExpirationDialog, setOpenExpirationDialog] = React.useState(false); // Etat pour ExpirationDialog
    const [selectedLinks, setSelectedLinks] = React.useState<string[]>([]);
    const [rows, setRows] = React.useState(initialRows); // État pour les ligne
    const theme = useTheme();

    const handleMakeUnavailable = () => {
        const updatedRows = rows.map((row) => {
            if (selectedLinks.includes(row.id.toString())) {
                return { ...row, status: 'Offline' }; // Mettre à jour le statut à 'Offline'
            }
            return row;
        });
        setRows(updatedRows);
        setSelectedLinks([]); // Réinitialiser les liens sélectionnés après l'action
    };

    const handleExtendExpiration = () => {
        setOpenExpirationDialog(true); // Ouvrir le dialogue de sélection de date d'expiration
    };

    const handleExpirationDateSelection = (selectedDate: Date | null) => {
        if (selectedDate) {
            const updatedRows = rows.map((row) => {
                if (selectedLinks.includes(row.id.toString())) {
                    return { ...row, expirationDate: selectedDate.toISOString().split('T')[0] }; // Mettre à jour la date d'expiration
                }
                return row;
            });
            setRows(updatedRows);
            setSelectedLinks([]); // Réinitialiser les liens sélectionnés après l'action
        }
        setOpenExpirationDialog(false); // Fermer le dialogue
    };

    return (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' }, minHeight: "100vh", minWidth: "100%" }}>
            <Typography component="h1" variant="h6" sx={{ mb: 2 }}>
                Bonjour <span style={{ fontWeight: 'bold', color: theme.palette.primary.main }}>{JSON.parse(localStorage.getItem('authInfos')!).name}   </span>  !
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography component="h2" variant="h6">
                    Mes liens actifs {selectedLinks.length > 0 && `(${selectedLinks.length} sélectionnés)`}
                </Typography>
                <Box>
                    <Button
                        variant="contained"
                        disabled={selectedLinks.length === 0}
                        color="error"
                        onClick={handleMakeUnavailable}
                        startIcon={<Close />}
                        sx={{ mr: 1 }}
                    >
                        Rendre indisponible
                    </Button>
                    <Button
                        variant="contained"
                        disabled={selectedLinks.length === 0}
                        startIcon={<TimeIcon />}
                        color={selectedLinks.length === 0 ? "inherit" : "primary"}
                        onClick={handleExtendExpiration}
                    >
                        Prolonger l'expiration
                    </Button>
                </Box>
            </Box>

            <Grid2 size={{ xs: 12, lg: 9 }}>
                <CustomizedDataGrid 
                    rows={rows}
                    columns={columns}
                    setSelectedRows={setSelectedLinks}
                />
            </Grid2>

            <Copyright sx={{ my: 4 }} />

            <AddFileDialog open={openFileDialog} handleClose={() => setOpenFileDialog(false)} />
            <ExpirationDialog
                open={openExpirationDialog}
                handleClose={() => setOpenExpirationDialog(false)}
                onSelectExpiration={handleExpirationDateSelection}
            />
        </Box>
    );
}
