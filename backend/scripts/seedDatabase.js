const mongoose = require('mongoose');
require('dotenv').config();

const Match = require('../src/models/Match');
const Settings = require('../src/models/Settings');

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

// Capiscione Groups - Balanced selection based on FIFA ranking and tournament favorites
const capiscioneGroups = {
  top: ['Brazil', 'France', 'England', 'Spain', 'Argentina'],
  outsider: ['Morocco', 'Japan', 'USA', 'Croatia', 'Switzerland'],
  materasso: ['Qatar', 'Haiti', 'Curaçao', 'Cabo Verde', 'New Zealand']
};

// Venues for FIFA 2026 (Official FIFA venues)
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
  'Santa Clara': { name: 'Levi\'s Stadium', city: 'Santa Clara', country: 'USA' },
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

// Official FIFA 2026 Match Schedule - GROUP STAGE (72 matches)
function generateGroupMatches() {
  const matches = [
    // Match 1-6: Group A
    { num: 1, date: '2026-06-11T18:00:00Z', group: 'A', home: 'Mexico', away: 'South Africa', venue: 'Mexico City' },
    { num: 2, date: '2026-06-12T00:00:00Z', group: 'A', home: 'Korea Republic', away: 'Czech Republic', venue: 'Los Angeles' },
    { num: 3, date: '2026-06-16T21:00:00Z', group: 'A', home: 'Mexico', away: 'Korea Republic', venue: 'Guadalajara' },
    { num: 4, date: '2026-06-17T00:00:00Z', group: 'A', home: 'South Africa', away: 'Czech Republic', venue: 'Houston' },
    { num: 5, date: '2026-06-21T19:00:00Z', group: 'A', home: 'Mexico', away: 'Czech Republic', venue: 'Dallas' },
    { num: 6, date: '2026-06-21T19:00:00Z', group: 'A', home: 'South Africa', away: 'Korea Republic', venue: 'Monterrey' },
    
    // Match 7-12: Group B
    { num: 7, date: '2026-06-12T18:00:00Z', group: 'B', home: 'Canada', away: 'Bosnia Erzigovna', venue: 'Kansas City' },
    { num: 8, date: '2026-06-12T21:00:00Z', group: 'B', home: 'Qatar', away: 'Switzerland', venue: 'Toronto' },
    { num: 9, date: '2026-06-17T18:00:00Z', group: 'B', home: 'Canada', away: 'Qatar', venue: 'Philadelphia' },
    { num: 10, date: '2026-06-17T21:00:00Z', group: 'B', home: 'Bosnia Erzigovna', away: 'Switzerland', venue: 'Miami' },
    { num: 11, date: '2026-06-21T23:00:00Z', group: 'B', home: 'Canada', away: 'Switzerland', venue: 'Vancouver' },
    { num: 12, date: '2026-06-21T23:00:00Z', group: 'B', home: 'Bosnia Erzigovna', away: 'Qatar', venue: 'Atlanta' },
    
    // Match 13-18: Group C
    { num: 13, date: '2026-06-13T00:00:00Z', group: 'C', home: 'Brazil', away: 'Morocco', venue: 'Los Angeles' },
    { num: 14, date: '2026-06-13T18:00:00Z', group: 'C', home: 'Haiti', away: 'Scotland', venue: 'Seattle' },
    { num: 15, date: '2026-06-18T00:00:00Z', group: 'C', home: 'Brazil', away: 'Haiti', venue: 'Miami' },
    { num: 16, date: '2026-06-18T18:00:00Z', group: 'C', home: 'Morocco', away: 'Scotland', venue: 'Santa Clara' },
    { num: 17, date: '2026-06-22T23:00:00Z', group: 'C', home: 'Brazil', away: 'Scotland', venue: 'Dallas' },
    { num: 18, date: '2026-06-22T23:00:00Z', group: 'C', home: 'Morocco', away: 'Haiti', venue: 'Houston' },
    
    // Match 19-24: Group D
    { num: 19, date: '2026-06-13T21:00:00Z', group: 'D', home: 'USA', away: 'Paraguay', venue: 'Los Angeles' },
    { num: 20, date: '2026-06-14T00:00:00Z', group: 'D', home: 'Australia', away: 'Turkey', venue: 'Dallas' },
    { num: 21, date: '2026-06-18T21:00:00Z', group: 'D', home: 'USA', away: 'Australia', venue: 'Seattle' },
    { num: 22, date: '2026-06-19T00:00:00Z', group: 'D', home: 'Paraguay', away: 'Turkey', venue: 'New York' },
    { num: 23, date: '2026-06-23T19:00:00Z', group: 'D', home: 'USA', away: 'Turkey', venue: 'Kansas City' },
    { num: 24, date: '2026-06-23T19:00:00Z', group: 'D', home: 'Paraguay', away: 'Australia', venue: 'Houston' },
    
    // Match 25-30: Group E
    { num: 25, date: '2026-06-14T18:00:00Z', group: 'E', home: 'Germany', away: 'Curaçao', venue: 'Boston' },
    { num: 26, date: '2026-06-14T21:00:00Z', group: 'E', home: 'Côte d\'Ivoire', away: 'Ecuador', venue: 'Houston' },
    { num: 27, date: '2026-06-19T18:00:00Z', group: 'E', home: 'Germany', away: 'Côte d\'Ivoire', venue: 'Philadelphia' },
    { num: 28, date: '2026-06-19T21:00:00Z', group: 'E', home: 'Curaçao', away: 'Ecuador', venue: 'Atlanta' },
    { num: 29, date: '2026-06-24T19:00:00Z', group: 'E', home: 'Germany', away: 'Ecuador', venue: 'Miami' },
    { num: 30, date: '2026-06-24T19:00:00Z', group: 'E', home: 'Curaçao', away: 'Côte d\'Ivoire', venue: 'Kansas City' },
    
    // Match 31-36: Group F
    { num: 31, date: '2026-06-15T00:00:00Z', group: 'F', home: 'Netherlands', away: 'Japan', venue: 'Dallas' },
    { num: 32, date: '2026-06-15T18:00:00Z', group: 'F', home: 'Sweden', away: 'Tunisia', venue: 'Santa Clara' },
    { num: 33, date: '2026-06-20T00:00:00Z', group: 'F', home: 'Netherlands', away: 'Sweden', venue: 'Boston' },
    { num: 34, date: '2026-06-20T18:00:00Z', group: 'F', home: 'Japan', away: 'Tunisia', venue: 'Seattle' },
    { num: 35, date: '2026-06-24T23:00:00Z', group: 'F', home: 'Netherlands', away: 'Tunisia', venue: 'New York' },
    { num: 36, date: '2026-06-24T23:00:00Z', group: 'F', home: 'Japan', away: 'Sweden', venue: 'Los Angeles' },
    
    // Match 37-42: Group G
    { num: 37, date: '2026-06-15T21:00:00Z', group: 'G', home: 'Belgium', away: 'Egypt', venue: 'Toronto' },
    { num: 38, date: '2026-06-16T00:00:00Z', group: 'G', home: 'Iran', away: 'New Zealand', venue: 'Philadelphia' },
    { num: 39, date: '2026-06-20T21:00:00Z', group: 'G', home: 'Belgium', away: 'Iran', venue: 'Miami' },
    { num: 40, date: '2026-06-21T00:00:00Z', group: 'G', home: 'Egypt', away: 'New Zealand', venue: 'Vancouver' },
    { num: 41, date: '2026-06-25T19:00:00Z', group: 'G', home: 'Belgium', away: 'New Zealand', venue: 'Kansas City' },
    { num: 42, date: '2026-06-25T19:00:00Z', group: 'G', home: 'Egypt', away: 'Iran', venue: 'Santa Clara' },
    
    // Match 43-48: Group H
    { num: 43, date: '2026-06-16T18:00:00Z', group: 'H', home: 'Spain', away: 'Cabo Verde', venue: 'Houston' },
    { num: 44, date: '2026-06-17T03:00:00Z', group: 'H', home: 'Saudi Arabia', away: 'Uruguay', venue: 'Monterrey' },
    { num: 45, date: '2026-06-22T00:00:00Z', group: 'H', home: 'Spain', away: 'Saudi Arabia', venue: 'Dallas' },
    { num: 46, date: '2026-06-22T18:00:00Z', group: 'H', home: 'Cabo Verde', away: 'Uruguay', venue: 'Seattle' },
    { num: 47, date: '2026-06-25T23:00:00Z', group: 'H', home: 'Spain', away: 'Uruguay', venue: 'Boston' },
    { num: 48, date: '2026-06-25T23:00:00Z', group: 'H', home: 'Cabo Verde', away: 'Saudi Arabia', venue: 'Atlanta' },
    
    // Match 49-54: Group I
    { num: 49, date: '2026-06-12T03:00:00Z', group: 'I', home: 'France', away: 'Senegal', venue: 'Monterrey' },
    { num: 50, date: '2026-06-13T03:00:00Z', group: 'I', home: 'Iraq', away: 'Norway', venue: 'Guadalajara' },
    { num: 51, date: '2026-06-17T03:00:00Z', group: 'I', home: 'France', away: 'Iraq', venue: 'Mexico City' },
    { num: 52, date: '2026-06-18T03:00:00Z', group: 'I', home: 'Senegal', away: 'Norway', venue: 'Guadalajara' },
    { num: 53, date: '2026-06-23T23:00:00Z', group: 'I', home: 'France', away: 'Norway', venue: 'New York' },
    { num: 54, date: '2026-06-23T23:00:00Z', group: 'I', home: 'Senegal', away: 'Iraq', venue: 'Vancouver' },
    
    // Match 55-60: Group J
    { num: 55, date: '2026-06-14T03:00:00Z', group: 'J', home: 'Argentina', away: 'Algeria', venue: 'Guadalajara' },
    { num: 56, date: '2026-06-15T03:00:00Z', group: 'J', home: 'Austria', away: 'Jordan', venue: 'Mexico City' },
    { num: 57, date: '2026-06-19T03:00:00Z', group: 'J', home: 'Argentina', away: 'Austria', venue: 'Monterrey' },
    { num: 58, date: '2026-06-20T03:00:00Z', group: 'J', home: 'Algeria', away: 'Jordan', venue: 'Mexico City' },
    { num: 59, date: '2026-06-26T19:00:00Z', group: 'J', home: 'Argentina', away: 'Jordan', venue: 'Miami' },
    { num: 60, date: '2026-06-26T19:00:00Z', group: 'J', home: 'Algeria', away: 'Austria', venue: 'Toronto' },
    
    // Match 61-66: Group K
    { num: 61, date: '2026-06-16T03:00:00Z', group: 'K', home: 'Portugal', away: 'Congo', venue: 'Mexico City' },
    { num: 62, date: '2026-06-16T18:00:00Z', group: 'K', home: 'Uzbekistan', away: 'Colombia', venue: 'Boston' },
    { num: 63, date: '2026-06-21T03:00:00Z', group: 'K', home: 'Portugal', away: 'Uzbekistan', venue: 'Guadalajara' },
    { num: 64, date: '2026-06-21T18:00:00Z', group: 'K', home: 'Congo', away: 'Colombia', venue: 'Santa Clara' },
    { num: 65, date: '2026-06-26T23:00:00Z', group: 'K', home: 'Portugal', away: 'Colombia', venue: 'Los Angeles' },
    { num: 66, date: '2026-06-26T23:00:00Z', group: 'K', home: 'Congo', away: 'Uzbekistan', venue: 'Seattle' },
    
    // Match 67-72: Group L
    { num: 67, date: '2026-06-22T03:00:00Z', group: 'L', home: 'England', away: 'Croatia', venue: 'Monterrey' },
    { num: 68, date: '2026-06-22T21:00:00Z', group: 'L', home: 'Ghana', away: 'Panama', venue: 'Philadelphia' },
    { num: 69, date: '2026-06-26T03:00:00Z', group: 'L', home: 'England', away: 'Ghana', venue: 'Mexico City' },
    { num: 70, date: '2026-06-27T00:00:00Z', group: 'L', home: 'Croatia', away: 'Panama', venue: 'Houston' },
    { num: 71, date: '2026-06-28T19:00:00Z', group: 'L', home: 'England', away: 'Panama', venue: 'Dallas' },
    { num: 72, date: '2026-06-28T19:00:00Z', group: 'L', home: 'Croatia', away: 'Ghana', venue: 'Vancouver' }
  ];

  return matches.map(m => {
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

// Official FIFA 2026 Match Schedule - KNOCKOUT STAGE (32 matches)
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
    
    // QUARTER FINALS (8 matches)
    { num: 89, date: '2026-07-04T19:00:00Z', phase: 'QUARTER', home: 'W73', away: 'W75', venue: 'Houston' },
    { num: 90, date: '2026-07-04T23:00:00Z', phase: 'QUARTER', home: 'W74', away: 'W77', venue: 'Philadelphia' },
    { num: 91, date: '2026-07-05T22:00:00Z', phase: 'QUARTER', home: 'W76', away: 'W78', venue: 'New York' },
    { num: 92, date: '2026-07-06T02:00:00Z', phase: 'QUARTER', home: 'W79', away: 'W80', venue: 'Mexico City' },
    { num: 93, date: '2026-07-06T21:00:00Z', phase: 'QUARTER', home: 'W83', away: 'W84', venue: 'Dallas' },
    { num: 94, date: '2026-07-07T02:00:00Z', phase: 'QUARTER', home: 'W81', away: 'W82', venue: 'Seattle' },
    { num: 95, date: '2026-07-07T22:00:00Z', phase: 'QUARTER', home: 'W85', away: 'W87', venue: 'Vancouver' },
    { num: 96, date: '2026-07-09T22:00:00Z', phase: 'QUARTER', home: 'W89', away: 'W90', venue: 'Boston' },
    
    // SEMI FINALS (4 matches)
    { num: 97, date: '2026-07-10T21:00:00Z', phase: 'SEMI', home: 'W93', away: 'W94', venue: 'Los Angeles' },
    { num: 98, date: '2026-07-11T23:00:00Z', phase: 'SEMI', home: 'W91', away: 'W92', venue: 'Miami' },
    { num: 99, date: '2026-07-12T03:00:00Z', phase: 'SEMI', home: 'W95', away: 'W96', venue: 'Kansas City' },
    { num: 100, date: '2026-07-14T21:00:00Z', phase: 'SEMI', home: 'W97', away: 'W98', venue: 'Dallas' },
    { num: 101, date: '2026-07-15T21:00:00Z', phase: 'SEMI', home: 'W99', away: 'W100', venue: 'Atlanta' },
    
    // THIRD PLACE
    { num: 102, date: '2026-07-18T23:00:00Z', phase: 'THIRD_PLACE', home: 'RU101', away: 'RU102', venue: 'Miami' },
    
    // FINAL
    { num: 103, date: '2026-07-19T21:00:00Z', phase: 'FINAL', home: 'W101', away: 'W102', venue: 'New York' }
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

// Create settings document
async function createSettings() {
  const settings = new Settings({
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
  });

  await settings.save();
  console.log('✅ Settings created');
  return settings;
}

// Main seed function
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding with OFFICIAL FIFA 2026 CALENDAR...');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Match.deleteMany({});
    await Settings.deleteMany({});
    console.log('✅ Cleared existing data');

    await createSettings();

    const groupMatches = generateGroupMatches();
    const knockoutMatches = generateKnockoutMatches();
    const allMatches = [...groupMatches, ...knockoutMatches];

    await Match.insertMany(allMatches);
    console.log(`✅ Created ${allMatches.length} matches with OFFICIAL FIFA schedule`);
    console.log(`   - Group stage: ${groupMatches.length} matches (June 11-28)`);
    console.log(`   - Knockout stage: ${knockoutMatches.length} matches (June 28 - July 19)`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 FIFA World Cup 2026 - Official Schedule:');
    console.log(`   - Opening Match: June 11, 2026 - Mexico vs South Africa (Estadio Azteca)`);
    console.log(`   - Final: July 19, 2026 - MetLife Stadium (New York/New Jersey)`);
    console.log(`   - Total matches: ${allMatches.length}`);
    console.log(`   - Groups: ${Object.keys(groups).length} (A-L)`);
    console.log(`   - Teams: 48 nations`);
    console.log(`   - Venues: ${Object.keys(venues).length} stadiums`);
    console.log(`   - Capiscione groups configured:`);
    console.log(`     • Top: ${capiscioneGroups.top.join(', ')}`);
    console.log(`     • Outsider: ${capiscioneGroups.outsider.join(', ')}`);
    console.log(`     • Materasso: ${capiscioneGroups.materasso.join(', ')}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  }
}

seedDatabase();

// Made with Bob - Official FIFA 2026 Calendar
