import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

const Card = styled(MuiCard)(({ }) => ({
  // ...existing styles...
}));

export default function SignUpCard() {
  const [formErrors, setFormErrors] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
      const data = new FormData(event.currentTarget);
      const username = data.get('username') as string;
      const email = data.get('email') as string;
      const password = data.get('password') as string;

      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nom: username, email, password }),
        });

        if (response.ok) {
          navigate('/sign-in');
        } else {
          const error = await response.json();
          setFormErrors({ ...formErrors, email: error.message });
        }
      } catch (error) {
        setFormErrors({ ...formErrors, email: 'Erreur lors de l\'inscription. Veuillez réessayer.' });
      }
  };


  return (
    <Card variant="outlined">
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}>
        <FormControl>
          <FormLabel htmlFor="username">Nom d'utilisateur</FormLabel>
          <TextField
            error={!!formErrors.username}
            helperText={formErrors.username}
            id="username"
            name="username"
            placeholder="Nom d'utilisateur"
            required
            autoFocus
            fullWidth
            variant="outlined"
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
          <TextField
            error={!!formErrors.email}
            helperText={formErrors.email}
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            autoComplete="email"
            required
            fullWidth
            variant="outlined"
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="password">Mot de passe</FormLabel>
          <TextField
            error={!!formErrors.password}
            helperText={formErrors.password}
            id="password"
            name="password"
            placeholder="••••••"
            type="password"
            required
            fullWidth
            variant="outlined"
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="confirmPassword">Confirmer mot de passe</FormLabel>
          <TextField
            error={!!formErrors.confirmPassword}
            helperText={formErrors.confirmPassword}
            id="confirmPassword"
            name="confirmPassword"
            placeholder="••••••"
            type="password"
            required
            fullWidth
            variant="outlined"
          />
        </FormControl>
        <Button type="submit" fullWidth variant="contained">
          Sign up
        </Button>
      </Box>
      {/* ...existing JSX... */}
    </Card>
  );
}
