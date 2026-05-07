import { Link } from 'react-router-dom';
import { Container, Box, Typography, Button } from '@mui/material';
import { ROUTES } from '../utils/constants';

const NotFoundPage = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" gutterBottom>
          Pagina Non Trovata
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          La pagina che stai cercando non esiste.
        </Typography>
        <Button component={Link} to={ROUTES.HOME} variant="contained" size="large">
          Torna alla Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
