# 🚀 Guida Rapida - Inizia Subito!

## 📋 Cosa Serve (Tutto Gratis!)

1. **Account GitHub** (per hosting frontend)
2. **Account MongoDB Atlas** (per database)
3. **Account Railway.app** (per backend)

**Tempo totale setup**: ~30 minuti  
**Costo**: 0€/mese

---

## 🎯 Setup in 5 Passi

### PASSO 1: Database MongoDB (10 minuti)

```
1. Vai su https://www.mongodb.com/cloud/atlas/register
2. Registrati (usa Google per velocità)
3. Scegli piano "M0 FREE"
4. Region: eu-west-1 (Ireland)
5. Cluster name: fifa2026-cluster
6. Clicca "Create"

7. Vai su "Database Access" → "Add New Database User"
   - Username: fifa2026admin
   - Password: [genera e SALVA!]
   - Privileges: Read and write to any database

8. Vai su "Network Access" → "Add IP Address"
   - Seleziona "Allow Access from Anywhere"

9. Vai su "Database" → "Connect" → "Connect your application"
   - Copia la connection string
   - Sostituisci <password> con la tua password
   - Aggiungi /fifa2026 alla fine
   
   Esempio finale:
   mongodb+srv://fifa2026admin:MiaPassword123@fifa2026-cluster.abc123.mongodb.net/fifa2026?retryWrites=true&w=majority
```

**✅ SALVA questa stringa! La userai dopo.**

---

### PASSO 2: Backend su Railway (10 minuti)

```
1. Vai su https://railway.app/
2. Login con GitHub
3. Clicca "New Project" → "Deploy from GitHub repo"
4. Autorizza Railway
5. Seleziona repository "fifa-2026-predictions"

6. Clicca sul servizio backend → "Variables"
7. Aggiungi queste variabili:

NODE_ENV=production
PORT=3000
MONGODB_URI=[incolla la stringa MongoDB qui]
JWT_SECRET=[genera stringa casuale lunga]
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=[genera altra stringa casuale]
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=https://TUO-USERNAME.github.io

8. Vai su "Settings"
   - Root Directory: /backend
   - Start Command: npm start

9. Railway farà deploy automaticamente
10. Copia l'URL del backend (tipo: https://xxx.railway.app)
```

**Come generare JWT secrets sicuri:**
```bash
# Apri terminale e esegui:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Copia output per JWT_SECRET

node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Copia output per JWT_REFRESH_SECRET
```

**✅ SALVA l'URL Railway! Lo userai dopo.**

---

### PASSO 3: Prepara Repository GitHub (5 minuti)

```bash
# Nel terminale, vai nella cartella del progetto
cd fifa-2026-predictions

# Inizializza git
git init
git add .
git commit -m "Initial commit"

# Crea repository su GitHub
# Vai su github.com/new
# Nome: fifa-2026-predictions
# Public
# NON inizializzare con README

# Collega e pusha
git remote add origin https://github.com/TUO-USERNAME/fifa-2026-predictions.git
git branch -M main
git push -u origin main
```

---

### PASSO 4: Configura e Deploy Frontend (5 minuti)

```bash
cd frontend

# Crea file .env.production
nano .env.production
# (oppure usa qualsiasi editor)

# Incolla questo contenuto (sostituisci i valori):
VITE_API_URL=https://TUO-BACKEND-URL.railway.app/api
VITE_APP_NAME=FIFA 2026 Predictions
VITE_TOURNAMENT_START=2026-06-11T00:00:00Z
VITE_PREDICTIONS_LOCK_DATE=2026-06-10T23:59:59Z

# Salva e chiudi (Ctrl+X, Y, Enter)

# Modifica vite.config.js
nano vite.config.js

# Cambia la riga base:
base: '/fifa-2026-predictions/',

# Installa gh-pages
npm install --save-dev gh-pages

# Aggiungi script deploy al package.json
# Apri package.json e aggiungi in "scripts":
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# Deploy!
npm run deploy
```

---

### PASSO 5: Attiva GitHub Pages (2 minuti)

```
1. Vai su github.com/TUO-USERNAME/fifa-2026-predictions
2. Clicca "Settings"
3. Menu laterale → "Pages"
4. Source: Deploy from a branch
5. Branch: gh-pages, folder: / (root)
6. Clicca "Save"
7. Attendi 1-2 minuti

✅ App disponibile su:
https://TUO-USERNAME.github.io/fifa-2026-predictions/
```

---

### PASSO 5.1: Aggiorna CORS su Railway

```
1. Torna su railway.app
2. Apri progetto backend
3. Vai su "Variables"
4. Modifica CORS_ORIGIN:
   CORS_ORIGIN=https://TUO-USERNAME.github.io
5. Railway farà redeploy automaticamente (1-2 minuti)
```

---

## ✅ Verifica che Funzioni

### Test Backend
```bash
# Sostituisci con il tuo URL Railway
curl https://TUO-BACKEND.railway.app/health

# Dovrebbe rispondere:
{"status":"OK","timestamp":"...","uptime":...}
```

### Test Frontend
```
1. Apri https://TUO-USERNAME.github.io/fifa-2026-predictions/
2. Dovresti vedere la homepage
3. Clicca "Registrati"
4. Crea un account
5. Fai login
6. Se funziona → TUTTO OK! 🎉
```

---

## 🔄 Come Aggiornare l'App

### Aggiornare Backend
```bash
# Modifica codice backend
git add backend/
git commit -m "Update backend"
git push

# Railway farà redeploy automaticamente
```

### Aggiornare Frontend
```bash
cd frontend
npm run deploy

# Fatto! GitHub Pages si aggiorna automaticamente
```

---

## 🆘 Problemi Comuni

### "Backend non risponde"
```
1. Vai su railway.app
2. Apri progetto → "View Logs"
3. Cerca errori rossi
4. Verifica variabili ambiente corrette
```

### "CORS error nel browser"
```
1. Verifica CORS_ORIGIN su Railway
2. Deve essere: https://TUO-USERNAME.github.io
3. Senza slash finale!
4. Redeploy backend
```

### "Cannot connect to database"
```
1. Verifica MONGODB_URI su Railway
2. Controlla password corretta
3. Verifica Network Access su MongoDB Atlas (0.0.0.0/0)
```

### "Frontend non carica"
```
1. Verifica GitHub Pages attivo
2. Controlla branch gh-pages esista
3. Aspetta 2-3 minuti dopo deploy
4. Prova in incognito (cache browser)
```

---

## 📊 Monitoraggio

### Railway (Backend)
```
railway.app → Progetto → View Logs
- Vedi richieste in tempo reale
- Errori evidenziati in rosso
- CPU e memoria usage
```

### MongoDB Atlas (Database)
```
mongodb.com/cloud/atlas → Cluster → Metrics
- Storage usato
- Connessioni attive
- Query performance
```

### GitHub Pages (Frontend)
```
github.com/TUO-USERNAME/fifa-2026-predictions → Settings → Pages
- Build status
- Deploy history
- Errori build
```

---

## 💰 Limiti Gratuiti

| Servizio | Limite | Sufficiente per |
|----------|--------|-----------------|
| MongoDB Atlas | 512MB storage | ~100-200 utenti |
| Railway | 500h/mese | ~50-100 utenti attivi |
| GitHub Pages | 100GB/mese | Illimitato utenti |

**Nota**: Railway dorme dopo 5 min inattività (risveglio ~10 sec)

---

## 🎉 Fatto!

Ora hai:
- ✅ Frontend su GitHub Pages
- ✅ Backend su Railway
- ✅ Database su MongoDB Atlas
- ✅ Tutto gratis e 24/7 online
- ✅ Nessuna dipendenza dal tuo laptop

**URL App**: https://TUO-USERNAME.github.io/fifa-2026-predictions/

---

## 📚 Prossimi Passi

1. Leggi `DEPLOYMENT_GUIDE.md` per dettagli completi
2. Leggi `ARCHITECTURE.md` per capire come funziona
3. Leggi `IMPLEMENTATION_PLAN.md` per vedere cosa manca
4. Inizia a sviluppare le funzionalità mancanti!

---

**Hai domande? Controlla `DEPLOYMENT_GUIDE.md` per troubleshooting dettagliato! 🚀**