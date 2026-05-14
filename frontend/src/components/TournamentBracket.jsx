import { Box, TextField, Typography, Paper } from '@mui/material';
import './TournamentBracket.css';

const TournamentBracket = ({ predictions, onChange, isLocked }) => {
  const handleTeamChange = (round, matchIndex, position, value) => {
    onChange(round, matchIndex, position, value);
  };

  // Match component for bracket
  const MatchBox = ({ matchNum, date, team1, team2, round, matchIndex, showConnector = true, label1, label2 }) => (
    <Box className={`match-box ${showConnector ? 'with-connector' : ''}`}>
      <Typography variant="caption" className="match-info">
        MATCH {matchNum}<br />
        {date}
      </Typography>
      <Box className="team-input-wrapper">
        {label1 && <Box className="team-label">{label1}</Box>}
        <TextField
          size="small"
          value={team1 || ''}
          onChange={(e) => handleTeamChange(round, matchIndex, 0, e.target.value)}
          disabled={isLocked}
          placeholder="Squadra"
          className="team-input"
        />
      </Box>
      <Box className="team-input-wrapper">
        {label2 && <Box className="team-label">{label2}</Box>}
        <TextField
          size="small"
          value={team2 || ''}
          onChange={(e) => handleTeamChange(round, matchIndex, 1, e.target.value)}
          disabled={isLocked}
          placeholder="Squadra"
          className="team-input"
        />
      </Box>
    </Box>
  );

  return (
    <Box className="tournament-bracket">
      {/* Left Side - Round of 32 */}
      <Box className="bracket-column round-32-left">
        <Typography variant="h6" className="round-title">SEDICESIMI DI FINALE</Typography>
        <MatchBox matchNum="73" date="SUN, JUN 28" team1={predictions.round32?.[0]?.[0]} team2={predictions.round32?.[0]?.[1]} round="round32" matchIndex={0} label1="2A" label2="2B" />
        <MatchBox matchNum="74" date="MON, JUN 29" team1={predictions.round32?.[1]?.[0]} team2={predictions.round32?.[1]?.[1]} round="round32" matchIndex={1} label1="1E" label2="3RD" />
        <MatchBox matchNum="75" date="MON, JUN 29" team1={predictions.round32?.[2]?.[0]} team2={predictions.round32?.[2]?.[1]} round="round32" matchIndex={2} label1="1F" label2="2C" />
        <MatchBox matchNum="76" date="MON, JUN 29" team1={predictions.round32?.[3]?.[0]} team2={predictions.round32?.[3]?.[1]} round="round32" matchIndex={3} label1="1D" label2="2F" />
        <MatchBox matchNum="77" date="TUE, JUN 30" team1={predictions.round32?.[4]?.[0]} team2={predictions.round32?.[4]?.[1]} round="round32" matchIndex={4} label1="1I" label2="3RD" />
        <MatchBox matchNum="78" date="TUE, JUN 30" team1={predictions.round32?.[5]?.[0]} team2={predictions.round32?.[5]?.[1]} round="round32" matchIndex={5} label1="1E" label2="2I" />
        <MatchBox matchNum="79" date="TUE, JUN 30" team1={predictions.round32?.[6]?.[0]} team2={predictions.round32?.[6]?.[1]} round="round32" matchIndex={6} label1="1G" label2="3RD" />
        <MatchBox matchNum="80" date="WED, JUL 1" team1={predictions.round32?.[7]?.[0]} team2={predictions.round32?.[7]?.[1]} round="round32" matchIndex={7} label1="1B" label2="2F" />
      </Box>

      {/* Left Side - Round of 16 */}
      <Box className="bracket-column round-16-left">
        <Typography variant="h6" className="round-title">OTTAVI DI FINALE</Typography>
        <MatchBox matchNum="89" date="SAT, JUL 4" team1={predictions.round16?.[0]?.[0]} team2={predictions.round16?.[0]?.[1]} round="round16" matchIndex={0} />
        <MatchBox matchNum="90" date="SAT, JUL 4" team1={predictions.round16?.[1]?.[0]} team2={predictions.round16?.[1]?.[1]} round="round16" matchIndex={1} />
        <MatchBox matchNum="91" date="SUN, JUL 5" team1={predictions.round16?.[2]?.[0]} team2={predictions.round16?.[2]?.[1]} round="round16" matchIndex={2} />
        <MatchBox matchNum="92" date="SUN, JUL 5" team1={predictions.round16?.[3]?.[0]} team2={predictions.round16?.[3]?.[1]} round="round16" matchIndex={3} />
      </Box>

      {/* Left Side - Quarter Finals */}
      <Box className="bracket-column quarter-left">
        <Typography variant="h6" className="round-title">QUARTI DI FINALE</Typography>
        <MatchBox matchNum="97" date="THU, JUL 9" team1={predictions.quarters?.[0]?.[0]} team2={predictions.quarters?.[0]?.[1]} round="quarters" matchIndex={0} />
        <MatchBox matchNum="98" date="FRI, JUL 10" team1={predictions.quarters?.[1]?.[0]} team2={predictions.quarters?.[1]?.[1]} round="quarters" matchIndex={1} />
      </Box>

      {/* Left Side - Semi Final */}
      <Box className="bracket-column semi-left">
        <Typography variant="h6" className="round-title">SEMIFINALI</Typography>
        <MatchBox matchNum="101" date="TUE, JUL 14" team1={predictions.semis?.[0]?.[0]} team2={predictions.semis?.[0]?.[1]} round="semis" matchIndex={0} />
      </Box>

      {/* Center - Final */}
      <Box className="bracket-column final-center">
        <Typography variant="h6" className="round-title">FINALE</Typography>
        <Paper className="final-box" elevation={3}>
          <Box className="trophy-icon">
            <svg viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#FFD700', stopOpacity: 1}} />
                  <stop offset="50%" style={{stopColor: '#FFA500', stopOpacity: 1}} />
                  <stop offset="100%" style={{stopColor: '#DAA520', stopOpacity: 1}} />
                </linearGradient>
              </defs>
              {/* Trophy base */}
              <ellipse cx="100" cy="280" rx="40" ry="8" fill="url(#goldGradient)" />
              <rect x="85" y="260" width="30" height="20" fill="url(#goldGradient)" />
              {/* Trophy stem */}
              <path d="M 90 260 L 85 220 L 115 220 L 110 260 Z" fill="url(#goldGradient)" stroke="#B8860B" strokeWidth="1"/>
              {/* Trophy cup */}
              <path d="M 60 220 Q 50 180 55 140 L 70 60 Q 100 40 130 60 L 145 140 Q 150 180 140 220 Z"
                    fill="url(#goldGradient)" stroke="#B8860B" strokeWidth="2"/>
              {/* Trophy handles */}
              <path d="M 55 140 Q 30 140 25 120 Q 20 100 30 90 Q 40 85 50 100 L 55 120"
                    fill="url(#goldGradient)" stroke="#B8860B" strokeWidth="1.5"/>
              <path d="M 145 140 Q 170 140 175 120 Q 180 100 170 90 Q 160 85 150 100 L 145 120"
                    fill="url(#goldGradient)" stroke="#B8860B" strokeWidth="1.5"/>
              {/* Decorative bands */}
              <ellipse cx="100" cy="80" rx="32" ry="4" fill="#B8860B" opacity="0.5"/>
              <ellipse cx="100" cy="120" rx="35" ry="4" fill="#B8860B" opacity="0.5"/>
              <ellipse cx="100" cy="160" rx="38" ry="4" fill="#B8860B" opacity="0.5"/>
            </svg>
          </Box>
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
        <Typography variant="h6" className="round-title">SEMIFINALI</Typography>
        <MatchBox matchNum="102" date="WED, JUL 15" team1={predictions.semis?.[1]?.[0]} team2={predictions.semis?.[1]?.[1]} round="semis" matchIndex={1} />
      </Box>

      {/* Right Side - Quarter Finals */}
      <Box className="bracket-column quarter-right">
        <Typography variant="h6" className="round-title">QUARTI DI FINALE</Typography>
        <MatchBox matchNum="99" date="THU, JUL 11" team1={predictions.quarters?.[2]?.[0]} team2={predictions.quarters?.[2]?.[1]} round="quarters" matchIndex={2} />
        <MatchBox matchNum="100" date="SAT, JUL 11" team1={predictions.quarters?.[3]?.[0]} team2={predictions.quarters?.[3]?.[1]} round="quarters" matchIndex={3} />
      </Box>

      {/* Right Side - Round of 16 */}
      <Box className="bracket-column round-16-right">
        <Typography variant="h6" className="round-title">OTTAVI DI FINALE</Typography>
        <MatchBox matchNum="93" date="MON, JUL 6" team1={predictions.round16?.[4]?.[0]} team2={predictions.round16?.[4]?.[1]} round="round16" matchIndex={4} />
        <MatchBox matchNum="94" date="MON, JUL 6" team1={predictions.round16?.[5]?.[0]} team2={predictions.round16?.[5]?.[1]} round="round16" matchIndex={5} />
        <MatchBox matchNum="95" date="TUE, JUL 7" team1={predictions.round16?.[6]?.[0]} team2={predictions.round16?.[6]?.[1]} round="round16" matchIndex={6} />
        <MatchBox matchNum="96" date="TUE, JUL 7" team1={predictions.round16?.[7]?.[0]} team2={predictions.round16?.[7]?.[1]} round="round16" matchIndex={7} />
      </Box>

      {/* Right Side - Round of 32 */}
      <Box className="bracket-column round-32-right">
        <Typography variant="h6" className="round-title">SEDICESIMI DI FINALE</Typography>
        <MatchBox matchNum="81" date="WED, JUL 1" team1={predictions.round32?.[8]?.[0]} team2={predictions.round32?.[8]?.[1]} round="round32" matchIndex={8} label1="1C" label2="3RD" />
        <MatchBox matchNum="82" date="WED, JUL 1" team1={predictions.round32?.[9]?.[0]} team2={predictions.round32?.[9]?.[1]} round="round32" matchIndex={9} label1="1K" label2="3RD" />
        <MatchBox matchNum="83" date="THU, JUL 2" team1={predictions.round32?.[10]?.[0]} team2={predictions.round32?.[10]?.[1]} round="round32" matchIndex={10} label1="1G" label2="2L" />
        <MatchBox matchNum="84" date="THU, JUL 2" team1={predictions.round32?.[11]?.[0]} team2={predictions.round32?.[11]?.[1]} round="round32" matchIndex={11} label1="1J" label2="2H" />
        <MatchBox matchNum="85" date="THU, JUL 2" team1={predictions.round32?.[12]?.[0]} team2={predictions.round32?.[12]?.[1]} round="round32" matchIndex={12} label1="1A" label2="3RD" />
        <MatchBox matchNum="86" date="FRI, JUL 3" team1={predictions.round32?.[13]?.[0]} team2={predictions.round32?.[13]?.[1]} round="round32" matchIndex={13} label1="1H" label2="2K" />
        <MatchBox matchNum="87" date="FRI, JUL 3" team1={predictions.round32?.[14]?.[0]} team2={predictions.round32?.[14]?.[1]} round="round32" matchIndex={14} label1="1B" label2="3RD" />
        <MatchBox matchNum="88" date="SAT, JUL 4" team1={predictions.round32?.[15]?.[0]} team2={predictions.round32?.[15]?.[1]} round="round32" matchIndex={15} label1="1L" label2="2C" />
      </Box>
    </Box>
  );
};

export default TournamentBracket;

// Made with Bob
