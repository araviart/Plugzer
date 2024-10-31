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

// Interface pour un lien de fichier
export interface FileLink {
    id: number;
    fileName: string;
    status: 'active' | 'inactive';  // Updated to match database enum
    visites: number;
    fileLink: string;
    expirationDate: string;
}

// Fonction pour rendre le statut d'un fichier
function renderStatus(status: 'active' | 'inactive') {
    const colors: { [index: string]: 'success' | 'default' } = {
        active: 'success',
        inactive: 'default',
    };

    const labels: { [index: string]: string } = {
        active: 'Actif',
        inactive: 'Inactif',
    };

    return <Chip label={labels[status]} color={colors[status]} size="small" />;
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

export default function LinksGrid() {
    const [openFileDialog, setOpenFileDialog] = React.useState(false);
    const [openExpirationDialog, setOpenExpirationDialog] = React.useState(false); // Etat pour ExpirationDialog
    const [selectedLinks, setSelectedLinks] = React.useState<string[]>([]);
    const [rows, setRows] = React.useState<FileLink[]>([]); // État pour les lignes
    const [isUpdating, setIsUpdating] = React.useState(false);
    const theme = useTheme();

    React.useEffect(() => {
        const fetchLinks = async () => {
            const authInfos = localStorage.getItem('authInfos');
            if (authInfos) {
                const { token } = JSON.parse(authInfos);
                try {
                    const response = await fetch('http://localhost:3000/api/links', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const data = await response.json();
                    // Transform the data to match FileLink interface
                    const transformedData = data.map((item: any) => ({
                        id: item.id,
                        fileName: `File ${item.fichier_id}`, // You might want to fetch actual file names
                        status: item.status,
                        visites: 0, // Add if you have this data
                        fileLink: item.lien,
                        expirationDate: new Date(item.date_expiration).toLocaleDateString()
                    }));
                    setRows(transformedData);
                } catch (error) {
                    console.error('Erreur lors de la récupération des liens:', error);
                }
            }
        };

        fetchLinks();
    }, []);

    const handleMakeUnavailable = async () => {
        const authInfos = localStorage.getItem('authInfos');
        if (!authInfos || isUpdating) return;
        const { token } = JSON.parse(authInfos);
        setIsUpdating(true);
        console.log("selectedLinks", selectedLinks);
        try {
            const response = await fetch('http://localhost:3000/api/links', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ids: selectedLinks,
                    updates: { status: 'inactive' }
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update links');
            }
            const updatedRows = rows.map(row => 
                selectedLinks.includes(row.id.toString())
                    ? { ...row, status: 'inactive' }
                    : row
            );
            
            setRows(updatedRows);
            setSelectedLinks([]);
        } catch (error) {
            console.error('Error updating links:', error);
        } finally {
            setIsUpdating(false);
        }
    }


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
            setSelectedLinks([]); 
        }
        setOpenExpirationDialog(false); 
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