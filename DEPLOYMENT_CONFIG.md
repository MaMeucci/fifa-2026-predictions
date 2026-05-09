# 🚀 Configurazione Deployment FIFA 2026 Predictions

## 📋 Riepilogo Configurazione

### Frontend (GitHub Pages)
- **URL**: `https://mameucci.github.io/fifa-2026-predictions/`
- **Hosting**: GitHub Pages (gratuito)
- **Branch**: `gh-pages` (automatico con gh-pages package)

### Backend (Render.com)
- **URL**: `https://fifa-2026-predictions-backend.onrender.com`
- **Hosting**: Render.com (free tier)
- **Endpoint API**: `/api`

### Database
- **Provider**: MongoDB Atlas
- **Tier**: Free (512MB)

---

## ⚙️ Variabili d'Ambiente

### Frontend (.env.production)
```env
VITE_API_URL=https://fifa-2026-predictions-backend.onrender.com/api
VITE_APP_NAME=FIFA 2026 Predictions
VITE_TOURNAMENT_START=2026-06-11T00:00:00Z
VITE_PREDICTIONS_LOCK_DATE=2026-06-10T23:59:59Z
```

### Backend (Render.com Environment Variables)
```env
# CORS - IMPORTANTE!
CORS_ORIGIN=https://mameucci.github.io

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fifa2026?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-too
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Node Environment
NODE_ENV=production

# Server
PORT=10000
```

---

## 🔧 Configurazione CORS Corretta

### ⚠️ Problema Comune
Il backend deve accettare richieste dal dominio corretto del frontend.

**SBAGLIATO** ❌:
```
CORS_ORIGIN=https://mmeucci.github.io
```

**CORRETTO** ✅:
```
CORS_ORIGIN=https://mameucci.github.io
```

**Per accettare entrambi** (opzionale):
```
CORS_ORIGIN=https://mameucci.github.io,https://mmeucci.github.io
```

### Come Modificare su Render.com
1. Vai su [Render Dashboard](https://dashboard.render.com/)
2. Seleziona il servizio `fifa-2026-predictions-backend`
3. Vai su **Environment** nel menu laterale
4. Trova la variabile `CORS_ORIGIN`
5. Clicca **Edit** e modifica il valore
6. Clicca **Save Changes**
7. Render farà automaticamente il redeploy (1-2 minuti)

---

## 🧪 Test degli Endpoint

### Test Backend Funzionante
```bash
# Root endpoint
curl https://fifa-2026-predictions-backend.onrender.com/

# Health check
curl https://fifa-2026-predictions-backend.onrender.com/health

# Test registrazione (deve restituire errori di validazione)
curl -X POST https://fifa-2026-predictions-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"test":"data"}'
```

### Risposta Attesa
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [...]
}
```

---

## 📦 Deploy Frontend

### Comandi
```bash
cd fifa-2026-predictions/frontend

# Build
npm run build

# Deploy su GitHub Pages
npm run deploy
```

### Verifica Deploy
1. Vai su `https://mameucci.github.io/fifa-2026-predictions/`
2. Apri Developer Tools (F12)
3. Vai su **Network** tab
4. Prova a registrarti
5. Verifica le richieste API

---

## 🐛 Troubleshooting

### Errore: "Errore di connessione"
**Causa**: Backend non raggiungibile o CORS non configurato
**Soluzione**: 
1. Verifica che il backend sia online: `curl https://fifa-2026-predictions-backend.onrender.com/`
2. Controlla CORS_ORIGIN su Render
3. Aspetta che Render finisca il redeploy (può richiedere 1-2 minuti)

### Errore: CORS Policy
**Causa**: CORS_ORIGIN non corrisponde al dominio frontend
**Soluzione**: Aggiorna `CORS_ORIGIN` su Render con il dominio corretto

### Backend in Sleep (Free Tier)
**Causa**: Render free tier mette in sleep i servizi dopo 15 minuti di inattività
**Soluzione**: 
- La prima richiesta dopo il sleep può richiedere 30-60 secondi
- Considera un piano a pagamento per produzione

### Errori di Validazione
**Causa**: Dati inseriti non rispettano le regole
**Soluzione**: Verifica i requisiti:
- Username: 3-30 caratteri, solo lettere/numeri/underscore
- Email: formato valido
- Password: min 8 caratteri, 1 maiuscola, 1 minuscola, 1 numero

---

## 📝 Checklist Pre-Deploy

### Frontend
- [ ] `.env.production` ha l'URL backend corretto
- [ ] `vite.config.js` ha `base: '/fifa-2026-predictions/'`
- [ ] `App.jsx` ha `basename="/fifa-2026-predictions"`
- [ ] `404.html` presente in `public/`
- [ ] `index.html` ha lo script di redirect

### Backend
- [ ] `CORS_ORIGIN` configurato correttamente su Render
- [ ] `MONGODB_URI` configurato su Render
- [ ] `JWT_SECRET` e `JWT_REFRESH_SECRET` configurati
- [ ] Backend risponde su `/` e `/api/auth/register`

### Database
- [ ] MongoDB Atlas cluster attivo
- [ ] IP whitelist configurato (0.0.0.0/0 per Render)
- [ ] Database user creato con permessi corretti

---

## 🎯 URL Finali

- **Frontend**: https://mameucci.github.io/fifa-2026-predictions/
- **Backend API**: https://fifa-2026-predictions-backend.onrender.com/api
- **Backend Root**: https://fifa-2026-predictions-backend.onrender.com/
- **MongoDB**: mongodb+srv://cluster.mongodb.net/fifa2026

---

## 📞 Supporto

Se riscontri problemi:
1. Controlla i log su Render Dashboard
2. Verifica le variabili d'ambiente
3. Testa gli endpoint con curl
4. Controlla la console del browser (F12)

---

*Documento creato: 2026-05-08*
*Ultima modifica: 2026-05-08*