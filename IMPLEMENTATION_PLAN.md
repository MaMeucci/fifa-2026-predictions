# Piano di Implementazione - FIFA 2026 Predictions App

## Panoramica Progetto

Applicazione web full-stack per gestire pronostici sul Mondiale FIFA 2026 con:
- Frontend React responsive (mobile-first)
- Backend Node.js/Express con MongoDB
- Autenticazione dual (classica + Auth0)
- Hosting gratuito (GitHub Pages + Railway/Render)
- Calcolo automatico punteggi
- Dashboard con classifica dinamica

## Stack Tecnologico Scelto

### Frontend
- **React 18** + **Vite** (build veloce)
- **Material-UI (MUI)** per UI responsive
- **React Router v6** per navigazione
- **React Hook Form** + **Zod** per validazione
- **React Query** per caching e state management
- **Axios** per HTTP requests

### Backend
- **Node.js 20** + **Express.js**
- **MongoDB Atlas** (free tier 512MB)
- **Mongoose** ORM
- **JWT** per auth classica
- **Auth0** SDK per OAuth
- **Bcrypt** per password hashing

### Hosting
- **Frontend**: GitHub Pages (gratis)
- **Backend**: Railway.app o Render.com (free tier)
- **Database**: MongoDB Atlas (free tier)

## Fasi di Implementazione

### FASE 1: Setup Iniziale (Giorni 1-2)

#### 1.1 Repository e Struttura
```bash
fifa-2026-predictions/
├── frontend/          # React app
├── backend/           # Express API
├── docs/              # Documentazione
└── scripts/           # Utility scripts
```

#### 1.2 Setup Frontend
- Inizializzare progetto React con Vite
- Installare dipendenze (MUI, React Router, React Query, Axios)
- Configurare routing base
- Setup tema MUI personalizzato
- Creare layout base (Header, Footer, Navigation)

#### 1.3 Setup Backend
- Inizializzare progetto Node.js
- Installare dipendenze (Express, Mongoose, JWT, Bcrypt)
- Configurare connessione MongoDB
- Setup middleware (CORS, body-parser, error handler)
- Creare struttura cartelle (models, controllers, routes, services)

#### 1.4 Database Schema
Creare modelli Mongoose per:
- Users (username, email, password, authProvider, role)
- Matches (matchNumber, phase, teams, date, results)
- Predictions (userId, groupPredictions, knockoutStage, capiscione)
- Scores (userId, breakdown, totalPoints, rank)
- Settings (chiave-valore per configurazioni)

### FASE 2: Autenticazione (Giorni 3-4)

#### 2.1 Backend Auth
- Implementare registrazione classica (POST /api/auth/register)
- Implementare login classica (POST /api/auth/login)
- Implementare JWT token generation e validation
- Integrare Auth0 (POST /api/auth/auth0/callback)
- Creare middleware di autenticazione
- Implementare refresh token logic

#### 2.2 Frontend Auth
- Creare componenti LoginForm e RegisterForm
- Implementare Auth0Button per OAuth
- Creare AuthContext per gestione stato utente
- Implementare ProtectedRoute component
- Gestire token storage (localStorage)
- Auto-refresh token prima della scadenza

### FASE 3: Gestione Partite (Giorni 5-6)

#### 3.1 Backend Matches
- Creare API CRUD per partite (GET, POST, PUT)
- Implementare endpoint per inserimento risultati
- Creare script per popolare database con calendario FIFA 2026
- Implementare filtri (per fase, girone, data)

#### 3.2 Frontend Matches
- Creare componente per visualizzazione calendario
- Implementare filtri e ricerca partite
- Mostrare risultati reali quando disponibili

### FASE 4: Pronostici Fase a Gironi (Giorni 7-9)

#### 4.1 Backend Predictions
- Creare API per salvare/aggiornare pronostici gironi
- Implementare validazione (risultati 0-20, segno coerente)
- Implementare sistema di lock (blocco modifiche)
- Creare endpoint per recuperare pronostici

#### 4.2 Frontend Group Stage
- Creare componente GroupStage con tab per ogni girone
- Implementare MatchPrediction component (input risultato + segno)
- Aggiungere validazione real-time
- Implementare auto-save ogni 30 secondi
- Mostrare indicatore di completamento
- Evidenziare pronostici corretti/errati dopo risultati reali

### FASE 5: Pronostici Fase Finale (Giorni 10-12)

#### 5.1 Backend Knockout Stage
- Estendere API predictions per fase finale
- Validare sedicesimi (16 squadre, no duplicati)
- Validare ottavi, quarti, semi, finale
- Validare classifiche finali e capocannoniere

#### 5.2 Frontend Knockout Stage
- Creare componente Round16Selector (drag & drop)
- Implementare selezione ottavi/quarti/semi/finale
- Creare bracket interattivo per visualizzazione
- Implementare selezione classifiche finali (1°-4°)
- Aggiungere input capocannoniere con autocomplete

### FASE 6: Angolo del Capiscione (Giorni 13-14)

#### 6.1 Backend Capiscione
- Definire gruppi squadre (Top, Outsider, Materasso) in Settings
- Creare API per recuperare gruppi
- Validare selezioni (1 squadra per gruppo)
- Implementare logica calcolo migliore squadra per gruppo

#### 6.2 Frontend Capiscione
- Creare CapiscioneSection component
- Implementare 3 dropdown per selezione squadre
- Mostrare tooltip con spiegazione regole
- Evidenziare scelte corrette a torneo finito

### FASE 7: Sistema di Calcolo Punteggi (Giorni 15-17)

#### 7.1 Scoring Engine
Implementare algoritmo di calcolo con regole:

**Fase a Gironi:**
- Risultato esatto: 6 punti
- Segno corretto: 3 punti
- Bonus ogni 5 risultati esatti: 5 punti

**Fase Finale:**
- Sedicesimi: 20 punti per squadra + 5 se posizione esatta
- Ottavi: 20 punti per squadra
- Quarti: 30 punti per squadra
- Semifinali: 50 punti per squadra
- Finale: 60 punti per squadra

**Classifiche:**
- 1° posto: 80 punti
- 2° posto: 50 punti
- 3° posto: 25 punti
- 4° posto: 25 punti
- Capocannoniere: 30 punti

**Capiscione:**
- Top: 25 punti
- Outsider: 20 punti
- Materasso: 15 punti

#### 7.2 API Scores
- Creare endpoint per calcolo punteggi (POST /api/scores/calculate)
- Implementare calcolo automatico dopo inserimento risultati
- Creare cache in Score collection per performance
- Implementare aggiornamento rank automatico

### FASE 8: Dashboard e Classifica (Giorni 18-20)

#### 8.1 Backend Leaderboard
- Creare API per classifica (GET /api/scores/leaderboard)
- Implementare paginazione e filtri
- Creare API per dettaglio punteggi utente
- Implementare confronto tra utenti

#### 8.2 Frontend Dashboard
- Creare Leaderboard component con tabella sortable
- Implementare UserStats component (grafici)
- Creare PointsBreakdown component (dettaglio punteggi)
- Implementare ComparisonView per confronto utenti
- Aggiungere grafici evoluzione punteggi (Chart.js)
- Implementare filtri (amici, top 10, etc.)

### FASE 9: Admin Panel (Giorni 21-23)

#### 9.1 Backend Admin
- Creare middleware per controllo ruolo admin
- Implementare API per inserimento risultati partite
- Creare API per gestione utenti
- Implementare API per configurazione settings
- Creare endpoint per trigger ricalcolo punteggi

#### 9.2 Frontend Admin
- Creare AdminPanel component con protezione
- Implementare ResultsEntry form per inserimento risultati
- Creare UserManagement per gestione utenti
- Implementare SettingsManager per configurazioni
- Aggiungere dashboard statistiche generali

### FASE 10: Funzionalità Avanzate (Giorni 24-26)

#### 10.1 Sistema Lock Pronostici
- Implementare controllo data lock in backend
- Bloccare modifiche dopo data limite
- Inviare notifiche email 7 giorni e 1 giorno prima
- Mostrare countdown nel frontend

#### 10.2 Privacy Pronostici
- Implementare controllo visibilità pronostici
- Prima del mondiale: solo propri pronostici visibili
- Dopo inizio: tutti i pronostici visibili
- Aggiungere toggle per confronto pronostici

#### 10.3 API Esterne per Risultati
- Ricercare e documentare API disponibili:
  - API-Football (100 req/giorno gratis)
  - TheSportsDB (gratuita)
  - FIFA.com scraping (backup)
- Implementare servizio di import automatico
- Creare job schedulato per sync risultati
- Fallback su inserimento manuale admin

### FASE 11: Responsive e PWA (Giorni 27-28)

#### 11.1 Mobile Optimization
- Ottimizzare layout per mobile (breakpoints MUI)
- Implementare touch gestures per navigazione
- Ottimizzare form per input mobile
- Testare su dispositivi reali

#### 11.2 Progressive Web App
- Configurare manifest.json
- Implementare service worker con Workbox
- Abilitare funzionalità offline per visualizzazione
- Aggiungere installabilità app

### FASE 12: Testing e Deploy (Giorni 29-30)

#### 12.1 Testing
- Scrivere unit test per scoring engine
- Testare API endpoints con Postman/Insomnia
- Testare componenti React con React Testing Library
- Test E2E con Cypress (scenari principali)
- Test cross-browser (Chrome, Firefox, Safari)

#### 12.2 Deployment
- Configurare GitHub Actions per frontend
- Deploy frontend su GitHub Pages
- Configurare Railway/Render per backend
- Setup MongoDB Atlas production
- Configurare variabili ambiente
- Setup Auth0 production
- Testare in produzione

#### 12.3 Documentazione
- Completare README.md
- Scrivere guida utente (USER_GUIDE.md)
- Scrivere guida admin (ADMIN_GUIDE.md)
- Documentare API (API.md)
- Creare guida deployment (DEPLOYMENT.md)

## Gruppi "Angolo del Capiscione"

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

## Stima Tempi e Risorse

### Timeline
- **Setup e Auth**: 4 giorni
- **Core Features**: 14 giorni
- **Advanced Features**: 6 giorni
- **Testing e Deploy**: 6 giorni
- **TOTALE**: ~30 giorni (1 mese)

### Costi
- **Sviluppo**: 0€ (tutto gratuito)
- **Hosting**: 0€/mese (< 50 utenti)
- **Scale-up**: ~45€/mese (100-500 utenti)

## Prossimi Passi

1. ✅ Architettura definita
2. ✅ Piano implementazione creato
3. ⏭️ Creare struttura progetto
4. ⏭️ Setup repository GitHub
5. ⏭️ Iniziare Fase 1: Setup Iniziale

## Note Importanti

- **Priorità**: Funzionalità core prima di features avanzate
- **Testing**: Testare ogni fase prima di procedere
- **Documentazione**: Documentare mentre si sviluppa
- **Backup**: Commit frequenti su GitHub
- **Sicurezza**: Validazione input, rate limiting, HTTPS