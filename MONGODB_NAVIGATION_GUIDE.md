# 🧭 MongoDB Atlas - Guida Navigazione Interfaccia

## Come Trovare "Network Access"

### Metodo 1: Menu Laterale Sinistro (RACCOMANDATO)

Quando sei loggato su MongoDB Atlas (https://cloud.mongodb.com), vedrai un menu laterale sulla sinistra:

```
┌─────────────────────────────────┐
│  MongoDB Atlas                  │
├─────────────────────────────────┤
│                                 │
│  🏠 Overview                    │
│                                 │
│  DEPLOYMENT                     │
│  📊 Database                    │  ← Qui vedi i tuoi cluster
│  📈 Charts                      │
│  🔍 Data Explorer              │
│                                 │
│  SECURITY                       │
│  👤 Database Access            │  ← Gestione utenti database
│  🌐 Network Access             │  ← CLICCA QUI!
│  🔐 Encryption at Rest         │
│                                 │
│  DATA SERVICES                  │
│  🔄 Triggers                   │
│  📡 App Services               │
│                                 │
│  SETTINGS                       │
│  ⚙️  Project Settings          │
│  👥 Access Manager             │
│                                 │
└─────────────────────────────────┘
```

**📍 Posizione**: Menu laterale sinistro → Sezione "SECURITY" → **Network Access**

---

### Metodo 2: Dalla Dashboard del Cluster

Se sei nella schermata del tuo cluster:

```
1. Vai su "Database" nel menu laterale
2. Vedrai il tuo cluster "fifa2026-cluster"
3. Guarda il menu laterale sinistro
4. Sotto "SECURITY" trovi "Network Access"
```

---

## 🎯 Cosa Fare su "Network Access"

### Schermata Network Access

Quando clicchi su "Network Access", vedrai:

```
┌──────────────────────────────────────────────────────────┐
│  🌐 Network Access                                       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  IP Access List                                          │
│                                                          │
│  [+ ADD IP ADDRESS]  [+ ADD CURRENT IP ADDRESS]         │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ IP Address        │ Comment      │ Status │ Actions││
│  ├────────────────────────────────────────────────────┤ │
│  │ (vuoto se nuovo)                                   │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## ✅ Configurazione Corretta per Railway/Render

### PASSO 1: Clicca "+ ADD IP ADDRESS"

```
┌──────────────────────────────────────────────┐
│  Add IP Access List Entry                   │
├──────────────────────────────────────────────┤
│                                              │
│  Access List Entry                           │
│                                              │
│  ○ Add Current IP Address                   │
│     Your current IP: 93.45.123.45           │
│                                              │
│  ● Allow Access from Anywhere  ← SCEGLI!    │
│     0.0.0.0/0 (includes your current IP)    │
│                                              │
│  ○ Add IP Address                           │
│     [________________]                       │
│                                              │
│  Comment (optional)                          │
│  [Railway/Render access_______________]     │
│                                              │
│  [Cancel]              [Confirm]             │
│                                              │
└──────────────────────────────────────────────┘
```

### PASSO 2: Seleziona "Allow Access from Anywhere"

**✅ Seleziona**: "Allow Access from Anywhere"
- Questo aggiunge automaticamente `0.0.0.0/0`
- Necessario perché Railway/Render hanno IP dinamici

**📝 Comment (opzionale)**: Scrivi "Railway/Render access" per ricordare

### PASSO 3: Clicca "Confirm"

Dopo aver cliccato Confirm, vedrai:

```
┌────────────────────────────────────────────────────────┐
│  IP Access List                                        │
├────────────────────────────────────────────────────────┤
│                                                        │
│  IP Address    │ Comment              │ Status │ ...  │
│  ─────────────────────────────────────────────────────│
│  0.0.0.0/0     │ Railway/Render access│ Active │ ...  │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**✅ Status deve essere "Active"** (potrebbe richiedere 1-2 minuti)

---

## 🔍 Verifica Configurazione

### Checklist Network Access

- [ ] Sono su MongoDB Atlas (cloud.mongodb.com)
- [ ] Ho cliccato "Network Access" nel menu laterale sinistro
- [ ] Ho cliccato "+ ADD IP ADDRESS"
- [ ] Ho selezionato "Allow Access from Anywhere"
- [ ] Ho cliccato "Confirm"
- [ ] Vedo `0.0.0.0/0` nella lista con Status "Active"

---

## 🎨 Interfaccia Completa MongoDB Atlas

### Vista Generale

```
┌─────────────────────────────────────────────────────────────────┐
│  MongoDB Atlas                                    [👤 Account ▼] │
├──────────┬──────────────────────────────────────────────────────┤
│          │                                                      │
│  🏠 Over │  🏆 fifa2026-cluster                                │
│  view    │  ┌──────────────────────────────────────────────┐  │
│          │  │  M0 Sandbox • AWS • eu-west-1                │  │
│  DEPLOY  │  │  [Connect] [Browse Collections] [Metrics]    │  │
│  📊 Data │  └──────────────────────────────────────────────┘  │
│  base    │                                                      │
│          │  Quick Actions:                                      │
│  SECURIT │  • Load Sample Data                                 │
│  Y       │  • Terminate Cluster                                │
│  👤 Data │                                                      │
│  base    │                                                      │
│  Access  │                                                      │
│  🌐 Netw │                                                      │
│  ork     │                                                      │
│  Access  │                                                      │
│          │                                                      │
└──────────┴──────────────────────────────────────────────────────┘
```

---

## 🆘 Problemi Comuni

### Non Vedo "Network Access"

**Problema**: Il menu laterale non mostra "Network Access"

**Soluzioni**:
1. **Verifica di essere loggato**: Vai su https://cloud.mongodb.com
2. **Seleziona il progetto corretto**: In alto a sinistra, verifica il nome del progetto
3. **Espandi il menu**: Se il menu è collassato, clicca sull'icona hamburger (☰)
4. **Scorri verso il basso**: "Network Access" è sotto "Database Access"

### "Network Access" è Grigio/Disabilitato

**Problema**: Non posso cliccare su "Network Access"

**Soluzioni**:
1. **Verifica permessi**: Devi essere Owner o Project Owner del progetto
2. **Attendi creazione cluster**: Se hai appena creato il cluster, attendi 2-3 minuti
3. **Ricarica pagina**: Premi F5 o Cmd+R

### Non Vedo "Allow Access from Anywhere"

**Problema**: L'opzione non appare nel popup

**Soluzioni**:
1. **Verifica versione interfaccia**: MongoDB Atlas aggiorna l'interfaccia
2. **Alternativa**: Seleziona "Add IP Address" e inserisci manualmente:
   ```
   IP Address: 0.0.0.0/0
   Comment: Railway/Render access
   ```

---

## 📱 Interfaccia Mobile

Se usi MongoDB Atlas da smartphone/tablet:

```
1. Menu hamburger (☰) in alto a sinistra
2. Scorri fino a "SECURITY"
3. Tap su "Network Access"
4. Tap su "+" (Add IP Address)
5. Seleziona "Allow Access from Anywhere"
6. Tap "Confirm"
```

---

## 🎯 Dopo Network Access

Una volta configurato Network Access, hai completato:

✅ **PASSO 1.4** della guida QUICK_START_IT.md

**Prossimo passo**: PASSO 1.5 - Ottieni Connection String

```
1. Torna su "Database" nel menu laterale
2. Clicca "Connect" sul cluster
3. Scegli "Drivers"
4. Copia la connection string
```

Vedi **MONGODB_SETUP_SCREENSHOTS.md** per dettagli!

---

## 🔗 Link Utili

- **MongoDB Atlas Dashboard**: https://cloud.mongodb.com
- **Documentazione Network Access**: https://docs.atlas.mongodb.com/security/ip-access-list/
- **Video Tutorial**: https://www.youtube.com/watch?v=rPqRyYJmx2g

---

## 📞 Hai Ancora Dubbi?

Se non riesci a trovare "Network Access":

1. **Fai uno screenshot** della tua schermata MongoDB Atlas
2. **Verifica** di essere su https://cloud.mongodb.com
3. **Controlla** di aver selezionato il progetto corretto (in alto a sinistra)
4. **Cerca** nel menu laterale sinistro sotto "SECURITY"

**Il menu "Network Access" è SEMPRE presente in tutti i progetti MongoDB Atlas!** 🎯