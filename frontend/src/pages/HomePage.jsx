import { Link } from 'react-router-dom';
import { Container, Box, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { ROUTES, TOURNAMENT_CONFIG } from '../utils/constants';
import SportsIcon from '@mui/icons-material/Sports';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 8 }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h1" component="h1" gutterBottom>
            🏆 FIFA World Cup 2026
          </Typography>
          <Typography variant="h4" color="text.secondary" gutterBottom>
            Pronostici e Classifiche
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            {TOURNAMENT_CONFIG.hosts.join(' • ')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            Partecipa al gioco dei pronostici sul Mondiale di Calcio 2026!
            Prevedi i risultati delle partite, le squadre qualificate e vinci punti.
          </Typography>
          
          {!isAuthenticated ? (
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                component={Link}
                to={ROUTES.REGISTER}
                variant="contained"
                size="large"
                sx={{ px: 4 }}
              >
                Registrati
              </Button>
              <Button
                component={Link}
                to={ROUTES.LOGIN}
                variant="outlined"
                size="large"
                sx={{ px: 4 }}
              >
                Accedi
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                component={Link}
                to={ROUTES.PREDICTIONS}
                variant="contained"
                size="large"
                sx={{ px: 4 }}
              >
                I Miei Pronostici
              </Button>
              <Button
                component={Link}
                to={ROUTES.DASHBOARD}
                variant="outlined"
                size="large"
                sx={{ px: 4 }}
              >
                Classifica
              </Button>
            </Box>
          )}
        </Box>

        {/* Features Section */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', textAlign: 'center' }}>
              <CardContent>
                <SportsIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Pronostici Completi
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Prevedi i risultati di tutte le 104 partite del mondiale, dalla fase a gironi alla finale.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', textAlign: 'center' }}>
              <CardContent>
                <LeaderboardIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Classifica Dinamica
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Segui la classifica in tempo reale e confronta i tuoi punteggi con gli altri giocatori.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', textAlign: 'center' }}>
              <CardContent>
                <EmojiEventsIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Sistema Punteggi
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Guadagna punti per risultati esatti, segni corretti e pronostici sulla fase finale.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* How it Works Section */}
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom>
            Come Funziona
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" color="primary" gutterBottom>
                1. Registrati
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Crea un account gratuito o accedi con Auth0
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" color="primary" gutterBottom>
                2. Inserisci Pronostici
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Prevedi risultati, squadre qualificate e capocannoniere
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" color="primary" gutterBottom>
                3. Guadagna Punti
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Accumula punti per ogni pronostico corretto
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" color="primary" gutterBottom>
                4. Vinci!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Scala la classifica e diventa il campione
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* CTA Section */}
        {!isAuthenticated && (
          <Box sx={{ mt: 8, textAlign: 'center', bgcolor: 'primary.main', color: 'white', p: 6, borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom>
              Pronto a Iniziare?
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Registrati ora e inizia a fare i tuoi pronostici!
            </Typography>
            <Button
              component={Link}
              to={ROUTES.REGISTER}
              variant="contained"
              size="large"
              sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
            >
              Registrati Gratis
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default HomePage;

// Made with Bob
