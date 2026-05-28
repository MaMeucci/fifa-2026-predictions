import { Box, TextField, Typography, Paper, Autocomplete } from '@mui/material';
import { useState, useEffect } from 'react';
import './TournamentBracketSymmetric.css';
import api from '../services/api';
import worldCupTrophy from '../assets/world-cup-trophy.jpg';

const TournamentBracketSymmetric = ({ predictions, onChange, isLocked }) => {
  const [teamsByGroup, setTeamsByGroup] = useState({});
  const [allTeams, setAllTeams] = useState([]);

  // Load teams from group matches
  useEffect(() => {
    const loadTeams = async () => {
      try {
        const response = await api.get('/matches?phase=GROUP');
        const matches = response.data.data;
        
        // Extract teams by group
        const groups = {};
        matches.forEach(match => {
          const group = match.group;
          if (!groups[group]) {
            groups[group] = new Set();
          }
          groups[group].add(match.homeTeam.name);
          groups[group].add(match.awayTeam.name);
        });
        
        // Convert Sets to Arrays
        const teamsByGroupObj = {};
        Object.keys(groups).forEach(group => {
          teamsByGroupObj[group] = Array.from(groups[group]).sort();
        });
        
        setTeamsByGroup(teamsByGroupObj);
        
        // Create list of all teams
        const allTeamsSet = new Set();
        Object.values(teamsByGroupObj).forEach(teams => {
          teams.forEach(team => allTeamsSet.add(team));
        });
        setAllTeams(Array.from(allTeamsSet).sort());
      } catch (error) {
        console.error('Error loading teams:', error);
      }
    };
    
    loadTeams();
  }, []);

  const handleTeamChange = (round, matchIndex, position, value) => {
    onChange(round, matchIndex, position, value);
  };

  // Get teams for a specific label
  const getTeamsForLabel = (label) => {
    if (!label) return allTeams;
    if (label.startsWith('3')) return allTeams;
    const group = label.slice(-1);
    return teamsByGroup[group] || allTeams;
  };

  // Compact Match component
  const MatchBox = ({ matchNum, date, team1, team2, round, matchIndex, label1, label2 }) => {
    const teams1 = getTeamsForLabel(label1);
    const teams2 = getTeamsForLabel(label2);

    return (
      <Box className="match-box-compact">
        <Typography variant="caption" className="match-header">
          M{matchNum} • {date}
        </Typography>
        <Box className="team-row">
          {label1 && <Box className="team-badge">{label1}</Box>}
          <Autocomplete
            size="small"
            value={team1 || null}
            onChange={(event, newValue) => handleTeamChange(round, matchIndex, 0, newValue || '')}
            options={teams1}
            disabled={isLocked}
            renderInput={(params) => <TextField {...params} placeholder="Team" />}
            freeSolo
            sx={{ flex: 1, minWidth: 120 }}
          />
        </Box>
        <Box className="team-row">
          {label2 && <Box className="team-badge">{label2}</Box>}
          <Autocomplete
            size="small"
            value={team2 || null}
            onChange={(event, newValue) => handleTeamChange(round, matchIndex, 1, newValue || '')}
            options={teams2}
            disabled={isLocked}
            renderInput={(params) => <TextField {...params} placeholder="Team" />}
            freeSolo
            sx={{ flex: 1, minWidth: 120 }}
          />
        </Box>
      </Box>
    );
  };

  return (
    <Box className="bracket-symmetric">
      {/* Left Side */}
      <Box className="bracket-side left-side">
        {/* Round of 32 - Left (8 matches) */}
        <Box className="bracket-round">
          <Typography className="round-label">SEDICESIMI</Typography>
          <MatchBox matchNum="74" date="JUN 29" team1={predictions.round32?.[1]?.[0]} team2={predictions.round32?.[1]?.[1]} round="round32" matchIndex={1} label1="1E" label2="3ABCDF" />
          <MatchBox matchNum="77" date="JUN 30" team1={predictions.round32?.[4]?.[0]} team2={predictions.round32?.[4]?.[1]} round="round32" matchIndex={4} label1="1I" label2="3CDFGH" />
          <MatchBox matchNum="73" date="JUN 28" team1={predictions.round32?.[0]?.[0]} team2={predictions.round32?.[0]?.[1]} round="round32" matchIndex={0} label1="2A" label2="2B" />
          <MatchBox matchNum="75" date="JUN 29" team1={predictions.round32?.[2]?.[0]} team2={predictions.round32?.[2]?.[1]} round="round32" matchIndex={2} label1="1F" label2="2C" />
          <MatchBox matchNum="83" date="JUL 2" team1={predictions.round32?.[10]?.[0]} team2={predictions.round32?.[10]?.[1]} round="round32" matchIndex={10} label1="2K" label2="2L" />
          <MatchBox matchNum="84" date="JUL 2" team1={predictions.round32?.[11]?.[0]} team2={predictions.round32?.[11]?.[1]} round="round32" matchIndex={11} label1="1H" label2="2J" />
          <MatchBox matchNum="81" date="JUL 1" team1={predictions.round32?.[8]?.[0]} team2={predictions.round32?.[8]?.[1]} round="round32" matchIndex={8} label1="1D" label2="3BEFIJ" />
          <MatchBox matchNum="82" date="JUL 1" team1={predictions.round32?.[9]?.[0]} team2={predictions.round32?.[9]?.[1]} round="round32" matchIndex={9} label1="1G" label2="3AEHIJ" />
        </Box>

        {/* Round of 16 - Left (4 matches) */}
        <Box className="bracket-round">
          <Typography className="round-label">OTTAVI</Typography>
          <MatchBox matchNum="89" date="JUL 4" team1={predictions.round16?.[0]?.[0]} team2={predictions.round16?.[0]?.[1]} round="round16" matchIndex={0} />
          <MatchBox matchNum="90" date="JUL 4" team1={predictions.round16?.[1]?.[0]} team2={predictions.round16?.[1]?.[1]} round="round16" matchIndex={1} />
          <MatchBox matchNum="93" date="JUL 6" team1={predictions.round16?.[4]?.[0]} team2={predictions.round16?.[4]?.[1]} round="round16" matchIndex={4} />
          <MatchBox matchNum="94" date="JUL 6" team1={predictions.round16?.[5]?.[0]} team2={predictions.round16?.[5]?.[1]} round="round16" matchIndex={5} />
        </Box>

        {/* Quarter Finals - Left (2 matches) */}
        <Box className="bracket-round">
          <Typography className="round-label">QUARTI DI FINALE</Typography>
          <MatchBox matchNum="97" date="JUL 9" team1={predictions.quarters?.[0]?.[0]} team2={predictions.quarters?.[0]?.[1]} round="quarters" matchIndex={0} />
          <MatchBox matchNum="98" date="JUL 10" team1={predictions.quarters?.[1]?.[0]} team2={predictions.quarters?.[1]?.[1]} round="quarters" matchIndex={1} />
        </Box>

        {/* Semi Final - Left (1 match) */}
        <Box className="bracket-round">
          <Typography className="round-label">SEMIFINALI</Typography>
          <MatchBox matchNum="101" date="JUL 14" team1={predictions.semis?.[0]?.[0]} team2={predictions.semis?.[0]?.[1]} round="semis" matchIndex={0} />
        </Box>
      </Box>

      {/* Center - Final */}
      <Box className="bracket-center">
        <Box className="trophy-container">
          <img src={worldCupTrophy} alt="FIFA World Cup Trophy" className="trophy-image" />
          <Typography variant="h4" className="fifa-logo">FIFA</Typography>
        </Box>
        <Paper className="final-match" elevation={6}>
          <Typography variant="h6" className="final-title">FINALE</Typography>
          <Typography variant="caption" className="final-info">
            MATCH 103 • SUNDAY, JULY 19, 3:00 PM ET • NEW YORK
          </Typography>
          <Box className="final-teams">
            <Autocomplete
              size="small"
              value={predictions.final?.[0] || null}
              onChange={(event, newValue) => handleTeamChange('final', 0, 0, newValue || '')}
              options={allTeams}
              disabled={isLocked}
              renderInput={(params) => <TextField {...params} placeholder="Winner Semi 1" />}
              freeSolo
              sx={{ mb: 1 }}
            />
            <Autocomplete
              size="small"
              value={predictions.final?.[1] || null}
              onChange={(event, newValue) => handleTeamChange('final', 0, 1, newValue || '')}
              options={allTeams}
              disabled={isLocked}
              renderInput={(params) => <TextField {...params} placeholder="Winner Semi 2" />}
              freeSolo
            />
          </Box>
        </Paper>
        <Box className="third-place">
          <Typography variant="caption">Play-off for third place</Typography>
        </Box>
      </Box>

      {/* Right Side */}
      <Box className="bracket-side right-side">
        {/* Semi Final - Right (1 match) */}
        <Box className="bracket-round">
          <Typography className="round-label">SEMIFINALI</Typography>
          <MatchBox matchNum="102" date="JUL 15" team1={predictions.semis?.[1]?.[0]} team2={predictions.semis?.[1]?.[1]} round="semis" matchIndex={1} />
        </Box>

        {/* Quarter Finals - Right (2 matches) */}
        <Box className="bracket-round">
          <Typography className="round-label">QUARTI DI FINALE</Typography>
          <MatchBox matchNum="99" date="JUL 11" team1={predictions.quarters?.[2]?.[0]} team2={predictions.quarters?.[2]?.[1]} round="quarters" matchIndex={2} />
          <MatchBox matchNum="100" date="JUL 11" team1={predictions.quarters?.[3]?.[0]} team2={predictions.quarters?.[3]?.[1]} round="quarters" matchIndex={3} />
        </Box>

        {/* Round of 16 - Right (4 matches) */}
        <Box className="bracket-round">
          <Typography className="round-label">OTTAVI</Typography>
          <MatchBox matchNum="91" date="JUL 5" team1={predictions.round16?.[2]?.[0]} team2={predictions.round16?.[2]?.[1]} round="round16" matchIndex={2} />
          <MatchBox matchNum="92" date="JUL 5" team1={predictions.round16?.[3]?.[0]} team2={predictions.round16?.[3]?.[1]} round="round16" matchIndex={3} />
          <MatchBox matchNum="95" date="JUL 7" team1={predictions.round16?.[6]?.[0]} team2={predictions.round16?.[6]?.[1]} round="round16" matchIndex={6} />
          <MatchBox matchNum="96" date="JUL 7" team1={predictions.round16?.[7]?.[0]} team2={predictions.round16?.[7]?.[1]} round="round16" matchIndex={7} />
        </Box>

        {/* Round of 32 - Right (8 matches) */}
        <Box className="bracket-round">
          <Typography className="round-label">SEDICESIMI</Typography>
          <MatchBox matchNum="76" date="JUN 29" team1={predictions.round32?.[3]?.[0]} team2={predictions.round32?.[3]?.[1]} round="round32" matchIndex={3} label1="1C" label2="2F" />
          <MatchBox matchNum="78" date="JUN 30" team1={predictions.round32?.[5]?.[0]} team2={predictions.round32?.[5]?.[1]} round="round32" matchIndex={5} label1="2E" label2="2I" />
          <MatchBox matchNum="79" date="JUN 30" team1={predictions.round32?.[6]?.[0]} team2={predictions.round32?.[6]?.[1]} round="round32" matchIndex={6} label1="1A" label2="3CEFHI" />
          <MatchBox matchNum="80" date="JUL 1" team1={predictions.round32?.[7]?.[0]} team2={predictions.round32?.[7]?.[1]} round="round32" matchIndex={7} label1="1L" label2="3EHIJK" />
          <MatchBox matchNum="86" date="JUL 3" team1={predictions.round32?.[13]?.[0]} team2={predictions.round32?.[13]?.[1]} round="round32" matchIndex={13} label1="1J" label2="2H" />
          <MatchBox matchNum="88" date="JUL 4" team1={predictions.round32?.[15]?.[0]} team2={predictions.round32?.[15]?.[1]} round="round32" matchIndex={15} label1="2D" label2="2G" />
          <MatchBox matchNum="85" date="JUL 2" team1={predictions.round32?.[12]?.[0]} team2={predictions.round32?.[12]?.[1]} round="round32" matchIndex={12} label1="1B" label2="3EFIGJ" />
          <MatchBox matchNum="87" date="JUL 3" team1={predictions.round32?.[14]?.[0]} team2={predictions.round32?.[14]?.[1]} round="round32" matchIndex={14} label1="1K" label2="3DEIJL" />
        </Box>
      </Box>
    </Box>
  );
};

export default TournamentBracketSymmetric;

// Made with Bob
