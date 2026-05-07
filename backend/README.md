# FIFA 2026 Predictions - Backend API

Backend API per l'applicazione di pronostici sul Mondiale FIFA 2026.

## 🚀 Quick Start

### Prerequisiti
- Node.js 20+
- MongoDB (locale o Atlas)

### Installazione

```bash
# Installa dipendenze
npm install

# Copia file environment
cp .env.example .env

# Modifica .env con le tue configurazioni
# Importante: MONGODB_URI, JWT_SECRET, JWT_REFRESH_SECRET

# Avvia server in development
npm run dev

# Avvia server in production
npm start
```

### Configurazione MongoDB

**Opzione 1: MongoDB Locale**
```bash
# Installa MongoDB
brew install mongodb-community  # macOS
# oppure scarica da mongodb.com

# Avvia MongoDB
brew services start mongodb-community

# .env
MONGODB_URI=mongodb://localhost:27017/fifa2026
```

**Opzione 2: MongoDB Atlas (Cloud - Gratuito)**
```bash
# 1. Crea account su mongodb.com/cloud/atlas
# 2. Crea cluster gratuito
# 3. Ottieni connection string

# .env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fifa2026
```

## 📁 Struttura Progetto

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Configurazione MongoDB
│   ├── models/
│   │   └── User.js              # Modello User (✅ completato)
│   ├── controllers/
│   │   └── authController.js    # Controller autenticazione (✅ completato)
│   ├── routes/
│   │   └── auth.js              # Route autenticazione (✅ completato)
│   ├── middleware/
│   │   ├── auth.js              # Middleware JWT (✅ completato)
│   │   └── validation.js        # Middleware validazione (✅ completato)
│   ├── services/                # Business logic (da implementare)
│   ├── utils/                   # Utilities (da implementare)
│   ├── jobs/                    # Scheduled jobs (da implementare)
│   ├── app.js                   # Express app (✅ completato)
│   └── server.js                # Server entry point (✅ completato)
├── .env.example                 # Template environment variables
├── .gitignore
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Autenticazione (✅ Implementati)

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "Password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer your-access-token
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer your-access-token
```

### Health Check
```http
GET /health
```

## 🔐 Autenticazione

Il sistema usa JWT (JSON Web Tokens) con:
- **Access Token**: Scade dopo 15 minuti
- **Refresh Token**: Scade dopo 7 giorni

### Flusso Autenticazione

1. **Register/Login** → Ricevi access token + refresh token
2. **Richieste API** → Invia access token nell'header `Authorization: Bearer <token>`
3. **Token Scaduto** → Usa refresh token per ottenere nuovo access token
4. **Logout** → Elimina tokens lato client

## 🛠️ Sviluppo

### Scripts Disponibili

```bash
npm start       # Avvia server production
npm run dev     # Avvia server development con nodemon
npm test        # Run tests (da implementare)
```

### Variabili Ambiente

Vedi `.env.example` per tutte le variabili disponibili.

**Variabili Essenziali:**
- `MONGODB_URI` - Connection string MongoDB
- `JWT_SECRET` - Secret per access token
- `JWT_REFRESH_SECRET` - Secret per refresh token
- `CORS_ORIGIN` - URL frontend per CORS

## 📊 Modelli Database

### User Model (✅ Completato)
```javascript
{
  username: String (unique, 3-30 chars),
  email: String (unique, valid email),
  passwordHash: String (bcrypt hashed),
  authProvider: 'local' | 'auth0',
  auth0Id: String (optional),
  role: 'user' | 'admin',
  profile: {
    firstName: String,
    lastName: String,
    avatar: String
  },
  isActive: Boolean,
  lastLogin: Date,
  emailVerified: Boolean,
  timestamps: true
}
```

### Da Implementare
- Match Model
- Prediction Model
- Score Model
- Setting Model
- AuditLog Model

## 🔄 Prossimi Passi

1. **Modelli Database**
   - [ ] Match.js
   - [ ] Prediction.js
   - [ ] Score.js
   - [ ] Setting.js
   - [ ] AuditLog.js

2. **Controllers & Routes**
   - [ ] predictionsController.js + routes
   - [ ] matchesController.js + routes
   - [ ] scoresController.js + routes
   - [ ] settingsController.js + routes
   - [ ] adminController.js + routes

3. **Services**
   - [ ] scoringEngine.js (calcolo punteggi)
   - [ ] resultsImporter.js (import risultati da API)
   - [ ] notificationService.js (email notifications)

4. **Jobs**
   - [ ] scoreCalculator.js (ricalcolo automatico)
   - [ ] resultsSync.js (sync risultati 2x/giorno)

5. **Testing**
   - [ ] Unit tests
   - [ ] Integration tests
   - [ ] API tests

## 🐛 Debugging

### Logs
Il server usa `morgan` per logging HTTP requests:
- Development: formato `dev` (colorato, conciso)
- Production: formato `combined` (completo)

### Errori Comuni

**MongoDB Connection Failed**
```bash
# Verifica che MongoDB sia in esecuzione
brew services list  # macOS

# Verifica connection string in .env
```

**JWT Token Invalid**
```bash
# Verifica che JWT_SECRET sia configurato in .env
# Verifica che il token non sia scaduto
```

## 📝 Note

- Password hashate con bcrypt (12 rounds)
- Validazione input con express-validator
- Error handling centralizzato
- CORS configurato per frontend
- Rate limiting da implementare

## 🤝 Contribuire

1. Segui la struttura esistente
2. Usa async/await per operazioni asincrone
3. Gestisci errori con try/catch
4. Valida input utente
5. Documenta nuovi endpoint

---

**Stato**: Backend base funzionante con autenticazione completa ✅