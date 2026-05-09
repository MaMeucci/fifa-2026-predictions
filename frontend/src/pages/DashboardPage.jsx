import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Chip,
  Avatar,
} from '@mui/material';
import { EmojiEvents, TrendingUp, TrendingDown } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [myScore, setMyScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch(`${API_URL}/scores/leaderboard`);
      // const data = await response.json();
      
      // Mock data for now
      const mockData = [
        { rank: 1, username: 'Mario_Rossi', totalPoints: 245, exactResults: 12, correctSigns: 28, trend: 'up' },
        { rank: 2, username: 'Luca_Bianchi', totalPoints: 238, exactResults: 11, correctSigns: 30, trend: 'same' },
        { rank: 3, username: 'Anna_Verdi', totalPoints: 225, exactResults: 10, correctSigns: 27, trend: 'down' },
        { rank: 4, username: user?.username || 'Tu', totalPoints: 210, exactResults: 9, correctSigns: 25, trend: 'up' },
        { rank: 5, username: 'Paolo_Neri', totalPoints: 198, exactResults: 8, correctSigns: 24, trend: 'same' },
      ];
      
      setLeaderboard(mockData);
      
      // Find current user's score
      const userScore = mockData.find(item => item.username === user?.username);
      setMyScore(userScore);
      
      setError('');
    } catch (err) {
      setError('Errore nel caricamento della classifica');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp color="success" fontSize="small" />;
      case 'down':
        return <TrendingDown color="error" fontSize="small" />;
      default:
        return null;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return '#FFD700'; // Gold
      case 2:
        return '#C0C0C0'; // Silver
      case 3:
        return '#CD7F32'; // Bronze
      default:
        return 'transparent';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Caricamento classifica...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom>
            <EmojiEvents sx={{ fontSize: 40, verticalAlign: 'middle', mr: 1, color: '#FFD700' }} />
            Classifica Generale
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            FIFA World Cup 2026 - Predictions Game
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* My Score Card */}
        {myScore && (
          <Paper elevation={3} sx={{ p: 3, mb: 3, bgcolor: 'primary.light', color: 'white' }}>
            <Typography variant="h5" gutterBottom>
              La Tua Posizione
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="h3" component="span" sx={{ fontWeight: 'bold' }}>
                  #{myScore.rank}
                </Typography>
                <Typography variant="body1" sx={{ ml: 2, display: 'inline' }}>
                  {myScore.username}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {myScore.totalPoints} punti
                </Typography>
                <Typography variant="body2">
                  {myScore.exactResults} risultati esatti • {myScore.correctSigns} segni corretti
                </Typography>
              </Box>
            </Box>
          </Paper>
        )}

        {/* Leaderboard Table */}
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Posizione</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Giocatore</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Punti Totali</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Risultati Esatti</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Segni Corretti</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Trend</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaderboard.map((row) => (
                <TableRow
                  key={row.rank}
                  sx={{
                    bgcolor: row.username === user?.username ? 'action.selected' : 'inherit',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: getRankColor(row.rank),
                          color: row.rank <= 3 ? 'black' : 'white',
                          fontWeight: 'bold',
                        }}
                      >
                        {row.rank}
                      </Avatar>
                      {row.rank <= 3 && (
                        <EmojiEvents sx={{ color: getRankColor(row.rank) }} />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" sx={{ fontWeight: row.username === user?.username ? 'bold' : 'normal' }}>
                      {row.username}
                      {row.username === user?.username && (
                        <Chip label="Tu" size="small" color="primary" sx={{ ml: 1 }} />
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      {row.totalPoints}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip label={row.exactResults} color="success" size="small" />
                  </TableCell>
                  <TableCell align="center">
                    <Chip label={row.correctSigns} color="info" size="small" />
                  </TableCell>
                  <TableCell align="center">
                    {getTrendIcon(row.trend)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Info Box */}
        <Paper elevation={1} sx={{ p: 2, mt: 3, bgcolor: 'info.light' }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Nota:</strong> La classifica viene aggiornata automaticamente dopo ogni partita.
            I punteggi vengono calcolati in base ai risultati esatti e ai segni corretti dei tuoi pronostici.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default DashboardPage;

// Made with Bob
