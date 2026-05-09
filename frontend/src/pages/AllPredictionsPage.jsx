import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Alert,
  AlertTitle,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SportsIcon from '@mui/icons-material/Sports';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PersonIcon from '@mui/icons-material/Person';

const AllPredictionsPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  // Mock data - Replace with real API calls
  const mockPlayers = [
    { id: 1, username: 'Mario Rossi', avatar: 'MR' },
    { id: 2, username: 'Luigi Verdi', avatar: 'LV' },
    { id: 3, username: 'Anna Bianchi', avatar: 'AB' },
  ];

  const mockGroupPredictions = [
    {
      playerId: 1,
      playerName: 'Mario Rossi',
      match: 'Italia vs Brasile',
      homeScore: 2,
      awayScore: 1,
      sign: '1',
    },
    {
      playerId: 2,
      playerName: 'Luigi Verdi',
      match: 'Italia vs Brasile',
      homeScore: 1,
      awayScore: 1,
      sign: 'X',
    },
    {
      playerId: 3,
      playerName: 'Anna Bianchi',
      match: 'Italia vs Brasile',
      homeScore: 0,
      awayScore: 2,
      sign: '2',
    },
  ];

  const mockKnockoutPredictions = [
    {
      playerId: 1,
      playerName: 'Mario Rossi',
      round: 'Finale',
      team1: 'Brasile',
      team2: 'Argentina',
      winner: 'Brasile',
    },
    {
      playerId: 2,
      playerName: 'Luigi Verdi',
      round: 'Finale',
      team1: 'Francia',
      team2: 'Spagna',
      winner: 'Francia',
    },
    {
      playerId: 3,
      playerName: 'Anna Bianchi',
      round: 'Finale',
      team1: 'Inghilterra',
      team2: 'Germania',
      winner: 'Inghilterra',
    },
  ];

  const mockCapiscionePredictions = [
    {
      playerId: 1,
      playerName: 'Mario Rossi',
      top: 'Brasile',
      outsider: 'Portogallo',
      materasso: 'Messico',
    },
    {
      playerId: 2,
      playerName: 'Luigi Verdi',
      top: 'Argentina',
      outsider: 'Olanda',
      materasso: 'Giappone',
    },
    {
      playerId: 3,
      playerName: 'Anna Bianchi',
      top: 'Francia',
      outsider: 'Uruguay',
      materasso: 'Senegal',
    },
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getSignColor = (sign) => {
    switch (sign) {
      case '1':
        return 'success';
      case 'X':
        return 'warning';
      case '2':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <VisibilityIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
          <Typography variant="h3" gutterBottom>
            Pronostici Completi
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Visualizza i pronostici di tutti i giocatori
          </Typography>
        </Box>

        {/* Info Alert */}
        <Alert severity="info" sx={{ mb: 4 }}>
          <AlertTitle>Informazione</AlertTitle>
          Questa sezione mostra i pronostici di tutti i partecipanti. I dati sono visibili solo dopo l'inizio del torneo.
        </Alert>

        {/* Players Summary */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Giocatori Partecipanti
            </Typography>
            <Grid container spacing={2}>
              {mockPlayers.map((player) => (
                <Grid item xs={12} sm={6} md={4} key={player.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {player.avatar}
                    </Avatar>
                    <Typography variant="body1">{player.username}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
            <Tab icon={<SportsIcon />} label="Fase a Gironi" />
            <Tab icon={<EmojiEventsIcon />} label="Fase Finale" />
            <Tab icon={<PersonIcon />} label="Angolo del Capiscione" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pronostici Fase a Gironi
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Giocatore</TableCell>
                      <TableCell>Partita</TableCell>
                      <TableCell align="center">Risultato</TableCell>
                      <TableCell align="center">Segno</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockGroupPredictions.map((pred, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.875rem' }}>
                              {pred.playerName.split(' ').map(n => n[0]).join('')}
                            </Avatar>
                            {pred.playerName}
                          </Box>
                        </TableCell>
                        <TableCell>{pred.match}</TableCell>
                        <TableCell align="center">
                          <Typography variant="body1" fontWeight="bold">
                            {pred.homeScore} - {pred.awayScore}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={pred.sign}
                            color={getSignColor(pred.sign)}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {activeTab === 1 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pronostici Fase Finale
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Giocatore</TableCell>
                      <TableCell>Fase</TableCell>
                      <TableCell>Squadra 1</TableCell>
                      <TableCell>Squadra 2</TableCell>
                      <TableCell>Vincitore</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockKnockoutPredictions.map((pred, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main', fontSize: '0.875rem' }}>
                              {pred.playerName.split(' ').map(n => n[0]).join('')}
                            </Avatar>
                            {pred.playerName}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={pred.round} color="primary" size="small" />
                        </TableCell>
                        <TableCell>{pred.team1}</TableCell>
                        <TableCell>{pred.team2}</TableCell>
                        <TableCell>
                          <Typography variant="body1" fontWeight="bold" color="primary">
                            {pred.winner}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {activeTab === 2 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Angolo del Capiscione
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Giocatore</TableCell>
                      <TableCell>Top</TableCell>
                      <TableCell>Outsider</TableCell>
                      <TableCell>Materasso</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockCapiscionePredictions.map((pred, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'warning.main', fontSize: '0.875rem' }}>
                              {pred.playerName.split(' ').map(n => n[0]).join('')}
                            </Avatar>
                            {pred.playerName}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={pred.top} color="success" />
                        </TableCell>
                        <TableCell>
                          <Chip label={pred.outsider} color="warning" />
                        </TableCell>
                        <TableCell>
                          <Chip label={pred.materasso} color="error" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
};

export default AllPredictionsPage;

// Made with Bob