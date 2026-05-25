import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Alert,
  CircularProgress,
  TextField,
  Autocomplete,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
} from '@mui/material';
import { Save, Refresh, EmojiEvents } from '@mui/icons-material';
import api from '../services/api';
import TournamentBracket from './TournamentBracket';
import { CAPISCIONE_GROUPS } from '../utils/constants';

const AdminKnockoutStage = () => {
  console.log('🔧 AdminKnockoutStage component loaded - VERSION 2.0 with Capiscione');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [allTeams, setAllTeams] = useState([]);
  
  const [bracketPredictions, setBracketPredictions] = useState({
    round32: Array(16).fill(null).map(() => ['', '']),
    round16: Array(8).fill(null).map(() => ['', '']),
    quarters: Array(4).fill(null).map(() => ['', '']),
    semis: Array(2).fill(null).map(() => ['', '']),
    final: ['', ''],
  });
  
  const [finalRankings, setFinalRankings] = useState({
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

  useEffect(() => {
    loadData();
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      const response = await api.get('/matches?phase=GROUP');
      const matches = response.data.data;
      
      // Extract all unique teams
      const teamsSet = new Set();
      matches.forEach(match => {
        teamsSet.add(match.homeTeam.name);
        teamsSet.add(match.awayTeam.name);
      });
      
      setAllTeams(Array.from(teamsSet).sort());
    } catch (error) {
      console.error('Error loading teams:', error);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load existing knockout results
      const response = await api.get('/knockout-results');
      if (response.data.data) {
        const data = response.data.data;
        
        // Convert knockout results to bracket format
        // Round32 -> round32
        if (data.round32 && data.round32.length > 0) {
          const round32 = data.round32.map(match => [
            match.team1?.name || '',
            match.team2?.name || ''
          ]);
          setBracketPredictions(prev => ({ ...prev, round32 }));
        }
        
        // Round16 -> round16
        if (data.round16 && data.round16.length > 0) {
          const round16 = data.round16.map(match => [
            match.team1?.name || '',
            match.team2?.name || ''
          ]);
          setBracketPredictions(prev => ({ ...prev, round16 }));
        }
        
        // QuarterFinals -> quarters
        if (data.quarterFinals && data.quarterFinals.length > 0) {
          const quarters = data.quarterFinals.map(match => [
            match.team1?.name || '',
            match.team2?.name || ''
          ]);
          setBracketPredictions(prev => ({ ...prev, quarters }));
        }
        
        // SemiFinals -> semis
        if (data.semiFinals && data.semiFinals.length > 0) {
          const semis = data.semiFinals.map(match => [
            match.team1?.name || '',
            match.team2?.name || ''
          ]);
          setBracketPredictions(prev => ({ ...prev, semis }));
        }
        
        // Final
        if (data.final && data.final.team1) {
          console.log('Loading final data:', data.final);
          console.log('team1:', data.final.team1?.name);
          console.log('team2:', data.final.team2?.name);
          
          const finalArray = [data.final.team1?.name || '', data.final.team2?.name || ''];
          console.log('Final array:', finalArray);
          
          setBracketPredictions(prev => ({
            ...prev,
            final: finalArray
          }));
        }
        
        // Final rankings
        if (data.finalRankings) {
          setFinalRankings({
            winner: data.finalRankings.first?.name || '',
            runnerUp: data.finalRankings.second?.name || '',
            third: data.finalRankings.third?.name || '',
            fourth: data.finalRankings.fourth?.name || '',
            topScorer: data.topScorer?.playerName || '',
          });
        }
        
        // Capiscione
        if (data.capiscione) {
          console.log('Loading capiscione data:', data.capiscione);
          setCapiscionePredictions({
            top: data.capiscione.top?.name || '',
            outsider: data.capiscione.outsider?.name || '',
            materasso: data.capiscione.materasso?.name || '',
          });
          console.log('Capiscione predictions set:', {
            top: data.capiscione.top?.name || '',
            outsider: data.capiscione.outsider?.name || '',
            materasso: data.capiscione.materasso?.name || '',
          });
        }
      }
    } catch (err) {
      setError('Errore nel caricamento dei dati');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBracketChange = (round, matchIndex, teamIndex, value) => {
    setBracketPredictions(prev => {
      const newPredictions = { ...prev };
      
      // Special handling for 'final' which is a simple array, not array of arrays
      if (round === 'final') {
        const newFinal = [...newPredictions.final];
        newFinal[teamIndex] = value;
        newPredictions.final = newFinal;
      } else {
        const newRound = [...newPredictions[round]];
        newRound[matchIndex] = [...newRound[matchIndex]];
        newRound[matchIndex][teamIndex] = value;
        newPredictions[round] = newRound;
      }
      
      return newPredictions;
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      
      console.log('=== SAVING ADMIN DATA ===');
      console.log('bracketPredictions.final:', bracketPredictions.final);
      console.log('finalRankings:', finalRankings);
      console.log('capiscionePredictions:', capiscionePredictions);
      
      // Convert bracket format to knockout results format
      const knockoutResults = {
        round32: bracketPredictions.round32.map((match, i) => ({
          matchNumber: i + 1,
          team1: { name: match[0], code: '' },
          team2: { name: match[1], code: '' },
          winner: { name: '', code: '' } // Will be filled by admin later
        })),
        round16: bracketPredictions.round16.map((match, i) => ({
          matchNumber: i + 1,
          team1: { name: match[0], code: '' },
          team2: { name: match[1], code: '' },
          winner: { name: '', code: '' }
        })),
        quarterFinals: bracketPredictions.quarters.map((match, i) => ({
          matchNumber: i + 1,
          team1: { name: match[0], code: '' },
          team2: { name: match[1], code: '' },
          winner: { name: '', code: '' }
        })),
        semiFinals: bracketPredictions.semis.map((match, i) => ({
          matchNumber: i + 1,
          team1: { name: match[0], code: '' },
          team2: { name: match[1], code: '' },
          winner: { name: '', code: '' }
        })),
        final: {
          team1: { name: bracketPredictions.final[0] || '', code: '' },
          team2: { name: bracketPredictions.final[1] || '', code: '' },
          winner: { name: '', code: '' }
        },
      };
      
      console.log('Final object being saved:', knockoutResults.final);
      console.log('team1.name:', knockoutResults.final.team1.name);
      console.log('team2.name:', knockoutResults.final.team2.name);
      
      knockoutResults.finalRankings = {
        first: { name: finalRankings.winner, code: '' },
        second: { name: finalRankings.runnerUp, code: '' },
        third: { name: finalRankings.third, code: '' },
        fourth: { name: finalRankings.fourth, code: '' }
      };
      
      knockoutResults.topScorer = {
        playerName: finalRankings.topScorer,
        team: { name: '', code: '' }
      };
      
      knockoutResults.capiscione = {
        top: { name: capiscionePredictions.top, code: '' },
        outsider: { name: capiscionePredictions.outsider, code: '' },
        materasso: { name: capiscionePredictions.materasso, code: '' }
      };
      
      console.log('Complete data being sent:', JSON.stringify(knockoutResults, null, 2));
      
      await api.put('/knockout-results', knockoutResults);
      
      setSuccess('Risultati fase finale salvati con successo!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Errore nel salvataggio');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          Gestione Fase Finale
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadData}
          >
            Ricarica
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Salvataggio...' : 'Salva Risultati'}
          </Button>
        </Box>
      </Box>

      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Alert severity="info" sx={{ mb: 3 }}>
        Inserisci le squadre che si sono qualificate ad ogni turno. Il tabellone mostra tutti i match dalla fase a 32 squadre fino alla finale.
      </Alert>

      <TournamentBracket
        predictions={bracketPredictions}
        onChange={handleBracketChange}
        isLocked={false}
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
                value={finalRankings.winner || null}
                onChange={(event, newValue) => setFinalRankings(prev => ({ ...prev, winner: newValue || '' }))}
                options={allTeams}
                renderInput={(params) => (
                  <TextField {...params} label="🥇 Vincitore" placeholder="Prima classificata" />
                )}
                freeSolo
              />
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
              <Autocomplete
                size="small"
                value={finalRankings.runnerUp || null}
                onChange={(event, newValue) => setFinalRankings(prev => ({ ...prev, runnerUp: newValue || '' }))}
                options={allTeams}
                renderInput={(params) => (
                  <TextField {...params} label="🥈 Seconda" placeholder="Seconda classificata" />
                )}
                freeSolo
              />
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
              <Autocomplete
                size="small"
                value={finalRankings.third || null}
                onChange={(event, newValue) => setFinalRankings(prev => ({ ...prev, third: newValue || '' }))}
                options={allTeams}
                renderInput={(params) => (
                  <TextField {...params} label="🥉 Terza" placeholder="Terza" />
                )}
                freeSolo
              />
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
              <Autocomplete
                size="small"
                value={finalRankings.fourth || null}
                onChange={(event, newValue) => setFinalRankings(prev => ({ ...prev, fourth: newValue || '' }))}
                options={allTeams}
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
                value={finalRankings.topScorer}
                onChange={(e) => setFinalRankings(prev => ({ ...prev, topScorer: e.target.value }))}
                placeholder="Nome giocatore"
              />
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Angolo del Capiscione */}
      <Box sx={{ mt: 4, px: 2, width: '100%' }}>
        <Paper elevation={2} sx={{ p: 3, bgcolor: 'info.light' }}>
          <Typography variant="h6" gutterBottom>
            Angolo del Capiscione
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Seleziona le squadre vincenti per ogni categoria
          </Typography>

          <Grid container spacing={3}>
            {Object.entries(CAPISCIONE_GROUPS).map(([key, group]) => (
              <Grid item xs={12} md={4} key={key}>
                <Paper elevation={1} sx={{ p: 2, height: '100%', bgcolor: 'background.paper' }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
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

                  <FormControl fullWidth size="small">
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
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminKnockoutStage;

// Made with Bob
