import * as React from 'react';
import { Button, Box, Typography, useTheme, Chip } from '@mui/material';
import Copyright from '../internals/components/Copyright';
import ExpirationDialog from './dialog/ExpirationDialog'; // Importez le ExpirationDialog
import CustomizedDataGrid from './CustomizedDataGrid';
import Grid2 from '@mui/material/Grid2';
import { Check, Close } from '@mui/icons-material';
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
function renderStatus(status: '0' | '1', expiration: string) {
    const colors: { [index: string]: 'success' | 'default' | 'error' } = {
        '0': 'default',
        '1': 'success',
        '3': 'error',
    };

    const isDateExpired = new Date(expiration) < new Date();

    return <Chip label={isDateExpired ? "Expired" : status == '0' ? "Offline" : "Online"} color={colors[!isDateExpired ? status : '3']} size="small" />;
}

function renderLink(link:string, fileId: string | number) {
    return `https://www.plugzer.sebastien-gratade.fr/api/file/${fileId}?token=${link}`;
}

//renderdate affiche date d'expiration + heure et minute
// si c'est dépassé on l'affiche en rouge

function renderDate(date: string) {
    const expirationDate = new Date(date);
    const now = new Date();
    const isExpired = expirationDate < now;

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="end"
            height="100%"
        >
            <Typography color={isExpired ? 'error' : 'initial'}>
                {expirationDate.toLocaleString()}
            </Typography>
        </Box>
    );
}


// Colonnes du tableau
const columns: GridColDef[] = [
    {
        field: 'fileId',
        headerName: 'fileID',
        flex: 0.5,
        //@ts-ignore
        hide: true,
    },
    {
        field: 'id',
        headerName: 'ID',
        flex: 0.5,
        //@ts-ignore
        hide: true,
        minWidth: 80,
    },
    {
         field: 'nom', headerName: 'Nom du fichier', flex: 1, minWidth: 200
    },
    {
        field: 'isOnline',
        headerName: 'Status',
        flex: 0.5,
        minWidth: 80,
        renderCell: (params) => renderStatus(params.value as any, params.row.expiration),
    },
    {
        field: 'visites',
        headerName: 'Visites',
        headerAlign: 'right',
        align: 'right',
        flex: 0.3,
        minWidth: 80,
    },
    {
        field: 'link',
        headerName: 'Lien du fichier',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 100,
        renderCell: (params) => renderLink(params.value as any, params.row.fileId),
    },
    {
        field: 'expiration',
        headerName: "Date d'expiration",
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 120,
        renderCell: (params) => renderDate(params.value as any),
    },
];


export default function LinksGrid() {
    const [unselectRows, setUnselectRows] = React.useState(false);
    const [openExpirationDialog, setOpenExpirationDialog] = React.useState(false); // Etat pour ExpirationDialog
    const [selectedLinks, setSelectedLinks] = React.useState<string[]>([]);
    const [rows, setRows] = React.useState<GridRowsProp>([]); // État pour les ligne
    const theme = useTheme();

    const fetchData = async () => {
        const authInfos = localStorage.getItem('authInfos');
        if (authInfos) {
          const { token } = JSON.parse(authInfos);

            try {
                const response = await fetch('/api/links', {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
                });
    
                const result = await response.json();
                if (response.ok) {
                    console.log('Fetched links:', result);
                    setRows(result);
                } else {
                console.error('Failed to fetch links:', result);
                }
            } catch (error) {
                console.error('Failed to fetch links:', error);
            }
        }
    };

    React.useEffect(() => {
        fetchData();
    }, []);

    const [isAnySelectedLinkExpired, setIsAnySelectedLinkExpired] = React.useState(false);
    const [isSelectedLinkDisabled, setIsSelectedLinkDisabled] = React.useState(false);

    React.useEffect(() => {
        setIsAnySelectedLinkExpired(selectedLinks.some((link) => {
            //@ts-ignore
            const expirationDate = new Date(link.expiration);
            const now = new Date();
            return expirationDate < now;
        }));

        console.log(selectedLinks)

        setIsSelectedLinkDisabled(selectedLinks.some((link) => {
            //@ts-ignore
            return link.isOnline == '0';
        }));
    }, [selectedLinks])

    const handleMakeUnavailable = () => {
        const authInfos = localStorage.getItem('authInfos');
        if (authInfos) {
            const { token } = JSON.parse(authInfos);

            selectedLinks.forEach(async (link) => {
                //@ts-ignore
                const linkId = link.id;

                console.log(`Making link ${linkId} unavailable...`);
                try {
                    const response = await fetch(`/api/link/${linkId}/status`, {
                        method: 'PUT',
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    if (response.ok) {
                        fetchData();
                        setSelectedLinks([]);
                        setUnselectRows(true);
                        console.log(`Link ${linkId} made unavailable`);
                    } else {
                        console.error(`Failed to make link ${linkId} unavailable`);
                    }
                } catch (error) {
                    console.error(`Failed to make link ${linkId} unavailable:`, error);
                }
            });
        }
        // Recharger les données après l'action
         // Réinitialiser les liens sélectionnés après l'action
    };

    const handleExtendExpiration = () => {
        setOpenExpirationDialog(true); // Ouvrir le dialogue de sélection de date d'expiration
    };

    const handleExpirationDateSelection = (selectedDate: Date | null) => {
        if (selectedDate) {
            
            console.log('Selected date:', selectedDate);

            const authInfos = localStorage.getItem('authInfos');
            if (authInfos) {
                const { token } = JSON.parse(authInfos);

                selectedLinks.forEach(async (link) => {
                    //@ts-ignore
                    const linkId = link.id;

                    console.log(`Extending expiration date of link ${linkId}...`);
                    try {
                        const response = await fetch(`/api/link/${linkId}/expiration`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({ expiration: selectedDate.toISOString() }),
                        });

                        if (response.ok) {
                            fetchData();
                            setSelectedLinks([]);
                            setUnselectRows(true);
                            console.log(`Expiration date of link ${linkId} extended`);
                        } else {
                            console.error(`Failed to extend expiration date of link ${linkId}`);
                        }
                    } catch (error) {
                        console.error(`Failed to extend expiration date of link ${linkId}:`, error);
                    }
                });
            }

            //setRows(updatedRows);
            //setSelectedLinks([]); // Réinitialiser les liens sélectionnés après l'action
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
                        disabled={selectedLinks.length === 0 || isAnySelectedLinkExpired}
                        color={isSelectedLinkDisabled ? "success" : "error"}
                        onClick={handleMakeUnavailable}
                        startIcon={
                            isSelectedLinkDisabled ? <Check /> :
                        <Close />}
                        sx={{ mr: 1 }}
                    >
                        {
                            isSelectedLinkDisabled ? "Rendre disponible" : "Rendre indisponible"
                        }
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

            <Grid2 size={{ xs: 12, lg: 9 }}
            sx={{ minHeight: '70vh', minWidth: '100%'}}
            >
                <CustomizedDataGrid 
                    unselectRows={unselectRows}
                    setUnselectRows={setUnselectRows}
                    rows={rows}
                    columns={columns}
                    setSelectedRows={setSelectedLinks}
                />
            </Grid2>

            <Copyright sx={{ my: 4 }} />

            <ExpirationDialog
                open={openExpirationDialog}
                handleClose={() => setOpenExpirationDialog(false)}
                onSelectExpiration={handleExpirationDateSelection}
            />
        </Box>
    );
}
