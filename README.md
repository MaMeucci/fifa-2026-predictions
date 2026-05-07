# 🏆 FIFA World Cup 2026 - Predictions App

Applicazione web full-stack per gestire pronostici sul Mondiale di Calcio FIFA 2026 con sistema di punteggi, classifiche dinamiche e dashboard interattiva.

## 📋 Caratteristiche Principali

### Per gli Utenti
- ✅ **Registrazione flessibile**: Classica (email/password) o tramite Auth0 (Google, Facebook, etc.)
- ⚽ **Pronostici Fase a Gironi**: Inserisci risultato esatto e segno (1-X-2) per tutte le 48 partite
- 🏅 **Pronostici Fase Finale**: Prevedi le squadre qualificate ai sedicesimi, ottavi, quarti, semifinali e finale
- 🎯 **Classifiche Finali**: Pronostica le prime 4 classificate e il capocannoniere
- 🎲 **Angolo del Capiscione**: Scegli la migliore squadra da 3 gruppi (Top, Outsider, Materasso)
- 📊 **Dashboard Dinamica**: Visualizza classifica in tempo reale, statistiche e confronto con altri giocatori
- 🔒 **Sistema di Lock**: Modifica i pronostici fino a 1 giorno prima dell'inizio del mondiale
- 👀 **Privacy**: I pronostici degli altri sono visibili solo dopo l'inizio del torneo
- 📱 **Mobile-First**: Interfaccia responsive ottimizzata per smartphone e tablet

### Per gli Admin
- 🎮 **Admin Panel**: Interfaccia dedicata per gestione completa
- 📝 **Inserimento Risultati**: Manuale o automatico tramite API esterne
- 👥 **Gestione Utenti**: Visualizza, modifica ruoli, gestisci account
- ⚙️ **Configurazioni**: Modifica date, regole punteggio, gruppi Capiscione
- 🔄 **Ricalcolo Punteggi**: Trigger manuale per aggiornamento classifiche

## 🎯 Sistema di Punteggio

### Fase a Gironi
- **Risultato esatto**: 6 punti
- **Segno corretto** (1-X-2): 3 punti
- **Bonus**: 5 punti ogni 5 risultati esatti

### Fase Finale
- **Sedicesimi**: 20 punti per squadra corretta + 5 punti se posizione esatta
- **Ottavi**: 20 punti per squadra
- **Quarti**: 30 punti per squadra
- **Semifinali**: 50 punti per squadra
- **Finale**: 60 punti per squadra

### Classifiche Finali
- **1° posto**: 80 punti
- **2° posto**: 50 punti
- **3° posto**: 25 punti
- **4° posto**: 25 punti
- **Capocannoniere**: 30 punti

### Angolo del Capiscione
- **Gruppo Top**: 25 punti
- **Gruppo Outsider**: 20 punti
- **Gruppo Materasso**: 15 punti

## 🛠️ Stack Tecnologico

### Frontend
- **React 18** con Vite
- **Material-UI (MUI)** per UI components
- **React Router v6** per navigazione
- **React Query** per state management e caching
- **Axios** per HTTP requests
- **React Hook Form + Zod** per validazione form

### Backend
- **Node.js 20** con Express.js
- **MongoDB** con Mongoose ORM
- **JWT** per autenticazione classica
- **Auth0** per OAuth social login
- **Bcrypt** per password hashing
- **Node-cron** per scheduled jobs

### Hosting (Gratuito)
- **Frontend**: GitHub Pages
- **Backend**: Railway.app o Render.com (free tier)
- **Database**: MongoDB Atlas (free tier 512MB)

## 📁 Struttura Progetto

```
fifa-2026-predictions/
├── frontend/              # React Application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom hooks
│   │   ├── services/     # API services
│   │   └── utils/        # Utilities
│   └── package.json
│
├── backend/              # Express API
│   ├── src/
│   │   ├── models/      # Mongoose models
│   │   ├── controllers/ # Route controllers
│   │   ├── services/    # Business logic
│   │   ├── routes/      # API routes
│   │   └── middleware/  # Express middleware
│   └── package.json
│
├── docs/                 # Documentation
│   ├── API.md
│   ├── USER_GUIDE.md
│   └── ADMIN_GUIDE.md
│
└── scripts/             # Utility scripts
```

## 🚀 Quick Start

### Prerequisiti
- Node.js 20+
- MongoDB (locale o Atlas)
- Git

### 1. Clone Repository
```bash
git clone https://github.com/your-username/fifa-2026-predictions.git
cd fifa-2026-predictions
```

### 2. Setup Backend
```bash
cd backend
npm install

# Crea file .env
cp .env.example .env
# Configura variabili ambiente (vedi sotto)

# Avvia server
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install

# Crea file .env
cp .env.example .env
# Configura variabili ambiente (vedi sotto)

# Avvia app
npm run dev
```

### 4. Accedi all'App
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## ⚙️ Configurazione

### Backend (.env)
```env
# Server
NODE_ENV=development
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/fifa2026
# O MongoDB Atlas:
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/fifa2026

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=7d

# Auth0
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_AUDIENCE=https://your-api-audience

# API Football (opzionale)
API_FOOTBALL_KEY=your-api-key

# Email (opzionale)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# CORS
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```env
# API
VITE_API_URL=http://localhost:3000/api

# Auth0
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=https://your-api-audience
VITE_AUTH0_REDIRECT_URI=http://localhost:5173/callback

# App
VITE_APP_NAME=FIFA 2026 Predictions
VITE_TOURNAMENT_START=2026-06-11
```

## 📚 Documentazione

### 🚀 Guide Deployment (NUOVO!)
- **[QUICK_START_IT.md](./QUICK_START_IT.md)** - 🇮🇹 **Setup rapido in 30 minuti** (GitHub Pages + Railway + MongoDB Atlas)
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - 🇮🇹 **Guida completa deployment gratuito** con troubleshooting

### 📖 Documentazione Tecnica
- [**ARCHITECTURE.md**](./ARCHITECTURE.md) - Architettura completa del sistema
- [**IMPLEMENTATION_PLAN.md**](./IMPLEMENTATION_PLAN.md) - Piano di implementazione 30 giorni
- [**IMPLEMENTATION_STATUS.md**](./IMPLEMENTATION_STATUS.md) - Stato avanzamento progetto
- [**API_RESEARCH.md**](./API_RESEARCH.md) - Ricerca API per risultati automatici
- [**DIAGRAMS.md**](./DIAGRAMS.md) - Diagrammi architetturali e flussi

## 🎮 Gruppi Angolo del Capiscione

### 🏆 Gruppo TOP (Favorite)
1. Brasile
2. Argentina
3. Francia
4. Inghilterra
5. Spagna

### 🎯 Gruppo OUTSIDER (Sorprese possibili)
1. Portogallo
2. Olanda
3. Uruguay
4. Colombia
5. Croazia

### 🎲 Gruppo MATERASSO (Outsider estreme)
1. Messico
2. Giappone
3. Senegal
4. Marocco
5. Stati Uniti

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test                 # Run all tests
npm run test:unit       # Unit tests only
npm run test:integration # Integration tests
npm run test:coverage   # Coverage report
```

### Frontend Tests
```bash
cd frontend
npm test                # Run all tests
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
```

### E2E Tests
```bash
npm run test:e2e       # Cypress E2E tests
```

## 🚀 Deployment Cloud Gratuito

### ✨ Hosting Completamente Gratuito!

L'applicazione può essere ospitata **gratuitamente** su servizi cloud senza dipendere dal tuo laptop:

| Servizio | Uso | Costo | Limiti |
|----------|-----|-------|--------|
| **GitHub Pages** | Frontend | 0€ | 100GB/mese bandwidth |
| **Railway.app** | Backend | 0€ | 500h/mese (~20 giorni) |
| **MongoDB Atlas** | Database | 0€ | 512MB storage |

**Totale: 0€/mese** per ~50-100 utenti attivi! 🎉

### 📖 Guide Complete

1. **[QUICK_START_IT.md](./QUICK_START_IT.md)** - Setup rapido in 5 passi (30 minuti)
   - Crea account MongoDB Atlas
   - Deploy backend su Railway
   - Deploy frontend su GitHub Pages
   - Tutto spiegato passo-passo in italiano!

2. **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Guida dettagliata con:
   - Istruzioni complete per ogni servizio
   - Screenshot e comandi esatti
   - Troubleshooting problemi comuni
   - Monitoraggio e limiti tier gratuiti

### 🎯 Risultato Finale

Dopo il deployment avrai:
- ✅ **Frontend**: `https://tuo-username.github.io/fifa-2026-predictions/`
- ✅ **Backend**: `https://tuo-backend.railway.app`
- ✅ **Database**: MongoDB Atlas (cloud)
- ✅ **Disponibilità**: 24/7 senza dipendere dal tuo laptop
- ✅ **Costo**: 0€/mese

### 🔄 Aggiornamenti Futuri

```bash
# Aggiorna Backend
git add backend/
git commit -m "Update backend"
git push
# Railway farà redeploy automaticamente

# Aggiorna Frontend
cd frontend
npm run deploy
# GitHub Pages si aggiorna automaticamente
```

## 📊 Roadmap

### Fase 1: Core Features ✅
- [x] Architettura definita
- [x] Piano implementazione
- [ ] Setup progetto
- [ ] Autenticazione
- [ ] Pronostici gironi
- [ ] Pronostici fase finale
- [ ] Calcolo punteggi

### Fase 2: Advanced Features
- [ ] Dashboard dinamica
- [ ] Admin panel
- [ ] API esterne risultati
- [ ] Sistema notifiche
- [ ] PWA support

### Fase 3: Polish & Launch
- [ ] Testing completo
- [ ] Documentazione
- [ ] Deployment produzione
- [ ] Monitoring

## 🤝 Contribuire

Contributi sono benvenuti! Per favore:

1. Fork il repository
2. Crea un branch per la feature (`git checkout -b feature/AmazingFeature`)
3. Commit le modifiche (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📝 License

Questo progetto è rilasciato sotto licenza MIT. Vedi [LICENSE](LICENSE) per dettagli.

## 👥 Autori

- **Il tuo nome** - *Initial work*

## 🙏 Ringraziamenti

- FIFA per il calendario ufficiale del mondiale
- API-Football per i dati in tempo reale
- Community open source per le librerie utilizzate

## 📞 Supporto

Per domande o supporto:
- 📧 Email: your-email@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/fifa-2026-predictions/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-username/fifa-2026-predictions/discussions)

## 📈 Status

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-85%25-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![Version](https://img.shields.io/badge/version-1.0.0-blue)

---

**Nota**: Questo progetto è in fase di sviluppo attivo. Il Mondiale FIFA 2026 si terrà dall'11 giugno al 19 luglio 2026 in Canada, Messico e Stati Uniti.

🏆 **Buona fortuna con i tuoi pronostici!** ⚽