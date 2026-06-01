import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  LinearProgress,
  Chip,
  Paper,
  Divider
} from '@mui/material';
import {
  SportsSoccer,
  People,
  EmojiEvents,
  TrendingUp,
  CheckCircle,
  Schedule,
  Star
} from '@mui/icons-material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { getTournamentStatistics } from '../services/api';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

const StatCard = ({ title, value, icon: Icon, color = 'primary', subtitle }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Icon sx={{ fontSize: 40, color: `${color}.main`, mr: 2 }} />
        <Box>
          <Typography color="text.secondary" variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const TournamentStatistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTournamentStatistics();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error loading statistics:', err);
      setError('Errore nel caricamento delle statistiche');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  if (!stats) {
    return (
      <Alert severity="info">
        Nessuna statistica disponibile
      </Alert>
    );
  }

  // Prepare chart data
  const signChartData = {
    labels: ['Vittoria Casa (1)', 'Pareggio (X)', 'Vittoria Trasferta (2)'],
    datasets: [
      {
        label: 'Pronostici per Segno',
        data: [
          stats.predictions.signDistribution['1'],
          stats.predictions.signDistribution['X'],
          stats.predictions.signDistribution['2']
        ],
        backgroundColor: [
          'rgba(76, 175, 80, 0.8)',
          'rgba(255, 193, 7, 0.8)',
          'rgba(244, 67, 54, 0.8)'
        ],
        borderColor: [
          'rgba(76, 175, 80, 1)',
          'rgba(255, 193, 7, 1)',
          'rgba(244, 67, 54, 1)'
        ],
        borderWidth: 2
      }
    ]
  };

  const topPerformersData = {
    labels: stats.topPerformers.map(p => p.username),
    datasets: [
      {
        label: 'Punteggio',
        data: stats.topPerformers.map(p => p.score),
        backgroundColor: 'rgba(33, 150, 243, 0.8)',
        borderColor: 'rgba(33, 150, 243, 1)',
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Statistiche Torneo
      </Typography>

      {/* Tournament Progress */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Progresso Torneo
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ flex: 1, mr: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={stats.tournament.progress} 
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {stats.tournament.progress}%
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Chip 
            icon={<SportsSoccer />} 
            label={`Fase: ${stats.tournament.currentPhase}`} 
            color="primary" 
            variant="outlined"
          />
          <Chip 
            icon={<CheckCircle />} 
            label={`${stats.tournament.finishedMatches} partite giocate`} 
            color="success"
          />
          <Chip 
            icon={<Schedule />} 
            label={`${stats.tournament.scheduledMatches} partite rimanenti`} 
            color="warning"
          />
        </Box>
      </Paper>

      {/* Main Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Partite Totali"
            value={stats.tournament.totalMatches}
            icon={SportsSoccer}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Giocatori Attivi"
            value={stats.participation.totalUsers}
            icon={People}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Risultati Esatti"
            value={stats.predictions.exactResults}
            icon={EmojiEvents}
            color="warning"
            subtitle={`${stats.predictions.total} pronostici totali`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Segni Corretti"
            value={stats.predictions.correctSigns}
            icon={CheckCircle}
            color="info"
            subtitle={`${stats.predictions.successRate}% successo`}
          />
        </Grid>
      </Grid>

      {/* Participation Statistics */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Statistiche Partecipazione
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h3" color="success.main" sx={{ fontWeight: 'bold' }}>
                {stats.participation.completeUsers}
              </Typography>
              <Typography color="text.secondary">
                Pronostici Completi
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h3" color="warning.main" sx={{ fontWeight: 'bold' }}>
                {stats.participation.partialUsers}
              </Typography>
              <Typography color="text.secondary">
                Pronostici Parziali
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h3" color="primary.main" sx={{ fontWeight: 'bold' }}>
                {stats.participation.completionRate}%
              </Typography>
              <Typography color="text.secondary">
                Tasso Completamento
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Sign Distribution Pie Chart */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Distribuzione Pronostici per Segno
            </Typography>
            <Box sx={{ height: 300 }}>
              <Pie data={signChartData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>

        {/* Top Performers Bar Chart */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Top 5 Giocatori
            </Typography>
            <Box sx={{ height: 300 }}>
              <Bar data={topPerformersData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Insights */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <Star sx={{ mr: 1, color: 'warning.main' }} />
          Curiosità e Statistiche Avanzate
        </Typography>
        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={3}>
          {stats.insights.mostDifficultMatch && (
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Partita Più Difficile
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {stats.insights.mostDifficultMatch.match}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Solo {stats.insights.mostDifficultMatch.difficulty}% di pronostici corretti
                  ({stats.insights.mostDifficultMatch.correctPredictions}/{stats.insights.mostDifficultMatch.totalPredictions})
                </Typography>
              </Box>
            </Grid>
          )}

          {stats.insights.mostPredictedMatch && (
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="subtitle1" color="success.main" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Partita Più Pronosticata
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {stats.insights.mostPredictedMatch.match}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stats.insights.mostPredictedMatch.difficulty}% di pronostici corretti
                  ({stats.insights.mostPredictedMatch.correctPredictions}/{stats.insights.mostPredictedMatch.totalPredictions})
                </Typography>
              </Box>
            </Grid>
          )}

          {stats.insights.mostPredictedWinner && (
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="subtitle1" color="warning.main" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Vincitore Più Pronosticato
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {stats.insights.mostPredictedWinner.team}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stats.insights.mostPredictedWinner.count} giocatori hanno scelto questa squadra
                </Typography>
              </Box>
            </Grid>
          )}

          {stats.insights.mostPredictedScorer && (
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="subtitle1" color="info.main" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Capocannoniere Più Votato
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {stats.insights.mostPredictedScorer.player}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stats.insights.mostPredictedScorer.count} voti ricevuti
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Box>
  );
};

export default TournamentStatistics;

// Made with Bob