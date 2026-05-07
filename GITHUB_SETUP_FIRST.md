# 🚀 Setup GitHub - Da Fare PRIMA di Railway

## ⚠️ Ordine Corretto dei Passi

Hai ragione! L'ordine corretto è:

1. ✅ **MongoDB Atlas** (già fatto!)
2. **GitHub Repository** (da fare ORA)
3. **Railway Backend**
4. **GitHub Pages Frontend**

---

## 📦 PASSO 1: Crea Repository su GitHub

### 1.1 Vai su GitHub

Apri il browser e vai su: https://github.com/new

### 1.2 Compila il Form

```
Repository name: fifa-2026-predictions

Description (opzionale): 
Applicazione web per pronostici FIFA World Cup 2026

○ Public  ← Seleziona questo (necessario per GitHub Pages gratis)
○ Private

☐ Add a README file  ← NON selezionare (già presente nel progetto)
☐ Add .gitignore      ← NON selezionare (già presente)
☐ Choose a license    ← Opzionale

[Create repository]  ← Clicca qui
```

### 1.3 Salva l'URL del Repository

Dopo aver cliccato "Create repository", vedrai una pagina con l'URL:

```
https://github.com/TUO-USERNAME/fifa-2026-predictions.git
```

**✅ Copia questo URL! Lo userai tra poco.**

---

## 💻 PASSO 2: Carica il Codice su GitHub

### 2.1 Apri il Terminale

```bash
# Su Mac: Apri Terminal
# Su Windows: Apri Git Bash o PowerShell
# Su Linux: Apri Terminal

# Vai nella cartella del progetto
cd /Users/mmroot/Documents/IBM/Tools/Bob/fifa-2026-predictions
```

### 2.2 Inizializza Git (se non già fatto)

```bash
# Verifica se git è già inizializzato
git status

# Se vedi "fatal: not a git repository", esegui:
git init
```

### 2.3 Aggiungi Tutti i File

```bash
# Aggiungi tutti i file al repository
git add .

# Verifica cosa verrà committato
git status
```

Dovresti vedere:
```
Changes to be committed:
  new file:   README.md
  new file:   QUICK_START_IT.md
  new file:   DEPLOYMENT_GUIDE.md
  new file:   backend/package.json
  new file:   frontend/package.json
  ... (molti altri file)
```

### 2.4 Crea il Primo Commit

```bash
git commit -m "Initial commit - FIFA 2026 Predictions App"
```

### 2.5 Collega al Repository GitHub

```bash
# Sostituisci TUO-USERNAME con il tuo username GitHub
git remote add origin https://github.com/TUO-USERNAME/fifa-2026-predictions.git

# Verifica che sia stato aggiunto
git remote -v
```

Dovresti vedere:
```
origin  https://github.com/TUO-USERNAME/fifa-2026-predictions.git (fetch)
origin  https://github.com/TUO-USERNAME/fifa-2026-predictions.git (push)
```

### 2.6 Rinomina Branch in "main"

```bash
# GitHub usa "main" come branch principale
git branch -M main
```

### 2.7 Pusha il Codice su GitHub

```bash
git push -u origin main
```

Ti verrà chiesto di autenticarti:

**Su Mac/Linux:**
```
Username: TUO-USERNAME
Password: [usa Personal Access Token, NON la password!]
```

**Su Windows:**
Si aprirà una finestra di autenticazione GitHub.

---

## 🔑 PASSO 3: Personal Access Token (se richiesto)

Se ti viene chiesta la password e non funziona, devi creare un Personal Access Token:

### 3.1 Crea Token su GitHub

1. Vai su https://github.com/settings/tokens
2. Clicca "Generate new token" → "Generate new token (classic)"
3. Note: `FIFA 2026 Predictions Deploy`
4. Expiration: `90 days` (o più)
5. Seleziona scopes:
   - ✅ `repo` (tutti i sotto-checkbox)
   - ✅ `workflow`
6. Clicca "Generate token"
7. **COPIA IL TOKEN SUBITO!** (non lo vedrai più)

### 3.2 Usa il Token come Password

```bash
# Quando ti chiede la password, incolla il token
Username: TUO-USERNAME
Password: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## ✅ PASSO 4: Verifica su GitHub

1. Vai su https://github.com/TUO-USERNAME/fifa-2026-predictions
2. Dovresti vedere tutti i file del progetto
3. Verifica che ci siano:
   - ✅ `README.md`
   - ✅ `frontend/` directory
   - ✅ `backend/` directory
   - ✅ Guide deployment

---

## 🎯 PASSO 5: Ora Puoi Usare Railway!

Ora che il codice è su GitHub, puoi procedere con Railway:

### 5.1 Torna su Railway

1. Vai su https://railway.app
2. Clicca "New Project"
3. Scegli "Deploy from GitHub repo"
4. **ORA vedrai il repository "fifa-2026-predictions"!** ✅
5. Selezionalo e continua con la guida QUICK_START_IT.md

---

## 🔄 Comandi Git Utili per il Futuro

### Aggiornare il Codice su GitHub

```bash
# Dopo aver modificato file
git add .
git commit -m "Descrizione modifiche"
git push origin main
```

### Vedere lo Stato

```bash
git status          # Vedi file modificati
git log --oneline   # Vedi cronologia commit
```

### Annullare Modifiche

```bash
git checkout -- file.js    # Annulla modifiche a un file
git reset --hard HEAD      # Annulla tutte le modifiche
```

---

## 🆘 Problemi Comuni

### "fatal: not a git repository"

```bash
# Soluzione: Inizializza git
git init
```

### "remote origin already exists"

```bash
# Soluzione: Rimuovi e ri-aggiungi
git remote remove origin
git remote add origin https://github.com/TUO-USERNAME/fifa-2026-predictions.git
```

### "Authentication failed"

```bash
# Soluzione: Usa Personal Access Token invece della password
# Vedi PASSO 3 sopra
```

### "Permission denied"

```bash
# Soluzione: Verifica di essere il proprietario del repository
# O usa HTTPS invece di SSH
```

### Push rifiutato

```bash
# Soluzione: Pull prima di push
git pull origin main --rebase
git push origin main
```

---

## 📋 Checklist Completa

Prima di procedere con Railway, verifica:

- [ ] Ho creato il repository su GitHub
- [ ] Ho eseguito `git init` nella cartella del progetto
- [ ] Ho eseguito `git add .`
- [ ] Ho eseguito `git commit -m "Initial commit"`
- [ ] Ho collegato il repository con `git remote add origin`
- [ ] Ho eseguito `git push -u origin main`
- [ ] Vedo tutti i file su github.com/TUO-USERNAME/fifa-2026-predictions
- [ ] Ora posso procedere con Railway!

---

## 🎯 Ordine Corretto Completo

```
1. ✅ MongoDB Atlas (FATTO!)
   └─ Database gratuito configurato

2. ✅ GitHub Repository (FAI ORA!)
   └─ Codice caricato su GitHub

3. ⏭️  Railway Backend (PROSSIMO PASSO)
   └─ Deploy backend da GitHub

4. ⏭️  GitHub Pages Frontend (ULTIMO PASSO)
   └─ Deploy frontend
```

---

## 🚀 Prossimo Passo

Dopo aver caricato il codice su GitHub:

1. ✅ Verifica che il repository sia visibile su GitHub
2. ✅ Torna su Railway.app
3. ✅ Clicca "Deploy from GitHub repo"
4. ✅ Seleziona "fifa-2026-predictions"
5. ✅ Continua con QUICK_START_IT.md dal punto 2.2

**Ora hai tutto pronto per il deployment! 🎉**