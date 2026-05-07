import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../utils/constants';

const CallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleAuth0Callback } = useAuth();

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      handleAuth0Callback(code).then((result) => {
        if (result.success) {
          navigate(ROUTES.DASHBOARD);
        } else {
          navigate(ROUTES.LOGIN);
        }
      });
    } else {
      navigate(ROUTES.LOGIN);
    }
  }, [searchParams, handleAuth0Callback, navigate]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Autenticazione in corso...
        </Typography>
      </Box>
    </Container>
  );
};

export default CallbackPage;
