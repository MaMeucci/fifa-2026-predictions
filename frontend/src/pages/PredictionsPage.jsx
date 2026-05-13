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
} from '@mui/material';
import { Save, Lock, EmojiEvents } from '@mui/icons-material';
import { GROUPS, MATCH_SIGNS, CAPISCIONE_GROUPS, TOURNAMENT_CONFIG } from '../utils/constants';
import api from '../services/api';
import TournamentBracket from '../components/TournamentBracket';

const PredictionsPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [groupPredictions, setGroupPredictions] = useState({});
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

  // Load matches from API
  useEffect(() => {
    const loadMatches = async () => {
      try {
        setLoading(true);
        const response = await api.get('/matches?phase=GROUP');
        
        // Sort matches by date (chronological order)
        const sortedMatches = response.data.data
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
        
        const initialPredictions = {};
        sortedMatches.forEach(match => {
          // Initialize predictions with default values: 0-0 and sign X
          initialPredictions[match.id] = {
            homeScore: '0',
            awayScore: '0',
            sign: MATCH_SIGNS.DRAW, // X
          };
        });
        
        setMatches(sortedMatches);
        setGroupPredictions(initialPredictions);
      } catch (err) {
        console.error('Error loading matches:', err);
        setError('Errore nel caricamento delle partite');
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
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
      
      // TODO: Replace with actual API call
      // await savePredictions({ groupPredictions, knockoutPredictions, capiscionePredictions });
      
      // Mock save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Pronostici salvati con successo!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Errore nel salvataggio dei pronostici');
      console.error(err);
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
      <Box>
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
      <Typography variant="h5" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
        Fase Finale - Tabellone Eliminazione Diretta
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        Inserisci le squadre che prevedi passeranno ad ogni turno. Il tabellone mostra tutti i match dalla fase a 32 squadre fino alla finale.
      </Alert>

      <TournamentBracket
        predictions={bracketPredictions}
        onChange={handleBracketChange}
        isLocked={isLocked}
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
                  value={knockoutPredictions.winner}
                  onChange={(e) => setKnockoutPredictions(prev => ({ ...prev, winner: e.target.value }))}
                  disabled={isLocked}
                  placeholder="Prima classificata"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="🥈 Seconda"
                  size="small"
                  fullWidth
                  value={knockoutPredictions.runnerUp}
                  onChange={(e) => setKnockoutPredictions(prev => ({ ...prev, runnerUp: e.target.value }))}
                  disabled={isLocked}
                  placeholder="Seconda classificata"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="🥉 Terza"
                  size="small"
                  fullWidth
                  value={knockoutPredictions.third}
                  onChange={(e) => setKnockoutPredictions(prev => ({ ...prev, third: e.target.value }))}
                  disabled={isLocked}
                  placeholder="Terza"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="Quarta"
                  size="small"
                  fullWidth
                  value={knockoutPredictions.fourth}
                  onChange={(e) => setKnockoutPredictions(prev => ({ ...prev, fourth: e.target.value }))}
                  disabled={isLocked}
                  placeholder="Quarta"
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  label="⚽ Capocannoniere"
                  size="small"
                  fullWidth
                  value={knockoutPredictions.topScorer}
                  onChange={(e) => setKnockoutPredictions(prev => ({ ...prev, topScorer: e.target.value }))}
                  disabled={isLocked}
                  placeholder="Nome giocatore"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  const renderCapiscione = () => (
    <Box>
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
      <Box sx={{ py: 4, px: 2 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
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
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Tabs */}
        <Paper elevation={2} sx={{ mb: 3 }}>
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
