import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import { Save, Refresh } from '@mui/icons-material';
import api from '../services/api';
import { CAPISCIONE_GROUPS } from '../utils/constants';

const AdminCapiscione = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const [capiscioneResults, setCapiscioneResults] = useState({
    top: '',
    outsider: '',
    materasso: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load existing capiscione results from knockout-results
      const response = await api.get('/knockout-results');
      if (response.data.data && response.data.data.capiscione) {
        const data = response.data.data.capiscione;
        setCapiscioneResults({
          top: data.top?.name || '',
          outsider: data.outsider?.name || '',
          materasso: data.materasso?.name || '',
        });
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
      
      // Get current knockout results
      const currentResponse = await api.get('/knockout-results');
      const currentData = currentResponse.data.data || {};
      
      // Update only capiscione section
      const updatedData = {
        ...currentData,
        capiscione: {
          top: { name: capiscioneResults.top, code: '' },
          outsider: { name: capiscioneResults.outsider, code: '' },
          materasso: { name: capiscioneResults.materasso, code: '' },
        }
      };
      
      await api.put('/knockout-results', updatedData);
      
      setSuccess('Risultati Angolo del Capiscione salvati con successo!');
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
          Angolo del Capiscione
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

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Seleziona la squadra vincente per ogni categoria
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

              <FormControl fullWidth>
                <InputLabel>Seleziona squadra vincente</InputLabel>
                <Select
                  value={capiscioneResults[key.toLowerCase()] || ''}
                  onChange={(e) => setCapiscioneResults(prev => ({
                    ...prev,
                    [key.toLowerCase()]: e.target.value,
                  }))}
                  label="Seleziona squadra vincente"
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

      <Alert severity="info" sx={{ mt: 3 }}>
        <strong>Angolo del Capiscione:</strong> Seleziona la migliore squadra di ogni categoria. Gli utenti che indovinano guadagnano punti extra!
      </Alert>
    </Box>
  );
};

export default AdminCapiscione;

// Made with Bob
