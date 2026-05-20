import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Autocomplete,
  TextField,
  Divider,
} from '@mui/material';
import { Save, Refresh } from '@mui/icons-material';
import api from '../services/api';

const KnockoutManagement = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [allTeams, setAllTeams] = useState([]);
  const [knockoutResults, setKnockoutResults] = useState({
    round32: [],
    round16: [],
    quarterFinals: [],
    semiFinals: [],
    final: {},
    thirdPlace: {},
    finalRankings: {},
    topScorer: {}
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load all teams from matches
      const matchesResponse = await api.get('/matches');
      const teams = new Set();
      matchesResponse.data.data.forEach(match => {
        teams.add(JSON.stringify({ name: match.homeTeam.name, code: match.homeTeam.code }));
        teams.add(JSON.stringify({ name: match.awayTeam.name, code: match.awayTeam.code }));
      });
      setAllTeams(Array.from(teams).map(t => JSON.parse(t)));
      
      // Load existing knockout results
      const resultsResponse = await api.get('/knockout-results');
      if (resultsResponse.data.data) {
        setKnockoutResults(resultsResponse.data.data);
      }
    } catch (err) {
      setError('Errore nel caricamento dei dati');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      
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

  const updateRound32 = (matchIndex, field, value) => {
    const newRound32 = [...knockoutResults.round32];
    if (!newRound32[matchIndex]) {
      newRound32[matchIndex] = { matchNumber: matchIndex + 1, team1: {}, team2: {}, winner: {} };
    }
    newRound32[matchIndex][field] = value;
    setKnockoutResults({ ...knockoutResults, round32: newRound32 });
  };

  const updateRound16 = (matchIndex, field, value) => {
    const newRound16 = [...knockoutResults.round16];
    if (!newRound16[matchIndex]) {
      newRound16[matchIndex] = { matchNumber: matchIndex + 1, team1: {}, team2: {}, winner: {} };
    }
    newRound16[matchIndex][field] = value;
    setKnockoutResults({ ...knockoutResults, round16: newRound16 });
  };

  const updateQuarterFinals = (matchIndex, field, value) => {
    const newQuarters = [...knockoutResults.quarterFinals];
    if (!newQuarters[matchIndex]) {
      newQuarters[matchIndex] = { matchNumber: matchIndex + 1, team1: {}, team2: {}, winner: {} };
    }
    newQuarters[matchIndex][field] = value;
    setKnockoutResults({ ...knockoutResults, quarterFinals: newQuarters });
  };

  const updateSemiFinals = (matchIndex, field, value) => {
    const newSemis = [...knockoutResults.semiFinals];
    if (!newSemis[matchIndex]) {
      newSemis[matchIndex] = { matchNumber: matchIndex + 1, team1: {}, team2: {}, winner: {} };
    }
    newSemis[matchIndex][field] = value;
    setKnockoutResults({ ...knockoutResults, semiFinals: newSemis });
  };

  const updateFinal = (field, value) => {
    setKnockoutResults({
      ...knockoutResults,
      final: { ...knockoutResults.final, [field]: value }
    });
  };

  const updateFinalRankings = (position, value) => {
    setKnockoutResults({
      ...knockoutResults,
      finalRankings: { ...knockoutResults.finalRankings, [position]: value }
    });
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
        Seleziona le squadre qualificate per ogni turno. Il sistema calcolerà automaticamente i punteggi confrontando con i pronostici degli utenti.
      </Alert>

      {/* Sedicesimi di Finale (Round of 32) */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Sedicesimi di Finale (32 squadre → 16 vincitori)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          20 punti per squadra corretta, +5 punti per posizione esatta
        </Typography>
        <Grid container spacing={2}>
          {[...Array(16)].map((_, i) => (
            <Grid item xs={12} md={6} key={i}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Match {i + 1}
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Autocomplete
                      options={allTeams}
                      getOptionLabel={(option) => option.name || ''}
                      value={knockoutResults.round32[i]?.team1 || null}
                      onChange={(e, value) => updateRound32(i, 'team1', value)}
                      renderInput={(params) => <TextField {...params} label="Squadra 1" size="small" />}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete
                      options={allTeams}
                      getOptionLabel={(option) => option.name || ''}
                      value={knockoutResults.round32[i]?.team2 || null}
                      onChange={(e, value) => updateRound32(i, 'team2', value)}
                      renderInput={(params) => <TextField {...params} label="Squadra 2" size="small" />}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete
                      options={allTeams}
                      getOptionLabel={(option) => option.name || ''}
                      value={knockoutResults.round32[i]?.winner || null}
                      onChange={(e, value) => updateRound32(i, 'winner', value)}
                      renderInput={(params) => <TextField {...params} label="Vincitore" size="small" />}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Ottavi di Finale (Round of 16) */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Ottavi di Finale (16 squadre → 8 vincitori)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          20 punti per squadra corretta
        </Typography>
        <Grid container spacing={2}>
          {[...Array(8)].map((_, i) => (
            <Grid item xs={12} md={6} key={i}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Match {i + 1}
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Autocomplete
                      options={allTeams}
                      getOptionLabel={(option) => option.name || ''}
                      value={knockoutResults.round16[i]?.team1 || null}
                      onChange={(e, value) => updateRound16(i, 'team1', value)}
                      renderInput={(params) => <TextField {...params} label="Squadra 1" size="small" />}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete
                      options={allTeams}
                      getOptionLabel={(option) => option.name || ''}
                      value={knockoutResults.round16[i]?.team2 || null}
                      onChange={(e, value) => updateRound16(i, 'team2', value)}
                      renderInput={(params) => <TextField {...params} label="Squadra 2" size="small" />}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete
                      options={allTeams}
                      getOptionLabel={(option) => option.name || ''}
                      value={knockoutResults.round16[i]?.winner || null}
                      onChange={(e, value) => updateRound16(i, 'winner', value)}
                      renderInput={(params) => <TextField {...params} label="Vincitore" size="small" />}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Quarti di Finale */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quarti di Finale (8 squadre → 4 vincitori)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          30 punti per squadra corretta
        </Typography>
        <Grid container spacing={2}>
          {[...Array(4)].map((_, i) => (
            <Grid item xs={12} md={6} key={i}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Match {i + 1}
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Autocomplete
                      options={allTeams}
                      getOptionLabel={(option) => option.name || ''}
                      value={knockoutResults.quarterFinals[i]?.team1 || null}
                      onChange={(e, value) => updateQuarterFinals(i, 'team1', value)}
                      renderInput={(params) => <TextField {...params} label="Squadra 1" size="small" />}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete
                      options={allTeams}
                      getOptionLabel={(option) => option.name || ''}
                      value={knockoutResults.quarterFinals[i]?.team2 || null}
                      onChange={(e, value) => updateQuarterFinals(i, 'team2', value)}
                      renderInput={(params) => <TextField {...params} label="Squadra 2" size="small" />}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete
                      options={allTeams}
                      getOptionLabel={(option) => option.name || ''}
                      value={knockoutResults.quarterFinals[i]?.winner || null}
                      onChange={(e, value) => updateQuarterFinals(i, 'winner', value)}
                      renderInput={(params) => <TextField {...params} label="Vincitore" size="small" />}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Semifinali */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Semifinali (4 squadre → 2 vincitori)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          50 punti per squadra corretta
        </Typography>
        <Grid container spacing={2}>
          {[...Array(2)].map((_, i) => (
            <Grid item xs={12} md={6} key={i}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Semifinale {i + 1}
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Autocomplete
                      options={allTeams}
                      getOptionLabel={(option) => option.name || ''}
                      value={knockoutResults.semiFinals[i]?.team1 || null}
                      onChange={(e, value) => updateSemiFinals(i, 'team1', value)}
                      renderInput={(params) => <TextField {...params} label="Squadra 1" size="small" />}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete
                      options={allTeams}
                      getOptionLabel={(option) => option.name || ''}
                      value={knockoutResults.semiFinals[i]?.team2 || null}
                      onChange={(e, value) => updateSemiFinals(i, 'team2', value)}
                      renderInput={(params) => <TextField {...params} label="Squadra 2" size="small" />}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete
                      options={allTeams}
                      getOptionLabel={(option) => option.name || ''}
                      value={knockoutResults.semiFinals[i]?.winner || null}
                      onChange={(e, value) => updateSemiFinals(i, 'winner', value)}
                      renderInput={(params) => <TextField {...params} label="Vincitore" size="small" />}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Finale */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Finale
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Autocomplete
              options={allTeams}
              getOptionLabel={(option) => option.name || ''}
              value={knockoutResults.final?.team1 || null}
              onChange={(e, value) => updateFinal('team1', value)}
              renderInput={(params) => <TextField {...params} label="Squadra 1" />}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Autocomplete
              options={allTeams}
              getOptionLabel={(option) => option.name || ''}
              value={knockoutResults.final?.team2 || null}
              onChange={(e, value) => updateFinal('team2', value)}
              renderInput={(params) => <TextField {...params} label="Squadra 2" />}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Autocomplete
              options={allTeams}
              getOptionLabel={(option) => option.name || ''}
              value={knockoutResults.final?.winner || null}
              onChange={(e, value) => updateFinal('winner', value)}
              renderInput={(params) => <TextField {...params} label="Vincitore" />}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Classifica Finale */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Classifica Finale
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Autocomplete
              options={allTeams}
              getOptionLabel={(option) => option.name || ''}
              value={knockoutResults.finalRankings?.first || null}
              onChange={(e, value) => updateFinalRankings('first', value)}
              renderInput={(params) => <TextField {...params} label="1° Posto (80 punti)" />}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Autocomplete
              options={allTeams}
              getOptionLabel={(option) => option.name || ''}
              value={knockoutResults.finalRankings?.second || null}
              onChange={(e, value) => updateFinalRankings('second', value)}
              renderInput={(params) => <TextField {...params} label="2° Posto (50 punti)" />}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Autocomplete
              options={allTeams}
              getOptionLabel={(option) => option.name || ''}
              value={knockoutResults.finalRankings?.third || null}
              onChange={(e, value) => updateFinalRankings('third', value)}
              renderInput={(params) => <TextField {...params} label="3° Posto (25 punti)" />}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Autocomplete
              options={allTeams}
              getOptionLabel={(option) => option.name || ''}
              value={knockoutResults.finalRankings?.fourth || null}
              onChange={(e, value) => updateFinalRankings('fourth', value)}
              renderInput={(params) => <TextField {...params} label="4° Posto (25 punti)" />}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Capocannoniere */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Capocannoniere (30 punti)
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nome Giocatore"
              value={knockoutResults.topScorer?.playerName || ''}
              onChange={(e) => setKnockoutResults({
                ...knockoutResults,
                topScorer: { ...knockoutResults.topScorer, playerName: e.target.value }
              })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Autocomplete
              options={allTeams}
              getOptionLabel={(option) => option.name || ''}
              value={knockoutResults.topScorer?.team || null}
              onChange={(e, value) => setKnockoutResults({
                ...knockoutResults,
                topScorer: { ...knockoutResults.topScorer, team: value }
              })}
              renderInput={(params) => <TextField {...params} label="Squadra" />}
            />
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<Save />}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Salvataggio...' : 'Salva Tutti i Risultati'}
        </Button>
      </Box>
    </Box>
  );
};

export default KnockoutManagement;

// Made with Bob
