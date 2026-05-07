# 🗄️ MongoDB Atlas - Guida Visuale Setup

## Problema: "Choose a connection method"

Quando arrivi a questa schermata, segui questi passi:

### PASSO 1: Scegli il Metodo di Connessione

Nella schermata "Choose a connection method" vedrai 3 opzioni:

```
┌─────────────────────────────────────────────┐
│  Choose a connection method                 │
├─────────────────────────────────────────────┤
│                                             │
│  [Compass]                                  │
│  Connect using MongoDB Compass              │
│                                             │
│  [Drivers]  ← SCEGLI QUESTA!               │
│  Connect your application                   │
│                                             │
│  [MongoDB Shell]                            │
│  Connect using the MongoDB Shell            │
│                                             │
└─────────────────────────────────────────────┘
```

**✅ CLICCA SU "Drivers" (Connect your application)**

---

### PASSO 2: Seleziona Driver e Versione

Dopo aver cliccato "Drivers", vedrai:

```
┌─────────────────────────────────────────────┐
│  Connect your application                   │
├─────────────────────────────────────────────┤
│                                             │
│  1. Select your driver and version          │
│                                             │
│     Driver: [Node.js ▼]  ← Seleziona questo│
│     Version: [5.5 or later ▼]              │
│                                             │
│  2. Add your connection string into your    │
│     application code                        │
│                                             │
│     mongodb+srv://fifa2026admin:<password>@ │
│     fifa2026-cluster.xxxxx.mongodb.net/     │
│     ?retryWrites=true&w=majority            │
│                                             │
│     [Copy] ← Clicca qui per copiare        │
│                                             │
└─────────────────────────────────────────────┘
```

**Configurazione:**
- **Driver**: Seleziona "Node.js"
- **Version**: Seleziona "5.5 or later" (o la versione più recente)

---

### PASSO 3: Copia la Connection String

1. Clicca sul pulsante **[Copy]** per copiare la stringa di connessione
2. La stringa sarà simile a questa:

```
mongodb+srv://fifa2026admin:<password>@fifa2026-cluster.abc123.mongodb.net/?retryWrites=true&w=majority
```

---

### PASSO 4: Modifica la Connection String

Devi fare 2 modifiche alla stringa copiata:

#### 4.1 Sostituisci `<password>`

```
PRIMA:
mongodb+srv://fifa2026admin:<password>@fifa2026-cluster.abc123.mongodb.net/?retryWrites=true&w=majority

DOPO (esempio con password "MiaPassword123"):
mongodb+srv://fifa2026admin:MiaPassword123@fifa2026-cluster.abc123.mongodb.net/?retryWrites=true&w=majority
```

**⚠️ IMPORTANTE**: Usa la password che hai creato nello step "Database Access", NON la password del tuo account MongoDB Atlas!

#### 4.2 Aggiungi il Nome del Database

Aggiungi `/fifa2026` dopo `.mongodb.net` e prima di `?`:

```
PRIMA:
mongodb+srv://fifa2026admin:MiaPassword123@fifa2026-cluster.abc123.mongodb.net/?retryWrites=true&w=majority

DOPO:
mongodb+srv://fifa2026admin:MiaPassword123@fifa2026-cluster.abc123.mongodb.net/fifa2026?retryWrites=true&w=majority
                                                                                    ^^^^^^^^
                                                                                    Aggiunto qui!
```

---

### PASSO 5: Usa la Connection String

Ora hai la tua connection string completa! Usala in:

#### Per Railway (Backend)
```
1. Vai su railway.app
2. Apri il progetto backend
3. Clicca "Variables"
4. Aggiungi variabile:
   Nome: MONGODB_URI
   Valore: mongodb+srv://fifa2026admin:MiaPassword123@fifa2026-cluster.abc123.mongodb.net/fifa2026?retryWrites=true&w=majority
```

#### Per Sviluppo Locale (Backend .env)
```bash
# Nel file backend/.env
MONGODB_URI=mongodb+srv://fifa2026admin:MiaPassword123@fifa2026-cluster.abc123.mongodb.net/fifa2026?retryWrites=true&w=majority
```

---

## 🔍 Verifica Connection String

La tua connection string finale deve avere questa struttura:

```
mongodb+srv://[USERNAME]:[PASSWORD]@[CLUSTER-URL]/[DATABASE-NAME]?retryWrites=true&w=majority
               ↑          ↑           ↑              ↑
               |          |           |              |
               |          |           |              Nome database (fifa2026)
               |          |           URL del cluster (da MongoDB Atlas)
               |          Password utente database (NON password account!)
               Username utente database (fifa2026admin)
```

---

## ✅ Checklist Finale

Prima di procedere, verifica:

- [ ] Ho scelto "Drivers" come metodo di connessione
- [ ] Ho selezionato "Node.js" come driver
- [ ] Ho copiato la connection string
- [ ] Ho sostituito `<password>` con la password corretta
- [ ] Ho aggiunto `/fifa2026` dopo `.mongodb.net`
- [ ] La stringa finale contiene: username, password, cluster URL, e database name
- [ ] Ho salvato la stringa in un posto sicuro

---

## 🆘 Problemi Comuni

### "Authentication failed"
```
❌ Problema: Password errata
✅ Soluzione: 
   1. Vai su MongoDB Atlas → Database Access
   2. Trova l'utente "fifa2026admin"
   3. Clicca "Edit"
   4. Clicca "Edit Password"
   5. Genera nuova password
   6. Salva e aggiorna la connection string
```

### "Connection timeout"
```
❌ Problema: IP non autorizzato
✅ Soluzione:
   1. Vai su MongoDB Atlas → Network Access
   2. Verifica che 0.0.0.0/0 sia presente
   3. Se non c'è, clicca "Add IP Address"
   4. Seleziona "Allow Access from Anywhere"
   5. Conferma
```

### "Database not found"
```
❌ Problema: Nome database mancante nella stringa
✅ Soluzione:
   Verifica che la stringa contenga /fifa2026 prima di ?
   Esempio corretto:
   ...mongodb.net/fifa2026?retryWrites=true...
                  ^^^^^^^^
```

---

## 📸 Screenshot di Riferimento

### Schermata "Choose a connection method"
```
┌──────────────────────────────────────────────────────┐
│  🔌 Connect to fifa2026-cluster                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Choose a connection method                          │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │  📊 Compass                                    │ │
│  │  Connect using MongoDB Compass                 │ │
│  │  A GUI for MongoDB                             │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │  💻 Drivers                    ← CLICCA QUI!  │ │
│  │  Connect your application                      │ │
│  │  Use MongoDB's native drivers                  │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │  🐚 MongoDB Shell                              │ │
│  │  Connect using the MongoDB Shell               │ │
│  │  A command line interface                      │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Schermata "Connect your application"
```
┌──────────────────────────────────────────────────────┐
│  💻 Connect your application                         │
├──────────────────────────────────────────────────────┤
│                                                      │
│  1️⃣ Select your driver and version                  │
│                                                      │
│     Driver:   [Node.js ▼]                           │
│     Version:  [5.5 or later ▼]                      │
│                                                      │
│  2️⃣ Add your connection string                      │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ mongodb+srv://fifa2026admin:<password>@        │ │
│  │ fifa2026-cluster.abc123.mongodb.net/           │ │
│  │ ?retryWrites=true&w=majority                   │ │
│  │                                                │ │
│  │                                    [📋 Copy]   │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ⚠️  Replace <password> with your database user's   │
│     password                                         │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 🎯 Prossimo Passo

Dopo aver ottenuto la connection string:

1. ✅ Salvala in un posto sicuro (password manager)
2. ✅ Usala per configurare Railway (variabile MONGODB_URI)
3. ✅ Continua con il PASSO 2 della guida QUICK_START_IT.md

---

**Hai ancora dubbi? Controlla la sezione Troubleshooting in DEPLOYMENT_GUIDE.md!** 🚀