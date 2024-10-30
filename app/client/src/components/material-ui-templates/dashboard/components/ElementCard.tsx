import { Box, Card, CardContent, Stack, Typography, Icon, useTheme } from '@mui/material'
import FolderIcon from '@mui/icons-material/Folder'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import React from 'react'
import { Directory, File } from './FilesGrid'

export default function ElementCard(props: { element: Directory | File }) {
    const theme = useTheme()

    // Détecter si c'est un fichier ou un dossier
    const isFile = 'id' in props.element
    const hasPreview = isFile && (props.element as File).previewImage

    return (
        <Box sx={{ position: 'relative', marginBottom: 4 }}>
            <Card
                variant={isFile ? 'outlined' : 'elevation'}
                sx={{
                    minHeight: 250,
                    flexGrow: 1,
                    bgcolor: !isFile ? theme.palette.primary.main : 'inherit',
                    //color: !isFile ? theme.palette.primary.contrastText : 'text.primary',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: 1
                }}
            >
                <CardContent sx={{ padding: 1, flexGrow: 1 }}>
                    {/* Nom avec points de suspension et ... à droite */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography component="h2" variant="subtitle2" noWrap sx={{ maxWidth: '80%' }}>
                            {props.element.name}
                        </Typography>
                        <Typography variant="subtitle2">...</Typography>
                    </Stack>

                    {/* Preview ou icône centrée verticalement et légèrement descendue */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexGrow: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            my: 2
                        }}
                    >
                        {hasPreview ? (
                            <Box
                                component="img"
                                src={(props.element as File).previewImage}
                                alt="preview"
                                sx={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: '50%',
                                    objectFit: 'cover'
                                }}
                            />
                        ) : (
                            <Icon sx={{ fontSize: 100, position: 'relative', top: 8 }}> {/* Légère descente de l'icône */}
                                {isFile ? <InsertDriveFileIcon fontSize="inherit" /> : <FolderIcon fontSize="inherit" />}
                            </Icon>
                        )}
                    </Box>
                </CardContent>
            </Card>
            
            {/* Date de dernière modification en bas de la carte avec espace */}
            <Typography variant="caption" sx={{ color: 'text.secondary', position: 'absolute', bottom: -25 }}>
                Dernière modification: {props.element.lastOpenedAt?.toLocaleDateString()}
            </Typography>
        </Box>
    )
}
