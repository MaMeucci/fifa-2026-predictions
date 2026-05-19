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
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Edit, Save, Calculate, Refresh, CheckCircle } from '@mui/icons-material';
import api from '../services/api';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [matchResult, setMatchResult] = useState({ 
    homeScore: '', 
    awayScore: '', 
    penaltiesHome: '',
    penaltiesAway: ''
  });
  const [calculating, setCalculating] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhase, setSelectedPhase] = useState('GROUP');
  const [selectedGroup, setSelectedGroup] = useState('ALL');

  // Load matches on component mount and when filters change
  useEffect(() => {
    loadMatches();
  }, [selectedPhase, selectedGroup]);

  const loadMatches = async () => {
    try {
      setLoading(true);
      setError('');
      
      let url = '/matches';
      const params = new URLSearchParams();
      
      if (selectedPhase) params.append('phase', selectedPhase);
      if (selectedGroup !== 'ALL' && selectedPhase === 'GROUP') params.append('group', selectedGroup);
      
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await api.get(url);
      setMatches(response.data.data || []);
    } catch (err) {
      setError('Errore nel caricamento delle partite');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleEditMatch = (match) => {
    setSelectedMatch(match);
    setMatchResult({
      homeScore: match.result?.homeScore ?? '',
      awayScore: match.result?.awayScore ?? '',
      penaltiesHome: match.result?.penalties?.homeScore ?? '',
      penaltiesAway: match.result?.penalties?.awayScore ?? '',
    });
    setEditDialogOpen(true);
  };

  const handleSaveResult = async () => {
    try {
      setError('');
      
      // Validate scores
      if (matchResult.homeScore === '' || matchResult.awayScore === '') {
        setError('Inserisci entrambi i punteggi');
        return;
      }

      const payload = {
        homeScore: parseInt(matchResult.homeScore),
        awayScore: parseInt(matchResult.awayScore),
      };

      // Add penalties if provided (for knockout matches)
      if (matchResult.penaltiesHome !== '' && matchResult.penaltiesAway !== '') {
        payload.penalties = {
          homeScore: parseInt(matchResult.penaltiesHome),
          awayScore: parseInt(matchResult.penaltiesAway),
        };
      }

      await api.put(`/matches/${selectedMatch._id}/result`, payload);
      
      setSuccess('Risultato salvato con successo!');
      setEditDialogOpen(false);
      loadMatches(); // Reload matches
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Errore nel salvataggio del risultato');
      console.error(err);
    }
  };

  const handleCalculateScores = async () => {
    try {
      setCalculating(true);
      setError('');
      
      // TODO: Implement score calculation API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess('Punteggi ricalcolati con successo!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Errore nel calcolo dei punteggi');
      console.error(err);
    } finally {
      setCalculating(false);
    }
  };

  const isKnockoutPhase = () => {
    return ['ROUND_16', 'ROUND_8', 'QUARTER', 'SEMI', 'FINAL'].includes(selectedPhase);
  };

  const renderMatchResults = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          Inserimento Risultati
        </Typography>
        <Button
          variant="contained"
          startIcon={<Calculate />}
          onClick={handleCalculateScores}
          disabled={calculating}
        >
          {calculating ? 'Calcolo in corso...' : 'Ricalcola Punteggi'}
        </Button>
      </Box>

      {/* Filters */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Fase</InputLabel>
              <Select
                value={selectedPhase}
                label="Fase"
                onChange={(e) => setSelectedPhase(e.target.value)}
              >
                <MenuItem value="GROUP">Gironi</MenuItem>
                <MenuItem value="ROUND_16">Sedicesimi</MenuItem>
                <MenuItem value="ROUND_8">Ottavi</MenuItem>
                <MenuItem value="QUARTER">Quarti</MenuItem>
                <MenuItem value="SEMI">Semifinali</MenuItem>
                <MenuItem value="FINAL">Finale</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {selectedPhase === 'GROUP' && (
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Gruppo</InputLabel>
                <Select
                  value={selectedGroup}
                  label="Gruppo"
                  onChange={(e) => setSelectedGroup(e.target.value)}
                >
                  <MenuItem value="ALL">Tutti i gruppi</MenuItem>
                  {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'].map(group => (
                    <MenuItem key={group} value={group}>Gruppo {group}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={loadMatches}
              fullWidth
            >
              Aggiorna
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : matches.length === 0 ? (
        <Alert severity="info">Nessuna partita trovata</Alert>
      ) : (
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Match #</TableCell>
                {selectedPhase === 'GROUP' && <TableCell sx={{ fontWeight: 'bold' }}>Gruppo</TableCell>}
                <TableCell sx={{ fontWeight: 'bold' }}>Partita</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Data</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Risultato</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Stato</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Azioni</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {matches.map((match) => (
                <TableRow key={match._id} hover>
                  <TableCell>
                    <Chip label={match.matchNumber} size="small" />
                  </TableCell>
                  {selectedPhase === 'GROUP' && (
                    <TableCell>
                      <Chip label={`Gruppo ${match.group}`} size="small" color="primary" />
                    </TableCell>
                  )}
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {match.homeTeam.name} vs {match.awayTeam.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {new Date(match.date).toLocaleDateString('it-IT', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </TableCell>
                  <TableCell align="center">
                    {match.result?.homeScore !== null && match.result?.awayScore !== null ? (
                      <Box>
                        <Chip 
                          label={`${match.result.homeScore} - ${match.result.awayScore}`}
                          color="success"
                          size="small"
                        />
                        {match.result?.penalties?.homeScore !== null && (
                          <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                            Rigori: {match.result.penalties.homeScore} - {match.result.penalties.awayScore}
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      <Chip label="Da inserire" size="small" variant="outlined" />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {match.status === 'FINISHED' ? (
                      <Chip 
                        icon={<CheckCircle />}
                        label="Completata" 
                        color="success" 
                        size="small" 
                      />
                    ) : match.status === 'LIVE' ? (
                      <Chip label="In corso" color="error" size="small" />
                    ) : (
                      <Chip label="Programmata" size="small" />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton 
                      color="primary" 
                      size="small"
                      onClick={() => handleEditMatch(match)}
                    >
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );

  const renderStatistics = () => (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Statistiche Torneo
      </Typography>
      <Alert severity="info">
        Statistiche in fase di implementazione
      </Alert>
    </Box>
  );

  const renderUserManagement = () => (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Gestione Utenti
      </Typography>
      <Alert severity="info">
        Gestione utenti in fase di implementazione
      </Alert>
    </Box>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Pannello Amministrazione
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Gestione risultati, punteggi e utenti
          </Typography>
        </Box>

        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
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
            <Tab label="Risultati Partite" />
            <Tab label="Statistiche" />
            <Tab label="Gestione Utenti" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        <Box sx={{ mt: 3 }}>
          {activeTab === 0 && renderMatchResults()}
          {activeTab === 1 && renderStatistics()}
          {activeTab === 2 && renderUserManagement()}
        </Box>

        {/* Edit Match Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            Inserisci Risultato
          </DialogTitle>
          <DialogContent>
            {selectedMatch && (
              <Box sx={{ pt: 2 }}>
                <Typography variant="h6" gutterBottom align="center">
                  {selectedMatch.homeTeam.name} vs {selectedMatch.awayTeam.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                  {selectedMatch.group && `Gruppo ${selectedMatch.group} - `}
                  Match #{selectedMatch.matchNumber} - {new Date(selectedMatch.date).toLocaleDateString('it-IT')}
                </Typography>

                <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                  Risultato Tempi Regolamentari
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label={selectedMatch.homeTeam.name}
                      type="number"
                      fullWidth
                      value={matchResult.homeScore}
                      onChange={(e) => setMatchResult(prev => ({ ...prev, homeScore: e.target.value }))}
                      inputProps={{ min: 0, max: 20 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label={selectedMatch.awayTeam.name}
                      type="number"
                      fullWidth
                      value={matchResult.awayScore}
                      onChange={(e) => setMatchResult(prev => ({ ...prev, awayScore: e.target.value }))}
                      inputProps={{ min: 0, max: 20 }}
                    />
                  </Grid>
                </Grid>

                {isKnockoutPhase() && (
                  <>
                    <Typography variant="subtitle2" gutterBottom sx={{ mt: 3 }}>
                      Rigori (opzionale - solo se necessari)
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          label="Rigori Casa"
                          type="number"
                          fullWidth
                          value={matchResult.penaltiesHome}
                          onChange={(e) => setMatchResult(prev => ({ ...prev, penaltiesHome: e.target.value }))}
                          inputProps={{ min: 0, max: 20 }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Rigori Trasferta"
                          type="number"
                          fullWidth
                          value={matchResult.penaltiesAway}
                          onChange={(e) => setMatchResult(prev => ({ ...prev, penaltiesAway: e.target.value }))}
                          inputProps={{ min: 0, max: 20 }}
                        />
                      </Grid>
                    </Grid>
                  </>
                )}

                {matchResult.homeScore !== '' && matchResult.awayScore !== '' && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Risultato: {matchResult.homeScore} - {matchResult.awayScore}
                    {matchResult.penaltiesHome !== '' && matchResult.penaltiesAway !== '' && (
                      <> (Rigori: {matchResult.penaltiesHome} - {matchResult.penaltiesAway})</>
                    )}
                  </Alert>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>
              Annulla
            </Button>
            <Button 
              onClick={handleSaveResult} 
              variant="contained" 
              startIcon={<Save />}
              disabled={matchResult.homeScore === '' || matchResult.awayScore === ''}
            >
              Salva Risultato
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default AdminPage;

// Made with Bob
