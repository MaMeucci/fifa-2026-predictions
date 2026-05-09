import { useState } from 'react';
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
} from '@mui/material';
import { Edit, Save, Calculate, Refresh, CheckCircle } from '@mui/icons-material';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [matchResult, setMatchResult] = useState({ homeScore: '', awayScore: '' });
  const [calculating, setCalculating] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleEditMatch = (match) => {
    setSelectedMatch(match);
    setMatchResult({
      homeScore: match.homeScore || '',
      awayScore: match.awayScore || '',
    });
    setEditDialogOpen(true);
  };

  const handleSaveResult = async () => {
    try {
      // TODO: Replace with actual API call
      // await saveMatchResult(selectedMatch.id, matchResult);
      
      // Mock save
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSuccess('Risultato salvato con successo!');
      setEditDialogOpen(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Errore nel salvataggio del risultato');
      console.error(err);
    }
  };

  const handleCalculateScores = async () => {
    try {
      setCalculating(true);
      setError('');
      
      // TODO: Replace with actual API call
      // await calculateAllScores();
      
      // Mock calculation
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

  // Mock matches data
  const mockMatches = [
    { 
      id: 1, 
      group: 'A', 
      home: 'Canada', 
      away: 'Messico', 
      date: '2026-06-11',
      homeScore: 2,
      awayScore: 1,
      status: 'completed'
    },
    { 
      id: 2, 
      group: 'A', 
      home: 'Stati Uniti', 
      away: 'Uruguay', 
      date: '2026-06-11',
      homeScore: null,
      awayScore: null,
      status: 'scheduled'
    },
    { 
      id: 3, 
      group: 'B', 
      home: 'Brasile', 
      away: 'Argentina', 
      date: '2026-06-12',
      homeScore: 3,
      awayScore: 3,
      status: 'completed'
    },
  ];

  const mockStats = {
    totalMatches: 64,
    completedMatches: 12,
    pendingMatches: 52,
    totalPredictions: 156,
    scoresCalculated: true,
    lastCalculation: '2026-06-11 22:30',
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

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.100' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Gruppo</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Partita</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Data</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Risultato</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Stato</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Azioni</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockMatches.map((match) => (
              <TableRow key={match.id} hover>
                <TableCell>
                  <Chip label={`Gruppo ${match.group}`} size="small" color="primary" />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {match.home} vs {match.away}
                  </Typography>
                </TableCell>
                <TableCell>
                  {new Date(match.date).toLocaleDateString('it-IT')}
                </TableCell>
                <TableCell align="center">
                  {match.homeScore !== null && match.awayScore !== null ? (
                    <Chip 
                      label={`${match.homeScore} - ${match.awayScore}`}
                      color="success"
                      size="small"
                    />
                  ) : (
                    <Chip label="Da inserire" size="small" variant="outlined" />
                  )}
                </TableCell>
                <TableCell align="center">
                  {match.status === 'completed' ? (
                    <Chip 
                      icon={<CheckCircle />}
                      label="Completata" 
                      color="success" 
                      size="small" 
                    />
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
    </Box>
  );

  const renderStatistics = () => (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Statistiche Torneo
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Partite Totali
              </Typography>
              <Typography variant="h3" component="div" color="primary">
                {mockStats.totalMatches}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Partite Completate
              </Typography>
              <Typography variant="h3" component="div" color="success.main">
                {mockStats.completedMatches}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Partite Rimanenti
              </Typography>
              <Typography variant="h3" component="div" color="warning.main">
                {mockStats.pendingMatches}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Pronostici Totali
              </Typography>
              <Typography variant="h3" component="div" color="info.main">
                {mockStats.totalPredictions}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Stato Calcolo Punteggi
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
              {mockStats.scoresCalculated ? (
                <>
                  <CheckCircle color="success" />
                  <Typography>
                    Punteggi aggiornati - Ultimo calcolo: {mockStats.lastCalculation}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Refresh />}
                    onClick={handleCalculateScores}
                    disabled={calculating}
                  >
                    Ricalcola
                  </Button>
                </>
              ) : (
                <>
                  <Alert severity="warning" sx={{ flex: 1 }}>
                    I punteggi devono essere ricalcolati
                  </Alert>
                  <Button
                    variant="contained"
                    startIcon={<Calculate />}
                    onClick={handleCalculateScores}
                    disabled={calculating}
                  >
                    Calcola Ora
                  </Button>
                </>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  const renderUserManagement = () => (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Gestione Utenti
      </Typography>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.100' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Ruolo</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Pronostici</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Punteggio</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Azioni</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[
              { id: 1, username: 'Mario_Rossi', email: 'mario@example.com', role: 'user', predictions: 48, score: 245 },
              { id: 2, username: 'Luca_Bianchi', email: 'luca@example.com', role: 'user', predictions: 48, score: 238 },
              { id: 3, username: 'admin', email: 'admin@example.com', role: 'admin', predictions: 0, score: 0 },
            ].map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={user.role} 
                    color={user.role === 'admin' ? 'error' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">{user.predictions}/48</TableCell>
                <TableCell align="center">
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {user.score}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <IconButton color="primary" size="small">
                    <Edit />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
                  {selectedMatch.home} vs {selectedMatch.away}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                  Gruppo {selectedMatch.group} - {new Date(selectedMatch.date).toLocaleDateString('it-IT')}
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label={selectedMatch.home}
                      type="number"
                      fullWidth
                      value={matchResult.homeScore}
                      onChange={(e) => setMatchResult(prev => ({ ...prev, homeScore: e.target.value }))}
                      inputProps={{ min: 0, max: 20 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label={selectedMatch.away}
                      type="number"
                      fullWidth
                      value={matchResult.awayScore}
                      onChange={(e) => setMatchResult(prev => ({ ...prev, awayScore: e.target.value }))}
                      inputProps={{ min: 0, max: 20 }}
                    />
                  </Grid>
                </Grid>

                {matchResult.homeScore !== '' && matchResult.awayScore !== '' && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Risultato: {matchResult.homeScore} - {matchResult.awayScore}
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
