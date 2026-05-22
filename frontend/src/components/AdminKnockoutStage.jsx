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
} from '@mui/material';
import { Save, Refresh, EmojiEvents } from '@mui/icons-material';
import api from '../services/api';
import TournamentBracket from './TournamentBracket';

const AdminKnockoutStage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
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

  useEffect(() => {
    loadData();
  }, []);

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
      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, bgcolor: 'warning.light' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmojiEvents /> Podio e Capocannoniere
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="🥇 Vincitore"
                  size="small"
                  fullWidth
                  value={finalRankings.winner}
                  onChange={(e) => setFinalRankings(prev => ({ ...prev, winner: e.target.value }))}
                  placeholder="Prima classificata"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="🥈 Seconda"
                  size="small"
                  fullWidth
                  value={finalRankings.runnerUp}
                  onChange={(e) => setFinalRankings(prev => ({ ...prev, runnerUp: e.target.value }))}
                  placeholder="Seconda classificata"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="🥉 Terza"
                  size="small"
                  fullWidth
                  value={finalRankings.third}
                  onChange={(e) => setFinalRankings(prev => ({ ...prev, third: e.target.value }))}
                  placeholder="Terza"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="Quarta"
                  size="small"
                  fullWidth
                  value={finalRankings.fourth}
                  onChange={(e) => setFinalRankings(prev => ({ ...prev, fourth: e.target.value }))}
                  placeholder="Quarta"
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  label="⚽ Capocannoniere"
                  size="small"
                  fullWidth
                  value={finalRankings.topScorer}
                  onChange={(e) => setFinalRankings(prev => ({ ...prev, topScorer: e.target.value }))}
                  placeholder="Nome giocatore"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminKnockoutStage;

// Made with Bob
