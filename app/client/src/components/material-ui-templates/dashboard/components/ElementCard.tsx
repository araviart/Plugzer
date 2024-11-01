import { Box, Card, CardContent, Stack, Typography, Icon, useTheme } from '@mui/material'
import FolderIcon from '@mui/icons-material/Folder'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import { Directory, File } from './FilesGrid'
import CardDropdown from './CardDropDown'
import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

type Props = {
    element: Directory | File,
    onChange: () => void
}

export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 octets';
    const units = ['octets', 'Ko', 'Mo', 'Go', 'To', 'Po', 'Eo'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = (bytes / Math.pow(1024, i)).toFixed(2);
    return `${size} ${units[i]}`;
}

export default function ElementCard(props: Props) {
    const theme = useTheme()
    const [imageExists, setImageExists] = useState(false)
    const [previewImageSrc, setPreviewImageSrc] = useState<string | null>(null)

    // Détecter si c'est un fichier ou un dossier
    const isFile = 'taille_fichier' in props.element

    const location = useLocation();

    useEffect(() => {
        const checkImageExists = async () => {
            const authInfos = localStorage.getItem('authInfos');
            if (authInfos) {
                const { token } = JSON.parse(authInfos);

                try {
                    const response = await fetch(`http://localhost:3000/api/file/${props.element.id}/preview`, {
                        method: 'GET',
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    if (response.ok) {
                        const blob = await response.blob();
                        const fileURL = URL.createObjectURL(blob);
                        setPreviewImageSrc(fileURL); // Mettre à jour la source de l'image
                        setImageExists(true);
                    } else {
                        setImageExists(false);
                    }
                } catch (error) {
                    setImageExists(false);
                }
            }
        };

        if (isFile) {
            checkImageExists()  ;
        }
        else{
            setImageExists(false);
        }
    }, [props.element.id, isFile]);

    const handleClick = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (isFile) {
            e.preventDefault();
            e.stopPropagation();

            console.log('File clicked:', props.element);

            const authInfos = localStorage.getItem('authInfos');
            if (authInfos) {
                const { token } = JSON.parse(authInfos);

                try {
                    const response = await fetch(`http://localhost:3000/api/file/${props.element.id}`, {
                        method: 'GET',
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    if (response.ok) {
                        const blob = await response.blob();
                        const fileURL = URL.createObjectURL(blob);
                        window.open(fileURL, '_blank'); // Ouvre le fichier dans un nouvel onglet
                    } else {
                        console.error("Erreur lors de la récupération du fichier:", response.statusText);
                    }
                } catch (error) {
                    console.error("Erreur réseau:", error);
                }
            }
        }
    };

    return (
        <Link
            onClick={handleClick}
            to={isFile ? location.pathname : location.pathname + "/" + props.element.nom} style={{ textDecoration: 'none' }}>
            <Box sx={{ position: 'relative', marginBottom: 4 }}>
                <Card
                    variant={isFile ? 'outlined' : 'elevation'}
                    sx={{
                        minHeight: 250,
                        flexGrow: 1,
                        bgcolor: !isFile ? theme.palette.primary.main : 'inherit',
                        transition: '0.3s ease', // Animation lors du survol
                        '&:hover': {
                            bgcolor: !isFile ? theme.palette.primary.dark : theme.palette.primary.light, // Changer la couleur de fond
                            boxShadow: 3, // Légère ombre lors du survol
                        },
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: 1,
                    }}
                >
                    <CardContent sx={{ padding: 1, flexGrow: 1 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography component="h2" variant="subtitle2" noWrap sx={{ maxWidth: '80%' }}>
                                {props.element.nom}
                            </Typography>
                            <CardDropdown
                                onChange={props.onChange}
                                element={props.element} />
                        </Stack>

                        <Box
                            sx={{
                                display: 'flex',
                                flexGrow: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                my: 2
                            }}
                        >
                            {imageExists && previewImageSrc ? (
                                <Box
                                    component="img"
                                    src={previewImageSrc} // Utiliser l'URL blob ici
                                    alt="preview"
                                    sx={{
                                        width: 100,
                                        height: 100,
                                        borderRadius: '0',
                                        objectFit: 'cover'
                                    }}
                                />
                            ) : (
                                <Icon sx={{ fontSize: 100, position: 'relative', top: 8 }}>
                                    {isFile ? <InsertDriveFileIcon fontSize="inherit" /> : <FolderIcon fontSize="inherit" />}
                                </Icon>
                            )}
                        </Box>

                        <Stack direction="row" justifyContent="end" alignItems="center"
                            sx={{ position: 'relative', top: 30 }}
                        >
                            <Typography variant="caption">
                                {
                                    //@ts-ignore
                                    (props.element && props.element.taille_fichier !== undefined) ? formatFileSize(props.element!.taille_fichier) : ''}
                            </Typography>
                        </Stack>
                    </CardContent>
                </Card>

                <Typography variant="caption" sx={{ color: 'text.secondary', position: 'absolute', bottom: -25 }}>
                    Dernière modification: {props.element.lastOpenedAt ? new Date(props.element.lastOpenedAt).toLocaleDateString() : 'N/A'}
                </Typography>

            </Box>
        </Link>
    )
}
