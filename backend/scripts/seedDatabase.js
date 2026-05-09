const mongoose = require('mongoose');
require('dotenv').config();

const Match = require('../src/models/Match');
const Settings = require('../src/models/Settings');

// FIFA World Cup 2026 Groups (Official Draw)
const groups = {
  A: ['Mexico', 'South Africa', 'Korea Republic', 'Winner Play-off D'],
  B: ['Canada', 'Winner Play-off A', 'Qatar', 'Switzerland'],
  C: ['Brazil', 'Morocco', 'Haiti', 'Scotland'],
  D: ['USA', 'Paraguay', 'Australia', 'Winner Play-off C'],
  E: ['Germany', 'Curaçao', 'Côte d\'Ivoire', 'Ecuador'],
  F: ['Netherlands', 'Japan', 'Winner Play-off B', 'Tunisia'],
  G: ['Belgium', 'Egypt', 'Iran', 'New Zealand'],
  H: ['Spain', 'Cabo Verde', 'Saudi Arabia', 'Uruguay'],
  I: ['France', 'Senegal', 'Winner Play-off 2', 'Norway'],
  J: ['Argentina', 'Algeria', 'Austria', 'Jordan'],
  K: ['Portugal', 'Winner Play-off 1', 'Uzbekistan', 'Colombia'],
  L: ['England', 'Croatia', 'Ghana', 'Panama']
};

// Capiscione Groups - Balanced selection based on FIFA ranking and tournament favorites
const capiscioneGroups = {
  top: ['Brazil', 'France', 'England', 'Spain', 'Argentina'],
  outsider: ['Morocco', 'Japan', 'USA', 'Croatia', 'Switzerland'],
  materasso: ['Qatar', 'Haiti', 'Curaçao', 'Cabo Verde', 'New Zealand']
};

// Venues for FIFA 2026 (Official FIFA venues)
const venues = [
  // USA
  { name: 'MetLife Stadium', city: 'East Rutherford', country: 'USA' },
  { name: 'SoFi Stadium', city: 'Inglewood', country: 'USA' },
  { name: 'AT&T Stadium', city: 'Arlington', country: 'USA' },
  { name: 'Mercedes-Benz Stadium', city: 'Atlanta', country: 'USA' },
  { name: 'Hard Rock Stadium', city: 'Miami Gardens', country: 'USA' },
  { name: 'Arrowhead Stadium', city: 'Kansas City', country: 'USA' },
  { name: 'Lincoln Financial Field', city: 'Philadelphia', country: 'USA' },
  { name: 'Lumen Field', city: 'Seattle', country: 'USA' },
  { name: 'Levi\'s Stadium', city: 'Santa Clara', country: 'USA' },
  { name: 'Gillette Stadium', city: 'Foxborough', country: 'USA' },
  { name: 'NRG Stadium', city: 'Houston', country: 'USA' },
  // Canada
  { name: 'BMO Field', city: 'Toronto', country: 'Canada' },
  { name: 'BC Place', city: 'Vancouver', country: 'Canada' },
  // Mexico
  { name: 'Estadio Azteca', city: 'Mexico City', country: 'Mexico' },
  { name: 'Estadio Akron', city: 'Guadalajara', country: 'Mexico' },
  { name: 'Estadio BBVA', city: 'Monterrey', country: 'Mexico' }
];

function getVenue(matchNumber) {
  return venues[matchNumber % venues.length];
}

function getTeamCode(teamName) {
  // FIFA team codes (ISO 3166-1 alpha-3 based)
  const codes = {
    // Group A
    'Mexico': 'MEX',
    'South Africa': 'RSA',
    'Korea Republic': 'KOR',
    'Winner Play-off D': 'WPD',
    // Group B
    'Canada': 'CAN',
    'Winner Play-off A': 'WPA',
    'Qatar': 'QAT',
    'Switzerland': 'SUI',
    // Group C
    'Brazil': 'BRA',
    'Morocco': 'MAR',
    'Haiti': 'HAI',
    'Scotland': 'SCO',
    // Group D
    'USA': 'USA',
    'Paraguay': 'PAR',
    'Australia': 'AUS',
    'Winner Play-off C': 'WPC',
    // Group E
    'Germany': 'GER',
    'Curaçao': 'CUW',
    'Côte d\'Ivoire': 'CIV',
    'Ecuador': 'ECU',
    // Group F
    'Netherlands': 'NED',
    'Japan': 'JPN',
    'Winner Play-off B': 'WPB',
    'Tunisia': 'TUN',
    // Group G
    'Belgium': 'BEL',
    'Egypt': 'EGY',
    'Iran': 'IRN',
    'New Zealand': 'NZL',
    // Group H
    'Spain': 'ESP',
    'Cabo Verde': 'CPV',
    'Saudi Arabia': 'KSA',
    'Uruguay': 'URU',
    // Group I
    'France': 'FRA',
    'Senegal': 'SEN',
    'Winner Play-off 2': 'WP2',
    'Norway': 'NOR',
    // Group J
    'Argentina': 'ARG',
    'Algeria': 'ALG',
    'Austria': 'AUT',
    'Jordan': 'JOR',
    // Group K
    'Portugal': 'POR',
    'Winner Play-off 1': 'WP1',
    'Uzbekistan': 'UZB',
    'Colombia': 'COL',
    // Group L
    'England': 'ENG',
    'Croatia': 'CRO',
    'Ghana': 'GHA',
    'Panama': 'PAN'
  };
  
  return codes[teamName] || teamName.substring(0, 3).toUpperCase();
}

// Generate group stage matches
function generateGroupMatches() {
  const matches = [];
  let matchNumber = 1;
  const startDate = new Date('2026-06-11T18:00:00Z'); // Opening match

  Object.entries(groups).forEach(([groupName, teams]) => {
    // Each team plays 3 matches in group stage (round-robin)
    const groupMatches = [
      [teams[0], teams[1]], // Match 1
      [teams[2], teams[3]], // Match 2
      [teams[0], teams[2]], // Match 3
      [teams[1], teams[3]], // Match 4
      [teams[0], teams[3]], // Match 5
      [teams[1], teams[2]]  // Match 6
    ];

    groupMatches.forEach((matchup, index) => {
      const matchDate = new Date(startDate);
      // Spread matches over ~2 weeks (group stage)
      matchDate.setDate(matchDate.getDate() + Math.floor((matchNumber - 1) / 6));
      matchDate.setHours(14 + ((matchNumber - 1) % 4) * 3); // 14:00, 17:00, 20:00, 23:00 UTC

      const venue = getVenue(matchNumber);

      matches.push({
        matchNumber,
        phase: 'GROUP',
        group: groupName,
        homeTeam: {
          name: matchup[0],
          code: getTeamCode(matchup[0])
        },
        awayTeam: {
          name: matchup[1],
          code: getTeamCode(matchup[1])
        },
        date: matchDate,
        venue: venue.name,
        city: venue.city,
        country: venue.country,
        status: 'SCHEDULED'
      });

      matchNumber++;
    });
  });

  return matches;
}

// Generate knockout stage matches (placeholders)
function generateKnockoutMatches() {
  const matches = [];
  let matchNumber = 73; // After 72 group matches
  const roundOf16Date = new Date('2026-06-27T18:00:00Z');
  const quarterFinalDate = new Date('2026-07-03T18:00:00Z');
  const semiFinalDate = new Date('2026-07-07T20:00:00Z');
  const thirdPlaceDate = new Date('2026-07-11T18:00:00Z');
  const finalDate = new Date('2026-07-12T20:00:00Z');

  // Round of 16 (8 matches)
  // Top 2 from each group + 8 best third-placed teams
  for (let i = 0; i < 8; i++) {
    const matchDate = new Date(roundOf16Date);
    matchDate.setDate(matchDate.getDate() + Math.floor(i / 2));
    matchDate.setHours(14 + (i % 2) * 6); // 14:00 or 20:00 UTC

    const venue = getVenue(matchNumber);

    matches.push({
      matchNumber: matchNumber++,
      phase: 'ROUND_16',
      homeTeam: {
        name: `Winner Group ${String.fromCharCode(65 + i)}`,
        code: `W${String.fromCharCode(65 + i)}`
      },
      awayTeam: {
        name: `Runner-up Group ${String.fromCharCode(65 + ((i + 4) % 12))}`,
        code: `R${String.fromCharCode(65 + ((i + 4) % 12))}`
      },
      date: matchDate,
      venue: venue.name,
      city: venue.city,
      country: venue.country,
      status: 'SCHEDULED'
    });
  }

  // Quarter Finals (4 matches)
  for (let i = 0; i < 4; i++) {
    const matchDate = new Date(quarterFinalDate);
    matchDate.setDate(matchDate.getDate() + Math.floor(i / 2));
    matchDate.setHours(14 + (i % 2) * 6);

    const venue = getVenue(matchNumber);

    matches.push({
      matchNumber: matchNumber++,
      phase: 'QUARTER',
      homeTeam: {
        name: `Winner R16-${i * 2 + 1}`,
        code: `QF${i * 2 + 1}`
      },
      awayTeam: {
        name: `Winner R16-${i * 2 + 2}`,
        code: `QF${i * 2 + 2}`
      },
      date: matchDate,
      venue: venue.name,
      city: venue.city,
      country: venue.country,
      status: 'SCHEDULED'
    });
  }

  // Semi Finals (2 matches)
  for (let i = 0; i < 2; i++) {
    const matchDate = new Date(semiFinalDate);
    matchDate.setDate(matchDate.getDate() + i);
    matchDate.setHours(20);

    const venue = getVenue(matchNumber);

    matches.push({
      matchNumber: matchNumber++,
      phase: 'SEMI',
      homeTeam: {
        name: `Winner QF-${i * 2 + 1}`,
        code: `SF${i * 2 + 1}`
      },
      awayTeam: {
        name: `Winner QF-${i * 2 + 2}`,
        code: `SF${i * 2 + 2}`
      },
      date: matchDate,
      venue: venue.name,
      city: venue.city,
      country: venue.country,
      status: 'SCHEDULED'
    });
  }

  // Third Place Match
  const thirdPlaceVenue = venues.find(v => v.city === 'Miami Gardens');
  matches.push({
    matchNumber: matchNumber++,
    phase: 'THIRD_PLACE',
    homeTeam: {
      name: 'Loser SF-1',
      code: 'L-SF1'
    },
    awayTeam: {
      name: 'Loser SF-2',
      code: 'L-SF2'
    },
    date: thirdPlaceDate,
    venue: thirdPlaceVenue.name,
    city: thirdPlaceVenue.city,
    country: thirdPlaceVenue.country,
    status: 'SCHEDULED'
  });

  // Final
  const finalVenue = venues.find(v => v.city === 'East Rutherford');
  matches.push({
    matchNumber: matchNumber++,
    phase: 'FINAL',
    homeTeam: {
      name: 'Winner SF-1',
      code: 'W-SF1'
    },
    awayTeam: {
      name: 'Winner SF-2',
      code: 'W-SF2'
    },
    date: finalDate,
    venue: finalVenue.name,
    city: finalVenue.city,
    country: finalVenue.country,
    status: 'SCHEDULED'
  });

  return matches;
}

// Create settings document
async function createSettings() {
  const settings = new Settings({
    _id: 'app_settings',
    tournament: {
      name: 'FIFA World Cup 2026',
      startDate: new Date('2026-06-11T18:00:00Z'),
      endDate: new Date('2026-07-12T22:00:00Z'),
      hosts: ['USA', 'Canada', 'Mexico']
    },
    predictionsLockDate: new Date('2026-06-11T17:00:00Z'), // 1 hour before opening match
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
    console.log('🌱 Starting database seeding...');
    console.log('⚠️  Note: Using placeholder teams (TBD) until FIFA draw is completed');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Match.deleteMany({});
    await Settings.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create settings
    await createSettings();

    // Generate and insert matches
    const groupMatches = generateGroupMatches();
    const knockoutMatches = generateKnockoutMatches();
    const allMatches = [...groupMatches, ...knockoutMatches];

    await Match.insertMany(allMatches);
    console.log(`✅ Created ${allMatches.length} matches`);
    console.log(`   - Group stage: ${groupMatches.length} matches`);
    console.log(`   - Knockout stage: ${knockoutMatches.length} matches`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Total matches: ${allMatches.length}`);
    console.log(`   - Groups: ${Object.keys(groups).length}`);
    console.log(`   - Teams: 48 (Official FIFA 2026 Draw)`);
    console.log(`   - Tournament: June 11 - July 12, 2026`);
    console.log(`   - Capiscione groups configured:`);
    console.log(`     • Top: ${capiscioneGroups.top.join(', ')}`);
    console.log(`     • Outsider: ${capiscioneGroups.outsider.join(', ')}`);
    console.log(`     • Materasso: ${capiscioneGroups.materasso.join(', ')}`);
    console.log(`   - Venues: ${venues.length} stadiums across USA, Canada, Mexico`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  }
}

// Run the seed function
seedDatabase();

// Made with Bob
