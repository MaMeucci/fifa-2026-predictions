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

const PredictionsPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [groupPredictions, setGroupPredictions] = useState({});
  const [knockoutPredictions, setKnockoutPredictions] = useState({
    round16: [],
    quarterFinals: [],
    semiFinals: [],
    final: [],
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
        
        // Group matches by group
        const groupedMatches = {};
        const initialPredictions = {};
        
        response.data.data.forEach(match => {
          if (!groupedMatches[match.group]) {
            groupedMatches[match.group] = [];
          }
          groupedMatches[match.group].push({
            id: match._id,
            matchNumber: match.matchNumber,
            home: match.homeTeam.name,
            homeCode: match.homeTeam.code,
            away: match.awayTeam.name,
            awayCode: match.awayTeam.code,
            date: match.date,
            venue: match.venue,
            city: match.city,
          });
          
          // Initialize predictions with default values: 0-0 and sign X
          initialPredictions[match._id] = {
            homeScore: '0',
            awayScore: '0',
            sign: MATCH_SIGNS.DRAW, // X
          };
        });
        
        setMatches(groupedMatches);
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

    return (
      <Box>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Pronostici Fase a Gironi
        </Typography>
        
        {GROUPS.map(group => (
          <Paper key={group} elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              Gruppo {group}
            </Typography>
            
            {!matches[group] || matches[group].length === 0 ? (
              <Alert severity="info">Nessuna partita disponibile per questo gruppo</Alert>
            ) : (
              <Grid container spacing={2}>
                {matches[group].map(match => (
                  <Grid item xs={12} key={match.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} md={4}>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(match.date).toLocaleDateString('it-IT')}
                            </Typography>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                              {match.home} vs {match.away}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {match.venue}, {match.city}
                            </Typography>
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
            )}
          </Paper>
        ))}
        
        <Alert severity="info" sx={{ mt: 2 }}>
          <strong>Nota:</strong> Il segno può essere diverso dal risultato esatto.
          Ad esempio: 2-0 con segno X è valido.
        </Alert>
      </Box>
    );
  };

  const renderKnockoutStage = () => (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Fase Finale
      </Typography>
      
      <Grid container spacing={3}>
        {/* Round of 16 */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
              Sedicesimi di Finale
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Indica le 16 squadre qualificate in ordine di posizione (incluse le 8 migliori terze)
            </Typography>
            <Grid container spacing={2}>
              {[...Array(16)].map((_, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <TextField
                    label={`Posizione ${index + 1}`}
                    size="small"
                    fullWidth
                    disabled={isLocked}
                    placeholder="Nome squadra"
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Quarter Finals */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
              Quarti di Finale
            </Typography>
            <Grid container spacing={2}>
              {[...Array(8)].map((_, index) => (
                <Grid item xs={12} key={index}>
                  <TextField
                    label={`Squadra ${index + 1}`}
                    size="small"
                    fullWidth
                    disabled={isLocked}
                    placeholder="Nome squadra"
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Semi Finals */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
              Semifinali
            </Typography>
            <Grid container spacing={2}>
              {[...Array(4)].map((_, index) => (
                <Grid item xs={12} key={index}>
                  <TextField
                    label={`Squadra ${index + 1}`}
                    size="small"
                    fullWidth
                    disabled={isLocked}
                    placeholder="Nome squadra"
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Final & Podium */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, bgcolor: 'warning.light' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmojiEvents /> Finale e Podio
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="🥇 Vincitore"
                  size="small"
                  fullWidth
                  disabled={isLocked}
                  placeholder="Prima classificata"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="🥈 Seconda Classificata"
                  size="small"
                  fullWidth
                  disabled={isLocked}
                  placeholder="Seconda classificata"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="🥉 Terza Classificata"
                  size="small"
                  fullWidth
                  disabled={isLocked}
                  placeholder="Terza classificata"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Quarta Classificata"
                  size="small"
                  fullWidth
                  disabled={isLocked}
                  placeholder="Quarta classificata"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="⚽ Capocannoniere"
                  size="small"
                  fullWidth
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
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
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
