// FIFA World Cup 2026 Groups (Official Draw)
const groups = {
  A: ['Mexico', 'South Africa', 'Korea Republic', 'Czech Republic'],
  B: ['Canada', 'Bosnia Erzigovna', 'Qatar', 'Switzerland'],
  C: ['Brazil', 'Morocco', 'Haiti', 'Scotland'],
  D: ['USA', 'Paraguay', 'Australia', 'Turkey'],
  E: ['Germany', 'Curaçao', 'Côte d\'Ivoire', 'Ecuador'],
  F: ['Netherlands', 'Japan', 'Sweden', 'Tunisia'],
  G: ['Belgium', 'Egypt', 'Iran', 'New Zealand'],
  H: ['Spain', 'Cabo Verde', 'Saudi Arabia', 'Uruguay'],
  I: ['France', 'Senegal', 'Iraq', 'Norway'],
  J: ['Argentina', 'Algeria', 'Austria', 'Jordan'],
  K: ['Portugal', 'Congo', 'Uzbekistan', 'Colombia'],
  L: ['England', 'Croatia', 'Ghana', 'Panama']
};

const capiscioneGroups = {
  top: ['Brazil', 'France', 'England', 'Spain', 'Argentina'],
  outsider: ['Morocco', 'Japan', 'USA', 'Croatia', 'Switzerland'],
  materasso: ['Qatar', 'Haiti', 'Curaçao', 'Cabo Verde', 'New Zealand']
};

const venues = {
  'Mexico City': { name: 'Estadio Azteca', city: 'Mexico City', country: 'Mexico' },
  'Los Angeles': { name: 'SoFi Stadium', city: 'Los Angeles', country: 'USA' },
  'Guadalajara': { name: 'Estadio Akron', city: 'Guadalajara', country: 'Mexico' },
  'Houston': { name: 'NRG Stadium', city: 'Houston', country: 'USA' },
  'Dallas': { name: 'AT&T Stadium', city: 'Dallas', country: 'USA' },
  'Monterrey': { name: 'Estadio BBVA', city: 'Monterrey', country: 'Mexico' },
  'Kansas City': { name: 'Arrowhead Stadium', city: 'Kansas City', country: 'USA' },
  'Toronto': { name: 'BMO Field', city: 'Toronto', country: 'Canada' },
  'Philadelphia': { name: 'Lincoln Financial Field', city: 'Philadelphia', country: 'USA' },
  'Miami': { name: 'Hard Rock Stadium', city: 'Miami', country: 'USA' },
  'Vancouver': { name: 'BC Place', city: 'Vancouver', country: 'Canada' },
  'Atlanta': { name: 'Mercedes-Benz Stadium', city: 'Atlanta', country: 'USA' },
  'Seattle': { name: 'Lumen Field', city: 'Seattle', country: 'USA' },
  'San Francisco': { name: 'Levi\'s Stadium', city: 'San Francisco Bay Area', country: 'USA' },
  'Santa Clara': { name: 'Levi\'s Stadium', city: 'San Francisco Bay Area', country: 'USA' }, // Alias for San Francisco
  'Boston': { name: 'Gillette Stadium', city: 'Boston', country: 'USA' },
  'New York': { name: 'MetLife Stadium', city: 'New York/New Jersey', country: 'USA' }
};

function getTeamCode(teamName) {
  const codes = {
    'Mexico': 'MEX', 'South Africa': 'RSA', 'Korea Republic': 'KOR', 'Czech Republic': 'CZE',
    'Canada': 'CAN', 'Bosnia Erzigovna': 'BIH', 'Qatar': 'QAT', 'Switzerland': 'SUI',
    'Brazil': 'BRA', 'Morocco': 'MAR', 'Haiti': 'HAI', 'Scotland': 'SCO',
    'USA': 'USA', 'Paraguay': 'PAR', 'Australia': 'AUS', 'Turkey': 'TUR',
    'Germany': 'GER', 'Curaçao': 'CUW', 'Côte d\'Ivoire': 'CIV', 'Ecuador': 'ECU',
    'Netherlands': 'NED', 'Japan': 'JPN', 'Sweden': 'SWE', 'Tunisia': 'TUN',
    'Belgium': 'BEL', 'Egypt': 'EGY', 'Iran': 'IRN', 'New Zealand': 'NZL',
    'Spain': 'ESP', 'Cabo Verde': 'CPV', 'Saudi Arabia': 'KSA', 'Uruguay': 'URU',
    'France': 'FRA', 'Senegal': 'SEN', 'Iraq': 'IRQ', 'Norway': 'NOR',
    'Argentina': 'ARG', 'Algeria': 'ALG', 'Austria': 'AUT', 'Jordan': 'JOR',
    'Portugal': 'POR', 'Congo': 'CGO', 'Uzbekistan': 'UZB', 'Colombia': 'COL',
    'England': 'ENG', 'Croatia': 'CRO', 'Ghana': 'GHA', 'Panama': 'PAN'
  };
  return codes[teamName] || teamName.substring(0, 3).toUpperCase();
}

// Generate group stage matches (72 matches)
function generateGroupMatches() {
  const groupSchedule = [
    // Group A - Corrected schedule
    // Giornata 1
    { num: 1, date: '2026-06-11T19:00:00Z', group: 'A', home: 'Mexico', away: 'South Africa', venue: 'Mexico City' },
    { num: 2, date: '2026-06-12T02:00:00Z', group: 'A', home: 'Korea Republic', away: 'Czech Republic', venue: 'Guadalajara' },
    // Giornata 2
    { num: 3, date: '2026-06-18T16:00:00Z', group: 'A', home: 'Czech Republic', away: 'South Africa', venue: 'Atlanta' },
    { num: 4, date: '2026-06-19T01:00:00Z', group: 'A', home: 'Mexico', away: 'Korea Republic', venue: 'Guadalajara' },
    // Giornata 3
    { num: 5, date: '2026-06-25T01:00:00Z', group: 'A', home: 'South Africa', away: 'Korea Republic', venue: 'Monterrey' },
    { num: 6, date: '2026-06-25T01:00:00Z', group: 'A', home: 'Czech Republic', away: 'Mexico', venue: 'Mexico City' },
    // Group B - Corrected
    { num: 7, date: '2026-06-12T19:00:00Z', group: 'B', home: 'Canada', away: 'Bosnia Erzigovna', venue: 'Toronto' },
    { num: 8, date: '2026-06-13T19:00:00Z', group: 'B', home: 'Switzerland', away: 'Qatar', venue: 'San Francisco' },
    { num: 9, date: '2026-06-18T19:00:00Z', group: 'B', home: 'Switzerland', away: 'Bosnia Erzigovna', venue: 'Los Angeles' },
    { num: 10, date: '2026-06-19T22:00:00Z', group: 'B', home: 'Canada', away: 'Qatar', venue: 'Vancouver' },
    { num: 11, date: '2026-06-24T19:00:00Z', group: 'B', home: 'Switzerland', away: 'Canada', venue: 'Vancouver' },
    { num: 12, date: '2026-06-24T19:00:00Z', group: 'B', home: 'Bosnia Erzigovna', away: 'Qatar', venue: 'Seattle' },
    // Group C - Corrected
    { num: 13, date: '2026-06-15T22:00:00Z', group: 'C', home: 'Brazil', away: 'Morocco', venue: 'New York' },
    { num: 14, date: '2026-06-14T01:00:00Z', group: 'C', home: 'Haiti', away: 'Scotland', venue: 'Boston' },
    { num: 15, date: '2026-06-21T22:00:00Z', group: 'C', home: 'Scotland', away: 'Morocco', venue: 'Boston' },
    { num: 16, date: '2026-06-20T01:00:00Z', group: 'C', home: 'Brazil', away: 'Haiti', venue: 'Philadelphia' },
    { num: 17, date: '2026-06-26T22:00:00Z', group: 'C', home: 'Morocco', away: 'Haiti', venue: 'Atlanta' },
    { num: 18, date: '2026-06-26T22:00:00Z', group: 'C', home: 'Scotland', away: 'Brazil', venue: 'Miami' },
    // Group D - Corrected
    { num: 19, date: '2026-06-13T01:00:00Z', group: 'D', home: 'USA', away: 'Paraguay', venue: 'Los Angeles' },
    { num: 20, date: '2026-06-14T04:00:00Z', group: 'D', home: 'Australia', away: 'Turkey', venue: 'Vancouver' },
    { num: 21, date: '2026-06-20T04:00:00Z', group: 'D', home: 'Turkey', away: 'Paraguay', venue: 'San Francisco' },
    { num: 22, date: '2026-06-19T19:00:00Z', group: 'D', home: 'USA', away: 'Australia', venue: 'Seattle' },
    { num: 23, date: '2026-06-26T02:00:00Z', group: 'D', home: 'Turkey', away: 'USA', venue: 'Los Angeles' },
    { num: 24, date: '2026-06-26T02:00:00Z', group: 'D', home: 'Paraguay', away: 'Australia', venue: 'San Francisco' },
    // Group E - Corrected
    { num: 25, date: '2026-06-14T17:00:00Z', group: 'E', home: 'Germany', away: 'Curaçao', venue: 'Houston' },
    { num: 26, date: '2026-06-15T20:00:00Z', group: 'E', home: 'Côte d\'Ivoire', away: 'Ecuador', venue: 'Philadelphia' },
    { num: 27, date: '2026-06-20T20:00:00Z', group: 'E', home: 'Germany', away: 'Côte d\'Ivoire', venue: 'Toronto' },
    { num: 28, date: '2026-06-21T00:00:00Z', group: 'E', home: 'Ecuador', away: 'Curaçao', venue: 'Kansas City' },
    { num: 29, date: '2026-06-25T20:00:00Z', group: 'E', home: 'Curaçao', away: 'Côte d\'Ivoire', venue: 'Philadelphia' },
    { num: 30, date: '2026-06-25T20:00:00Z', group: 'E', home: 'Ecuador', away: 'Germany', venue: 'New York' },
    // Group F - Corrected
    { num: 31, date: '2026-06-14T20:00:00Z', group: 'F', home: 'Netherlands', away: 'Japan', venue: 'Dallas' },
    { num: 32, date: '2026-06-15T02:00:00Z', group: 'F', home: 'Sweden', away: 'Tunisia', venue: 'Monterrey' },
    { num: 33, date: '2026-06-21T04:00:00Z', group: 'F', home: 'Tunisia', away: 'Japan', venue: 'Monterrey' },
    { num: 34, date: '2026-06-20T17:00:00Z', group: 'F', home: 'Netherlands', away: 'Sweden', venue: 'Houston' },
    { num: 35, date: '2026-06-25T23:00:00Z', group: 'F', home: 'Tunisia', away: 'Netherlands', venue: 'Kansas City' },
    { num: 36, date: '2026-06-25T23:00:00Z', group: 'F', home: 'Japan', away: 'Sweden', venue: 'Dallas' },
    // Group G - Corrected
    { num: 37, date: '2026-06-15T19:00:00Z', group: 'G', home: 'Belgium', away: 'Egypt', venue: 'Seattle' },
    { num: 38, date: '2026-06-16T01:00:00Z', group: 'G', home: 'Iran', away: 'New Zealand', venue: 'Los Angeles' },
    { num: 39, date: '2026-06-21T19:00:00Z', group: 'G', home: 'Belgium', away: 'Iran', venue: 'Los Angeles' },
    { num: 40, date: '2026-06-22T01:00:00Z', group: 'G', home: 'New Zealand', away: 'Egypt', venue: 'Vancouver' },
    { num: 41, date: '2026-06-27T03:00:00Z', group: 'G', home: 'New Zealand', away: 'Belgium', venue: 'Vancouver' },
    { num: 42, date: '2026-06-27T03:00:00Z', group: 'G', home: 'Egypt', away: 'Iran', venue: 'Seattle' },
    // Group H - Corrected
    { num: 43, date: '2026-06-15T16:00:00Z', group: 'H', home: 'Spain', away: 'Cabo Verde', venue: 'Atlanta' },
    { num: 44, date: '2026-06-17T22:00:00Z', group: 'H', home: 'Saudi Arabia', away: 'Uruguay', venue: 'Miami' },
    { num: 45, date: '2026-06-21T16:00:00Z', group: 'H', home: 'Spain', away: 'Saudi Arabia', venue: 'Atlanta' },
    { num: 46, date: '2026-06-23T22:00:00Z', group: 'H', home: 'Uruguay', away: 'Cabo Verde', venue: 'Miami' },
    { num: 47, date: '2026-06-27T00:00:00Z', group: 'H', home: 'Cabo Verde', away: 'Saudi Arabia', venue: 'Houston' },
    { num: 48, date: '2026-06-27T00:00:00Z', group: 'H', home: 'Uruguay', away: 'Spain', venue: 'Guadalajara' },
    // Group I - Corrected
    { num: 49, date: '2026-06-16T19:00:00Z', group: 'I', home: 'France', away: 'Senegal', venue: 'New York' },
    { num: 50, date: '2026-06-16T22:00:00Z', group: 'I', home: 'Iraq', away: 'Norway', venue: 'Boston' },
    { num: 51, date: '2026-06-22T21:00:00Z', group: 'I', home: 'France', away: 'Iraq', venue: 'Philadelphia' },
    { num: 52, date: '2026-06-23T00:00:00Z', group: 'I', home: 'Norway', away: 'Senegal', venue: 'New York' },
    { num: 53, date: '2026-06-26T19:00:00Z', group: 'I', home: 'Norway', away: 'France', venue: 'Boston' },
    { num: 54, date: '2026-06-26T19:00:00Z', group: 'I', home: 'Senegal', away: 'Iraq', venue: 'Toronto' },
    // Group J - Corrected
    { num: 55, date: '2026-06-17T04:00:00Z', group: 'J', home: 'Austria', away: 'Jordan', venue: 'San Francisco' },
    { num: 56, date: '2026-06-17T01:00:00Z', group: 'J', home: 'Argentina', away: 'Algeria', venue: 'Kansas City' },
    { num: 57, date: '2026-06-22T17:00:00Z', group: 'J', home: 'Argentina', away: 'Austria', venue: 'Dallas' },
    { num: 58, date: '2026-06-23T03:00:00Z', group: 'J', home: 'Jordan', away: 'Algeria', venue: 'San Francisco' },
    { num: 59, date: '2026-06-28T02:00:00Z', group: 'J', home: 'Algeria', away: 'Austria', venue: 'Kansas City' },
    { num: 60, date: '2026-06-28T02:00:00Z', group: 'J', home: 'Jordan', away: 'Argentina', venue: 'Dallas' },
    // Group K - Corrected
    { num: 61, date: '2026-06-17T17:00:00Z', group: 'K', home: 'Portugal', away: 'Congo', venue: 'Houston' },
    { num: 62, date: '2026-06-18T02:00:00Z', group: 'K', home: 'Uzbekistan', away: 'Colombia', venue: 'Mexico City' },
    { num: 63, date: '2026-06-23T17:00:00Z', group: 'K', home: 'Portugal', away: 'Uzbekistan', venue: 'Houston' },
    { num: 64, date: '2026-06-24T02:00:00Z', group: 'K', home: 'Colombia', away: 'Congo', venue: 'Guadalajara' },
    { num: 65, date: '2026-06-27T23:30:00Z', group: 'K', home: 'Colombia', away: 'Portugal', venue: 'Miami' },
    { num: 66, date: '2026-06-27T23:30:00Z', group: 'K', home: 'Congo', away: 'Uzbekistan', venue: 'Atlanta' },
    // Group L - Corrected
    { num: 67, date: '2026-06-17T20:00:00Z', group: 'L', home: 'England', away: 'Croatia', venue: 'Dallas' },
    { num: 68, date: '2026-06-17T23:00:00Z', group: 'L', home: 'Ghana', away: 'Panama', venue: 'Toronto' },
    { num: 69, date: '2026-06-23T20:00:00Z', group: 'L', home: 'England', away: 'Ghana', venue: 'Boston' },
    { num: 70, date: '2026-06-23T23:00:00Z', group: 'L', home: 'Panama', away: 'Croatia', venue: 'Toronto' },
    { num: 71, date: '2026-06-27T21:00:00Z', group: 'L', home: 'Panama', away: 'England', venue: 'New York' },
    { num: 72, date: '2026-06-27T21:00:00Z', group: 'L', home: 'Croatia', away: 'Ghana', venue: 'Philadelphia' }
  ];

  return groupSchedule.map(m => {
    const venue = venues[m.venue];
    return {
      matchNumber: m.num,
      phase: 'GROUP',
      group: m.group,
      homeTeam: { name: m.home, code: getTeamCode(m.home) },
      awayTeam: { name: m.away, code: getTeamCode(m.away) },
      date: new Date(m.date),
      venue: venue.name,
      city: venue.city,
      country: venue.country,
      status: 'SCHEDULED'
    };
  });
}

// Generate knockout stage matches (32 matches)
function generateKnockoutMatches() {
  const knockoutSchedule = [
    // ROUND OF 16 (16 matches)
    { num: 73, date: '2026-06-28T21:00:00Z', phase: 'ROUND_16', home: '2A', away: '2B', venue: 'Los Angeles' },
    { num: 74, date: '2026-06-29T19:00:00Z', phase: 'ROUND_16', home: '1C', away: '2F', venue: 'Houston' },
    { num: 75, date: '2026-06-29T22:30:00Z', phase: 'ROUND_16', home: '1E', away: '3ABCDF', venue: 'Boston' },
    { num: 76, date: '2026-06-30T03:00:00Z', phase: 'ROUND_16', home: '1F', away: '2C', venue: 'Monterrey' },
    { num: 77, date: '2026-06-30T19:00:00Z', phase: 'ROUND_16', home: '2E', away: '2I', venue: 'Dallas' },
    { num: 78, date: '2026-06-30T23:00:00Z', phase: 'ROUND_16', home: '1I', away: '3CDFGH', venue: 'New York' },
    { num: 79, date: '2026-07-01T03:00:00Z', phase: 'ROUND_16', home: '1A', away: '3CEFHI', venue: 'Mexico City' },
    { num: 80, date: '2026-07-01T18:00:00Z', phase: 'ROUND_16', home: '1L', away: '3EHIJK', venue: 'Atlanta' },
    { num: 81, date: '2026-07-01T22:00:00Z', phase: 'ROUND_16', home: '1G', away: '3AEHIJ', venue: 'Seattle' },
    { num: 82, date: '2026-07-03T01:00:00Z', phase: 'ROUND_16', home: '2K', away: '2L', venue: 'Toronto' },
    { num: 83, date: '2026-07-03T05:00:00Z', phase: 'ROUND_16', home: '1B', away: '3EFGIJ', venue: 'Vancouver' },
    { num: 84, date: '2026-07-03T20:00:00Z', phase: 'ROUND_16', home: '2D', away: '2G', venue: 'Dallas' },
    { num: 85, date: '2026-07-04T00:00:00Z', phase: 'ROUND_16', home: '1J', away: '2H', venue: 'Miami' },
    { num: 86, date: '2026-07-04T03:30:00Z', phase: 'ROUND_16', home: '1K', away: '3DEIJL', venue: 'Kansas City' },
    { num: 87, date: '2026-07-05T00:00:00Z', phase: 'ROUND_16', home: '1D', away: '3ABCDE', venue: 'Philadelphia' },
    { num: 88, date: '2026-07-05T03:00:00Z', phase: 'ROUND_16', home: '1H', away: '3FGHIJ', venue: 'Santa Clara' },
    // ROUND OF 8 (8 matches)
    { num: 89, date: '2026-07-04T19:00:00Z', phase: 'ROUND_8', home: 'W73', away: 'W75', venue: 'Houston' },
    { num: 90, date: '2026-07-04T23:00:00Z', phase: 'ROUND_8', home: 'W74', away: 'W77', venue: 'Philadelphia' },
    { num: 91, date: '2026-07-05T22:00:00Z', phase: 'ROUND_8', home: 'W76', away: 'W78', venue: 'New York' },
    { num: 92, date: '2026-07-06T02:00:00Z', phase: 'ROUND_8', home: 'W79', away: 'W80', venue: 'Mexico City' },
    { num: 93, date: '2026-07-06T21:00:00Z', phase: 'ROUND_8', home: 'W83', away: 'W84', venue: 'Dallas' },
    { num: 94, date: '2026-07-07T02:00:00Z', phase: 'ROUND_8', home: 'W81', away: 'W82', venue: 'Seattle' },
    { num: 95, date: '2026-07-07T22:00:00Z', phase: 'ROUND_8', home: 'W85', away: 'W87', venue: 'Vancouver' },
    { num: 96, date: '2026-07-09T22:00:00Z', phase: 'ROUND_8', home: 'W86', away: 'W88', venue: 'Boston' },
    // QUARTER FINALS (4 matches)
    { num: 97, date: '2026-07-10T21:00:00Z', phase: 'QUARTER', home: 'W89', away: 'W90', venue: 'Los Angeles' },
    { num: 98, date: '2026-07-11T23:00:00Z', phase: 'QUARTER', home: 'W91', away: 'W92', venue: 'Miami' },
    { num: 99, date: '2026-07-12T03:00:00Z', phase: 'QUARTER', home: 'W93', away: 'W94', venue: 'Kansas City' },
    { num: 100, date: '2026-07-14T21:00:00Z', phase: 'QUARTER', home: 'W95', away: 'W96', venue: 'Dallas' },
    // SEMI FINALS (2 matches)
    { num: 101, date: '2026-07-15T21:00:00Z', phase: 'SEMI', home: 'W97', away: 'W98', venue: 'Atlanta' },
    { num: 102, date: '2026-07-16T21:00:00Z', phase: 'SEMI', home: 'W99', away: 'W100', venue: 'Philadelphia' },
    // THIRD PLACE
    { num: 103, date: '2026-07-18T23:00:00Z', phase: 'THIRD_PLACE', home: 'L101', away: 'L102', venue: 'Miami' },
    // FINAL
    { num: 104, date: '2026-07-19T21:00:00Z', phase: 'FINAL', home: 'W101', away: 'W102', venue: 'New York' }
  ];

  return knockoutSchedule.map(m => {
    const venue = venues[m.venue];
    return {
      matchNumber: m.num,
      phase: m.phase,
      homeTeam: { name: m.home, code: m.home },
      awayTeam: { name: m.away, code: m.away },
      date: new Date(m.date),
      venue: venue.name,
      city: venue.city,
      country: venue.country,
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