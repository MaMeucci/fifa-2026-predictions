import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Alert,
  Tooltip,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { ROUTES, VALIDATION } from '../utils/constants';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    // Clear validation error for this field
    if (validationErrors[e.target.name]) {
      setValidationErrors({
        ...validationErrors,
        [e.target.name]: '',
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    // Username validation
    if (formData.username.length < VALIDATION.USERNAME_MIN) {
      errors.username = `L'username deve essere di almeno ${VALIDATION.USERNAME_MIN} caratteri`;
    } else if (formData.username.length > VALIDATION.USERNAME_MAX) {
      errors.username = `L'username non può superare ${VALIDATION.USERNAME_MAX} caratteri`;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = 'Inserisci un indirizzo email valido';
    }

    // Password validation
    if (formData.password.length < VALIDATION.PASSWORD_MIN) {
      errors.password = `La password deve essere di almeno ${VALIDATION.PASSWORD_MIN} caratteri`;
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Le password non coincidono';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    const { confirmPassword, ...registrationData } = formData;
    const result = await register(registrationData);

    if (result.success) {
      navigate(ROUTES.DASHBOARD);
    } else {
      setError(result.error || 'Errore durante la registrazione');
    }

    setLoading(false);
  };

  const handleAuth0Register = () => {
    // TODO: Implement Auth0 registration
    console.log('Auth0 registration');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Registrati
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Crea un account per partecipare al gioco dei pronostici FIFA 2026
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              error={!!validationErrors.username}
              helperText={validationErrors.username}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              error={!!validationErrors.email}
              helperText={validationErrors.email}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              error={!!validationErrors.password}
              helperText={validationErrors.password || `Minimo ${VALIDATION.PASSWORD_MIN} caratteri`}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Conferma Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              error={!!validationErrors.confirmPassword}
              helperText={validationErrors.confirmPassword}
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
            >
              {loading ? 'Registrazione in corso...' : 'Registrati'}
            </Button>
          </form>

          <Divider sx={{ my: 3 }}>oppure</Divider>

          <Tooltip title="Disponibile prossimamente" arrow>
            <span>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                disabled
                sx={{ mb: 2 }}
              >
                Registrati con Auth0
              </Button>
            </span>
          </Tooltip>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              Hai già un account?{' '}
              <Link to={ROUTES.LOGIN} style={{ textDecoration: 'none' }}>
                Accedi
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;

// Made with Bob
