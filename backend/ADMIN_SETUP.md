# Admin User Setup Guide

## Creare un Utente Amministratore

Per accedere alla pagina di amministrazione (`/admin`) e inserire i risultati delle partite, è necessario un utente con ruolo `admin`.

### Metodo 1: Script Automatico (Consigliato)

Esegui lo script per creare automaticamente un utente admin:

```bash
cd backend
node scripts/createAdminUser.js
```

Lo script creerà (o aggiornerà) un utente admin con queste credenziali:

```
Username: admin
Email:    admin@fifa2026.com
Password: Admin2026!
Role:     admin
```

⚠️ **IMPORTANTE**: Cambia la password dopo il primo login!

### Metodo 2: Modifica Manuale Database

Se hai già un utente e vuoi renderlo admin:

1. Accedi a MongoDB Atlas
2. Vai alla collezione `users`
3. Trova il tuo utente
4. Modifica il campo `role` da `"user"` a `"admin"`
5. Salva le modifiche

### Metodo 3: Registrazione + Modifica

1. Registra un nuovo utente normalmente dall'applicazione
2. Segui il Metodo 2 per cambiare il ruolo a `admin`

## Accesso alla Pagina Admin

Una volta creato l'utente admin:

1. Vai su https://mameucci.github.io/fifa-2026-predictions/
2. Fai login con le credenziali admin
3. Nel menu di navigazione apparirà il link "Admin"
4. Clicca su "Admin" per accedere al pannello di amministrazione

## Funzionalità Pagina Admin

### Tab "Risultati Partite"

- **Filtri**:
  - Seleziona fase (Gironi, Sedicesimi, Ottavi, Quarti, Semifinali, Finale)
  - Seleziona gruppo (solo per fase gironi)
  
- **Tabella Partite**:
  - Visualizza tutte le partite della fase selezionata
  - Mostra numero match, squadre, data, risultato attuale, stato
  
- **Inserimento Risultati**:
  - Clicca sull'icona "Modifica" per ogni partita
  - Inserisci il risultato dei tempi regolamentari
  - Per le fasi finali, puoi anche inserire i rigori (opzionale)
  - Clicca "Salva Risultato"

- **Ricalcola Punteggi**:
  - Pulsante per ricalcolare automaticamente i punteggi di tutti i giocatori
  - (Funzionalità in fase di implementazione)

### Tab "Statistiche"

- Statistiche generali del torneo
- (In fase di implementazione)

### Tab "Gestione Utenti"

- Gestione utenti registrati
- (In fase di implementazione)

## Sicurezza

- Solo gli utenti con `role: "admin"` possono accedere alla pagina `/admin`
- Le API di modifica risultati richiedono autenticazione e ruolo admin
- Il token JWT viene verificato ad ogni richiesta

## Troubleshooting

### "Not authorized as admin"

- Verifica che il campo `role` dell'utente sia impostato a `"admin"` nel database
- Fai logout e login di nuovo per aggiornare il token JWT

### Script non funziona

- Verifica che il file `.env` contenga `MONGODB_URI` corretto
- Verifica la connessione a MongoDB Atlas
- Controlla i log per eventuali errori

### Non vedo il link "Admin" nel menu

- Verifica di aver fatto login con un utente admin
- Controlla la console del browser per eventuali errori
- Fai hard refresh (Ctrl+Shift+R o Cmd+Shift+R)

## Made with Bob