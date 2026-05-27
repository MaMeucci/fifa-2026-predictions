import { useState, useEffect, useMemo } from 'react';
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
  const [correctResults, setCorrectResults] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  
  // Define the bracket display order (same as TournamentBracket.jsx)
  // This is the order in which matches appear visually in the bracket
  const BRACKET_DISPLAY_ORDER = useMemo(() => ({
    round32: [1, 4, 0, 2, 10, 11, 8, 9, 3, 5, 6, 7, 13, 15, 12, 14], // matchIndex order from TournamentBracket
    round16: [0, 1, 2, 3, 4, 5, 6, 7], // Sequential for other rounds
    quarterFinals: [0, 1, 2, 3],
    semiFinals: [0, 1]
  }), []);

  useEffect(() => {
    loadAllPredictions();
    loadCorrectResults();
  }, []);

  // Helper function to reorder user predictions according to bracket display order
  const reorderPredictionsByBracket = (predictions) => {
    if (!predictions || !Array.isArray(predictions)) return predictions;
    
    return predictions.map(pred => {
      if (!pred.knockoutStage) return pred;
      
      const reordered = { ...pred };
      reordered.knockoutStage = { ...pred.knockoutStage };
      
      // Reorder round16 (Sedicesimi) according to bracket display order
      if (pred.knockoutStage.round16 && Array.isArray(pred.knockoutStage.round16)) {
        const originalTeams = pred.knockoutStage.round16;
        const reorderedTeams = [];
        
        // Map from bracket display order to original array indices
        BRACKET_DISPLAY_ORDER.round32.forEach(displayIndex => {
          // Each match has 2 teams, so multiply by 2
          const team1Index = displayIndex * 2;
          const team2Index = displayIndex * 2 + 1;
          
          reorderedTeams.push(originalTeams[team1Index] || { team: { name: '', code: '' } });
          reorderedTeams.push(originalTeams[team2Index] || { team: { name: '', code: '' } });
        });
        
        reordered.knockoutStage.round16 = reorderedTeams;
      }
      
      // Other rounds are already in sequential order, no need to reorder
      
      return reordered;
    });
  };

  const loadAllPredictions = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/predictions/all');
      const rawPredictions = response.data.data || [];
      
      // Reorder predictions to match bracket display order
      const reorderedPredictions = reorderPredictionsByBracket(rawPredictions);
      setPredictions(reorderedPredictions);
    } catch (err) {
      setError(err.response?.data?.message || 'Errore nel caricamento dei pronostici');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadCorrectResults = async () => {
    try {
      const response = await api.get('/knockout-results');
      console.log('Knockout results response:', response.data);
      const data = response.data.data;
      
      // Transform KnockoutResults format to match prediction format
      // Extract teams from matches and reorder according to bracket display order
      const transformedResults = {
        round32: [],
        round16: [],
        quarterFinals: [],
        semiFinals: [],
        final: [],
        finalRankings: data?.finalRankings || {},
        topScorer: data?.topScorer || {},
        capiscione: data?.capiscione || {}
      };
      
      // Extract teams from round32 matches (Sedicesimi) and reorder by bracket display order
      if (data?.round32 && Array.isArray(data.round32)) {
        // First, extract all teams in original order
        const allTeams = [];
        data.round32.forEach((match) => {
          allTeams.push({
            name: match.team1?.name || '',
            code: match.team1?.code || ''
          });
          allTeams.push({
            name: match.team2?.name || '',
            code: match.team2?.code || ''
          });
        });
        
        // Then reorder according to bracket display order
        BRACKET_DISPLAY_ORDER.round32.forEach(displayIndex => {
          const team1Index = displayIndex * 2;
          const team2Index = displayIndex * 2 + 1;
          
          transformedResults.round32.push(allTeams[team1Index] || { name: '', code: '' });
          transformedResults.round32.push(allTeams[team2Index] || { name: '', code: '' });
        });
      }
      
      // Extract teams from round16 matches (Ottavi) - keep array order
      if (data?.round16 && Array.isArray(data.round16)) {
        data.round16.forEach((match) => {
          transformedResults.round16.push({
            name: match.team1?.name || '',
            code: match.team1?.code || ''
          });
          transformedResults.round16.push({
            name: match.team2?.name || '',
            code: match.team2?.code || ''
          });
        });
      }
      
      // Extract teams from quarterFinals matches (Quarti) - keep array order
      if (data?.quarterFinals && Array.isArray(data.quarterFinals)) {
        data.quarterFinals.forEach((match) => {
          transformedResults.quarterFinals.push({
            name: match.team1?.name || '',
            code: match.team1?.code || ''
          });
          transformedResults.quarterFinals.push({
            name: match.team2?.name || '',
            code: match.team2?.code || ''
          });
        });
      }
      
      // Extract teams from semiFinals matches (Semifinali) - keep array order
      if (data?.semiFinals && Array.isArray(data.semiFinals)) {
        data.semiFinals.forEach((match) => {
          transformedResults.semiFinals.push({
            name: match.team1?.name || '',
            code: match.team1?.code || ''
          });
          transformedResults.semiFinals.push({
            name: match.team2?.name || '',
            code: match.team2?.code || ''
          });
        });
      }
      
      // Extract teams from final match (Finale)
      if (data?.final) {
        if (data.final.team1?.name || data.final.team2?.name) {
          transformedResults.final.push({
            name: data.final.team1?.name || '',
            code: data.final.team1?.code || ''
          });
          transformedResults.final.push({
            name: data.final.team2?.name || '',
            code: data.final.team2?.code || ''
          });
        }
      }
      
      console.log('Transformed results:', transformedResults);
      setCorrectResults(transformedResults);
    } catch (err) {
      console.error('Error loading correct results:', err);
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
    // Check if match has results - now checking inside result object
    if (!pred.match?.result || pred.match.result.homeScore === null || pred.match.result.awayScore === null) {
      return null; // Match not played yet - return null to distinguish from 0 points
    }

    const actualHomeScore = pred.match.result.homeScore;
    const actualAwayScore = pred.match.result.awayScore;
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

  // Calculate knockout stage points for a specific phase
  const calculateKnockoutPoints = (predictedTeams, correctTeams, pointsPerTeam, positionBonus = 0) => {
    if (!correctTeams || !Array.isArray(correctTeams) || correctTeams.length === 0) return 0;
    if (!predictedTeams || !Array.isArray(predictedTeams)) return 0;
    
    let points = 0;
    // Now using transformed format with direct 'name' field
    const correctTeamNames = correctTeams.map(t => t.name).filter(Boolean);
    
    // Debug logging
    console.log('calculateKnockoutPoints - pointsPerTeam:', pointsPerTeam);
    console.log('correctTeamNames:', correctTeamNames);
    console.log('predictedTeams:', predictedTeams.map(p => ({ name: p.team?.name || p.name, position: p.position })));
    
    predictedTeams.forEach((pred, index) => {
      const predTeamName = pred.team?.name || pred.name;
      if (predTeamName && correctTeamNames.includes(predTeamName)) {
        points += pointsPerTeam;
        console.log(`Match found: ${predTeamName} at index ${index}, points: ${pointsPerTeam}`);
        
        // Check position bonus for round16 (sedicesimi)
        if (positionBonus > 0) {
          const correctIndex = correctTeams.findIndex(t => t.name === predTeamName);
          if (correctIndex === index) {
            points += positionBonus;
            console.log(`Position bonus: ${positionBonus} for ${predTeamName}`);
          }
        }
      }
    });
    
    console.log('Total points:', points);
    return points;
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
                              <TableCell align="center">Esito</TableCell>
                              <TableCell align="center">Pronostico</TableCell>
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
                                    <Typography variant="body2" fontWeight="bold" color="primary">
                                      {pred.match?.result?.homeScore !== null && pred.match?.result?.awayScore !== null
                                        ? `${pred.match.result.homeScore} - ${pred.match.result.awayScore}`
                                        : '-'}
                                    </Typography>
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
                                      label={matchPoints === null ? '-' : `${matchPoints} pt`}
                                      color={matchPoints === null ? 'default' : getPointsColor(matchPoints)}
                                      size="small"
                                      variant={matchPoints === null ? 'outlined' : 'filled'}
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
                {/* Risultati Corretti Accordion */}
                {correctResults && (
                  <Accordion sx={{ mb: 2, bgcolor: 'success.light' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'success.main' }}>
                          <EmojiEventsIcon />
                        </Avatar>
                        <Typography variant="h6">Risultati Corretti</Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={3}>
                        {/* Sedicesimi */}
                        {correctResults?.round32 && Array.isArray(correctResults.round32) && correctResults.round32.length > 0 && (
                          <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                Sedicesimi di Finale
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {correctResults.round32.map((team, idx) => (
                                <Chip
                                  key={idx}
                                  label={team.name || '-'}
                                  color="success"
                                  size="small"
                                />
                              ))}
                            </Box>
                            <Divider sx={{ my: 2 }} />
                          </Grid>
                        )}
                        
                        {/* Ottavi */}
                        {correctResults?.round16 && Array.isArray(correctResults.round16) && correctResults.round16.length > 0 && (
                          <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                Ottavi di Finale
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {correctResults.round16.map((team, idx) => (
                                <Chip key={idx} label={team.name || '-'} color="success" size="small" />
                              ))}
                            </Box>
                            <Divider sx={{ my: 2 }} />
                          </Grid>
                        )}
                        
                        {/* Quarti */}
                        {correctResults?.quarterFinals && Array.isArray(correctResults.quarterFinals) && correctResults.quarterFinals.length > 0 && (
                          <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                Quarti di Finale
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {correctResults.quarterFinals.map((team, idx) => (
                                <Chip key={idx} label={team.name || '-'} color="success" size="small" />
                              ))}
                            </Box>
                            <Divider sx={{ my: 2 }} />
                          </Grid>
                        )}
                        
                        {/* Semifinali */}
                        {correctResults?.semiFinals && Array.isArray(correctResults.semiFinals) && correctResults.semiFinals.length > 0 && (
                          <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                Semifinali
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {correctResults.semiFinals.map((team, idx) => (
                                <Chip key={idx} label={team.name || '-'} color="success" size="small" />
                              ))}
                            </Box>
                            <Divider sx={{ my: 2 }} />
                          </Grid>
                        )}
                        
                        {/* Finale */}
                        {correctResults?.final && Array.isArray(correctResults.final) && correctResults.final.length > 0 && (
                          <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                Finale
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {correctResults.final.map((team, idx) => (
                                <Chip key={idx} label={team.name || '-'} color="success" size="small" />
                              ))}
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                )}

                {/* User Predictions */}
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
                        {/* Round of 16 - Actually Sedicesimi (32 teams) */}
                        {prediction.knockoutStage?.round16?.length > 0 && (
                          <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                Sedicesimi di Finale
                              </Typography>
                              {correctResults?.round32 && (
                                <Chip
                                  label={`${calculateKnockoutPoints(prediction.knockoutStage.round16, correctResults.round32, 20, 5)} pt`}
                                  color="primary"
                                  size="small"
                                />
                              )}
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {prediction.knockoutStage.round16.map((team, idx) => (
                                <Chip
                                  key={idx}
                                  label={team.team?.name || team.name || '-'}
                                  color="primary"
                                  variant="outlined"
                                  size="small"
                                />
                              ))}
                            </Box>
                            <Divider sx={{ my: 2 }} />
                          </Grid>
                        )}

                        {/* Quarter Finals - Actually Ottavi (16 teams) */}
                        {prediction.knockoutStage?.quarterFinals?.length > 0 && (
                          <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                Ottavi di Finale
                              </Typography>
                              {correctResults?.round16 && (
                                <Chip
                                  label={`${calculateKnockoutPoints(prediction.knockoutStage.quarterFinals, correctResults.round16, 20)} pt`}
                                  color="secondary"
                                  size="small"
                                />
                              )}
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {prediction.knockoutStage.quarterFinals.map((team, idx) => (
                                <Chip key={idx} label={team.team?.name || team.name || '-'} color="secondary" variant="outlined" size="small" />
                              ))}
                            </Box>
                            <Divider sx={{ my: 2 }} />
                          </Grid>
                        )}

                        {/* Semi Finals - Actually Quarti (8 teams) */}
                        {prediction.knockoutStage?.semiFinals?.length > 0 && (
                          <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                Quarti di Finale
                              </Typography>
                              {correctResults?.quarterFinals && (
                                <Chip
                                  label={`${calculateKnockoutPoints(prediction.knockoutStage.semiFinals, correctResults.quarterFinals, 30)} pt`}
                                  color="warning"
                                  size="small"
                                />
                              )}
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {prediction.knockoutStage.semiFinals.map((team, idx) => (
                                <Chip key={idx} label={team.team?.name || team.name || '-'} color="warning" variant="outlined" size="small" />
                              ))}
                            </Box>
                            <Divider sx={{ my: 2 }} />
                          </Grid>
                        )}

                        {/* Final - Actually Semifinali (4 teams) */}
                        {prediction.knockoutStage?.final?.length > 0 && (
                          <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                Semifinali
                              </Typography>
                              {correctResults?.semiFinals && (
                                <Chip
                                  label={`${calculateKnockoutPoints(prediction.knockoutStage.final, correctResults.semiFinals, 50)} pt`}
                                  color="error"
                                  size="small"
                                />
                              )}
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {prediction.knockoutStage.final.map((team, idx) => (
                                <Chip key={idx} label={team.team?.name || team.name || '-'} color="error" variant="outlined" size="small" />
                              ))}
                            </Box>
                            <Divider sx={{ my: 2 }} />
                          </Grid>
                        )}

                        {/* Finalists - Actually Finale (2 teams) */}
                        {prediction.knockoutStage?.finalists?.length > 0 && (
                          <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                Finale
                              </Typography>
                              {correctResults?.final && (
                                <Chip
                                  label={`${calculateKnockoutPoints(prediction.knockoutStage.finalists, correctResults.final, 60)} pt`}
                                  color="error"
                                  size="small"
                                />
                              )}
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {prediction.knockoutStage.finalists.map((team, idx) => (
                                <Chip key={idx} label={team.team?.name || team.name || '-'} color="error" size="small" />
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
                          <TableCell>Capocannoniere</TableCell>
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
                            <TableCell>
                              <Chip
                                label={pred.topScorer?.playerName || pred.topScorer?.name || '-'}
                                color="info"
                                size="small"
                                icon={<SportsIcon />}
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