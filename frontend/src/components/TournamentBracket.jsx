import { Box, TextField, Typography, Paper } from '@mui/material';
import './TournamentBracket.css';

const TournamentBracket = ({ predictions, onChange, isLocked }) => {
  const handleTeamChange = (round, matchIndex, position, value) => {
    onChange(round, matchIndex, position, value);
  };

  // Match component for bracket
  const MatchBox = ({ matchNum, date, team1, team2, round, matchIndex, showConnector = true }) => (
    <Box className={`match-box ${showConnector ? 'with-connector' : ''}`}>
      <Typography variant="caption" className="match-info">
        MATCH {matchNum}<br />
        {date}
      </Typography>
      <TextField
        size="small"
        value={team1 || ''}
        onChange={(e) => handleTeamChange(round, matchIndex, 0, e.target.value)}
        disabled={isLocked}
        placeholder="Squadra"
        className="team-input"
      />
      <TextField
        size="small"
        value={team2 || ''}
        onChange={(e) => handleTeamChange(round, matchIndex, 1, e.target.value)}
        disabled={isLocked}
        placeholder="Squadra"
        className="team-input"
      />
    </Box>
  );

  return (
    <Box className="tournament-bracket">
      {/* Left Side - Round of 32 */}
      <Box className="bracket-column round-32-left">
        <Typography variant="h6" className="round-title">ROUND OF 32</Typography>
        <MatchBox matchNum="73" date="SUN, JUN 28" team1={predictions.round32?.[0]?.[0]} team2={predictions.round32?.[0]?.[1]} round="round32" matchIndex={0} />
        <MatchBox matchNum="74" date="MON, JUN 29" team1={predictions.round32?.[1]?.[0]} team2={predictions.round32?.[1]?.[1]} round="round32" matchIndex={1} />
        <MatchBox matchNum="75" date="MON, JUN 29" team1={predictions.round32?.[2]?.[0]} team2={predictions.round32?.[2]?.[1]} round="round32" matchIndex={2} />
        <MatchBox matchNum="76" date="MON, JUN 29" team1={predictions.round32?.[3]?.[0]} team2={predictions.round32?.[3]?.[1]} round="round32" matchIndex={3} />
        <MatchBox matchNum="77" date="TUE, JUN 30" team1={predictions.round32?.[4]?.[0]} team2={predictions.round32?.[4]?.[1]} round="round32" matchIndex={4} />
        <MatchBox matchNum="78" date="TUE, JUN 30" team1={predictions.round32?.[5]?.[0]} team2={predictions.round32?.[5]?.[1]} round="round32" matchIndex={5} />
        <MatchBox matchNum="79" date="TUE, JUN 30" team1={predictions.round32?.[6]?.[0]} team2={predictions.round32?.[6]?.[1]} round="round32" matchIndex={6} />
        <MatchBox matchNum="80" date="WED, JUL 1" team1={predictions.round32?.[7]?.[0]} team2={predictions.round32?.[7]?.[1]} round="round32" matchIndex={7} />
      </Box>

      {/* Left Side - Round of 16 */}
      <Box className="bracket-column round-16-left">
        <Typography variant="h6" className="round-title">ROUND OF 16</Typography>
        <MatchBox matchNum="89" date="SAT, JUL 4" team1={predictions.round16?.[0]?.[0]} team2={predictions.round16?.[0]?.[1]} round="round16" matchIndex={0} />
        <MatchBox matchNum="90" date="SAT, JUL 4" team1={predictions.round16?.[1]?.[0]} team2={predictions.round16?.[1]?.[1]} round="round16" matchIndex={1} />
        <MatchBox matchNum="91" date="SUN, JUL 5" team1={predictions.round16?.[2]?.[0]} team2={predictions.round16?.[2]?.[1]} round="round16" matchIndex={2} />
        <MatchBox matchNum="92" date="SUN, JUL 5" team1={predictions.round16?.[3]?.[0]} team2={predictions.round16?.[3]?.[1]} round="round16" matchIndex={3} />
      </Box>

      {/* Left Side - Quarter Finals */}
      <Box className="bracket-column quarter-left">
        <Typography variant="h6" className="round-title">QUARTER FINAL</Typography>
        <MatchBox matchNum="97" date="THU, JUL 9" team1={predictions.quarters?.[0]?.[0]} team2={predictions.quarters?.[0]?.[1]} round="quarters" matchIndex={0} />
        <MatchBox matchNum="98" date="FRI, JUL 10" team1={predictions.quarters?.[1]?.[0]} team2={predictions.quarters?.[1]?.[1]} round="quarters" matchIndex={1} />
      </Box>

      {/* Left Side - Semi Final */}
      <Box className="bracket-column semi-left">
        <Typography variant="h6" className="round-title">SEMI FINAL</Typography>
        <MatchBox matchNum="101" date="TUE, JUL 14" team1={predictions.semis?.[0]?.[0]} team2={predictions.semis?.[0]?.[1]} round="semis" matchIndex={0} />
      </Box>

      {/* Center - Final */}
      <Box className="bracket-column final-center">
        <Typography variant="h6" className="round-title">FINAL</Typography>
        <Paper className="final-box" elevation={3}>
          <Box className="trophy-icon">🏆</Box>
          <TextField
            size="small"
            value={predictions.final?.[0] || ''}
            onChange={(e) => handleTeamChange('final', 0, 0, e.target.value)}
            disabled={isLocked}
            placeholder="Finalista 1"
            className="team-input final-input"
          />
          <TextField
            size="small"
            value={predictions.final?.[1] || ''}
            onChange={(e) => handleTeamChange('final', 0, 1, e.target.value)}
            disabled={isLocked}
            placeholder="Finalista 2"
            className="team-input final-input"
          />
        </Paper>
      </Box>

      {/* Right Side - Semi Final */}
      <Box className="bracket-column semi-right">
        <Typography variant="h6" className="round-title">SEMI FINAL</Typography>
        <MatchBox matchNum="102" date="WED, JUL 15" team1={predictions.semis?.[1]?.[0]} team2={predictions.semis?.[1]?.[1]} round="semis" matchIndex={1} />
      </Box>

      {/* Right Side - Quarter Finals */}
      <Box className="bracket-column quarter-right">
        <Typography variant="h6" className="round-title">QUARTER FINAL</Typography>
        <MatchBox matchNum="99" date="THU, JUL 11" team1={predictions.quarters?.[2]?.[0]} team2={predictions.quarters?.[2]?.[1]} round="quarters" matchIndex={2} />
        <MatchBox matchNum="100" date="SAT, JUL 11" team1={predictions.quarters?.[3]?.[0]} team2={predictions.quarters?.[3]?.[1]} round="quarters" matchIndex={3} />
      </Box>

      {/* Right Side - Round of 16 */}
      <Box className="bracket-column round-16-right">
        <Typography variant="h6" className="round-title">ROUND OF 16</Typography>
        <MatchBox matchNum="93" date="MON, JUL 6" team1={predictions.round16?.[4]?.[0]} team2={predictions.round16?.[4]?.[1]} round="round16" matchIndex={4} />
        <MatchBox matchNum="94" date="MON, JUL 6" team1={predictions.round16?.[5]?.[0]} team2={predictions.round16?.[5]?.[1]} round="round16" matchIndex={5} />
        <MatchBox matchNum="95" date="TUE, JUL 7" team1={predictions.round16?.[6]?.[0]} team2={predictions.round16?.[6]?.[1]} round="round16" matchIndex={6} />
        <MatchBox matchNum="96" date="TUE, JUL 7" team1={predictions.round16?.[7]?.[0]} team2={predictions.round16?.[7]?.[1]} round="round16" matchIndex={7} />
      </Box>

      {/* Right Side - Round of 32 */}
      <Box className="bracket-column round-32-right">
        <Typography variant="h6" className="round-title">ROUND OF 32</Typography>
        <MatchBox matchNum="81" date="WED, JUL 1" team1={predictions.round32?.[8]?.[0]} team2={predictions.round32?.[8]?.[1]} round="round32" matchIndex={8} />
        <MatchBox matchNum="82" date="WED, JUL 1" team1={predictions.round32?.[9]?.[0]} team2={predictions.round32?.[9]?.[1]} round="round32" matchIndex={9} />
        <MatchBox matchNum="83" date="THU, JUL 2" team1={predictions.round32?.[10]?.[0]} team2={predictions.round32?.[10]?.[1]} round="round32" matchIndex={10} />
        <MatchBox matchNum="84" date="THU, JUL 2" team1={predictions.round32?.[11]?.[0]} team2={predictions.round32?.[11]?.[1]} round="round32" matchIndex={11} />
        <MatchBox matchNum="85" date="THU, JUL 2" team1={predictions.round32?.[12]?.[0]} team2={predictions.round32?.[12]?.[1]} round="round32" matchIndex={12} />
        <MatchBox matchNum="86" date="FRI, JUL 3" team1={predictions.round32?.[13]?.[0]} team2={predictions.round32?.[13]?.[1]} round="round32" matchIndex={13} />
        <MatchBox matchNum="87" date="FRI, JUL 3" team1={predictions.round32?.[14]?.[0]} team2={predictions.round32?.[14]?.[1]} round="round32" matchIndex={14} />
        <MatchBox matchNum="88" date="SAT, JUL 4" team1={predictions.round32?.[15]?.[0]} team2={predictions.round32?.[15]?.[1]} round="round32" matchIndex={15} />
      </Box>
    </Box>
  );
};

export default TournamentBracket;

// Made with Bob
