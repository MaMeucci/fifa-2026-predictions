import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Divider,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SportsIcon from '@mui/icons-material/Sports';
import StarIcon from '@mui/icons-material/Star';
import { SCORING_RULES, CAPISCIONE_GROUPS } from '../utils/constants';

const ScoringRulesPage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <EmojiEventsIcon sx={{ fontSize: 60, color: 'warning.main', mb: 2 }} />
          <Typography variant="h3" gutterBottom>
            Sistema Punteggi
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Scopri come vengono assegnati i punti per ogni pronostico corretto
          </Typography>
        </Box>

        {/* Fase a Gironi */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <SportsIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
              <Typography variant="h5">Fase a Gironi</Typography>
            </Box>
            
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Pronostico</strong></TableCell>
                    <TableCell align="center"><strong>Punti</strong></TableCell>
                    <TableCell><strong>Descrizione</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Risultato Esatto</TableCell>
                    <TableCell align="center">
                      <Chip label={`${SCORING_RULES.EXACT_RESULT} punti`} color="success" />
                    </TableCell>
                    <TableCell>Indovini il risultato esatto della partita (es. 2-1)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Segno Corretto</TableCell>
                    <TableCell align="center">
                      <Chip label={`${SCORING_RULES.CORRECT_SIGN} punti`} color="primary" />
                    </TableCell>
                    <TableCell>Indovini il segno (1-X-2) anche se il risultato non è esatto</TableCell>
                  </TableRow>
                  <TableRow sx={{ bgcolor: 'warning.light' }}>
                    <TableCell><strong>Bonus Risultati Esatti</strong></TableCell>
                    <TableCell align="center">
                      <Chip label={`+${SCORING_RULES.BONUS_POINTS} punti`} color="warning" />
                    </TableCell>
                    <TableCell>
                      <strong>Ogni {SCORING_RULES.BONUS_THRESHOLD} risultati esatti</strong> ottieni un bonus extra!
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Fase Finale */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <EmojiEventsIcon sx={{ fontSize: 40, color: 'secondary.main', mr: 2 }} />
              <Typography variant="h5">Fase Finale</Typography>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom color="primary">
                  Qualificazioni
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell>Squadra ai Sedicesimi</TableCell>
                        <TableCell align="center">
                          <Chip label={`${SCORING_RULES.ROUND16_TEAM} punti`} size="small" color="primary" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Posizione Esatta</TableCell>
                        <TableCell align="center">
                          <Chip label={`+${SCORING_RULES.ROUND16_POSITION} punti`} size="small" color="success" />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom color="secondary">
                  Turni Eliminatori
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell>Ottavi di Finale</TableCell>
                        <TableCell align="center">
                          <Chip label={`${SCORING_RULES.QUARTER_TEAM} punti`} size="small" color="primary" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Quarti di Finale</TableCell>
                        <TableCell align="center">
                          <Chip label={`${SCORING_RULES.SEMI_TEAM} punti`} size="small" color="secondary" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Semifinale</TableCell>
                        <TableCell align="center">
                          <Chip label={`${SCORING_RULES.FINAL_TEAM} punti`} size="small" color="warning" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Finale</TableCell>
                        <TableCell align="center">
                          <Chip label={`${SCORING_RULES.WINNER_TEAM} punti`} size="small" color="error" />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Classifiche Finali */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <StarIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
              <Typography variant="h5">Classifiche Finali</Typography>
            </Box>
            
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Posizione</strong></TableCell>
                    <TableCell align="center"><strong>Punti</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow sx={{ bgcolor: 'warning.light' }}>
                    <TableCell><strong>🥇 Campione del Mondo</strong></TableCell>
                    <TableCell align="center">
                      <Chip label={`${SCORING_RULES.FIRST_PLACE} punti`} color="warning" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>🥈 Secondo Posto</TableCell>
                    <TableCell align="center">
                      <Chip label={`${SCORING_RULES.SECOND_PLACE} punti`} color="default" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>🥉 Terzo Posto</TableCell>
                    <TableCell align="center">
                      <Chip label={`${SCORING_RULES.THIRD_PLACE} punti`} color="default" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Quarto Posto</TableCell>
                    <TableCell align="center">
                      <Chip label={`${SCORING_RULES.FOURTH_PLACE} punti`} color="default" />
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ bgcolor: 'success.light' }}>
                    <TableCell><strong>⚽ Capocannoniere</strong></TableCell>
                    <TableCell align="center">
                      <Chip label={`${SCORING_RULES.TOP_SCORER} punti`} color="success" />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Angolo del Capiscione */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <EmojiEventsIcon sx={{ fontSize: 40, color: 'error.main', mr: 2 }} />
              <Typography variant="h5">Angolo del Capiscione</Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Scegli la migliore squadra per ogni categoria e guadagna punti extra!
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ bgcolor: 'success.light', height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="success.dark">
                      🏆 Top
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {CAPISCIONE_GROUPS.TOP.description}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ mb: 2 }}>
                      {CAPISCIONE_GROUPS.TOP.teams.map((team, index) => (
                        <Chip
                          key={index}
                          label={team}
                          size="small"
                          sx={{ m: 0.5 }}
                          color="success"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                    <Chip
                      label={`${CAPISCIONE_GROUPS.TOP.points} punti`}
                      color="success"
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ bgcolor: 'warning.light', height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="warning.dark">
                      ⭐ Outsider
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {CAPISCIONE_GROUPS.OUTSIDER.description}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ mb: 2 }}>
                      {CAPISCIONE_GROUPS.OUTSIDER.teams.map((team, index) => (
                        <Chip
                          key={index}
                          label={team}
                          size="small"
                          sx={{ m: 0.5 }}
                          color="warning"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                    <Chip
                      label={`${CAPISCIONE_GROUPS.OUTSIDER.points} punti`}
                      color="warning"
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ bgcolor: 'error.light', height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="error.dark">
                      🎲 Materasso
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {CAPISCIONE_GROUPS.MATERASSO.description}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ mb: 2 }}>
                      {CAPISCIONE_GROUPS.MATERASSO.teams.map((team, index) => (
                        <Chip
                          key={index}
                          label={team}
                          size="small"
                          sx={{ m: 0.5 }}
                          color="error"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                    <Chip
                      label={`${CAPISCIONE_GROUPS.MATERASSO.points} punti`}
                      color="error"
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Esempio Calcolo */}
        <Card sx={{ mt: 4, bgcolor: 'info.light' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="info.dark">
              💡 Esempio di Calcolo Punteggio
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Scenario:</strong> Hai indovinato 7 risultati esatti nella fase a gironi, 
              3 segni corretti, 2 squadre ai sedicesimi con posizione esatta, e il campione del mondo.
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  • 7 risultati esatti: <strong>7 × 6 = 42 punti</strong>
                </Typography>
                <Typography variant="body2">
                  • Bonus (5 risultati): <strong>+5 punti</strong>
                </Typography>
                <Typography variant="body2">
                  • 3 segni corretti: <strong>3 × 3 = 9 punti</strong>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  • 2 squadre ai sedicesimi: <strong>2 × 20 = 40 punti</strong>
                </Typography>
                <Typography variant="body2">
                  • 2 posizioni esatte: <strong>2 × 5 = 10 punti</strong>
                </Typography>
                <Typography variant="body2">
                  • Campione del mondo: <strong>80 punti</strong>
                </Typography>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" color="success.main" align="center">
              <strong>Totale: 186 punti! 🎉</strong>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default ScoringRulesPage;

// Made with Bob