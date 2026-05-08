# 🔧 Railway Deployment - Troubleshooting Completo

## 🐛 Problema: "Application not found" (404)

Il server si avvia correttamente nei log ma Railway risponde con 404.

### Causa Probabile

Railway non riesce a fare il routing verso l'applicazione. Possibili cause:

1. **Healthcheck fallisce** - Railway non riceve risposta dal server
2. **Porta non esposta correttamente** - Railway non sa su quale porta ascolta l'app
3. **Server si chiude dopo l'avvio** - Il processo termina immediatamente

## ✅ Soluzioni da Provare

### Soluzione 1: Verifica Configurazione Railway

**Vai su Railway → Settings del servizio e verifica:**

1. **Root Directory**: `/backend` ✅
2. **Start Command**: `npm start` o vuoto (usa package.json)
3. **Build Command**: vuoto (usa npm install automatico)
4. **Watch Paths**: vuoto o `/backend/**`

### Soluzione 2: Aggiungi railway.json

Crea un file di configurazione Railway nella root del backend:

```bash
cd backend
cat > railway.json << 'EOF'
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 300,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
EOF
```

### Soluzione 3: Aggiungi Procfile

Railway supporta anche Procfile (come Heroku):

```bash
cd backend
echo "web: npm start" > Procfile
```

### Soluzione 4: Verifica package.json

Assicurati che `backend/package.json` abbia:

```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### Soluzione 5: Aggiungi Logging Dettagliato

Modifica `backend/src/server.js` per aggiungere più log:

```javascript
const PORT = process.env.PORT || 3000;

console.log('🚀 Starting server...');
console.log('📍 PORT from env:', process.env.PORT);
console.log('📍 Using PORT:', PORT);

connectDB()
  .then(() => {
    console.log('✅ Database connected successfully');
    
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log('✅ Server is listening on port', PORT);
      console.log('✅ Server address:', server.address());
      // ... resto del banner
    });
    
    // Log ogni richiesta
    app.use((req, res, next) => {
      console.log(`📨 ${req.method} ${req.path}`);
      next();
    });
  })
  .catch((error) => {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  });
```

### Soluzione 6: Usa Railway CLI per Debug

Installa Railway CLI:

```bash
npm install -g @railway/cli
railway login
railway link
railway logs
```

Questo ti permette di vedere i log in tempo reale dal terminale.

### Soluzione 7: Prova Render.com

Se Railway continua a dare problemi, prova Render.com (alternativa gratuita):

1. Vai su https://render.com
2. "New +" → "Web Service"
3. Connetti GitHub repository
4. Configura:
   - **Name**: fifa-2026-predictions-backend
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Aggiungi variabili ambiente (come su Railway)

## 🔍 Debug Checklist

Prima di procedere, verifica:

- [ ] Il deployment su Railway è "ACTIVE" (verde)
- [ ] Nei log vedi "MongoDB Connected"
- [ ] Nei log vedi "Server running on port 8080"
- [ ] Non vedi "MongoDB disconnected" dopo
- [ ] Non vedi errori in rosso nei log
- [ ] La variabile `PORT` NON è impostata manualmente (Railway la imposta automaticamente)
- [ ] Tutte le altre variabili ambiente sono configurate (MONGODB_URI, JWT_SECRET, etc.)
- [ ] Il file `backend/package.json` ha lo script "start"
- [ ] Root Directory è impostato a `/backend`

## 🆘 Se Nulla Funziona

### Opzione A: Deploy Locale per Test

Testa il backend localmente per assicurarti che funzioni:

```bash
cd backend
npm install
cp .env.example .env
# Configura .env con MongoDB Atlas URI
npm start

# In un altro terminale
curl http://localhost:3000/health
```

Se funziona localmente ma non su Railway, il problema è nella configurazione Railway.

### Opzione B: Usa Docker

Crea `backend/Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
```

Railway rileverà automaticamente il Dockerfile e lo userà.

### Opzione C: Contatta Supporto Railway

Se hai provato tutto:

1. Vai su Railway Discord: https://discord.gg/railway
2. Canale #help
3. Spiega il problema con screenshot dei log

## 📊 Informazioni Utili per Debug

Quando chiedi aiuto, fornisci:

1. **Log completi** dall'inizio alla fine
2. **Screenshot** della configurazione Settings
3. **Screenshot** delle Variables
4. **Output** di `curl -v https://your-app.railway.app/health`
5. **Repository GitHub** (se pubblico)

## 🎯 Prossimi Passi

Una volta risolto il problema Railway, potrai:

1. ✅ Testare le API di autenticazione
2. ✅ Deployare il frontend su GitHub Pages
3. ✅ Collegare frontend e backend
4. ✅ Testare l'applicazione completa

---

**Nota**: Railway è in beta e può avere problemi. Se continua a non funzionare, Render.com è un'ottima alternativa gratuita e più stabile.