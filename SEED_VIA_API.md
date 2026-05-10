# 🌱 Seed Database via API (Render Free Tier)

## Problema
Il piano free di Render.com non permette l'accesso alla Shell, quindi non è possibile eseguire `node scripts/seedDatabase.js` direttamente.

## Soluzione
Abbiamo creato un endpoint API `/api/seed/database` che esegue il seed del database tramite una chiamata HTTP protetta da chiave segreta.

## 📋 Setup

### 1. Configura SEED_SECRET su Render

1. Vai su https://dashboard.render.com
2. Seleziona il servizio **fifa-2026-backend**
3. Vai su **Environment**
4. Aggiungi una nuova variabile:
   - **Key**: `SEED_SECRET`
   - **Value**: Una stringa segreta casuale (es: `my-super-secret-seed-key-2026`)
5. Clicca **Save Changes**
6. Render farà automaticamente il redeploy

### 2. Esegui il Seed

Dopo che il deploy è completato, esegui una delle seguenti opzioni:

#### Opzione A: Via curl (Terminale)

```bash
curl -X POST https://fifa-2026-backend.onrender.com/api/seed/database \
  -H "Content-Type: application/json" \
  -H "X-Seed-Secret: my-super-secret-seed-key-2026"
```

#### Opzione B: Via curl con secret nel body

```bash
curl -X POST https://fifa-2026-backend.onrender.com/api/seed/database \
  -H "Content-Type: application/json" \
  -d '{"secret":"my-super-secret-seed-key-2026"}'
```

#### Opzione C: Via Browser (Postman/Insomnia)

1. Apri Postman o Insomnia
2. Crea una nuova richiesta POST
3. URL: `https://fifa-2026-backend.onrender.com/api/seed/database`
4. Headers:
   - `Content-Type`: `application/json`
   - `X-Seed-Secret`: `my-super-secret-seed-key-2026`
5. Invia la richiesta

### 3. Verifica il Risultato

**Risposta di successo:**
```json
{
  "success": true,
  "message": "Database seeded successfully via script execution",
  "data": {
    "matches": 104,
    "settings": 1,
    "output": "🌱 Starting database seeding...\n✅ Created 104 matches..."
  }
}
```

**Errore (chiave sbagliata):**
```json
{
  "success": false,
  "message": "Unauthorized: Invalid or missing seed secret. Provide X-Seed-Secret header or secret in body."
}
```

## 🔍 Verifica Stato Database

Puoi controllare se il database è già popolato senza fornire la chiave segreta:

```bash
curl https://fifa-2026-backend.onrender.com/api/seed/status
```

**Risposta:**
```json
{
  "success": true,
  "data": {
    "isSeeded": true,
    "matches": {
      "total": 104,
      "group": 72,
      "knockout": 32
    },
    "settings": 1,
    "expectedMatches": 104
  }
}
```

## ⚠️ Note Importanti

1. **Sicurezza**: L'endpoint è protetto da `SEED_SECRET`. Non condividere questa chiave pubblicamente.

2. **Idempotenza**: Puoi eseguire il seed più volte. Lo script cancella i dati esistenti prima di inserire i nuovi.

3. **Timeout**: Il primo seed potrebbe richiedere 30-60 secondi. Render potrebbe andare in timeout se il servizio è "dormiente" (cold start). In questo caso, riprova dopo qualche secondo.

4. **Dati Utente**: Il seed tocca solo le collections `matches` e `settings`. I pronostici degli utenti (`predictions`) e gli utenti (`users`) non vengono toccati.

5. **Rimozione Endpoint**: Dopo aver eseguito il seed con successo, puoi rimuovere l'endpoint `/api/seed` dal codice per maggiore sicurezza (opzionale).

## 🐛 Troubleshooting

### Errore 403 Unauthorized
- Verifica che `SEED_SECRET` sia configurato correttamente su Render
- Controlla che la chiave nell'header o nel body corrisponda esattamente

### Errore 500 Internal Server Error
- Controlla i log su Render Dashboard
- Verifica che `MONGODB_URI` sia configurato correttamente
- Assicurati che MongoDB Atlas permetta connessioni da Render (IP whitelist: 0.0.0.0/0)

### Timeout
- Il servizio Render potrebbe essere in "sleep mode" (cold start)
- Riprova dopo 10-15 secondi
- Considera di fare un "ping" all'endpoint `/health` prima del seed

## 📊 Dati Creati

Dopo il seed avrai:
- **104 partite** con calendario ufficiale FIFA 2026
  - 72 partite fase a gironi (11-28 giugno)
  - 32 partite fase finale (28 giugno - 19 luglio)
- **1 documento settings** con configurazione torneo e regole punteggio

## 🔄 Re-seed

Se devi ripopolare il database (es. dopo modifiche allo script):
1. Esegui nuovamente la chiamata POST all'endpoint `/api/seed/database`
2. Lo script cancellerà automaticamente i dati esistenti
3. Inserirà i nuovi dati aggiornati

---

**Creato**: 10 Maggio 2026  
**Versione**: 1.0  
**Commit**: [in corso]