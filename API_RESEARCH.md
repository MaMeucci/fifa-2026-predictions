# Ricerca API per Risultati Automatici FIFA 2026

## Panoramica

Per automatizzare l'inserimento dei risultati delle partite del Mondiale FIFA 2026, sono state analizzate diverse opzioni di API pubbliche e servizi di dati sportivi.

## Opzioni Disponibili

### 1. API-Football (Raccomandato) ⭐

**Website**: https://www.api-football.com/

**Vantaggi:**
- ✅ Copertura completa tornei FIFA
- ✅ Dati in tempo reale
- ✅ Documentazione eccellente
- ✅ 100 richieste/giorno gratis
- ✅ Affidabilità alta
- ✅ JSON ben strutturato

**Svantaggi:**
- ❌ Limite 100 req/giorno (tier gratuito)
- ❌ Piano a pagamento per più richieste ($15/mese)

**Piano Gratuito:**
- 100 richieste/giorno
- Accesso a tutti gli endpoint
- Dati storici disponibili
- Supporto community

**Endpoints Utili:**
```
GET /fixtures?league=1&season=2026
GET /fixtures?id={fixture_id}
GET /fixtures/statistics?fixture={fixture_id}
GET /players/topscorers?league=1&season=2026
```

**Esempio Response:**
```json
{
  "fixture": {
    "id": 12345,
    "date": "2026-06-11T18:00:00+00:00",
    "status": {
      "short": "FT",
      "long": "Match Finished"
    }
  },
  "teams": {
    "home": {
      "id": 1,
      "name": "Qatar",
      "logo": "https://..."
    },
    "away": {
      "id": 2,
      "name": "Ecuador",
      "logo": "https://..."
    }
  },
  "goals": {
    "home": 0,
    "away": 2
  },
  "score": {
    "halftime": {
      "home": 0,
      "away": 1
    },
    "fulltime": {
      "home": 0,
      "away": 2
    }
  }
}
```

**Strategia di Utilizzo:**
- Sync automatico 2 volte al giorno (mattina e sera)
- Cache risultati per ridurre chiamate
- Fallback su inserimento manuale admin

### 2. TheSportsDB

**Website**: https://www.thesportsdb.com/

**Vantaggi:**
- ✅ Completamente gratuito
- ✅ Nessun limite di richieste
- ✅ Copertura mondiale di calcio
- ✅ Dati storici disponibili

**Svantaggi:**
- ❌ Aggiornamenti meno frequenti
- ❌ Documentazione limitata
- ❌ Affidabilità media
- ❌ Dati meno dettagliati

**Piano Gratuito:**
- Illimitato
- Tutti gli sport
- Dati base

**Endpoints Utili:**
```
GET /api/v1/json/3/eventsseason.php?id=4429&s=2026
GET /api/v1/json/3/eventslast.php?id=133602
GET /api/v1/json/3/lookupteam.php?id=133602
```

**Strategia di Utilizzo:**
- Backup per API-Football
- Verifica incrociata risultati
- Dati storici e statistiche

### 3. Football-Data.org

**Website**: https://www.football-data.org/

**Vantaggi:**
- ✅ 10 richieste/minuto gratis
- ✅ Buona documentazione
- ✅ Dati affidabili
- ✅ Copertura competizioni europee

**Svantaggi:**
- ❌ Copertura limitata mondiali
- ❌ Tier gratuito molto limitato
- ❌ Ritardi negli aggiornamenti

**Piano Gratuito:**
- 10 req/min
- Competizioni limitate
- Dati base

**Nota:** Potrebbe non coprire FIFA 2026, da verificare più vicino al torneo.

### 4. FIFA.com Web Scraping

**Website**: https://www.fifa.com/

**Vantaggi:**
- ✅ Fonte ufficiale
- ✅ Dati sempre aggiornati
- ✅ Gratuito
- ✅ Completo

**Svantaggi:**
- ❌ Richiede web scraping
- ❌ Può violare ToS
- ❌ Struttura HTML può cambiare
- ❌ Richiede manutenzione
- ❌ Rate limiting possibile

**Strategia di Utilizzo:**
- Solo come ultima risorsa
- Implementare con cautela
- Rispettare robots.txt
- Cache aggressiva

**Esempio Implementazione:**
```javascript
// Puppeteer per scraping
const puppeteer = require('puppeteer');

async function scrapeFIFAResults() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('https://www.fifa.com/fifaplus/en/tournaments/mens/worldcup/canadamexicousa2026/matches');
  
  const matches = await page.evaluate(() => {
    // Selettori da determinare
    const matchElements = document.querySelectorAll('.match-card');
    return Array.from(matchElements).map(el => ({
      homeTeam: el.querySelector('.home-team').textContent,
      awayTeam: el.querySelector('.away-team').textContent,
      homeScore: el.querySelector('.home-score').textContent,
      awayScore: el.querySelector('.away-score').textContent
    }));
  });
  
  await browser.close();
  return matches;
}
```

### 5. RapidAPI Sports

**Website**: https://rapidapi.com/

**Vantaggi:**
- ✅ Hub di multiple API sportive
- ✅ Interfaccia unificata
- ✅ Facile integrazione

**Svantaggi:**
- ❌ Costi variabili
- ❌ Dipendenza da terze parti
- ❌ Qualità variabile

**Nota:** Molte API su RapidAPI sono versioni a pagamento di API-Football.

## Strategia Raccomandata

### Approccio Ibrido (Consigliato)

1. **Primario**: API-Football
   - Sync automatico 2x/giorno
   - 100 richieste sufficienti per 48 partite gironi
   - Cache risultati in database

2. **Backup**: TheSportsDB
   - Verifica incrociata risultati
   - Fallback se API-Football non disponibile

3. **Manuale**: Admin Panel
   - Inserimento manuale sempre disponibile
   - Override risultati automatici se necessario
   - Utile per correzioni

### Implementazione Backend

```javascript
// services/resultsImporter.js

const axios = require('axios');
const Match = require('../models/Match');
const { calculateScores } = require('./scoringEngine');

class ResultsImporter {
  constructor() {
    this.apiFootballKey = process.env.API_FOOTBALL_KEY;
    this.apiFootballUrl = 'https://v3.football.api-sports.io';
    this.theSportsDBUrl = 'https://www.thesportsdb.com/api/v1/json/3';
  }

  async syncResults() {
    try {
      console.log('Starting results sync...');
      
      // Ottieni partite finite ma non ancora aggiornate
      const pendingMatches = await Match.find({
        matchDate: { $lt: new Date() },
        isFinished: false
      });

      console.log(`Found ${pendingMatches.length} pending matches`);

      for (const match of pendingMatches) {
        try {
          // Prova API-Football
          const result = await this.fetchFromAPIFootball(match);
          
          if (result) {
            await this.updateMatch(match, result);
          } else {
            // Fallback su TheSportsDB
            const backupResult = await this.fetchFromTheSportsDB(match);
            if (backupResult) {
              await this.updateMatch(match, backupResult);
            }
          }
        } catch (error) {
          console.error(`Error syncing match ${match.matchNumber}:`, error);
        }
      }

      // Ricalcola punteggi dopo sync
      await calculateScores();

      console.log('Results sync completed');
      return { success: true, updated: pendingMatches.length };
    } catch (error) {
      console.error('Results sync failed:', error);
      throw error;
    }
  }

  async fetchFromAPIFootball(match) {
    try {
      const response = await axios.get(
        `${this.apiFootballUrl}/fixtures`,
        {
          headers: {
            'x-rapidapi-key': this.apiFootballKey,
            'x-rapidapi-host': 'v3.football.api-sports.io'
          },
          params: {
            league: 1, // World Cup
            season: 2026,
            team: match.homeTeam // Cerca per squadra
          }
        }
      );

      const fixture = response.data.response.find(f => 
        f.teams.home.name === match.homeTeam &&
        f.teams.away.name === match.awayTeam
      );

      if (fixture && fixture.fixture.status.short === 'FT') {
        return {
          homeScore: fixture.goals.home,
          awayScore: fixture.goals.away,
          isFinished: true
        };
      }

      return null;
    } catch (error) {
      console.error('API-Football error:', error);
      return null;
    }
  }

  async fetchFromTheSportsDB(match) {
    try {
      // Implementazione TheSportsDB
      // Simile a API-Football ma con endpoint diversi
      return null;
    } catch (error) {
      console.error('TheSportsDB error:', error);
      return null;
    }
  }

  async updateMatch(match, result) {
    match.actualResult = {
      homeScore: result.homeScore,
      awayScore: result.awayScore
    };
    match.isFinished = result.isFinished;
    await match.save();

    console.log(`Updated match ${match.matchNumber}: ${match.homeTeam} ${result.homeScore}-${result.awayScore} ${match.awayTeam}`);
  }

  async fetchTopScorer() {
    try {
      const response = await axios.get(
        `${this.apiFootballUrl}/players/topscorers`,
        {
          headers: {
            'x-rapidapi-key': this.apiFootballKey,
            'x-rapidapi-host': 'v3.football.api-sports.io'
          },
          params: {
            league: 1,
            season: 2026
          }
        }
      );

      const topScorer = response.data.response[0];
      return {
        playerName: topScorer.player.name,
        team: topScorer.statistics[0].team.name,
        goals: topScorer.statistics[0].goals.total
      };
    } catch (error) {
      console.error('Error fetching top scorer:', error);
      return null;
    }
  }
}

module.exports = new ResultsImporter();
```

### Scheduled Job

```javascript
// jobs/resultsSync.js

const cron = require('node-cron');
const resultsImporter = require('../services/resultsImporter');

// Sync ogni 12 ore (8:00 e 20:00)
cron.schedule('0 8,20 * * *', async () => {
  console.log('Running scheduled results sync...');
  try {
    await resultsImporter.syncResults();
  } catch (error) {
    console.error('Scheduled sync failed:', error);
  }
});

// Sync capocannoniere una volta al giorno
cron.schedule('0 22 * * *', async () => {
  console.log('Updating top scorer...');
  try {
    const topScorer = await resultsImporter.fetchTopScorer();
    // Salva in database
  } catch (error) {
    console.error('Top scorer update failed:', error);
  }
});
```

## Costi Stimati

### Scenario 1: Solo API Gratuita
- **API-Football**: 0€/mese (100 req/giorno)
- **TheSportsDB**: 0€/mese (illimitato)
- **Totale**: 0€/mese

**Limitazioni:**
- Max 2 sync al giorno
- Inserimento manuale per urgenze

### Scenario 2: API-Football Pro
- **API-Football Pro**: $15/mese (1000 req/giorno)
- **Totale**: $15/mese

**Vantaggi:**
- Sync ogni ora se necessario
- Più affidabile
- Supporto prioritario

### Scenario 3: Ibrido (Raccomandato)
- **API-Football**: 0€/mese (tier gratuito)
- **Admin Panel**: Inserimento manuale backup
- **Totale**: 0€/mese

**Vantaggi:**
- Costo zero
- Flessibilità massima
- Controllo completo

## Raccomandazione Finale

**Per il lancio iniziale:**
1. Usare API-Football tier gratuito (100 req/giorno)
2. Implementare TheSportsDB come backup
3. Mantenere admin panel per inserimento manuale
4. Monitorare utilizzo e affidabilità

**Se l'app cresce (>100 utenti):**
1. Considerare upgrade a API-Football Pro ($15/mese)
2. Implementare caching aggressivo
3. Ottimizzare chiamate API

**Implementazione Prioritaria:**
1. Admin panel (sempre funzionante)
2. API-Football integration
3. TheSportsDB backup
4. FIFA.com scraping (solo se necessario)

## Prossimi Passi

1. ✅ Ricerca API completata
2. ⏭️ Registrazione API-Football (free tier)
3. ⏭️ Implementare ResultsImporter service
4. ⏭️ Creare scheduled jobs
5. ⏭️ Testare con dati mock
6. ⏭️ Implementare admin panel come fallback