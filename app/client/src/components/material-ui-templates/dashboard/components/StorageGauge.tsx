import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { formatFileSize } from './ElementCard';
import { useStorage } from '../context/StorageContext';

export default function StorageGauge() {

    const location = useLocation();

    const [maxStorage, setMaxStorage] = useState(100);
    const { storageUsageNeedsRefresh, setStorageUsageNeedsRefresh } = useStorage();
    const [usedStorage, setUsedStorage] = useState(75);

    const getStorage = async () => {


        const authInfos = localStorage.getItem('authInfos');
        if (authInfos) {
            const { token } = JSON.parse(authInfos);
            console.log(token)
            const path = location.pathname == "/files" ? null : location.pathname.split('/files/').pop() ?? null;

            try {
                const response = await fetch('http://localhost:3000/api/user/storage', {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` },
                });

                const result = await response.json();
                console.log(result)
                if (response.ok) {
                    // on ferme le dialogue
                    setUsedStorage(result.totalStorageUsed);
                    setMaxStorage(result.maxStorage);
                    console.log(response);
                } else {
                    //setErrorMessage(result.message || 'Échec de l\'ajout du dossier.');
                }
            } catch (error) {
                //setErrorMessage('Erreur du serveur. Veuillez réessayer plus tard.');
            }
        }

        //handleClose(); // Fermer le dialogue
    };

    useEffect(() => {
        if (storageUsageNeedsRefresh){
            getStorage();
            setStorageUsageNeedsRefresh(false);
        }
    }, [storageUsageNeedsRefresh]);

    useEffect(() => {
        getStorage();
    }, []);

    return (
        <Card variant="outlined" sx={{ height: '100%', flexGrow: 1 }}>
            <CardContent>
                <Typography component="h2" variant="subtitle2" gutterBottom>
                    Stockage 
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px' }}>
                    <Gauge
                        value={(usedStorage / maxStorage) * 360}
                        startAngle={0}
                        endAngle={360}  // 360 degrees is a full circle
                        innerRadius="90%"
                        sx={{
                            [`& .${gaugeClasses.valueText}`]: {
                                fontSize: 14,
                                transform: 'translate(0px, 0px)',
                            },
                        }}
                        text={`${Math.round((usedStorage / maxStorage) * 100)}% utilisé`}
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 2 }}>
                    <Typography variant="body2">
                        {formatFileSize(usedStorage)} / {formatFileSize(maxStorage)}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}
