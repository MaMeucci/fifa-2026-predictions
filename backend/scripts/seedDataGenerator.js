// FIFA World Cup 2026 Groups (Official Draw)
const groups = {
  A: ['Messico', 'Sudafrica', 'Corea del Sud', 'Repubblica Ceca'],
  B: ['Canada', 'Bosnia Erzegovina', 'Qatar', 'Svizzera'],
  C: ['Brasile', 'Marocco', 'Haiti', 'Scozia'],
  D: ['USA', 'Paraguay', 'Australia', 'Turchia'],
  E: ['Germania', 'Curaçao', 'Costa d\'Avorio', 'Ecuador'],
  F: ['Paesi Bassi', 'Giappone', 'Svezia', 'Tunisia'],
  G: ['Belgio', 'Egitto', 'Iran', 'Nuova Zelanda'],
  H: ['Spagna', 'Capo Verde', 'Arabia Saudita', 'Uruguay'],
  I: ['Francia', 'Senegal', 'Iraq', 'Norvegia'],
  J: ['Argentina', 'Algeria', 'Austria', 'Giordania'],
  K: ['Portogallo', 'RD del Congo', 'Uzbekistan', 'Colombia'],
  L: ['Inghilterra', 'Croazia', 'Ghana', 'Panama']
};

const capiscioneGroups = {
  top: ['Brasile', 'Francia', 'Inghilterra', 'Spagna', 'Argentina'],
  outsider: ['Marocco', 'Giappone', 'USA', 'Croazia', 'Svizzera'],
  materasso: ['Qatar', 'Haiti', 'Curaçao', 'Capo Verde', 'Nuova Zelanda']
};

function getTeamCode(teamName) {
  const codes = {
    'Messico': 'MEX', 'Sudafrica': 'RSA', 'Corea del Sud': 'KOR', 'Repubblica Ceca': 'CZE',
    'Canada': 'CAN', 'Bosnia Erzegovina': 'BIH', 'Qatar': 'QAT', 'Svizzera': 'SUI',
    'Brasile': 'BRA', 'Marocco': 'MAR', 'Haiti': 'HAI', 'Scozia': 'SCO',
    'USA': 'USA', 'Paraguay': 'PAR', 'Australia': 'AUS', 'Turchia': 'TUR',
    'Germania': 'GER', 'Curaçao': 'CUW', 'Costa d\'Avorio': 'CIV', 'Ecuador': 'ECU',
    'Paesi Bassi': 'NED', 'Giappone': 'JPN', 'Svezia': 'SWE', 'Tunisia': 'TUN',
    'Belgio': 'BEL', 'Egitto': 'EGY', 'Iran': 'IRN', 'Nuova Zelanda': 'NZL',
    'Spagna': 'ESP', 'Capo Verde': 'CPV', 'Arabia Saudita': 'KSA', 'Uruguay': 'URU',
    'Francia': 'FRA', 'Senegal': 'SEN', 'Iraq': 'IRQ', 'Norvegia': 'NOR',
    'Argentina': 'ARG', 'Algeria': 'ALG', 'Austria': 'AUT', 'Giordania': 'JOR',
    'Portogallo': 'POR', 'RD del Congo': 'CGO', 'Uzbekistan': 'UZB', 'Colombia': 'COL',
    'Inghilterra': 'ENG', 'Croazia': 'CRO', 'Ghana': 'GHA', 'Panama': 'PAN'
  };
  return codes[teamName] || teamName.substring(0, 3).toUpperCase();
}

// Generate group stage matches (72 matches) - In chronological order
function generateGroupMatches() {
  const groupSchedule = [
    // 11 Giugno
    { num: 1, date: '2026-06-11T19:00:00Z', group: 'A', home: 'Messico', away: 'Sudafrica' },
    // 12 Giugno
    { num: 2, date: '2026-06-12T02:00:00Z', group: 'A', home: 'Corea del Sud', away: 'Repubblica Ceca' },
    { num: 7, date: '2026-06-12T19:00:00Z', group: 'B', home: 'Canada', away: 'Bosnia Erzegovina' },
    // 13 Giugno
    { num: 19, date: '2026-06-13T01:00:00Z', group: 'D', home: 'USA', away: 'Paraguay' },
    { num: 8, date: '2026-06-13T19:00:00Z', group: 'B', home: 'Svizzera', away: 'Qatar' },
    // 14 Giugno
    { num: 14, date: '2026-06-14T01:00:00Z', group: 'C', home: 'Haiti', away: 'Scozia' },
    { num: 20, date: '2026-06-14T04:00:00Z', group: 'D', home: 'Australia', away: 'Turchia' },
    { num: 25, date: '2026-06-14T17:00:00Z', group: 'E', home: 'Germania', away: 'Curaçao' },
    { num: 31, date: '2026-06-14T20:00:00Z', group: 'F', home: 'Paesi Bassi', away: 'Giappone' },
    { num: 13, date: '2026-06-14T22:00:00Z', group: 'C', home: 'Brasile', away: 'Marocco' },
    // 15 Giugno
    { num: 26, date: '2026-06-15T01:00:00Z', group: 'E', home: 'Costa d\'Avorio', away: 'Ecuador' },
    { num: 32, date: '2026-06-15T02:00:00Z', group: 'F', home: 'Svezia', away: 'Tunisia' },
    { num: 43, date: '2026-06-15T16:00:00Z', group: 'H', home: 'Spagna', away: 'Capo Verde' },
    { num: 37, date: '2026-06-15T19:00:00Z', group: 'G', home: 'Belgio', away: 'Egitto' },
    // 16 Giugno
    { num: 38, date: '2026-06-16T01:00:00Z', group: 'G', home: 'Iran', away: 'Nuova Zelanda' },
    { num: 49, date: '2026-06-16T19:00:00Z', group: 'I', home: 'Francia', away: 'Senegal' },
    { num: 50, date: '2026-06-16T22:00:00Z', group: 'I', home: 'Iraq', away: 'Norvegia' },
    { num: 44, date: '2026-06-16T22:00:00Z', group: 'H', home: 'Arabia Saudita', away: 'Uruguay' },
    // 17 Giugno
    { num: 56, date: '2026-06-17T01:00:00Z', group: 'J', home: 'Argentina', away: 'Algeria' },
    { num: 55, date: '2026-06-17T04:00:00Z', group: 'J', home: 'Austria', away: 'Giordania' },
    { num: 61, date: '2026-06-17T17:00:00Z', group: 'K', home: 'Portogallo', away: 'RD del Congo' },
    { num: 67, date: '2026-06-17T20:00:00Z', group: 'L', home: 'Inghilterra', away: 'Croazia' },
    { num: 68, date: '2026-06-17T23:00:00Z', group: 'L', home: 'Ghana', away: 'Panama' },
    // 18 Giugno
    { num: 62, date: '2026-06-18T02:00:00Z', group: 'K', home: 'Uzbekistan', away: 'Colombia' },
    { num: 3, date: '2026-06-18T16:00:00Z', group: 'A', home: 'Repubblica Ceca', away: 'Sudafrica' },
    { num: 9, date: '2026-06-18T19:00:00Z', group: 'B', home: 'Svizzera', away: 'Bosnia Erzegovina' },
    { num: 10, date: '2026-06-19T00:00:00Z', group: 'B', home: 'Canada', away: 'Qatar' },
    // 19 Giugno
    { num: 4, date: '2026-06-19T01:00:00Z', group: 'A', home: 'Messico', away: 'Corea del Sud' },
    { num: 22, date: '2026-06-19T19:00:00Z', group: 'D', home: 'USA', away: 'Australia' },
    // 20 Giugno
    { num: 16, date: '2026-06-20T00:00:00Z', group: 'C', home: 'Brasile', away: 'Haiti' },
    { num: 15, date: '2026-06-20T00:00:00Z', group: 'C', home: 'Scozia', away: 'Marocco' },
    { num: 21, date: '2026-06-20T03:00:00Z', group: 'D', home: 'Turchia', away: 'Paraguay' },
    { num: 34, date: '2026-06-20T17:00:00Z', group: 'F', home: 'Paesi Bassi', away: 'Svezia' },
    { num: 27, date: '2026-06-20T20:00:00Z', group: 'E', home: 'Germania', away: 'Costa d\'Avorio' },
    // 21 Giugno
    { num: 28, date: '2026-06-21T00:00:00Z', group: 'E', home: 'Ecuador', away: 'Curaçao' },
    { num: 33, date: '2026-06-21T04:00:00Z', group: 'F', home: 'Tunisia', away: 'Giappone' },
    { num: 45, date: '2026-06-21T16:00:00Z', group: 'H', home: 'Spagna', away: 'Arabia Saudita' },
    { num: 39, date: '2026-06-21T19:00:00Z', group: 'G', home: 'Belgio', away: 'Iran' },
    // 22 Giugno
    { num: 40, date: '2026-06-22T01:00:00Z', group: 'G', home: 'Nuova Zelanda', away: 'Egitto' },
    { num: 46, date: '2026-06-22T00:00:00Z', group: 'H', home: 'Uruguay', away: 'Capo Verde' },
    { num: 57, date: '2026-06-22T17:00:00Z', group: 'J', home: 'Argentina', away: 'Austria' },
    { num: 51, date: '2026-06-22T21:00:00Z', group: 'I', home: 'Francia', away: 'Iraq' },
    { num: 52, date: '2026-06-23T00:00:00Z', group: 'I', home: 'Norvegia', away: 'Senegal' },
    // 23 Giugno
    { num: 58, date: '2026-06-23T03:00:00Z', group: 'J', home: 'Giordania', away: 'Algeria' },
    { num: 63, date: '2026-06-23T17:00:00Z', group: 'K', home: 'Portogallo', away: 'Uzbekistan' },
    { num: 69, date: '2026-06-23T20:00:00Z', group: 'L', home: 'Inghilterra', away: 'Ghana' },
    { num: 70, date: '2026-06-23T23:00:00Z', group: 'L', home: 'Panama', away: 'Croazia' },
    // 24 Giugno
    { num: 64, date: '2026-06-24T02:00:00Z', group: 'K', home: 'Colombia', away: 'RD del Congo' },
    { num: 11, date: '2026-06-24T19:00:00Z', group: 'B', home: 'Svizzera', away: 'Canada' },
    { num: 12, date: '2026-06-24T19:00:00Z', group: 'B', home: 'Bosnia Erzegovina', away: 'Qatar' },
    // 25 Giugno
    { num: 6, date: '2026-06-25T01:00:00Z', group: 'A', home: 'Repubblica Ceca', away: 'Messico' },
    { num: 5, date: '2026-06-25T01:00:00Z', group: 'A', home: 'Sudafrica', away: 'Corea del Sud' },
    { num: 29, date: '2026-06-25T20:00:00Z', group: 'E', home: 'Curaçao', away: 'Costa d\'Avorio' },
    { num: 30, date: '2026-06-25T20:00:00Z', group: 'E', home: 'Ecuador', away: 'Germania' },
    { num: 17, date: '2026-06-25T22:00:00Z', group: 'C', home: 'Marocco', away: 'Haiti' },
    { num: 18, date: '2026-06-25T22:00:00Z', group: 'C', home: 'Scozia', away: 'Brasile' },
    // 26 Giugno
    { num: 36, date: '2026-06-26T01:00:00Z', group: 'F', home: 'Giappone', away: 'Svezia' },
    { num: 35, date: '2026-06-26T01:00:00Z', group: 'F', home: 'Tunisia', away: 'Paesi Bassi' },
    { num: 23, date: '2026-06-26T02:00:00Z', group: 'D', home: 'Turchia', away: 'USA' },
    { num: 24, date: '2026-06-26T02:00:00Z', group: 'D', home: 'Paraguay', away: 'Australia' },
    { num: 53, date: '2026-06-26T19:00:00Z', group: 'I', home: 'Norvegia', away: 'Francia' },
    { num: 54, date: '2026-06-26T19:00:00Z', group: 'I', home: 'Senegal', away: 'Iraq' },
    // 27 Giugno
    { num: 47, date: '2026-06-27T00:00:00Z', group: 'H', home: 'Capo Verde', away: 'Arabia Saudita' },
    { num: 48, date: '2026-06-27T00:00:00Z', group: 'H', home: 'Uruguay', away: 'Spagna' },
    { num: 41, date: '2026-06-27T03:00:00Z', group: 'G', home: 'Nuova Zelanda', away: 'Belgio' },
    { num: 42, date: '2026-06-27T03:00:00Z', group: 'G', home: 'Egitto', away: 'Iran' },
    { num: 71, date: '2026-06-27T21:00:00Z', group: 'L', home: 'Panama', away: 'Inghilterra' },
    { num: 72, date: '2026-06-27T21:00:00Z', group: 'L', home: 'Croazia', away: 'Ghana' },
    { num: 65, date: '2026-06-27T23:30:00Z', group: 'K', home: 'Colombia', away: 'Portogallo' },
    { num: 66, date: '2026-06-27T23:30:00Z', group: 'K', home: 'RD del Congo', away: 'Uzbekistan' },
    // 28 Giugno
    { num: 59, date: '2026-06-28T02:00:00Z', group: 'J', home: 'Algeria', away: 'Austria' },
    { num: 60, date: '2026-06-28T02:00:00Z', group: 'J', home: 'Giordania', away: 'Argentina' }
  ];

  return groupSchedule.map(m => {
    return {
      matchNumber: m.num,
      phase: 'GROUP',
      group: m.group,
      homeTeam: { name: m.home, code: getTeamCode(m.home) },
      awayTeam: { name: m.away, code: getTeamCode(m.away) },
      date: new Date(m.date),
      status: 'SCHEDULED'
    };
  });
}

// Generate knockout stage matches (32 matches)
function generateKnockoutMatches() {
  const knockoutSchedule = [
    // ROUND OF 16 (16 matches)
    { num: 73, date: '2026-06-28T21:00:00Z', phase: 'ROUND_16', home: '2A', away: '2B' },
    { num: 74, date: '2026-06-29T19:00:00Z', phase: 'ROUND_16', home: '1C', away: '2F' },
    { num: 75, date: '2026-06-29T22:30:00Z', phase: 'ROUND_16', home: '1E', away: '3ABCDF' },
    { num: 76, date: '2026-06-30T03:00:00Z', phase: 'ROUND_16', home: '1F', away: '2C' },
    { num: 77, date: '2026-06-30T19:00:00Z', phase: 'ROUND_16', home: '2E', away: '2I' },
    { num: 78, date: '2026-06-30T23:00:00Z', phase: 'ROUND_16', home: '1I', away: '3CDFGH' },
    { num: 79, date: '2026-07-01T03:00:00Z', phase: 'ROUND_16', home: '1A', away: '3CEFHI' },
    { num: 80, date: '2026-07-01T18:00:00Z', phase: 'ROUND_16', home: '1L', away: '3EHIJK' },
    { num: 81, date: '2026-07-01T22:00:00Z', phase: 'ROUND_16', home: '1G', away: '3AEHIJ' },
    { num: 82, date: '2026-07-03T01:00:00Z', phase: 'ROUND_16', home: '2K', away: '2L' },
    { num: 83, date: '2026-07-03T05:00:00Z', phase: 'ROUND_16', home: '1B', away: '3EFGIJ' },
    { num: 84, date: '2026-07-03T20:00:00Z', phase: 'ROUND_16', home: '2D', away: '2G' },
    { num: 85, date: '2026-07-04T00:00:00Z', phase: 'ROUND_16', home: '1J', away: '2H' },
    { num: 86, date: '2026-07-04T03:30:00Z', phase: 'ROUND_16', home: '1K', away: '3DEIJL' },
    { num: 87, date: '2026-07-05T00:00:00Z', phase: 'ROUND_16', home: '1D', away: '3ABCDE' },
    { num: 88, date: '2026-07-05T03:00:00Z', phase: 'ROUND_16', home: '1H', away: '3FGHIJ' },
    // ROUND OF 8 (8 matches)
    { num: 89, date: '2026-07-04T19:00:00Z', phase: 'ROUND_8', home: 'W73', away: 'W75' },
    { num: 90, date: '2026-07-04T23:00:00Z', phase: 'ROUND_8', home: 'W74', away: 'W77' },
    { num: 91, date: '2026-07-05T22:00:00Z', phase: 'ROUND_8', home: 'W76', away: 'W78' },
    { num: 92, date: '2026-07-06T02:00:00Z', phase: 'ROUND_8', home: 'W79', away: 'W80' },
    { num: 93, date: '2026-07-06T21:00:00Z', phase: 'ROUND_8', home: 'W83', away: 'W84' },
    { num: 94, date: '2026-07-07T02:00:00Z', phase: 'ROUND_8', home: 'W81', away: 'W82' },
    { num: 95, date: '2026-07-07T22:00:00Z', phase: 'ROUND_8', home: 'W85', away: 'W87' },
    { num: 96, date: '2026-07-09T22:00:00Z', phase: 'ROUND_8', home: 'W86', away: 'W88' },
    // QUARTER FINALS (4 matches)
    { num: 97, date: '2026-07-10T21:00:00Z', phase: 'QUARTER', home: 'W89', away: 'W90' },
    { num: 98, date: '2026-07-11T23:00:00Z', phase: 'QUARTER', home: 'W91', away: 'W92' },
    { num: 99, date: '2026-07-12T03:00:00Z', phase: 'QUARTER', home: 'W93', away: 'W94' },
    { num: 100, date: '2026-07-14T21:00:00Z', phase: 'QUARTER', home: 'W95', away: 'W96' },
    // SEMI FINALS (2 matches)
    { num: 101, date: '2026-07-15T21:00:00Z', phase: 'SEMI', home: 'W97', away: 'W98' },
    { num: 102, date: '2026-07-16T21:00:00Z', phase: 'SEMI', home: 'W99', away: 'W100' },
    // THIRD PLACE
    { num: 103, date: '2026-07-18T23:00:00Z', phase: 'THIRD_PLACE', home: 'L101', away: 'L102' },
    // FINAL
    { num: 104, date: '2026-07-19T21:00:00Z', phase: 'FINAL', home: 'W101', away: 'W102' }
  ];

  return knockoutSchedule.map(m => {
    return {
      matchNumber: m.num,
      phase: m.phase,
      homeTeam: { name: m.home, code: m.home },
      awayTeam: { name: m.away, code: m.away },
      date: new Date(m.date),
      status: 'SCHEDULED'
    };
  });
}

// Create settings data
function createSettingsData() {
  return {
    _id: 'app_settings',
    tournament: {
      name: 'FIFA World Cup 2026',
      startDate: new Date('2026-06-11T18:00:00Z'),
      endDate: new Date('2026-07-19T23:00:00Z'),
      hosts: ['USA', 'Canada', 'Mexico']
    },
    predictionsLockDate: new Date('2026-06-11T17:00:00Z'),
    scoring: {
      groupStage: {
        exactResult: 6,
        correctSign: 3,
        bonusEvery5ExactResults: 5
      },
      knockoutStage: {
        round16Correct: 20,
        round16ExactPosition: 5,
        quarterFinalsCorrect: 20,
        semiFinalsCorrect: 30,
        finalCorrect: 50
      },
      finalRankings: {
        first: 80,
        second: 50,
        third: 25,
        fourth: 25
      },
      topScorer: 30,
      capiscione: {
        top: 25,
        outsider: 20,
        materasso: 15
      }
    },
    capiscioneGroups: {
      top: capiscioneGroups.top.map(team => ({ name: team, code: getTeamCode(team) })),
      outsider: capiscioneGroups.outsider.map(team => ({ name: team, code: getTeamCode(team) })),
      materasso: capiscioneGroups.materasso.map(team => ({ name: team, code: getTeamCode(team) }))
    },
    features: {
      allowRegistration: true,
      allowPredictionModification: true,
      showLeaderboard: false,
      showOtherPredictions: false
    }
  };
}

module.exports = {
  generateGroupMatches,
  generateKnockoutMatches,
  createSettingsData
};

// Made with Bob