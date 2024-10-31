import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { SitemarkIcon } from './CustomIcons';
import { CloudUploadRounded, LockRounded, ShareRounded, SpeedRounded } from '@mui/icons-material';

const items = [
  {
    icon: <CloudUploadRounded sx={{ color: 'text.secondary' }} />,
    title: 'Simple file uploads',
    description:
      'Upload your files quickly and easily, with support for large file sizes and secure storage.',
  },
  {
    icon: <LockRounded sx={{ color: 'text.secondary' }} />,
    title: 'Secure storage',
    description:
      'Your files are protected with high-level encryption, ensuring that your data remains private and secure.',
  },
  {
    icon: <ShareRounded sx={{ color: 'text.secondary' }} />,
    title: 'Easy sharing',
    description:
      'Effortlessly share files with others using customizable link options and expiration controls.',
  },
  {
    icon: <SpeedRounded sx={{ color: 'text.secondary' }} />,
    title: 'Fast and reliable',
    description:
      'Enjoy quick upload and download speeds, with reliable performance for all your storage needs.',
  },
];

export default function Content() {
  return (
    <Stack
      sx={{ flexDirection: 'column', alignSelf: 'center', gap: 4, maxWidth: 450 }}
    >
      <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
        <SitemarkIcon />
      </Box>
      {items.map((item, index) => (
        <Stack key={index} direction="row" sx={{ gap: 2 }}>
          {item.icon}
          <div>
            <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
              {item.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item.description}
            </Typography>
          </div>
        </Stack>
      ))}
    </Stack>
  );
}
