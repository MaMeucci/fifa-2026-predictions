# Database Seeding Guide

## Overview
This guide explains how to populate the database with FIFA World Cup 2026 data including matches, settings, and capiscione groups.

## What Gets Seeded

### Matches (88 total)
- **Group Stage**: 72 matches across 12 groups (A-L)
- **Round of 16**: 8 matches
- **Quarter Finals**: 4 matches
- **Semi Finals**: 2 matches
- **Third Place**: 1 match
- **Final**: 1 match

### Settings
- Tournament configuration (dates, hosts, teams)
- Scoring rules for all phases
- Capiscione groups (Top, Outsider, Materasso)
- Feature flags (registration, predictions, leaderboard)

### Teams (48 total)
- 36 confirmed teams
- 12 TBD placeholders for qualification playoffs

## Local Development

### Seed Local Database
```bash
cd backend
npm run seed
```

This will:
1. Connect to your local MongoDB (from `.env`)
2. Clear existing matches and settings
3. Create 88 matches
4. Create settings document
5. Close connection

## Production (Render.com)

### Option 1: Via Render Shell (Recommended)

1. Go to Render Dashboard: https://dashboard.render.com
2. Select your service: `fifa-2026-predictions-backend`
3. Click on **Shell** tab
4. Run the seed command:
```bash
npm run seed
```

### Option 2: Via Local Script with Production Credentials

1. Temporarily update your local `.env` with production MongoDB URI
2. Run the seed script:
```bash
npm run seed
```
3. Restore your local `.env`

⚠️ **Warning**: This will clear all existing data in production!

## Verify Seeding

### Check Matches
```bash
curl https://fifa-2026-predictions-backend.onrender.com/api/matches | jq '.data | length'
```
Expected output: `88`

### Check Settings
```bash
curl https://fifa-2026-predictions-backend.onrender.com/api/settings | jq '.data'
```

### Check Specific Group
```bash
curl https://fifa-2026-predictions-backend.onrender.com/api/matches/group/A | jq '.data | length'
```
Expected output: `6` (each group has 6 matches)

## Seed Data Details

### Groups Configuration
```
Group A: USA, Mexico, Canada, TBD1
Group B: Brazil, Argentina, Uruguay, TBD2
Group C: England, France, Spain, TBD3
Group D: Germany, Italy, Netherlands, TBD4
Group E: Portugal, Belgium, Croatia, TBD5
Group F: Japan, South Korea, Australia, TBD6
Group G: Morocco, Senegal, Nigeria, TBD7
Group H: Colombia, Ecuador, Peru, TBD8
Group I: Poland, Ukraine, Serbia, TBD9
Group J: Switzerland, Denmark, Sweden, TBD10
Group K: Iran, Saudi Arabia, Qatar, TBD11
Group L: Ghana, Cameroon, Tunisia, TBD12
```

### Capiscione Groups
- **Top**: Brazil, France, England, Spain, Argentina
- **Outsider**: Morocco, Japan, USA, Croatia, Switzerland
- **Materasso**: Qatar, TBD1, TBD2, TBD3, TBD4

### Venues (16 stadiums)
- **USA**: 11 stadiums (MetLife, SoFi, AT&T, Mercedes-Benz, etc.)
- **Canada**: 2 stadiums (BMO Field, BC Place)
- **Mexico**: 3 stadiums (Azteca, Akron, BBVA)

### Tournament Dates
- **Start**: June 11, 2026 (18:00 UTC)
- **End**: July 12, 2026 (22:00 UTC)
- **Predictions Lock**: June 11, 2026 (17:00 UTC)

## Scoring Rules

### Group Stage
- Exact result: 6 points
- Correct sign (1-X-2): 3 points
- Bonus every 5 exact results: 5 points

### Knockout Stage
- Round of 16 correct: 20 points
- Round of 16 exact position: 5 points
- Quarter finals correct: 20 points
- Semi finals correct: 30 points
- Final correct: 50 points

### Final Rankings
- 1st place: 80 points
- 2nd place: 50 points
- 3rd place: 25 points
- 4th place: 25 points

### Special
- Top scorer: 30 points
- Capiscione Top: 25 points
- Capiscione Outsider: 20 points
- Capiscione Materasso: 15 points

## Troubleshooting

### Error: Connection refused
- Check MongoDB URI in `.env`
- Verify MongoDB Atlas network access (whitelist 0.0.0.0/0)

### Error: Validation failed
- Check that all required fields are present
- Verify enum values match schema

### Matches not showing in API
- Verify seed completed successfully
- Check backend logs on Render
- Restart backend service if needed

## Re-seeding

To re-seed the database:
1. The script automatically clears existing data
2. Run `npm run seed` again
3. All matches and settings will be recreated

⚠️ **Note**: Re-seeding will delete all user predictions!

## Custom Seeding

To modify the seed data:
1. Edit `scripts/seedDatabase.js`
2. Update groups, teams, venues, or dates
3. Run the seed script
4. Commit changes to Git

---

**Last Updated**: May 9, 2026  
**Script Location**: `backend/scripts/seedDatabase.js`