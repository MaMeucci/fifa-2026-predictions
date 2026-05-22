import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Chip,
  CircularProgress,
  Autocomplete,
} from '@mui/material';
import { Save, Lock, EmojiEvents } from '@mui/icons-material';
import { GROUPS, MATCH_SIGNS, CAPISCIONE_GROUPS, TOURNAMENT_CONFIG } from '../utils/constants';
import api from '../services/api';
import TournamentBracket from '../components/TournamentBracket';

const PredictionsPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [groupPredictions, setGroupPredictions] = useState({});
  const [allTeams, setAllTeams] = useState([]);
  const [bracketPredictions, setBracketPredictions] = useState({
    round32: Array(16).fill(null).map(() => ['', '']),
    round16: Array(8).fill(null).map(() => ['', '']),
    quarters: Array(4).fill(null).map(() => ['', '']),
    semis: Array(2).fill(null).map(() => ['', '']),
    final: ['', ''],
  });
  const [knockoutPredictions, setKnockoutPredictions] = useState({
    winner: '',
    runnerUp: '',
    third: '',
    fourth: '',
    topScorer: '',
  });
  const [capiscionePredictions, setCapiscionePredictions] = useState({
    top: '',
    outsider: '',
    materasso: '',
  });
  const [matches, setMatches] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const isLocked = new Date() >= new Date(TOURNAMENT_CONFIG.lockDate);

  // Load matches and user predictions from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load matches
        const matchesResponse = await api.get('/matches?phase=GROUP');
        
        // Sort matches by date (chronological order)
        const sortedMatches = matchesResponse.data.data
          .map(match => ({
            id: match._id,
            matchNumber: match.matchNumber,
            home: match.homeTeam.name,
            homeCode: match.homeTeam.code,
            away: match.awayTeam.name,
            awayCode: match.awayTeam.code,
            date: match.date,
            group: match.group,
          }))
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        
        setMatches(sortedMatches);
        
        // Extract all unique teams for autocomplete
        const teamsSet = new Set();
        sortedMatches.forEach(match => {
          teamsSet.add(match.home);
          teamsSet.add(match.away);
        });
        setAllTeams(Array.from(teamsSet).sort());
        
        // Load user's existing predictions
        try {
          const predictionsResponse = await api.get('/predictions/my');
          const userPredictions = predictionsResponse.data.data;
          
          // Map existing predictions to state
          const loadedPredictions = {};
          sortedMatches.forEach(match => {
            // Find prediction for this match
            const existingPred = userPredictions.groupStage?.find(
              p => p.match === match.id || p.match?._id === match.id
            );
            
            if (existingPred) {
              loadedPredictions[match.id] = {
                homeScore: String(existingPred.homeScore),
                awayScore: String(existingPred.awayScore),
                sign: existingPred.sign,
              };
            } else {
              // Initialize with default values
              loadedPredictions[match.id] = {
                homeScore: '0',
                awayScore: '0',
                sign: MATCH_SIGNS.DRAW,
              };
            }
          });
          
          setGroupPredictions(loadedPredictions);
          
          // Load knockout stage bracket predictions if available
          if (userPredictions.knockoutStage) {
            console.log('Loading knockout predictions:', userPredictions.knockoutStage);
            
            const loadedBracket = {
              round32: Array(16).fill(null).map(() => ['', '']),
              round16: Array(8).fill(null).map(() => ['', '']),
              quarters: Array(4).fill(null).map(() => ['', '']),
              semis: Array(2).fill(null).map(() => ['', '']),
              final: ['', ''],
            };
            
            // Convert round16 (from API) to round32 (bracket format)
            if (userPredictions.knockoutStage.round16) {
              console.log('round16 from API:', userPredictions.knockoutStage.round16);
              console.log('round16 length:', userPredictions.knockoutStage.round16.length);
              
              userPredictions.knockoutStage.round16.forEach((item, index) => {
                const matchIndex = Math.floor(index / 2);
                const position = index % 2;
                console.log(`Index ${index}: matchIndex=${matchIndex}, position=${position}, team=${item.team?.name}`);
                if (matchIndex < 16 && loadedBracket.round32[matchIndex]) {
                  loadedBracket.round32[matchIndex][position] = item.team?.name || '';
                }
              });
              
              console.log('Loaded round32 bracket:', loadedBracket.round32);
            }
            
            // Convert quarterFinals (from API) to round16 (bracket format)
            if (userPredictions.knockoutStage.quarterFinals) {
              userPredictions.knockoutStage.quarterFinals.forEach((item, index) => {
                const matchIndex = Math.floor(index / 2);
                const position = index % 2;
                if (matchIndex < 8 && loadedBracket.round16[matchIndex]) {
                  loadedBracket.round16[matchIndex][position] = item.team?.name || '';
                }
              });
            }
            
            // Convert semiFinals (from API) to quarters (bracket format)
            if (userPredictions.knockoutStage.semiFinals) {
              userPredictions.knockoutStage.semiFinals.forEach((item, index) => {
                const matchIndex = Math.floor(index / 2);
                const position = index % 2;
                if (matchIndex < 4 && loadedBracket.quarters[matchIndex]) {
                  loadedBracket.quarters[matchIndex][position] = item.team?.name || '';
                }
              });
            }
            
            // Convert final (from API) to semis (bracket format)
            if (userPredictions.knockoutStage.final) {
              userPredictions.knockoutStage.final.forEach((item, index) => {
                const matchIndex = Math.floor(index / 2);
                const position = index % 2;
                if (matchIndex < 2 && loadedBracket.semis[matchIndex]) {
                  loadedBracket.semis[matchIndex][position] = item.team?.name || '';
                }
              });
            }
            
            // Convert finalists (from API) to final (bracket format)
            if (userPredictions.knockoutStage.finalists) {
              console.log('Loading finalists:', userPredictions.knockoutStage.finalists);
              userPredictions.knockoutStage.finalists.forEach((item, index) => {
                if (index < 2) {
                  loadedBracket.final[index] = item.team?.name || '';
                }
              });
              console.log('Loaded final bracket:', loadedBracket.final);
            }
            
            setBracketPredictions(loadedBracket);
          }
          
          // Load final rankings predictions if available
          if (userPredictions.finalRankings) {
            setKnockoutPredictions({
              winner: userPredictions.finalRankings.first?.name || '',
              runnerUp: userPredictions.finalRankings.second?.name || '',
              third: userPredictions.finalRankings.third?.name || '',
              fourth: userPredictions.finalRankings.fourth?.name || '',
              topScorer: userPredictions.topScorer?.playerName || '',
            });
          }
          
          // Load capiscione predictions if available
          if (userPredictions.capiscione) {
            setCapiscionePredictions({
              top: userPredictions.capiscione.top?.name || '',
              outsider: userPredictions.capiscione.outsider?.name || '',
              materasso: userPredictions.capiscione.materasso?.name || '',
            });
          }
        } catch (predErr) {
          console.log('No existing predictions found, using defaults');
          // Initialize with default values
          const initialPredictions = {};
          sortedMatches.forEach(match => {
            initialPredictions[match.id] = {
              homeScore: '0',
              awayScore: '0',
              sign: MATCH_SIGNS.DRAW,
            };
          });
          setGroupPredictions(initialPredictions);
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Errore nel caricamento dei dati');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleBracketChange = (round, matchIndex, position, value) => {
    setBracketPredictions(prev => {
      const newPredictions = { ...prev };
      if (round === 'final') {
        newPredictions.final = [...prev.final];
        newPredictions.final[position] = value;
      } else {
        newPredictions[round] = [...prev[round]];
        newPredictions[round][matchIndex] = [...prev[round][matchIndex]];
        newPredictions[round][matchIndex][position] = value;
      }
      return newPredictions;
    });
  };

  const handleGroupPredictionChange = (matchId, field, value) => {
    setGroupPredictions(prev => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [field]: value,
      },
    }));
  };

  const handleSavePredictions = async () => {
    try {
      setSaving(true);
      setError('');
      
      // Prepare data for API
      const groupStage = Object.entries(groupPredictions).map(([matchId, pred]) => ({
        match: matchId,
        homeScore: parseInt(pred.homeScore) || 0,
        awayScore: parseInt(pred.awayScore) || 0,
        sign: pred.sign,
      }));
      
      // Prepare knockout stage data from bracket predictions
      // IMPORTANT: Do NOT filter empty teams - maintain array structure for position matching
      const knockoutStage = {
        round16: bracketPredictions.round32.flatMap(match =>
          match.map(team => ({
            team: { name: team || '', code: '' }
          }))
        ),
        quarterFinals: bracketPredictions.round16.flatMap(match =>
          match.map(team => ({
            team: { name: team || '', code: '' }
          }))
        ),
        semiFinals: bracketPredictions.quarters.flatMap(match =>
          match.map(team => ({
            team: { name: team || '', code: '' }
          }))
        ),
        final: bracketPredictions.semis.flatMap(match =>
          match.map(team => ({
            team: { name: team || '', code: '' }
          }))
        ),
        finalists: bracketPredictions.final.map(team => ({
          team: { name: team || '', code: '' }
        })),
      };
      
      // Prepare final rankings
      const finalRankings = {
        first: knockoutPredictions.winner ? { name: knockoutPredictions.winner, code: '' } : undefined,
        second: knockoutPredictions.runnerUp ? { name: knockoutPredictions.runnerUp, code: '' } : undefined,
        third: knockoutPredictions.third ? { name: knockoutPredictions.third, code: '' } : undefined,
        fourth: knockoutPredictions.fourth ? { name: knockoutPredictions.fourth, code: '' } : undefined,
      };
      
      // Prepare top scorer
      const topScorer = knockoutPredictions.topScorer ? {
        playerName: knockoutPredictions.topScorer,
        team: { name: '', code: '' },
      } : undefined;
      
      // Prepare capiscione
      const capiscione = {
        top: capiscionePredictions.top ? { name: capiscionePredictions.top, code: '' } : undefined,
        outsider: capiscionePredictions.outsider ? { name: capiscionePredictions.outsider, code: '' } : undefined,
        materasso: capiscionePredictions.materasso ? { name: capiscionePredictions.materasso, code: '' } : undefined,
      };
      
      // Call API
      await api.put('/predictions/my', {
        groupStage,
        knockoutStage,
        finalRankings,
        topScorer,
        capiscione,
      });
      
      setSuccess('Pronostici salvati con successo!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Errore nel salvataggio dei pronostici');
      console.error('Error saving predictions:', err);
    } finally {
      setSaving(false);
    }
  };

  const renderGroupStage = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (!matches || matches.length === 0) {
      return <Alert severity="info">Nessuna partita disponibile</Alert>;
    }

    return (
      <Box sx={{ px: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Pronostici Fase a Gironi - Ordine Cronologico
        </Typography>
        
        <Grid container spacing={2}>
          {matches.map(match => (
            <Grid item xs={12} key={match.id}>
              <Card variant="outlined">
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                        {new Date(match.date).toLocaleDateString('it-IT', {
                          day: '2-digit',
                          month: 'short'
                        })}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        {match.home} - {match.away}
                      </Typography>
                      <Chip
                        label={`Gruppo ${match.group}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Grid>
                    
                    <Grid item xs={4} md={2}>
                      <TextField
                        label="Casa"
                        type="number"
                        size="small"
                        fullWidth
                        disabled={isLocked}
                        value={groupPredictions[match.id]?.homeScore || '0'}
                        onChange={(e) => handleGroupPredictionChange(match.id, 'homeScore', e.target.value)}
                        inputProps={{ min: 0, max: 20 }}
                      />
                    </Grid>
                    
                    <Grid item xs={4} md={2}>
                      <TextField
                        label="Trasferta"
                        type="number"
                        size="small"
                        fullWidth
                        disabled={isLocked}
                        value={groupPredictions[match.id]?.awayScore || '0'}
                        onChange={(e) => handleGroupPredictionChange(match.id, 'awayScore', e.target.value)}
                        inputProps={{ min: 0, max: 20 }}
                      />
                    </Grid>
                    
                    <Grid item xs={4} md={4}>
                      <FormControl fullWidth size="small" disabled={isLocked}>
                        <InputLabel>Segno</InputLabel>
                        <Select
                          value={groupPredictions[match.id]?.sign || MATCH_SIGNS.DRAW}
                          onChange={(e) => handleGroupPredictionChange(match.id, 'sign', e.target.value)}
                          label="Segno"
                        >
                          <MenuItem value={MATCH_SIGNS.HOME}>1 (Casa)</MenuItem>
                          <MenuItem value={MATCH_SIGNS.DRAW}>X (Pareggio)</MenuItem>
                          <MenuItem value={MATCH_SIGNS.AWAY}>2 (Trasferta)</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        <Alert severity="info" sx={{ mt: 2 }}>
          <strong>Nota:</strong> Il segno può essere diverso dal risultato esatto.
          Ad esempio: 2-0 con segno X è valido.
        </Alert>
      </Box>
    );
  };

  const renderKnockoutStage = () => (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, textAlign: 'center', px: 2 }}>
        Fase Finale - Tabellone Eliminazione Diretta
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3, mx: 2 }}>
        Inserisci le squadre che prevedi passeranno ad ogni turno. Il tabellone mostra tutti i match dalla fase a 32 squadre fino alla finale.
      </Alert>

      <TournamentBracket
        predictions={bracketPredictions}
        onChange={handleBracketChange}
        isLocked={isLocked}
      />

      {/* Podium & Top Scorer */}
      <Box sx={{ mt: 4, px: 2, width: '100%' }}>
        <Paper elevation={2} sx={{ p: 3, bgcolor: 'warning.light' }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmojiEvents /> Podio e Capocannoniere
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
              <Autocomplete
                size="small"
                value={knockoutPredictions.winner || null}
                onChange={(event, newValue) => setKnockoutPredictions(prev => ({ ...prev, winner: newValue || '' }))}
                options={allTeams}
                disabled={isLocked}
                renderInput={(params) => (
                  <TextField {...params} label="🥇 Vincitore" placeholder="Prima classificata" />
                )}
                freeSolo
              />
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
              <Autocomplete
                size="small"
                value={knockoutPredictions.runnerUp || null}
                onChange={(event, newValue) => setKnockoutPredictions(prev => ({ ...prev, runnerUp: newValue || '' }))}
                options={allTeams}
                disabled={isLocked}
                renderInput={(params) => (
                  <TextField {...params} label="🥈 Seconda" placeholder="Seconda classificata" />
                )}
                freeSolo
              />
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
              <Autocomplete
                size="small"
                value={knockoutPredictions.third || null}
                onChange={(event, newValue) => setKnockoutPredictions(prev => ({ ...prev, third: newValue || '' }))}
                options={allTeams}
                disabled={isLocked}
                renderInput={(params) => (
                  <TextField {...params} label="🥉 Terza" placeholder="Terza" />
                )}
                freeSolo
              />
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
              <Autocomplete
                size="small"
                value={knockoutPredictions.fourth || null}
                onChange={(event, newValue) => setKnockoutPredictions(prev => ({ ...prev, fourth: newValue || '' }))}
                options={allTeams}
                disabled={isLocked}
                renderInput={(params) => (
                  <TextField {...params} label="Quarta" placeholder="Quarta" />
                )}
                freeSolo
              />
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
              <TextField
                label="⚽ Capocannoniere"
                size="small"
                fullWidth
                value={knockoutPredictions.topScorer}
                onChange={(e) => setKnockoutPredictions(prev => ({ ...prev, topScorer: e.target.value }))}
                disabled={isLocked}
                placeholder="Nome giocatore"
              />
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );

  const renderCapiscione = () => (
    <Box sx={{ px: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Angolo del Capiscione
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Scegli la migliore squadra per ogni categoria
      </Typography>

      <Grid container spacing={3}>
        {Object.entries(CAPISCIONE_GROUPS).map(([key, group]) => (
          <Grid item xs={12} md={4} key={key}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                {group.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {group.description}
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                {group.teams.map(team => (
                  <Chip 
                    key={team}
                    label={team}
                    size="small"
                    sx={{ m: 0.5 }}
                    variant="outlined"
                  />
                ))}
              </Box>

              <FormControl fullWidth disabled={isLocked}>
                <InputLabel>Seleziona squadra</InputLabel>
                <Select
                  value={capiscionePredictions[key.toLowerCase()] || ''}
                  onChange={(e) => setCapiscionePredictions(prev => ({
                    ...prev,
                    [key.toLowerCase()]: e.target.value,
                  }))}
                  label="Seleziona squadra"
                >
                  {group.teams.map(team => (
                    <MenuItem key={team} value={team}>{team}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Punti: {group.points}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Alert severity="success" sx={{ mt: 3 }}>
        <strong>Bonus Capiscione:</strong> Indovina la migliore squadra di ogni categoria per guadagnare punti extra!
      </Alert>
    </Box>
  );

  return (
    <Container maxWidth={false} disableGutters>
      <Box sx={{ py: 2, px: 0 }}>
        {/* Header */}
        <Box sx={{ mb: 3, px: 2 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            I Miei Pronostici
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Inserisci i tuoi pronostici per il Mondiale FIFA 2026
          </Typography>
          
          {isLocked && (
            <Alert severity="warning" icon={<Lock />} sx={{ mt: 2 }}>
              <strong>Pronostici bloccati!</strong> Non è più possibile modificare i pronostici.
              Il torneo è iniziato.
            </Alert>
          )}
        </Box>

        {success && (
          <Alert severity="success" sx={{ mb: 3, mx: 2 }}>
            {success}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3, mx: 2 }}>
            {error}
          </Alert>
        )}

        {/* Tabs */}
        <Paper elevation={2} sx={{ mb: 3, mx: 2 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Fase a Gironi" />
            <Tab label="Fase Finale" />
            <Tab label="Angolo del Capiscione" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        <Box sx={{ mt: 3 }}>
          {activeTab === 0 && renderGroupStage()}
          {activeTab === 1 && renderKnockoutStage()}
          {activeTab === 2 && renderCapiscione()}
        </Box>

        {/* Save Button */}
        {!isLocked && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<Save />}
              onClick={handleSavePredictions}
              disabled={saving}
            >
              {saving ? 'Salvataggio...' : 'Salva Pronostici'}
            </Button>
            <Typography variant="caption" display="block" sx={{ mt: 1 }} color="text.secondary">
              Potrai modificare i tuoi pronostici fino al {new Date(TOURNAMENT_CONFIG.lockDate).toLocaleDateString('it-IT')}
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default PredictionsPage;

// Made with Bob
