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
  InputAdornment,
  Switch,
  FormControlLabel,
  Tooltip,
} from '@mui/material';
import {
  Edit,
  Save,
  Calculate,
  Refresh,
  CheckCircle,
  Search,
  PersonAdd,
  Block,
  CheckCircleOutlined,
  Delete,
  AdminPanelSettings,
  Person,
  VpnKey
} from '@mui/icons-material';
import api from '../services/api';
import AdminKnockoutStage from '../components/AdminKnockoutStage';
import TournamentStatistics from '../components/TournamentStatistics';

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
  const [selectedGroup, setSelectedGroup] = useState('ALL');
  
  // User management states
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [userStats, setUserStats] = useState(null);
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  // Load matches on component mount and when filters change
  useEffect(() => {
    loadMatches();
  }, [selectedGroup]);

  // Load users when user management tab is active
  useEffect(() => {
    if (activeTab === 3) {
      loadUsers();
      loadUserStats();
    }
  }, [activeTab, userSearch, userRoleFilter]);

  const loadMatches = async () => {
    try {
      setLoading(true);
      setError('');
      
      let url = '/matches?phase=GROUP';
      
      if (selectedGroup !== 'ALL') {
        url += `&group=${selectedGroup}`;
      }
      
      const response = await api.get(url);
      setMatches(response.data.data || []);
    } catch (err) {
      setError('Errore nel caricamento delle partite');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // User management functions
  const loadUsers = async () => {
    try {
      setUsersLoading(true);
      setError('');
      
      const params = new URLSearchParams();
      if (userSearch) params.append('search', userSearch);
      if (userRoleFilter) params.append('role', userRoleFilter);
      
      const url = `/admin/users${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await api.get(url);
      setUsers(response.data.data.users || []);
    } catch (err) {
      setError('Errore nel caricamento degli utenti');
      console.error(err);
    } finally {
      setUsersLoading(false);
    }
  };

  const loadUserStats = async () => {
    try {
      const response = await api.get('/admin/stats/users');
      setUserStats(response.data.data);
    } catch (err) {
      console.error('Error loading user stats:', err);
    }
  };

  const handleToggleUserRole = async (user) => {
    try {
      setError('');
      const newRole = user.role === 'admin' ? 'user' : 'admin';
      
      await api.put(`/admin/users/${user._id}/role`, { role: newRole });
      
      setSuccess(`Ruolo utente aggiornato a ${newRole === 'admin' ? 'Amministratore' : 'Utente'}`);
      loadUsers();
      loadUserStats();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Errore nell\'aggiornamento del ruolo');
      console.error(err);
    }
  };

  const handleToggleUserStatus = async (user) => {
    try {
      setError('');
      
      await api.put(`/admin/users/${user._id}/toggle-active`);
      
      setSuccess(`Utente ${user.isActive ? 'disattivato' : 'attivato'} con successo`);
      loadUsers();
      loadUserStats();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Errore nel cambio stato utente');
      console.error(err);
    }
  };

  const handleDeleteUser = async (user) => {
    setSelectedUser(user);
    setConfirmAction(() => async () => {
      try {
        setError('');
        
        await api.delete(`/admin/users/${user._id}`);
        
        setSuccess('Utente eliminato con successo');
        setConfirmDialogOpen(false);
        loadUsers();
        loadUserStats();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.response?.data?.message || 'Errore nell\'eliminazione dell\'utente');
        console.error(err);
      }
    });
    setConfirmDialogOpen(true);
  };

  const handleResetPassword = (user) => {
    setSelectedUser(user);
    setNewPassword('');
    setResetPasswordDialogOpen(true);
  };

  const handleConfirmResetPassword = async () => {
    try {
      setError('');
      
      if (!newPassword || newPassword.length < 6) {
        setError('La password deve essere di almeno 6 caratteri');
        return;
      }
      
      await api.put(`/admin/users/${selectedUser._id}/reset-password`, { newPassword });
      
      setSuccess(`Password resettata con successo per ${selectedUser.username}`);
      setResetPasswordDialogOpen(false);
      setNewPassword('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Errore nel reset della password');
      console.error(err);
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
      
      // Allow empty fields to clear results
      const payload = {};
      
      if (matchResult.homeScore === '' && matchResult.awayScore === '') {
        // Clear result - send null values
        payload.homeScore = null;
        payload.awayScore = null;
        payload.penalties = null;
      } else if (matchResult.homeScore !== '' && matchResult.awayScore !== '') {
        // Set result with scores
        payload.homeScore = parseInt(matchResult.homeScore);
        payload.awayScore = parseInt(matchResult.awayScore);
        
        // Add penalties if provided (for knockout matches)
        if (matchResult.penaltiesHome !== '' && matchResult.penaltiesAway !== '') {
          payload.penalties = {
            homeScore: parseInt(matchResult.penaltiesHome),
            awayScore: parseInt(matchResult.penaltiesAway),
          };
        }
      } else {
        // One field is empty and one is not - validation error
        setError('Inserisci entrambi i punteggi o lascia entrambi vuoti per cancellare');
        return;
      }

      await api.put(`/matches/${selectedMatch._id}/result`, payload);
      
      setSuccess(payload.homeScore === null ? 'Risultato cancellato con successo!' : 'Risultato salvato con successo!');
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
      
      // Call the score calculation API
      const response = await api.post('/scores/calculate');
      
      if (response.data.success) {
        setSuccess(`Punteggi ricalcolati con successo! ${response.data.data.scoresCalculated} utenti aggiornati.`);
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError('Errore nel calcolo dei punteggi');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Errore nel calcolo dei punteggi');
      console.error('Error calculating scores:', err);
    } finally {
      setCalculating(false);
    }
  };


  const renderMatchResults = () => (
    <Box sx={{ px: 2 }}>
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

      {/* Filters - Only Group filter */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={6}>
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
          <Grid item xs={12} sm={6} md={6}>
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
                <TableCell sx={{ fontWeight: 'bold' }}>Gruppo</TableCell>
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
                  <TableCell>
                    <Chip label={`Gruppo ${match.group}`} size="small" color="primary" />
                  </TableCell>
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
                    {match.result?.homeScore !== null &&
                     match.result?.homeScore !== undefined &&
                     match.result?.awayScore !== null &&
                     match.result?.awayScore !== undefined ? (
                      <Box>
                        <Chip
                          label={`${match.result.homeScore} - ${match.result.awayScore}`}
                          color="success"
                          size="small"
                        />
                        {match.result?.penalties?.homeScore !== null &&
                         match.result?.penalties?.homeScore !== undefined && (
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
      <TournamentStatistics />
    </Box>
  );

  const renderUserManagement = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          Gestione Utenti
        </Typography>
      </Box>

      {/* User Statistics */}
      {userStats && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Totale Utenti
                </Typography>
                <Typography variant="h4">
                  {userStats.total}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Utenti Attivi
                </Typography>
                <Typography variant="h4" color="success.main">
                  {userStats.active}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Amministratori
                </Typography>
                <Typography variant="h4" color="primary.main">
                  {userStats.admins}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Utenti Inattivi
                </Typography>
                <Typography variant="h4" color="error.main">
                  {userStats.inactive}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Filters */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={5}>
            <TextField
              fullWidth
              size="small"
              placeholder="Cerca per username o email..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Ruolo</InputLabel>
              <Select
                value={userRoleFilter}
                label="Ruolo"
                onChange={(e) => setUserRoleFilter(e.target.value)}
              >
                <MenuItem value="">Tutti</MenuItem>
                <MenuItem value="user">Utenti</MenuItem>
                <MenuItem value="admin">Amministratori</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => {
                loadUsers();
                loadUserStats();
              }}
              fullWidth
            >
              Aggiorna
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Users Table */}
      {usersLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : users.length === 0 ? (
        <Alert severity="info">Nessun utente trovato</Alert>
      ) : (
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Ruolo</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Provider</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Stato</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Registrato</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Azioni</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {user.role === 'admin' ? (
                        <AdminPanelSettings color="primary" fontSize="small" />
                      ) : (
                        <Person color="action" fontSize="small" />
                      )}
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {user.username}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {user.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.role === 'admin' ? 'Admin' : 'Utente'}
                      color={user.role === 'admin' ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.authProvider === 'local' ? 'Local' : 'Auth0'}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    {user.isActive ? (
                      <Chip
                        icon={<CheckCircleOutlined />}
                        label="Attivo"
                        color="success"
                        size="small"
                      />
                    ) : (
                      <Chip
                        icon={<Block />}
                        label="Inattivo"
                        color="error"
                        size="small"
                      />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="caption">
                      {new Date(user.createdAt).toLocaleDateString('it-IT')}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Tooltip title={user.role === 'admin' ? 'Rimuovi admin' : 'Rendi admin'}>
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleToggleUserRole(user)}
                        >
                          <AdminPanelSettings />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={user.isActive ? 'Disattiva' : 'Attiva'}>
                        <IconButton
                          color={user.isActive ? 'error' : 'success'}
                          size="small"
                          onClick={() => handleToggleUserStatus(user)}
                        >
                          {user.isActive ? <Block /> : <CheckCircleOutlined />}
                        </IconButton>
                      </Tooltip>
                      {user.authProvider === 'local' && (
                        <Tooltip title="Reset password">
                          <IconButton
                            color="warning"
                            size="small"
                            onClick={() => handleResetPassword(user)}
                          >
                            <VpnKey />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Elimina utente">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDeleteUser(user)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );

  return (
    <Container maxWidth={false} disableGutters>
      <Box sx={{ py: 2, px: 0 }}>
        {/* Header */}
        <Box sx={{ mb: 3, px: 2 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Pannello Amministrazione
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Gestione risultati, punteggi e utenti
          </Typography>
        </Box>

        {success && (
          <Alert severity="success" sx={{ mb: 3, mx: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3, mx: 2 }} onClose={() => setError('')}>
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
            <Tab label="Risultati Gironi" />
            <Tab label="Fase Finale" />
            <Tab label="Statistiche" />
            <Tab label="Gestione Utenti" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        <Box sx={{ mt: 3 }}>
          {activeTab === 0 && renderMatchResults()}
          {activeTab === 1 && <AdminKnockoutStage />}
          {activeTab === 2 && renderStatistics()}
          {activeTab === 3 && renderUserManagement()}
        </Box>

        {/* Confirm Dialog */}
        <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} maxWidth="xs">
          <DialogTitle>Conferma Eliminazione</DialogTitle>
          <DialogContent>
            <Typography>
              Sei sicuro di voler eliminare l'utente <strong>{selectedUser?.username}</strong>?
            </Typography>
            <Alert severity="warning" sx={{ mt: 2 }}>
              Questa azione è irreversibile!
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDialogOpen(false)}>
              Annulla
            </Button>
            <Button
              onClick={() => {
                if (confirmAction) confirmAction();
              }}
              variant="contained"
              color="error"
            >
              Elimina
            </Button>
          </DialogActions>
        </Dialog>
        {/* Reset Password Dialog */}
        <Dialog open={resetPasswordDialogOpen} onClose={() => setResetPasswordDialogOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Inserisci la nuova password per <strong>{selectedUser?.username}</strong>
            </Typography>
            <TextField
              fullWidth
              type="password"
              label="Nuova Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              helperText="Minimo 6 caratteri"
              autoFocus
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setResetPasswordDialogOpen(false)}>
              Annulla
            </Button>
            <Button 
              onClick={handleConfirmResetPassword}
              variant="contained"
              color="warning"
              disabled={!newPassword || newPassword.length < 6}
            >
              Reset Password
            </Button>
          </DialogActions>
        </Dialog>


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

                {false && (
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
