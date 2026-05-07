# Architettura Applicazione Pronostici FIFA World Cup 2026

## 1. Overview del Sistema

Applicazione web full-stack per gestire pronostici sul Mondiale FIFA 2026, con focus su:
- Accessibilità mobile-first
- Hosting gratuito (GitHub Pages + servizi free-tier)
- Autenticazione flessibile (classica + Auth0)
- Calcolo automatico punteggi
- Dashboard dinamica con classifiche

## 2. Stack Tecnologico

### Frontend
- **Framework**: React 18+ con Vite
- **UI Library**: Material-UI (MUI) o Tailwind CSS per responsive design
- **State Management**: React Context API + React Query per caching
- **Routing**: React Router v6
- **Form Management**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **PWA**: Workbox per funzionalità offline

### Backend
- **Runtime**: Node.js 20+ con Express.js
- **Alternative**: Python 3.11+ con FastAPI (più semplice per calcoli complessi)
- **Database**: PostgreSQL (Supabase free tier) o MongoDB Atlas (free tier)
- **ORM**: Prisma (PostgreSQL) o Mongoose (MongoDB)
- **Authentication**: 
  - JWT per auth classica
  - Auth0 SDK per OAuth
- **Validation**: Zod (Node.js) o Pydantic (Python)

### Hosting & Deployment
- **Frontend**: GitHub Pages (statico) o Vercel/Netlify (free tier)
- **Backend**: Railway.app, Render.com, o Fly.io (free tier)
- **Database**: Supabase (PostgreSQL) o MongoDB Atlas (free tier)
- **File Storage**: Cloudinary o AWS S3 (free tier) per loghi squadre

### API Esterne per Risultati Automatici
- **Opzione 1**: API-Football (api-football.com) - 100 richieste/giorno gratis
- **Opzione 2**: TheSportsDB API - gratuita ma limitata
- **Opzione 3**: FIFA.com web scraping (backup, richiede manutenzione)
- **Opzione 4**: Inserimento manuale via interfaccia admin

## 3. Architettura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (Browser/Mobile)                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           React SPA (Progressive Web App)              │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐ │ │
│  │  │  Login/  │  │Pronostici│  │  Dashboard/Classifica│ │ │
│  │  │  Signup  │  │  Gironi  │  │                      │ │ │
│  │  └──────────┘  └──────────┘  └──────────────────────┘ │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐ │ │
│  │  │   Fase   │  │  Angolo  │  │    Admin Panel       │ │ │
│  │  │  Finale  │  │Capiscione│  │  (risultati reali)   │ │ │
│  │  └──────────┘  └──────────┘  └──────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTPS/REST API
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    API GATEWAY / BACKEND                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Express.js / FastAPI Server               │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │ │
│  │  │ Auth Service │  │ Predictions  │  │   Scoring   │ │ │
│  │  │ (JWT/Auth0)  │  │   Service    │  │   Engine    │ │ │
│  │  └──────────────┘  └──────────────┘  └─────────────┘ │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │ │
│  │  │   Results    │  │  Leaderboard │  │    Admin    │ │ │
│  │  │   Service    │  │   Service    │  │   Service   │ │ │
│  │  └──────────────┘  └──────────────┘  └─────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         PostgreSQL / MongoDB (Cloud Hosted)            │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐ │ │
│  │  │  Users   │  │Predictions│  │  Matches & Results   │ │ │
│  │  └──────────┘  └──────────┘  └──────────────────────┘ │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐ │ │
│  │  │  Scores  │  │ Settings │  │    Audit Logs        │ │ │
│  │  └──────────┘  └──────────┘  └──────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                        ▲
                        │
┌───────────────────────┴─────────────────────────────────────┐
│                  EXTERNAL SERVICES                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   Auth0      │  │ API-Football │  │   Email Service  │  │
│  │   (OAuth)    │  │  (Results)   │  │   (SendGrid)     │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 4. Database Schema

### 4.1 Users Collection/Table
```javascript
{
  id: UUID/ObjectId,
  username: String (unique, required),
  email: String (unique, required),
  passwordHash: String (nullable - null se Auth0),
  authProvider: Enum ['local', 'auth0'],
  auth0Id: String (nullable),
  role: Enum ['user', 'admin'],
  createdAt: DateTime,
  updatedAt: DateTime,
  lastLogin: DateTime,
  isActive: Boolean
}
```

### 4.2 Matches Collection/Table
```javascript
{
  id: UUID/ObjectId,
  matchNumber: Integer,
  phase: Enum ['group', 'round16', 'quarter', 'semi', 'final', 'third_place'],
  group: String (nullable - es. 'A', 'B', etc.),
  homeTeam: String,
  awayTeam: String,
  matchDate: DateTime,
  venue: String,
  actualHomeScore: Integer (nullable),
  actualAwayScore: Integer (nullable),
  isFinished: Boolean,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### 4.3 Predictions Collection/Table
```javascript
{
  id: UUID/ObjectId,
  userId: UUID/ObjectId (foreign key),
  
  // Pronostici Gironi
  groupPredictions: [
    {
      matchId: UUID/ObjectId,
      homeScore: Integer,
      awayScore: Integer,
      sign: Enum ['1', 'X', '2'], // 1=casa, X=pareggio, 2=trasferta
      points: Integer (calcolato)
    }
  ],
  
  // Fase Finale - Sedicesimi
  round16Teams: [
    {
      position: Integer (1-16),
      teamName: String,
      group: String,
      groupPosition: Integer,
      isCorrect: Boolean (nullable),
      isPositionCorrect: Boolean (nullable),
      points: Integer (calcolato)
    }
  ],
  
  // Ottavi di Finale
  quarterFinalists: [String], // 8 squadre
  
  // Quarti di Finale
  semiFinalists: [String], // 4 squadre
  
  // Semifinali
  finalists: [String], // 2 squadre
  
  // Finale
  winner: String,
  runnerUp: String,
  thirdPlace: String,
  fourthPlace: String,
  
  // Capocannoniere
  topScorer: String,
  
  // Angolo del Capiscione
  capiscione: {
    topTeam: String, // 1 squadra dal gruppo "Top"
    outsiderTeam: String, // 1 squadra dal gruppo "Outsider"
    materassoTeam: String // 1 squadra dal gruppo "Materasso"
  },
  
  // Metadata
  totalPoints: Integer,
  bonusPoints: Integer,
  isLocked: Boolean,
  lastModified: DateTime,
  createdAt: DateTime
}
```

### 4.4 Scores Collection/Table (Cache per performance)
```javascript
{
  id: UUID/ObjectId,
  userId: UUID/ObjectId,
  predictionId: UUID/ObjectId,
  
  // Breakdown punteggi
  groupStagePoints: Integer,
  exactResultsCount: Integer,
  exactResultsPoints: Integer,
  signPoints: Integer,
  bonusPoints: Integer,
  
  round16Points: Integer,
  quarterPoints: Integer,
  semiPoints: Integer,
  finalPoints: Integer,
  
  winnerPoints: Integer,
  runnerUpPoints: Integer,
  thirdPlacePoints: Integer,
  fourthPlacePoints: Integer,
  topScorerPoints: Integer,
  
  capiscione: {
    topPoints: Integer,
    outsiderPoints: Integer,
    materassoPoints: Integer
  },
  
  totalPoints: Integer,
  rank: Integer,
  
  lastCalculated: DateTime,
  updatedAt: DateTime
}
```

### 4.5 Settings Collection/Table
```javascript
{
  id: UUID/ObjectId,
  key: String (unique),
  value: JSON,
  description: String,
  updatedAt: DateTime,
  updatedBy: UUID/ObjectId
}

// Esempi di settings:
// - tournament_start_date
// - predictions_lock_date
// - capiscione_groups (Top, Outsider, Materasso teams)
// - scoring_rules
```

### 4.6 AuditLogs Collection/Table
```javascript
{
  id: UUID/ObjectId,
  userId: UUID/ObjectId,
  action: String,
  entityType: String,
  entityId: UUID/ObjectId,
  changes: JSON,
  ipAddress: String,
  userAgent: String,
  timestamp: DateTime
}
```

## 5. API Endpoints

### 5.1 Authentication
```
POST   /api/auth/register          - Registrazione classica
POST   /api/auth/login             - Login classica
POST   /api/auth/auth0/callback    - Callback Auth0
POST   /api/auth/refresh           - Refresh JWT token
POST   /api/auth/logout            - Logout
GET    /api/auth/me                - Profilo utente corrente
```

### 5.2 Predictions
```
GET    /api/predictions/my         - Ottieni i miei pronostici
POST   /api/predictions            - Crea/aggiorna pronostici
GET    /api/predictions/:userId    - Ottieni pronostici utente (solo dopo inizio mondiale)
GET    /api/predictions/all        - Ottieni tutti i pronostici (admin o dopo inizio)
DELETE /api/predictions/:id        - Elimina pronostici (solo prima del lock)
```

### 5.3 Matches
```
GET    /api/matches                - Lista tutte le partite
GET    /api/matches/group/:group   - Partite per girone
GET    /api/matches/:phase         - Partite per fase
GET    /api/matches/:id            - Dettaglio partita
POST   /api/matches                - Crea partita (admin)
PUT    /api/matches/:id            - Aggiorna partita (admin)
PUT    /api/matches/:id/result     - Inserisci risultato (admin)
```

### 5.4 Scoring
```
GET    /api/scores/leaderboard     - Classifica generale
GET    /api/scores/my              - I miei punteggi dettagliati
GET    /api/scores/:userId         - Punteggi utente specifico
POST   /api/scores/calculate       - Ricalcola tutti i punteggi (admin)
POST   /api/scores/calculate/:userId - Ricalcola punteggi utente (admin)
```

### 5.5 Settings
```
GET    /api/settings               - Ottieni tutte le impostazioni
GET    /api/settings/:key          - Ottieni impostazione specifica
PUT    /api/settings/:key          - Aggiorna impostazione (admin)
GET    /api/settings/capiscione    - Ottieni gruppi Angolo del Capiscione
```

### 5.6 Admin
```
GET    /api/admin/users            - Lista utenti
PUT    /api/admin/users/:id/role   - Modifica ruolo utente
GET    /api/admin/audit-logs       - Log delle azioni
POST   /api/admin/import-results   - Importa risultati da API esterna
GET    /api/admin/stats            - Statistiche generali
```

## 6. Regole di Calcolo Punteggi

### 6.1 Fase a Gironi
- **Risultato esatto**: 6 punti
- **Segno corretto**: 3 punti
- **Bonus ogni 5 risultati esatti**: 5 punti aggiuntivi

### 6.2 Fase Finale
- **Sedicesimi**: 20 punti per squadra corretta + 5 punti se posizione esatta
- **Ottavi**: 20 punti per squadra corretta
- **Quarti**: 30 punti per squadra corretta
- **Semifinali**: 50 punti per squadra corretta
- **Finale**: 60 punti per squadra corretta

### 6.3 Classifiche Finali
- **1° classificato**: 80 punti
- **2° classificato**: 50 punti
- **3° classificato**: 25 punti
- **4° classificato**: 25 punti
- **Capocannoniere**: 30 punti

### 6.4 Angolo del Capiscione
- **Gruppo Top**: 25 punti
- **Gruppo Outsider**: 20 punti
- **Gruppo Materasso**: 15 punti

## 7. Gruppi "Angolo del Capiscione"

### Gruppo TOP (Favorite)
1. Brasile
2. Argentina
3. Francia
4. Inghilterra
5. Spagna

### Gruppo OUTSIDER (Sorprese possibili)
1. Portogallo
2. Olanda
3. Uruguay
4. Colombia
5. Croazia

### Gruppo MATERASSO (Outsider estreme)
1. Messico
2. Giappone
3. Senegal
4. Marocco
5. Stati Uniti

## 8. Funzionalità Chiave

### 8.1 Sistema di Lock
- I pronostici possono essere modificati fino a **1 giorno prima dell'inizio del mondiale**
- Data lock configurabile via settings
- Dopo il lock, i pronostici diventano read-only
- Notifica email 7 giorni e 1 giorno prima del lock

### 8.2 Privacy Pronostici
- Prima dell'inizio del mondiale: solo l'utente vede i propri pronostici
- Dopo l'inizio: tutti possono vedere i pronostici di tutti
- Dashboard con confronto pronostici vs risultati reali

### 8.3 Dashboard Dinamica
- Classifica in tempo reale
- Grafico evoluzione punteggi
- Statistiche: % risultati esatti, segni corretti, etc.
- Confronto con altri giocatori
- Highlight dei pronostici più azzeccati

### 8.4 Responsive Design
- Mobile-first approach
- Touch-friendly per inserimento pronostici
- Swipe gestures per navigazione
- Offline support (PWA) per visualizzazione

### 8.5 Admin Panel
- Inserimento risultati partite
- Gestione utenti
- Configurazione impostazioni
- Trigger manuale ricalcolo punteggi
- Import automatico risultati da API

## 9. Sicurezza

### 9.1 Authentication
- Password hashing con bcrypt (12 rounds)
- JWT con expiration (15 min access, 7 giorni refresh)
- Rate limiting su login (5 tentativi/15 min)
- HTTPS obbligatorio in produzione

### 9.2 Authorization
- Role-based access control (user/admin)
- Middleware per protezione route admin
- Validazione ownership per modifiche pronostici

### 9.3 Input Validation
- Sanitizzazione input lato server
- Validazione schema con Zod/Pydantic
- Protezione SQL injection (ORM)
- XSS protection

### 9.4 Rate Limiting
- API generale: 100 req/min per IP
- Auth endpoints: 5 req/15min per IP
- Admin endpoints: 50 req/min per utente

## 10. Performance

### 10.1 Caching
- Redis per session storage (opzionale)
- React Query per cache client-side
- Scores table come cache pre-calcolata
- CDN per asset statici

### 10.2 Ottimizzazioni
- Lazy loading componenti React
- Pagination per liste lunghe
- Debouncing per auto-save pronostici
- Compression gzip/brotli

### 10.3 Monitoring
- Error tracking (Sentry free tier)
- Analytics (Google Analytics o Plausible)
- Performance monitoring (Web Vitals)

## 11. Deployment Strategy

### 11.1 Frontend (GitHub Pages)
```bash
# Build production
npm run build

# Deploy su GitHub Pages
npm run deploy
```

### 11.2 Backend (Railway/Render)
```bash
# Dockerfile per containerizzazione
# Auto-deploy da GitHub su push a main
# Environment variables via dashboard
```

### 11.3 Database (Supabase/MongoDB Atlas)
```bash
# Migrations automatiche
# Backup giornalieri automatici
# Connection pooling
```

## 12. Testing Strategy

### 12.1 Unit Tests
- Jest per backend logic
- React Testing Library per componenti
- Coverage minimo 70%

### 12.2 Integration Tests
- Supertest per API endpoints
- Cypress per E2E frontend

### 12.3 Manual Testing
- Checklist funzionalità pre-release
- Test su dispositivi mobile reali
- Test cross-browser

## 13. Roadmap Implementazione

### Fase 1: Setup & Core (Settimana 1-2)
- Setup repository e struttura progetto
- Configurazione database
- Sistema autenticazione
- CRUD base pronostici

### Fase 2: Funzionalità Principali (Settimana 3-4)
- Interfaccia pronostici gironi
- Interfaccia fase finale
- Angolo del Capiscione
- Sistema calcolo punteggi

### Fase 3: Dashboard & Admin (Settimana 5)
- Dashboard con classifica
- Admin panel
- Sistema lock pronostici
- Privacy controls

### Fase 4: Polish & Deploy (Settimana 6)
- Responsive design refinement
- Testing completo
- Documentazione
- Deployment produzione

## 14. Costi Stimati

### Servizi Gratuiti
- GitHub Pages: hosting frontend
- Railway/Render: 500h/mese gratis backend
- Supabase: 500MB database gratis
- Auth0: 7000 utenti attivi gratis
- API-Football: 100 req/giorno gratis

### Totale: **€0/mese** per < 50 utenti

### Scale-up (se necessario)
- Railway Pro: $5/mese
- Supabase Pro: $25/mese
- API-Football: $15/mese
- **Totale: ~$45/mese** per 100-500 utenti