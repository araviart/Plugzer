import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { Card, CardContent, Typography, Box } from '@mui/material';

export default function StorageGauge() {
    return (
        <Card variant="outlined" sx={{ height: '100%', flexGrow: 1 }}>
            <CardContent>
                <Typography component="h2" variant="subtitle2" gutterBottom>
                    Storage Usage
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px' }}>
                    <Gauge
                        value={75}
                        startAngle={0}
                        endAngle={360}  // 360 degrees is a full circle
                        innerRadius="90%"
                        sx={{
                            [`& .${gaugeClasses.valueText}`]: {
                                fontSize: 14,
                                transform: 'translate(0px, 0px)',
                            },
                        }}
                        text={({ value, valueMax }) => `${value} / ${valueMax} Go`}
                    />
                </Box>
            </CardContent>
        </Card>
    );
}
