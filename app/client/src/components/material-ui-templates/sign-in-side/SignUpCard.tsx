import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import { SitemarkIcon, GoogleIcon, FacebookIcon } from './CustomIcons';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
}));

export default function SignUpCard() {
  const [formErrors, setFormErrors] = React.useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [signupMessage, setSignupMessage] = React.useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validateInputs()) {
      console.log("Form soumit");
      const data = {
        username: (document.getElementById('username') as HTMLInputElement).value,
        email: (document.getElementById('email') as HTMLInputElement).value,
        password: (document.getElementById('password') as HTMLInputElement).value,
      };

      try {
        const response = await fetch('http://localhost:8090/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();
        if (response.ok) {
          setSignupMessage('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        } else {
          setSignupMessage(result.message || 'Échec de l\'inscription.');
        }
      } catch (error) {
        console.error("Erreur lors de l'inscription:", error);
        setSignupMessage('Erreur du serveur. Veuillez réessayer plus tard.');
      }
    }
  };

  const validateInputs = () => {
    const username = (document.getElementById('username') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const confirmPassword = (document.getElementById('confirmPassword') as HTMLInputElement).value;

    const errors = { username: '', email: '', password: '', confirmPassword: '' };
    let isValid = true;
    if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Veuillez entrer une adresse email valide.';
      isValid = false;
    }
    if (password.length < 6) {
      errors.password = 'Le mot de passe doit contenir au moins 6 caractères.';
      isValid = false;
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas.';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  return (
    <Card variant="outlined">
      <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
        <SitemarkIcon />
      </Box>
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
      >
        Sign up
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
      >
        <FormControl>
          <FormLabel htmlFor="username">Nom d'utilisateur</FormLabel>
          <TextField
            error={!!formErrors.username}
            helperText={formErrors.username}
            id="username"
            name="username"
            placeholder="Nom d'utilisateur"
            required
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
            type="password"
            required
            fullWidth
            variant="outlined"
          />
        </FormControl>
        <Button type="submit" fullWidth variant="contained">
          Sign up
        </Button>
        {signupMessage && (
          <Typography color={signupMessage.includes('réussie') ? 'success.main' : 'error.main'}>
            {signupMessage}
          </Typography>
        )}
        <Typography sx={{ textAlign: 'center' }}>
          Already have an account?{' '}
          <span>
            <RouterLink to="/sign-in">
              <Link variant="body2" sx={{ alignSelf: 'center' }}>
                Sign in
              </Link>
            </RouterLink>
          </span>
        </Typography>
      </Box>
      <Divider>or</Divider>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => alert('Sign in with Google')}
          startIcon={<GoogleIcon />}
        >
          Sign in with Google
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => alert('Sign in with Facebook')}
          startIcon={<FacebookIcon />}
        >
          Sign in with Facebook
        </Button>
      </Box>
    </Card>
  );
}
