# 🚀 Backend Setup & Deployment Guide

## 📋 Panoramica

Questa guida ti aiuterà a:
1. Configurare MongoDB Atlas (database cloud gratuito)
2. Creare il file `.env` per il backend
3. Testare il backend localmente
4. Deployare su Render.com (hosting gratuito)
5. Collegare frontend e backend

---

## 1️⃣ Setup MongoDB Atlas

### Passo 1: Crea un Account
1. Vai su [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Registrati gratuitamente (puoi usare Google/GitHub)
3. Scegli il piano **FREE** (M0 Sandbox)

### Passo 2: Crea un Cluster
1. Dopo il login, clicca su **"Build a Database"**
2. Seleziona **FREE** (Shared Cluster)
3. Scegli un provider cloud (AWS, Google Cloud, o Azure)
4. Seleziona una region vicina (es. Frankfurt per Europa)
5. Clicca **"Create Cluster"** (ci vogliono 1-3 minuti)

### Passo 3: Configura Database Access
1. Nel menu laterale, vai su **"Database Access"**
2. Clicca **"Add New Database User"**
3. Scegli **"Password"** come metodo di autenticazione
4. Username: `fifa2026admin`
5. Password: genera una password sicura (salvala!)
6. Database User Privileges: **"Read and write to any database"**
7. Clicca **"Add User"**

### Passo 4: Configura Network Access
1. Nel menu laterale, vai su **"Network Access"**
2. Clicca **"Add IP Address"**
3. Clicca **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ Per produzione, limita agli IP di Render.com
4. Clicca **"Confirm"**

### Passo 5: Ottieni Connection String
1. Torna su **"Database"** nel menu laterale
2. Clicca **"Connect"** sul tuo cluster
3. Seleziona **"Connect your application"**
4. Copia la connection string (simile a):
   ```
   mongodb+srv://fifa2026admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Sostituisci `<password>` con la password che hai creato
6. Aggiungi il nome del database dopo `.net/`: `fifa2026`
   ```
   mongodb+srv://fifa2026admin:TUA_PASSWORD@cluster0.xxxxx.mongodb.net/fifa2026?retryWrites=true&w=majority
   ```

---

## 2️⃣ Configurazione Backend Locale

### Passo 1: Crea file .env
Nella cartella `backend/`, crea un file `.env`:

```bash
cd fifa-2026-predictions/backend
touch .env
```

### Passo 2: Configura variabili d'ambiente
Apri `.env` e aggiungi:

```env
# Server
NODE_ENV=development
PORT=3000

# Database
MONGODB_URI=mongodb+srv://fifa2026admin:TUA_PASSWORD@cluster0.xxxxx.mongodb.net/fifa2026?retryWrites=true&w=majority

# JWT
JWT_SECRET=fifa2026_super_secret_key_change_in_production_12345
JWT_EXPIRE=30d

# CORS
CORS_ORIGIN=http://localhost:5173

# Tournament Config
TOURNAMENT_START_DATE=2026-06-11
PREDICTIONS_LOCK_DATE=2026-06-10
```

### Passo 3: Installa dipendenze
```bash
npm install
```

### Passo 4: Testa il backend localmente
```bash
npm run dev
```

Dovresti vedere:
```
╔═══════════════════════════════════════════════════════════╗
║   🏆 FIFA World Cup 2026 - Predictions API Server 🏆    ║
║   Environment: development                                ║
║   Port: 3000                                              ║
║   Database: Connected                                     ║
╚═══════════════════════════════════════════════════════════╝
```

### Passo 5: Testa gli endpoint
Apri il browser o usa curl:

```bash
# Health check
curl http://localhost:3000/health

# Get settings
curl http://localhost:3000/api/settings

# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

---

## 3️⃣ Deploy su Render.com

### Passo 1: Prepara il Repository
1. Assicurati che tutto sia committato su GitHub:
   ```bash
   cd fifa-2026-predictions
   git add .
   git commit -m "Backend completo con API"
   git push origin main
   ```

### Passo 2: Crea Account Render
1. Vai su [Render.com](https://render.com/)
2. Registrati con GitHub
3. Autorizza Render ad accedere ai tuoi repository

### Passo 3: Crea Web Service
1. Dalla dashboard, clicca **"New +"** → **"Web Service"**
2. Connetti il repository `fifa-2026-predictions`
3. Configura il servizio:
   - **Name**: `fifa-2026-predictions-api`
   - **Region**: Frankfurt (EU Central)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### Passo 4: Aggiungi Environment Variables
Nella sezione **"Environment"**, aggiungi:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://fifa2026admin:TUA_PASSWORD@cluster0.xxxxx.mongodb.net/fifa2026?retryWrites=true&w=majority
JWT_SECRET=fifa2026_super_secret_key_CAMBIA_QUESTO_IN_PRODUZIONE
JWT_EXPIRE=30d
CORS_ORIGIN=https://mameucci.github.io
PORT=10000
```

⚠️ **IMPORTANTE**: Cambia `JWT_SECRET` con una stringa casuale sicura!

### Passo 5: Deploy
1. Clicca **"Create Web Service"**
2. Render inizierà il build e deploy (3-5 minuti)
3. Una volta completato, otterrai un URL tipo:
   ```
   https://fifa-2026-predictions-api.onrender.com
   ```

### Passo 6: Testa il Deploy
```bash
curl https://fifa-2026-predictions-api.onrender.com/health
```

---

## 4️⃣ Collega Frontend al Backend

### Passo 1: Aggiorna .env.production del Frontend
Nel file `frontend/.env.production`:

```env
VITE_API_URL=https://fifa-2026-predictions-api.onrender.com/api
```

### Passo 2: Aggiorna CORS nel Backend
Nel file `backend/.env` su Render, aggiorna:

```env
CORS_ORIGIN=https://mameucci.github.io
```

### Passo 3: Redeploy Frontend
```bash
cd frontend
npm run build
npm run deploy
```

---

## 5️⃣ Test End-to-End

### Test 1: Registrazione Utente
1. Vai su https://mameucci.github.io/fifa-2026-predictions/
2. Clicca "Registrati"
3. Compila il form
4. Verifica che la registrazione funzioni

### Test 2: Login
1. Fai login con le credenziali create
2. Verifica che vedi la dashboard

### Test 3: Salva Pronostici
1. Vai su "I Miei Pronostici"
2. Inserisci alcuni pronostici
3. Salva
4. Ricarica la pagina e verifica che siano salvati

### Test 4: Leaderboard
1. Vai su "Vai alla Classifica"
2. Verifica che vedi la classifica (anche se vuota)

---

## 🔧 Troubleshooting

### Problema: "Cannot connect to MongoDB"
**Soluzione**:
- Verifica che la connection string sia corretta
- Controlla che l'IP 0.0.0.0/0 sia nella whitelist
- Verifica username e password

### Problema: "CORS Error"
**Soluzione**:
- Verifica che `CORS_ORIGIN` nel backend includa l'URL del frontend
- Riavvia il servizio Render dopo aver cambiato le env variables

### Problema: "JWT Error"
**Soluzione**:
- Verifica che `JWT_SECRET` sia impostato
- Assicurati che sia lo stesso tra sviluppo e produzione

### Problema: "Render service sleeping"
**Soluzione**:
- Il piano free di Render mette il servizio in sleep dopo 15 minuti di inattività
- La prima richiesta dopo lo sleep può richiedere 30-60 secondi
- Considera un piano a pagamento per produzione

---

## 📊 Monitoraggio

### Render Dashboard
- Vai su https://dashboard.render.com
- Seleziona il tuo servizio
- Vedi logs, metriche, e stato

### MongoDB Atlas Dashboard
- Vai su https://cloud.mongodb.com
- Vedi connessioni, storage, e query

---

## 🎯 Prossimi Passi

1. ✅ Backend deployato e funzionante
2. ✅ Frontend collegato al backend
3. ⏳ Popolare database con partite FIFA 2026
4. ⏳ Implementare calcolo punteggi automatico
5. ⏳ Aggiungere integrazione API risultati live

---

## 📞 Supporto

Se hai problemi:
1. Controlla i logs su Render Dashboard
2. Verifica le variabili d'ambiente
3. Testa gli endpoint con curl/Postman
4. Controlla la console del browser per errori frontend

---

**Made with Bob** 🤖