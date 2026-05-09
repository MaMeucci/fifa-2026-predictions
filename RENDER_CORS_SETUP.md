# Configurazione CORS su Render.com

## Problema
Il backend su Render.com deve permettere richieste dal frontend ospitato su GitHub Pages.

## Soluzione

### 1. Accedi alla Dashboard di Render
Vai su: https://dashboard.render.com/project/prj-d7v4hanavr4c739g9i60

### 2. Seleziona il Servizio Backend
Clicca sul servizio `fifa-2026-predictions-backend`

### 3. Vai su Environment
Nel menu laterale, clicca su **Environment**

### 4. Aggiungi la Variabile CORS_ORIGIN
Clicca su **Add Environment Variable** e aggiungi:

**Key:** `CORS_ORIGIN`
**Value:** `https://mameucci.github.io`

> **Nota:** Questo è l'URL del tuo frontend su GitHub Pages.

### 5. Salva e Redeploy
1. Clicca su **Save Changes**
2. Render farà automaticamente il redeploy del servizio
3. Attendi qualche minuto che il servizio si riavvii

### 6. Verifica
Dopo il redeploy, testa che il backend accetti richieste dal frontend:

```bash
curl -H "Origin: https://mameucci.github.io" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://fifa-2026-predictions-backend.onrender.com/api/auth/register
```

Dovresti vedere negli header della risposta:
```
Access-Control-Allow-Origin: https://mameucci.github.io
Access-Control-Allow-Credentials: true
```

## Variabili d'Ambiente Complete su Render

Assicurati di avere tutte queste variabili configurate:

| Key | Value | Descrizione |
|-----|-------|-------------|
| `NODE_ENV` | `production` | Ambiente di esecuzione |
| `PORT` | `10000` | Porta del server (Render usa 10000) |
| `MONGODB_URI` | `mongodb+srv://fifa2026admin:...` | Connection string MongoDB Atlas |
| `JWT_SECRET` | `[genera-una-stringa-casuale-sicura]` | Secret per JWT tokens |
| `JWT_EXPIRE` | `7d` | Durata token (7 giorni) |
| `CORS_ORIGIN` | `https://mameucci.github.io` | URL frontend per CORS |

## Generare JWT_SECRET Sicuro

Se non hai ancora configurato `JWT_SECRET`, genera una stringa casuale sicura:

```bash
# Su macOS/Linux
openssl rand -base64 32

# Oppure in Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copia l'output e usalo come valore per `JWT_SECRET` su Render.

## Troubleshooting

### Errore CORS nel Browser
Se vedi errori CORS nella console del browser:
1. Verifica che `CORS_ORIGIN` sia configurato correttamente
2. Controlla che il servizio sia stato riavviato dopo la modifica
3. Svuota la cache del browser (Cmd+Shift+R su Mac, Ctrl+Shift+R su Windows)

### Backend Non Risponde
1. Controlla i log su Render: Dashboard → Service → Logs
2. Verifica che tutte le variabili d'ambiente siano configurate
3. Controlla che MongoDB Atlas sia raggiungibile (whitelist IP 0.0.0.0/0)

### Errore di Autenticazione
1. Verifica che `JWT_SECRET` sia configurato
2. Controlla che `MONGODB_URI` sia corretto
3. Verifica i log per errori di connessione al database

## Prossimi Passi

Dopo aver configurato CORS:
1. Redeploy del frontend con il nuovo URL backend
2. Test di registrazione e login
3. Test di salvataggio pronostici
4. Verifica della leaderboard

---

**Nota:** Render.com fa automaticamente il redeploy quando modifichi le variabili d'ambiente. Il processo richiede circa 2-3 minuti.