import { Link } from 'react-router-dom';
import { Container, Box, Typography, Button, Grid, Card, CardContent, Tooltip } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { ROUTES, TOURNAMENT_CONFIG } from '../utils/constants';
import SportsIcon from '@mui/icons-material/Sports';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LockIcon from '@mui/icons-material/Lock';

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  
  // Check if tournament has started (for demo purposes, using a mock date)
  const tournamentStarted = new Date() >= new Date(TOURNAMENT_CONFIG.startDate);

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
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
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
            <Box sx={{ maxWidth: 900, mx: 'auto' }}>
              {/* 4 Main Action Buttons in 2x2 Grid */}
              <Grid container spacing={3}>
                {/* I Miei Pronostici */}
                <Grid item xs={12} md={6}>
                  <Card
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      boxShadow: 2,
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 8
                      }
                    }}
                    component={Link}
                    to={ROUTES.PREDICTIONS}
                    style={{ textDecoration: 'none' }}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                      <EditIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                      <Typography variant="h5" gutterBottom color="primary">
                        I Miei Pronostici
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Inserisci o modifica i tuoi pronostici personali
                      </Typography>
                      <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        startIcon={<EditIcon />}
                      >
                        Vai ai Pronostici
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
                
                {/* Vai alla Classifica */}
                <Grid item xs={12} md={6}>
                  <Card
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      boxShadow: 2,
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 8
                      }
                    }}
                    component={Link}
                    to={ROUTES.DASHBOARD}
                    style={{ textDecoration: 'none' }}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                      <LeaderboardIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                      <Typography variant="h5" gutterBottom color="success.main">
                        Vai alla Classifica
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Visualizza la classifica e i punteggi in tempo reale
                      </Typography>
                      <Button
                        variant="contained"
                        color="success"
                        size="large"
                        fullWidth
                        startIcon={<LeaderboardIcon />}
                      >
                        Vedi Classifica
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Sistema Punteggi */}
                <Grid item xs={12} md={5}>
                  <Card
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      boxShadow: 2,
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 8
                      }
                    }}
                    component={Link}
                    to={ROUTES.SCORING_RULES}
                    style={{ textDecoration: 'none' }}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                      <EmojiEventsIcon sx={{ fontSize: 60, color: 'warning.main', mb: 2 }} />
                      <Typography variant="h5" gutterBottom color="warning.main">
                        Sistema Punteggi
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Scopri come vengono assegnati i punti
                      </Typography>
                      <Button
                        variant="contained"
                        color="warning"
                        size="large"
                        fullWidth
                        startIcon={<EmojiEventsIcon />}
                      >
                        Vedi Regole
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Pronostici Completi */}
                <Grid item xs={12} md={7}>
                  <Tooltip
                    title={!tournamentStarted ? "Disponibile dall'inizio del torneo (11 Giugno 2026)" : ""}
                    arrow
                  >
                    <span>
                      <Card
                        sx={{
                          height: '100%',
                          cursor: tournamentStarted ? 'pointer' : 'not-allowed',
                          transition: 'all 0.3s',
                          opacity: tournamentStarted ? 1 : 0.6,
                          boxShadow: 2,
                          '&:hover': tournamentStarted ? {
                            transform: 'translateY(-4px)',
                            boxShadow: 8
                          } : {}
                        }}
                        component={tournamentStarted ? Link : 'div'}
                        to={tournamentStarted ? ROUTES.ALL_PREDICTIONS : undefined}
                        style={{ textDecoration: 'none' }}
                      >
                        <CardContent sx={{ textAlign: 'center', py: 4 }}>
                          <Box sx={{ position: 'relative', display: 'inline-block' }}>
                            <VisibilityIcon sx={{ fontSize: 60, color: tournamentStarted ? 'secondary.main' : 'grey.500', mb: 2 }} />
                            {!tournamentStarted && (
                              <LockIcon
                                sx={{
                                  position: 'absolute',
                                  top: 0,
                                  right: -10,
                                  fontSize: 30,
                                  color: 'warning.main'
                                }}
                              />
                            )}
                          </Box>
                          <Typography variant="h5" gutterBottom color={tournamentStarted ? 'secondary' : 'text.secondary'}>
                            Pronostici Completi
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Visualizza i pronostici di tutti i giocatori
                          </Typography>
                          <Button
                            variant={tournamentStarted ? "contained" : "outlined"}
                            color="secondary"
                            size="large"
                            fullWidth
                            disabled={!tournamentStarted}
                            startIcon={tournamentStarted ? <VisibilityIcon /> : <LockIcon />}
                          >
                            {tournamentStarted ? 'Vedi Tutti' : 'Bloccato'}
                          </Button>
                        </CardContent>
                      </Card>
                    </span>
                  </Tooltip>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>


        {/* How it Works Section */}
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom>
            Come Funziona
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={3}>
              <Typography variant="h6" color="primary" gutterBottom>
                1. Registrati
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Crea un account gratuito o accedi con Auth0
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h6" color="primary" gutterBottom>
                2. Inserisci Pronostici
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Prevedi risultati, squadre qualificate e capocannoniere
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h6" color="primary" gutterBottom>
                3. Guadagna Punti
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Accumula punti per ogni pronostico corretto
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h6" color="primary" gutterBottom>
                4. Vinci
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
