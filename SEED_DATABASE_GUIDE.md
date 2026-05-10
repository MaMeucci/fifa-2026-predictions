# 🌱 Guida Seed Database - FIFA 2026 Predictions

## Panoramica
Questa guida spiega come popolare il database MongoDB Atlas con il calendario ufficiale FIFA 2026 (103 partite) utilizzando Render Shell.

## ✅ Prerequisiti
- Backend deployato su Render.com
- MongoDB Atlas configurato e connesso
- Variabile d'ambiente `MONGODB_URI` configurata su Render

## 📋 Procedura

### 1. Accedi a Render Dashboard
1. Vai su [https://dashboard.render.com](https://dashboard.render.com)
2. Seleziona il servizio **fifa-2026-backend**

### 2. Apri Render Shell
1. Nel menu laterale, clicca su **Shell**
2. Attendi che la shell si connetta al container

### 3. Esegui lo Script di Seed
Nella shell di Render, esegui:

```bash
node scripts/seedDatabase.js
```

### 4. Verifica l'Output
Dovresti vedere un output simile a:

```
🌱 Starting database seeding with OFFICIAL FIFA 2026 CALENDAR...
✅ Connected to MongoDB
✅ Cleared existing data
✅ Settings created
✅ Created 103 matches with OFFICIAL FIFA schedule
   - Group stage: 72 matches (June 11-28)
   - Knockout stage: 31 matches (June 28 - July 19)

🎉 Database seeding completed successfully!

📊 FIFA World Cup 2026 - Official Schedule:
   - Opening Match: June 11, 2026 - Mexico vs South Africa (Estadio Azteca)
   - Final: July 19, 2026 - MetLife Stadium (New York/New Jersey)
   - Total matches: 103
   - Groups: 12 (A-L)
   - Teams: 48 nations
   - Venues: 16 stadiums
   - Capiscione groups configured:
     • Top: Brazil, France, England, Spain, Argentina
     • Outsider: Morocco, Japan, USA, Croatia, Switzerland
     • Materasso: Qatar, Haiti, Curaçao, Cabo Verde, New Zealand

✅ Database connection closed
```

## 🔍 Verifica Dati

### Opzione 1: MongoDB Atlas UI
1. Accedi a [MongoDB Atlas](https://cloud.mongodb.com)
2. Vai al tuo cluster
3. Clicca su **Browse Collections**
4. Verifica le collections:
   - `matches`: dovrebbe contenere 103 documenti
   - `settings`: dovrebbe contenere 1 documento

### Opzione 2: API Endpoint
Testa l'endpoint delle partite:

```bash
curl https://fifa-2026-backend.onrender.com/api/matches
```

Dovresti ricevere un array con 103 partite.

### Opzione 3: Frontend
1. Vai su [https://mameucci.github.io/fifa-2026-predictions](https://mameucci.github.io/fifa-2026-predictions)
2. Registrati/Login
3. Vai alla sezione "Pronostici Gironi"
4. Verifica che le partite siano visualizzate con date e stadi corretti

## 📊 Struttura Dati Creati

### Matches (103 documenti)
- **72 partite fase a gironi** (11-28 giugno 2026)
  - 12 gruppi (A-L)
  - 6 partite per gruppo
  - Date, orari e stadi ufficiali FIFA

- **31 partite fase finale** (28 giugno - 19 luglio 2026)
  - 16 ottavi di finale
  - 8 quarti di finale
  - 4 semifinali
  - 1 finale 3° posto
  - 1 finale

### Settings (1 documento)
- Configurazione torneo
- Regole punteggio
- Gruppi "Angolo del Capiscione"
- Feature flags

## 🔄 Re-seed del Database

Se devi ripopolare il database (es. dopo modifiche allo script):

1. Lo script cancella automaticamente i dati esistenti
2. Esegui nuovamente: `node scripts/seedDatabase.js`
3. Verifica i nuovi dati

## ⚠️ Note Importanti

- **Backup**: Lo script cancella tutti i dati esistenti prima di inserire i nuovi
- **Pronostici utenti**: Se ci sono già pronostici salvati, verranno mantenuti (lo script tocca solo `matches` e `settings`)
- **Timezone**: Tutte le date sono in formato UTC (ISO 8601)
- **Stadi**: Utilizzati i 16 venue ufficiali FIFA 2026

## 🐛 Troubleshooting

### Errore di connessione MongoDB
```
Error: connect ECONNREFUSED
```
**Soluzione**: Verifica che `MONGODB_URI` sia configurato correttamente nelle variabili d'ambiente di Render.

### Script non trovato
```
Error: Cannot find module './scripts/seedDatabase.js'
```
**Soluzione**: Assicurati di essere nella directory root del progetto backend.

### Timeout
```
Error: Operation timed out
```
**Soluzione**: Verifica che MongoDB Atlas permetta connessioni da Render (IP whitelist: 0.0.0.0/0).

## 📞 Supporto

Per problemi o domande:
1. Controlla i log su Render Dashboard
2. Verifica MongoDB Atlas logs
3. Testa gli endpoint API manualmente

---

**Ultimo aggiornamento**: 10 Maggio 2026  
**Versione script**: 2.0 (Calendario ufficiale FIFA 2026)  
**Commit**: 92efd14