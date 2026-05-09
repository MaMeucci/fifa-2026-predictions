# 🚀 Guida al Deployment Completo

## Stato Attuale

✅ **Backend**: Deployato su Render.com  
✅ **Frontend**: Pronto per il deploy su GitHub Pages  
✅ **Database**: MongoDB Atlas configurato  
✅ **Codice**: Committato su GitHub  

## 📋 Checklist Pre-Deployment

### 1. Configurazione Backend su Render.com

Vai su: https://dashboard.render.com/project/prj-d7v4hanavr4c739g9i60

Verifica che tutte le variabili d'ambiente siano configurate:

- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `10000`
- [ ] `MONGODB_URI` = `mongodb+srv://fifa2026admin:c3ej4h0QWaMGjIbL@fifa2026-cluster.cpk7ux1.mongodb.net/fifa2026?retryWrites=true&w=majority&appName=fifa2026-cluster`
- [ ] `JWT_SECRET` = [genera una stringa casuale sicura]
- [ ] `JWT_EXPIRE` = `7d`
- [ ] `CORS_ORIGIN` = `https://mameucci.github.io`

**Come generare JWT_SECRET:**
```bash
openssl rand -base64 32
```

### 2. Verifica Backend Funzionante

Testa l'health endpoint:
```bash
curl https://fifa-2026-predictions-backend.onrender.com/health
```

Risposta attesa:
```json
{
  "status": "OK",
  "timestamp": "2026-05-09T21:05:30.362Z",
  "uptime": 4993.15265716,
  "environment": "production"
}
```

### 3. Deploy Frontend su GitHub Pages

#### Opzione A: Deploy Automatico con GitHub Actions (Consigliato)

Il workflow è già configurato in `.github/workflows/deploy.yml`. Ogni push su `main` triggera automaticamente il deploy.

**Passi:**
1. Assicurati che GitHub Pages sia abilitato nel repository
2. Vai su: Settings → Pages
3. Source: **GitHub Actions**
4. Il deploy partirà automaticamente al prossimo push

#### Opzione B: Deploy Manuale

```bash
cd fifa-2026-predictions/frontend
npm run build
npm run deploy
```

### 4. Verifica Deployment Frontend

Dopo il deploy, il sito sarà disponibile su:
**https://mameucci.github.io/fifa-2026-predictions/**

Controlla:
- [ ] La pagina si carica correttamente
- [ ] Il design FIFA 2026 è applicato (colori turchese e magenta)
- [ ] Non ci sono errori nella console del browser

### 5. Test Connessione Frontend-Backend

#### Test 1: Registrazione Utente
1. Vai su https://mameucci.github.io/fifa-2026-predictions/
2. Clicca su "Registrati"
3. Compila il form con:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `Test123!`
4. Clicca su "Registrati"
5. Verifica che la registrazione vada a buon fine

#### Test 2: Login
1. Usa le credenziali create sopra
2. Verifica che il login funzioni
3. Controlla che vedi la dashboard

#### Test 3: Salvataggio Pronostici
1. Vai su "Gironi"
2. Inserisci alcuni pronostici
3. Clicca su "Salva Pronostici"
4. Verifica che vengano salvati correttamente

#### Test 4: Leaderboard
1. Vai su "Classifica"
2. Verifica che vedi la tua posizione
3. Controlla che i punteggi siano calcolati correttamente

## 🔧 Troubleshooting

### Errore CORS

**Sintomo:** Errore nella console del browser tipo:
```
Access to fetch at 'https://fifa-2026-predictions-backend.onrender.com/api/auth/register'
from origin 'https://mameucci.github.io' has been blocked by CORS policy
```

**Soluzione:**
1. Vai su Render Dashboard → Environment
2. Verifica che `CORS_ORIGIN` sia `https://mameucci.github.io`
3. Salva e attendi il redeploy (2-3 minuti)
4. Svuota la cache del browser (Cmd+Shift+R)

### Backend Non Risponde

**Sintomo:** Errori di rete o timeout

**Soluzione:**
1. Controlla i log su Render: Dashboard → Service → Logs
2. Verifica che il servizio sia "Live" (non "Suspended")
3. Controlla che MongoDB Atlas sia raggiungibile:
   - Vai su MongoDB Atlas → Network Access
   - Verifica che ci sia `0.0.0.0/0` nella whitelist

### Errori di Autenticazione

**Sintomo:** Login fallisce o token non valido

**Soluzione:**
1. Verifica che `JWT_SECRET` sia configurato su Render
2. Controlla che `MONGODB_URI` sia corretto
3. Svuota localStorage del browser:
   ```javascript
   // Nella console del browser
   localStorage.clear()
   ```

### Frontend Non Si Aggiorna

**Sintomo:** Modifiche non visibili dopo il deploy

**Soluzione:**
1. Svuota la cache del browser (Cmd+Shift+R o Ctrl+Shift+R)
2. Verifica che il workflow GitHub Actions sia completato con successo
3. Controlla che il file `.env.production` sia corretto

## 📊 Monitoraggio

### Backend (Render.com)
- **Dashboard**: https://dashboard.render.com/project/prj-d7v4hanavr4c739g9i60
- **Logs**: Dashboard → Service → Logs
- **Metrics**: Dashboard → Service → Metrics

### Frontend (GitHub Pages)
- **Repository**: https://github.com/MaMeucci/fifa-2026-predictions
- **Actions**: Repository → Actions
- **Settings**: Repository → Settings → Pages

### Database (MongoDB Atlas)
- **Dashboard**: https://cloud.mongodb.com/
- **Cluster**: fifa2026-cluster
- **Database**: fifa2026

## 🎯 Prossimi Passi

Dopo aver verificato che tutto funzioni:

1. **Popolare il Database**
   - Creare le partite del Mondiale 2026
   - Configurare i gruppi "Capiscione"
   - Impostare le date di lock

2. **Testing Completo**
   - Testare tutti i flussi utente
   - Verificare il calcolo dei punteggi
   - Testare la leaderboard con più utenti

3. **Documentazione Utente**
   - Creare una guida per gli utenti
   - Spiegare il sistema di punteggi
   - Documentare le regole del gioco

4. **Ottimizzazioni**
   - Aggiungere loading states
   - Migliorare error handling
   - Implementare notifiche

## 📞 Supporto

Se incontri problemi:
1. Controlla i log su Render.com
2. Verifica la console del browser
3. Controlla che tutte le variabili d'ambiente siano configurate
4. Consulta la sezione Troubleshooting sopra

---

**Ultimo aggiornamento:** 9 Maggio 2026  
**Versione:** 1.0.0