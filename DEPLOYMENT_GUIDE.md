# 🚀 Guida Deployment Gratuito - FIFA 2026 Predictions App

## 📋 Panoramica

L'applicazione sarà ospitata completamente su servizi cloud gratuiti, senza dipendere dal tuo laptop:

- **Frontend**: GitHub Pages (gratis, illimitato)
- **Backend**: Railway.app o Render.com (gratis fino a 500h/mese)
- **Database**: MongoDB Atlas (gratis fino a 512MB)
- **Totale**: **0€/mese** per ~50 utenti

## 🗄️ STEP 1: Setup MongoDB Atlas (Database Gratuito)

### 1.1 Crea Account MongoDB Atlas

1. Vai su https://www.mongodb.com/cloud/atlas/register
2. Registrati con email o Google
3. Scegli il piano **FREE** (M0 Sandbox)

### 1.2 Crea Cluster Gratuito

```
1. Dopo il login, clicca "Build a Database"
2. Scegli "M0 FREE" (512MB storage, shared)
3. Seleziona provider: AWS
4. Seleziona region: eu-west-1 (Ireland) - più vicina all'Italia
5. Cluster Name: "fifa2026-cluster"
6. Clicca "Create"
```

### 1.3 Configura Database Access

```
1. Nel menu laterale, vai su "Database Access"
2. Clicca "Add New Database User"
3. Authentication Method: Password
4. Username: fifa2026admin
5. Password: Genera password sicura (salvala!)
6. Database User Privileges: "Read and write to any database"
7. Clicca "Add User"
```

### 1.4 Configura Network Access

```
1. Nel menu laterale, vai su "Network Access"
2. Clicca "Add IP Address"
3. Seleziona "Allow Access from Anywhere" (0.0.0.0/0)
   Nota: Necessario per Railway/Render
4. Clicca "Confirm"
```

### 1.5 Ottieni Connection String

```
1. Torna su "Database" nel menu laterale
2. Clicca "Connect" sul tuo cluster
3. Scegli "Connect your application"
4. Driver: Node.js, Version: 5.5 or later
5. Copia la connection string:
   mongodb+srv://fifa2026admin:<password>@fifa2026-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority

6. Sostituisci <password> con la password dell'utente
7. Aggiungi il nome del database alla fine:
   mongodb+srv://fifa2026admin:TUA_PASSWORD@fifa2026-cluster.xxxxx.mongodb.net/fifa2026?retryWrites=true&w=majority
```

**Salva questa stringa! La userai per il backend.**

## 🔧 STEP 2: Deploy Backend su Railway.app (Gratuito)

### 2.1 Crea Account Railway

1. Vai su https://railway.app/
2. Clicca "Start a New Project"
3. Login con GitHub (raccomandato)

### 2.2 Deploy Backend

```
1. Clicca "New Project"
2. Scegli "Deploy from GitHub repo"
3. Autorizza Railway ad accedere ai tuoi repository
4. Seleziona il repository "fifa-2026-predictions"
5. Railway rileverà automaticamente il backend Node.js
```

### 2.3 Configura Variabili Ambiente

```
1. Nel progetto Railway, clicca sul servizio backend
2. Vai su "Variables"
3. Aggiungi le seguenti variabili:

NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://fifa2026admin:TUA_PASSWORD@fifa2026-cluster.xxxxx.mongodb.net/fifa2026?retryWrites=true&w=majority
JWT_SECRET=genera-una-stringa-casuale-molto-lunga-e-sicura-qui
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=genera-un-altra-stringa-casuale-diversa-qui
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=https://TUO-USERNAME.github.io

4. Clicca "Add" per ogni variabile
```

**Genera JWT secrets sicuri:**
```bash
# Su Mac/Linux, esegui in terminale:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Copia l'output per JWT_SECRET

node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Copia l'output per JWT_REFRESH_SECRET
```

### 2.4 Configura Build Settings

```
1. Vai su "Settings" del servizio
2. Build Command: npm install
3. Start Command: npm start
4. Root Directory: /backend
5. Clicca "Save"
```

### 2.5 Deploy

```
1. Railway farà il deploy automaticamente
2. Attendi il completamento (2-3 minuti)
3. Clicca su "Deployments" per vedere lo stato
4. Una volta completato, vedrai un URL tipo:
   https://fifa2026-backend-production.up.railway.app
```

**Salva questo URL! È l'URL del tuo backend.**

### 2.6 Testa Backend

```bash
# Testa health check
curl https://TUO-BACKEND-URL.railway.app/health

# Dovrebbe rispondere:
{
  "status": "OK",
  "timestamp": "...",
  "uptime": ...,
  "environment": "production"
}
```

## 🌐 STEP 3: Deploy Frontend su GitHub Pages

### 3.1 Prepara Repository GitHub

```bash
# Nel tuo terminale, nella cartella fifa-2026-predictions
git init
git add .
git commit -m "Initial commit - FIFA 2026 Predictions App"

# Crea repository su GitHub
# Vai su github.com/new
# Nome: fifa-2026-predictions
# Public
# Non inizializzare con README (già presente)

# Collega repository locale a GitHub
git remote add origin https://github.com/TUO-USERNAME/fifa-2026-predictions.git
git branch -M main
git push -u origin main
```

### 3.2 Configura Frontend per Production

```bash
cd frontend

# Crea file .env.production
cat > .env.production << EOF
VITE_API_URL=https://TUO-BACKEND-URL.railway.app/api
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=https://your-api-audience
VITE_AUTH0_REDIRECT_URI=https://TUO-USERNAME.github.io/fifa-2026-predictions/callback
VITE_APP_NAME=FIFA 2026 Predictions
VITE_TOURNAMENT_START=2026-06-11T00:00:00Z
VITE_PREDICTIONS_LOCK_DATE=2026-06-10T23:59:59Z
EOF
```

### 3.3 Configura vite.config.js per GitHub Pages

```javascript
// frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/fifa-2026-predictions/', // Nome del tuo repository
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
```

### 3.4 Installa gh-pages

```bash
cd frontend
npm install --save-dev gh-pages
```

### 3.5 Aggiungi Script Deploy al package.json

```json
// frontend/package.json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### 3.6 Deploy su GitHub Pages

```bash
cd frontend
npm run deploy

# Questo comando:
# 1. Fa il build del frontend
# 2. Crea un branch gh-pages
# 3. Pusha il contenuto di dist/ su gh-pages
```

### 3.7 Abilita GitHub Pages

```
1. Vai su GitHub.com/TUO-USERNAME/fifa-2026-predictions
2. Clicca su "Settings"
3. Nel menu laterale, clicca "Pages"
4. Source: Deploy from a branch
5. Branch: gh-pages, folder: / (root)
6. Clicca "Save"
7. Attendi 1-2 minuti
8. L'app sarà disponibile su:
   https://TUO-USERNAME.github.io/fifa-2026-predictions/
```

## 🔄 STEP 4: Aggiorna CORS nel Backend

Dopo aver ottenuto l'URL di GitHub Pages, aggiorna Railway:

```
1. Vai su Railway.app
2. Apri il progetto backend
3. Vai su "Variables"
4. Modifica CORS_ORIGIN:
   CORS_ORIGIN=https://TUO-USERNAME.github.io
5. Railway farà redeploy automaticamente
```

## ✅ STEP 5: Verifica Deployment

### 5.1 Testa Backend

```bash
# Health check
curl https://TUO-BACKEND-URL.railway.app/health

# Test register
curl -X POST https://TUO-BACKEND-URL.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"Test123456"}'
```

### 5.2 Testa Frontend

```
1. Apri https://TUO-USERNAME.github.io/fifa-2026-predictions/
2. Verifica che la homepage si carichi
3. Prova a registrarti
4. Prova a fare login
5. Verifica che le chiamate API funzionino
```

## 🔧 Aggiornamenti Futuri

### Aggiornare Backend

```bash
# Modifica il codice backend
git add backend/
git commit -m "Update backend"
git push origin main

# Railway farà redeploy automaticamente
```

### Aggiornare Frontend

```bash
# Modifica il codice frontend
cd frontend
npm run deploy

# Questo farà build e deploy su GitHub Pages
```

## 💰 Limiti Tier Gratuiti

### MongoDB Atlas (Free M0)
- **Storage**: 512MB
- **RAM**: Shared
- **Connessioni**: 500 simultanee
- **Backup**: Nessuno (manuale)
- **Sufficiente per**: ~100-200 utenti

### Railway.app (Free Tier)
- **Ore**: 500h/mese (~20 giorni)
- **RAM**: 512MB
- **CPU**: Shared
- **Bandwidth**: 100GB/mese
- **Sufficiente per**: ~50-100 utenti attivi

**Nota**: Railway dorme dopo 5 minuti di inattività (cold start ~10 secondi)

### GitHub Pages
- **Storage**: 1GB
- **Bandwidth**: 100GB/mese
- **Build**: 10 build/ora
- **Completamente gratuito e illimitato per utenti**

## 🚀 Alternative se Superi i Limiti

### Se superi Railway (500h/mese):

**Opzione 1: Render.com (Gratis)**
- 750h/mese gratis
- Setup identico a Railway
- https://render.com/

**Opzione 2: Fly.io (Gratis)**
- 3 VM gratis
- Setup più complesso
- https://fly.io/

**Opzione 3: Railway Pro ($5/mese)**
- Ore illimitate
- 8GB RAM
- Più affidabile

### Se superi MongoDB Atlas (512MB):

**Opzione 1: Upgrade Atlas ($9/mese)**
- 2GB storage
- Backup automatici
- Più performance

**Opzione 2: Supabase (Gratis)**
- PostgreSQL invece di MongoDB
- 500MB storage
- Richiede modifica codice

## 📊 Monitoraggio

### Railway Dashboard
```
1. Vai su railway.app
2. Apri il progetto
3. Vedi:
   - CPU usage
   - Memory usage
   - Request count
   - Logs in tempo reale
```

### MongoDB Atlas Dashboard
```
1. Vai su mongodb.com/cloud/atlas
2. Apri il cluster
3. Vedi:
   - Storage usage
   - Connection count
   - Query performance
```

### GitHub Pages
```
1. Vai su github.com/TUO-USERNAME/fifa-2026-predictions
2. Settings > Pages
3. Vedi:
   - Build status
   - Deploy history
```

## 🆘 Troubleshooting

### Backend non risponde
```bash
# Controlla logs su Railway
1. Vai su railway.app
2. Apri progetto
3. Clicca "View Logs"
4. Cerca errori

# Errori comuni:
- MONGODB_URI errato → Verifica connection string
- JWT_SECRET mancante → Aggiungi variabile
- CORS error → Verifica CORS_ORIGIN
```

### Frontend non carica
```bash
# Verifica build
cd frontend
npm run build
# Controlla errori

# Verifica GitHub Pages
1. GitHub > Settings > Pages
2. Verifica branch gh-pages esista
3. Verifica URL corretto
```

### Database connection failed
```bash
# Verifica MongoDB Atlas
1. Network Access: 0.0.0.0/0 permesso?
2. Database User: password corretta?
3. Connection string: formato corretto?
```

## 📝 Checklist Deployment

- [ ] MongoDB Atlas cluster creato
- [ ] Database user configurato
- [ ] Network access configurato (0.0.0.0/0)
- [ ] Connection string salvato
- [ ] Railway account creato
- [ ] Backend deployato su Railway
- [ ] Variabili ambiente configurate
- [ ] Backend URL salvato
- [ ] Repository GitHub creato
- [ ] Frontend configurato per production
- [ ] Frontend deployato su GitHub Pages
- [ ] CORS aggiornato con URL GitHub Pages
- [ ] Test register/login funzionanti
- [ ] Monitoraggio configurato

## 🎉 Risultato Finale

Dopo aver completato tutti gli step, avrai:

✅ **Frontend**: https://TUO-USERNAME.github.io/fifa-2026-predictions/  
✅ **Backend**: https://TUO-BACKEND.railway.app  
✅ **Database**: MongoDB Atlas (cloud)  
✅ **Costo**: 0€/mese  
✅ **Disponibilità**: 24/7 senza dipendere dal tuo laptop  

---

**L'applicazione è completamente indipendente e accessibile da qualsiasi dispositivo! 🚀⚽**