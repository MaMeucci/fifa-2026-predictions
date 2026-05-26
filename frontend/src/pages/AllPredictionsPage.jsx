import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Alert,
  AlertTitle,
  CircularProgress,
  Pagination,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SportsIcon from '@mui/icons-material/Sports';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PersonIcon from '@mui/icons-material/Person';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import api from '../services/api';

const AllPredictionsPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadAllPredictions();
  }, []);

  const loadAllPredictions = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/predictions/all');
      setPredictions(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Errore nel caricamento dei pronostici');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const getSignColor = (sign) => {
    switch (sign) {
      case '1':
        return 'success';
      case 'X':
        return 'warning';
      case '2':
        return 'error';
      default:
        return 'default';
    }
  };

  const getUserInitials = (username) => {
    return username?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  };

  // Calculate points for a single match prediction
  const calculateMatchPoints = (pred) => {
    if (pred.match?.homeScore === undefined || pred.match?.awayScore === undefined) {
      return 0; // Match not played yet
    }

    const actualHomeScore = pred.match.homeScore;
    const actualAwayScore = pred.match.awayScore;
    const predictedHomeScore = pred.homeScore;
    const predictedAwayScore = pred.awayScore;
    const predictedSign = pred.sign;

    let points = 0;

    // Check exact score (6 points)
    const isExactScore = actualHomeScore === predictedHomeScore && actualAwayScore === predictedAwayScore;
    if (isExactScore) {
      points += 6;
    }

    // Check sign (3 points) - ALWAYS checked independently
    const actualSign = actualHomeScore > actualAwayScore ? '1' :
                       actualHomeScore < actualAwayScore ? '2' : 'X';
    if (actualSign === predictedSign) {
      points += 3;
    }

    return points;
  };

  // Get chip color based on points
  const getPointsColor = (points) => {
    if (points === 9) return 'success';      // Verde - risultato esatto + segno
    if (points === 6) return 'warning';      // Giallo - solo risultato esatto (impossibile)
    if (points === 3) return 'orange';       // Arancione - solo segno
    return 'default';                        // Grigio - nessun punto
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Caricamento pronostici...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Alert severity="error">
            <AlertTitle>Errore</AlertTitle>
            {error}
          </Alert>
        </Box>
      </Container>
    );
  }

  // Pagination for group stage
  const paginatedPredictions = predictions.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <VisibilityIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
          <Typography variant="h3" gutterBottom>
            Pronostici Completi
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Visualizza i pronostici di tutti i giocatori
          </Typography>
        </Box>

        {predictions.length === 0 ? (
          <Alert severity="info">
            <AlertTitle>Nessun pronostico disponibile</AlertTitle>
            Non ci sono ancora pronostici bloccati da visualizzare.
          </Alert>
        ) : (
          <>
            {/* Players Summary */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Giocatori Partecipanti ({predictions.length})
                </Typography>
                <Grid container spacing={2}>
                  {predictions.map((pred) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={pred._id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {getUserInitials(pred.user?.username)}
                        </Avatar>
                        <Typography variant="body1">{pred.user?.username}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
                <Tab icon={<SportsIcon />} label="Fase a Gironi" />
                <Tab icon={<EmojiEventsIcon />} label="Fase Finale" />
                <Tab icon={<PersonIcon />} label="Angolo del Capiscione" />
              </Tabs>
            </Box>

            {/* Tab Content - Group Stage */}
            {activeTab === 0 && (
              <Box>
                {paginatedPredictions.map((prediction) => (
                  <Accordion key={prediction._id} sx={{ mb: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {getUserInitials(prediction.user?.username)}
                        </Avatar>
                        <Typography variant="h6">{prediction.user?.username}</Typography>
                        <Chip 
                          label={`${prediction.groupStage?.length || 0} partite`} 
                          size="small" 
                          sx={{ ml: 'auto' }}
                        />
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Match #</TableCell>
                              <TableCell>Gruppo</TableCell>
                              <TableCell>Partita</TableCell>
                              <TableCell align="center">Risultato</TableCell>
                              <TableCell align="center">Segno</TableCell>
                              <TableCell align="center">Punti</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {prediction.groupStage?.map((pred, index) => {
                              const matchPoints = calculateMatchPoints(pred);
                              return (
                                <TableRow key={index}>
                                  <TableCell>
                                    <Chip label={pred.match?.matchNumber || '-'} size="small" />
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={`Gruppo ${pred.match?.group || '-'}`}
                                      size="small"
                                      color="primary"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    {pred.match?.homeTeam?.name || '?'} vs {pred.match?.awayTeam?.name || '?'}
                                  </TableCell>
                                  <TableCell align="center">
                                    <Typography variant="body2" fontWeight="bold">
                                      {pred.homeScore} - {pred.awayScore}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="center">
                                    <Chip
                                      label={pred.sign}
                                      color={getSignColor(pred.sign)}
                                      size="small"
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <Chip
                                      label={matchPoints > 0 ? `${matchPoints} pt` : '-'}
                                      color={getPointsColor(matchPoints)}
                                      size="small"
                                      variant={matchPoints > 0 ? 'filled' : 'outlined'}
                                      sx={matchPoints === 3 ? { bgcolor: '#ff9800', color: 'white' } : {}}
                                    />
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </AccordionDetails>
                  </Accordion>
                ))}
                
                {predictions.length > itemsPerPage && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination
                      count={Math.ceil(predictions.length / itemsPerPage)}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                    />
                  </Box>
                )}
              </Box>
            )}

            {/* Tab Content - Knockout Stage */}
            {activeTab === 1 && (
              <Box>
                {predictions.map((prediction) => (
                  <Accordion key={prediction._id} sx={{ mb: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'secondary.main' }}>
                          {getUserInitials(prediction.user?.username)}
                        </Avatar>
                        <Typography variant="h6">{prediction.user?.username}</Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={3}>
                        {/* Round of 32 */}
                        {prediction.knockoutStage?.round32?.length > 0 && (
                          <Grid item xs={12}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                              Sedicesimi di Finale
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {prediction.knockoutStage.round32.map((team, idx) => (
                                <Chip key={idx} label={team.team?.name || team.name || '-'} color="primary" variant="outlined" />
                              ))}
                            </Box>
                            <Divider sx={{ my: 2 }} />
                          </Grid>
                        )}

                        {/* Round of 16 */}
                        {prediction.knockoutStage?.round16?.length > 0 && (
                          <Grid item xs={12}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                              Ottavi di Finale
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {prediction.knockoutStage.round16.map((team, idx) => (
                                <Chip key={idx} label={team.team?.name || team.name || '-'} color="primary" variant="outlined" />
                              ))}
                            </Box>
                            <Divider sx={{ my: 2 }} />
                          </Grid>
                        )}

                        {/* Quarter Finals */}
                        {prediction.knockoutStage?.quarterFinals?.length > 0 && (
                          <Grid item xs={12}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                              Quarti di Finale
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {prediction.knockoutStage.quarterFinals.map((team, idx) => (
                                <Chip key={idx} label={team.team?.name || team.name || '-'} color="secondary" variant="outlined" />
                              ))}
                            </Box>
                            <Divider sx={{ my: 2 }} />
                          </Grid>
                        )}

                        {/* Semi Finals */}
                        {prediction.knockoutStage?.semiFinals?.length > 0 && (
                          <Grid item xs={12}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                              Semifinali
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {prediction.knockoutStage.semiFinals.map((team, idx) => (
                                <Chip key={idx} label={team.team?.name || team.name || '-'} color="warning" variant="outlined" />
                              ))}
                            </Box>
                            <Divider sx={{ my: 2 }} />
                          </Grid>
                        )}

                        {/* Final */}
                        {prediction.knockoutStage?.final?.length > 0 && (
                          <Grid item xs={12}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                              Finale
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {prediction.knockoutStage.final.map((team, idx) => (
                                <Chip key={idx} label={team.team?.name || team.name || '-'} color="error" />
                              ))}
                            </Box>
                            <Divider sx={{ my: 2 }} />
                          </Grid>
                        )}

                        {/* Final Rankings */}
                        {prediction.finalRankings && (
                          <Grid item xs={12}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                              Podio
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={6} sm={3}>
                                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#FFD700' }}>
                                  <Typography variant="caption">1° Posto</Typography>
                                  <Typography variant="body1" fontWeight="bold">
                                    {prediction.finalRankings.first?.name || '-'}
                                  </Typography>
                                </Paper>
                              </Grid>
                              <Grid item xs={6} sm={3}>
                                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#C0C0C0' }}>
                                  <Typography variant="caption">2° Posto</Typography>
                                  <Typography variant="body1" fontWeight="bold">
                                    {prediction.finalRankings.second?.name || '-'}
                                  </Typography>
                                </Paper>
                              </Grid>
                              <Grid item xs={6} sm={3}>
                                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#CD7F32' }}>
                                  <Typography variant="caption">3° Posto</Typography>
                                  <Typography variant="body1" fontWeight="bold">
                                    {prediction.finalRankings.third?.name || '-'}
                                  </Typography>
                                </Paper>
                              </Grid>
                              <Grid item xs={6} sm={3}>
                                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.300' }}>
                                  <Typography variant="caption">4° Posto</Typography>
                                  <Typography variant="body1" fontWeight="bold">
                                    {prediction.finalRankings.fourth?.name || '-'}
                                  </Typography>
                                </Paper>
                              </Grid>
                            </Grid>
                            <Divider sx={{ my: 2 }} />
                          </Grid>
                        )}

                        {/* Top Scorer */}
                        {prediction.topScorer?.name && (
                          <Grid item xs={12}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                              Capocannoniere
                            </Typography>
                            <Chip
                              label={prediction.topScorer.playerName || prediction.topScorer.name || '-'}
                              color="success"
                              icon={<SportsIcon />}
                            />
                          </Grid>
                        )}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            )}

            {/* Tab Content - Capiscione */}
            {activeTab === 2 && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Angolo del Capiscione
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Giocatore</TableCell>
                          <TableCell>Top</TableCell>
                          <TableCell>Outsider</TableCell>
                          <TableCell>Materasso</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {predictions.map((pred) => (
                          <TableRow key={pred._id}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar sx={{ width: 32, height: 32, bgcolor: 'warning.main', fontSize: '0.875rem' }}>
                                  {getUserInitials(pred.user?.username)}
                                </Avatar>
                                {pred.user?.username}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={pred.capiscione?.top?.name || '-'} 
                                color="success" 
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={pred.capiscione?.outsider?.name || '-'} 
                                color="warning" 
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={pred.capiscione?.materasso?.name || '-'} 
                                color="error" 
                                size="small"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default AllPredictionsPage;

// Made with Bob