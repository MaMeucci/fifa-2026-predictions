# Diagrammi Architetturali - FIFA 2026 Predictions App

## 1. Architettura Sistema Completa

```mermaid
graph TB
    subgraph Client["Client Layer"]
        Browser[Browser/Mobile]
        PWA[Progressive Web App]
    end
    
    subgraph Frontend["Frontend - React SPA"]
        Router[React Router]
        Auth[Auth Components]
        Predictions[Predictions UI]
        Dashboard[Dashboard]
        Admin[Admin Panel]
    end
    
    subgraph Backend["Backend - Express API"]
        Gateway[API Gateway]
        AuthService[Auth Service]
        PredService[Predictions Service]
        ScoreService[Scoring Engine]
        ResultsService[Results Importer]
    end
    
    subgraph Database["Database Layer"]
        MongoDB[(MongoDB Atlas)]
        Users[Users Collection]
        Matches[Matches Collection]
        Preds[Predictions Collection]
        Scores[Scores Collection]
    end
    
    subgraph External["External Services"]
        Auth0[Auth0 OAuth]
        APIFootball[API-Football]
        Email[Email Service]
    end
    
    Browser --> PWA
    PWA --> Router
    Router --> Auth
    Router --> Predictions
    Router --> Dashboard
    Router --> Admin
    
    Auth --> Gateway
    Predictions --> Gateway
    Dashboard --> Gateway
    Admin --> Gateway
    
    Gateway --> AuthService
    Gateway --> PredService
    Gateway --> ScoreService
    Gateway --> ResultsService
    
    AuthService --> Auth0
    AuthService --> Users
    PredService --> Preds
    PredService --> Matches
    ScoreService --> Scores
    ScoreService --> Preds
    ResultsService --> APIFootball
    ResultsService --> Matches
    
    Users --> MongoDB
    Matches --> MongoDB
    Preds --> MongoDB
    Scores --> MongoDB
    
    AuthService -.-> Email
```

## 2. Flusso Autenticazione

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant DB as MongoDB
    participant A0 as Auth0
    
    alt Registrazione Classica
        U->>F: Compila form registrazione
        F->>F: Valida input
        F->>B: POST /api/auth/register
        B->>B: Hash password
        B->>DB: Salva utente
        DB-->>B: User created
        B->>B: Genera JWT
        B-->>F: Token + User data
        F->>F: Salva token in localStorage
        F-->>U: Redirect a dashboard
    end
    
    alt Login con Auth0
        U->>F: Click su Auth0 button
        F->>A0: Redirect to Auth0
        A0->>U: Mostra login page
        U->>A0: Login con Google/Facebook
        A0-->>F: Redirect con code
        F->>B: POST /api/auth/auth0/callback
        B->>A0: Exchange code for token
        A0-->>B: User info
        B->>DB: Trova o crea utente
        B->>B: Genera JWT
        B-->>F: Token + User data
        F->>F: Salva token
        F-->>U: Redirect a dashboard
    end
```

## 3. Flusso Inserimento Pronostici

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant DB as MongoDB
    
    U->>F: Accede a pagina pronostici
    F->>B: GET /api/predictions/my
    B->>DB: Query predictions
    DB-->>B: User predictions
    B-->>F: Predictions data
    F-->>U: Mostra form pronostici
    
    U->>F: Inserisce risultato partita
    F->>F: Valida input
    F->>F: Auto-save dopo 30s
    F->>B: POST /api/predictions
    B->>B: Valida dati
    B->>B: Controlla lock date
    B->>DB: Salva/aggiorna predictions
    DB-->>B: Success
    B-->>F: Updated predictions
    F-->>U: Mostra conferma
    
    Note over F,B: Ripeti per ogni modifica
```

## 4. Flusso Calcolo Punteggi

```mermaid
flowchart TD
    Start([Admin inserisce risultato]) --> UpdateMatch[Aggiorna Match in DB]
    UpdateMatch --> TriggerCalc[Trigger calcolo punteggi]
    
    TriggerCalc --> GetPreds[Ottieni tutte le predictions]
    GetPreds --> LoopPreds{Per ogni prediction}
    
    LoopPreds --> CalcGroup[Calcola punti gironi]
    CalcGroup --> CheckExact{Risultato esatto?}
    CheckExact -->|Si| Add6[+6 punti]
    CheckExact -->|No| CheckSign{Segno corretto?}
    CheckSign -->|Si| Add3[+3 punti]
    CheckSign -->|No| Add0[+0 punti]
    
    Add6 --> CountExact[Conta risultati esatti]
    Add3 --> CountExact
    Add0 --> CountExact
    
    CountExact --> CheckBonus{Multiplo di 5?}
    CheckBonus -->|Si| AddBonus[+5 punti bonus]
    CheckBonus -->|No| CalcKnockout
    AddBonus --> CalcKnockout[Calcola punti fase finale]
    
    CalcKnockout --> CalcRound16[Sedicesimi: 20pt + 5pt posizione]
    CalcRound16 --> CalcQuarter[Ottavi: 20pt per squadra]
    CalcQuarter --> CalcSemi[Quarti: 30pt per squadra]
    CalcSemi --> CalcFinal[Semi: 50pt, Finale: 60pt]
    
    CalcFinal --> CalcRankings[Calcola classifiche finali]
    CalcRankings --> Winner[1°: 80pt, 2°: 50pt]
    Winner --> ThirdFourth[3°: 25pt, 4°: 25pt]
    ThirdFourth --> TopScorer[Capocannoniere: 30pt]
    
    TopScorer --> CalcCapiscione[Calcola Angolo Capiscione]
    CalcCapiscione --> TopTeam[Top: 25pt]
    TopTeam --> OutsiderTeam[Outsider: 20pt]
    OutsiderTeam --> MaterassoTeam[Materasso: 15pt]
    
    MaterassoTeam --> SumTotal[Somma totale punti]
    SumTotal --> SaveScore[Salva in Scores collection]
    SaveScore --> MorePreds{Altre predictions?}
    
    MorePreds -->|Si| LoopPreds
    MorePreds -->|No| UpdateRanks[Aggiorna classifiche]
    UpdateRanks --> End([Fine])
```

## 5. Flusso Import Risultati Automatico

```mermaid
sequenceDiagram
    participant Cron as Scheduled Job
    participant RI as Results Importer
    participant API as API-Football
    participant TSD as TheSportsDB
    participant DB as MongoDB
    participant SE as Scoring Engine
    
    Cron->>RI: Trigger sync (2x/giorno)
    RI->>DB: Query partite non finite
    DB-->>RI: Lista partite pending
    
    loop Per ogni partita
        RI->>API: GET /fixtures
        alt API-Football Success
            API-->>RI: Risultato partita
            RI->>DB: Aggiorna match
        else API-Football Fail
            RI->>TSD: GET risultato
            alt TheSportsDB Success
                TSD-->>RI: Risultato partita
                RI->>DB: Aggiorna match
            else Entrambe fallite
                RI->>RI: Log errore
                Note over RI: Admin inserirà manualmente
            end
        end
    end
    
    RI->>SE: Trigger ricalcolo punteggi
    SE->>DB: Calcola e salva scores
    DB-->>SE: Success
    SE-->>RI: Punteggi aggiornati
    RI-->>Cron: Sync completato
```

## 6. Struttura Database

```mermaid
erDiagram
    USERS ||--o{ PREDICTIONS : creates
    USERS ||--o{ SCORES : has
    USERS ||--o{ AUDIT_LOGS : generates
    PREDICTIONS ||--|| SCORES : calculates
    MATCHES ||--o{ PREDICTIONS : referenced_in
    
    USERS {
        ObjectId _id PK
        string username UK
        string email UK
        string passwordHash
        string authProvider
        string auth0Id
        string role
        boolean isActive
        date createdAt
        date updatedAt
    }
    
    MATCHES {
        ObjectId _id PK
        int matchNumber UK
        string phase
        string group
        string homeTeam
        string awayTeam
        date matchDate
        object actualResult
        boolean isFinished
        date createdAt
    }
    
    PREDICTIONS {
        ObjectId _id PK
        ObjectId userId FK
        array groupPredictions
        array round16Teams
        array quarterFinalists
        array semiFinalists
        array finalists
        object finalRankings
        object topScorer
        object capiscione
        int totalPoints
        boolean isLocked
        date createdAt
        date updatedAt
    }
    
    SCORES {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId predictionId FK
        object breakdown
        int totalPoints
        int rank
        object stats
        date lastCalculated
    }
    
    SETTINGS {
        ObjectId _id PK
        string key UK
        mixed value
        string type
        string category
        boolean isPublic
    }
    
    AUDIT_LOGS {
        ObjectId _id PK
        ObjectId userId FK
        string action
        string entityType
        ObjectId entityId
        object changes
        date timestamp
    }
```

## 7. Flusso Utente Completo

```mermaid
journey
    title Esperienza Utente - Dal Login alla Classifica
    section Registrazione
      Visita sito: 5: User
      Sceglie metodo auth: 4: User
      Completa registrazione: 5: User
      Riceve email conferma: 3: User
    section Pronostici Gironi
      Accede a pronostici: 5: User
      Seleziona girone: 5: User
      Inserisce risultati: 4: User
      Sceglie segni: 4: User
      Auto-save: 5: System
    section Fase Finale
      Completa gironi: 5: User
      Seleziona sedicesimi: 4: User
      Prevede ottavi-finale: 4: User
      Sceglie classifiche: 4: User
      Indica capocannoniere: 4: User
    section Angolo Capiscione
      Legge regole: 3: User
      Sceglie Top team: 4: User
      Sceglie Outsider: 4: User
      Sceglie Materasso: 4: User
      Salva tutto: 5: User
    section Durante Mondiale
      Riceve notifica lock: 3: System
      Pronostici bloccati: 5: System
      Vede risultati reali: 5: User
      Controlla punteggi: 5: User
      Visualizza classifica: 5: User
      Confronta con amici: 5: User
    section Fine Torneo
      Vede posizione finale: 5: User
      Analizza statistiche: 4: User
      Condivide risultati: 4: User
```

## 8. Componenti Frontend

```mermaid
graph TD
    App[App.jsx] --> Router[Router]
    
    Router --> Public[Public Routes]
    Router --> Protected[Protected Routes]
    Router --> Admin[Admin Routes]
    
    Public --> Home[HomePage]
    Public --> Login[LoginPage]
    Public --> Register[RegisterPage]
    
    Protected --> Predictions[PredictionsPage]
    Protected --> Dashboard[DashboardPage]
    
    Admin --> AdminPanel[AdminPage]
    
    Predictions --> GroupStage[GroupStage]
    Predictions --> KnockoutStage[KnockoutStage]
    Predictions --> Capiscione[CapiscioneSection]
    
    GroupStage --> MatchPred[MatchPrediction]
    KnockoutStage --> Round16[Round16Selector]
    KnockoutStage --> FinalStages[FinalStages]
    
    Dashboard --> Leaderboard[Leaderboard]
    Dashboard --> UserStats[UserStats]
    Dashboard --> Comparison[ComparisonView]
    
    AdminPanel --> ResultsEntry[ResultsEntry]
    AdminPanel --> UserMgmt[UserManagement]
    AdminPanel --> Settings[SettingsManager]
```

## 9. Stati Applicazione

```mermaid
stateDiagram-v2
    [*] --> NotAuthenticated
    
    NotAuthenticated --> Authenticating: Login/Register
    Authenticating --> Authenticated: Success
    Authenticating --> NotAuthenticated: Failure
    
    Authenticated --> ViewingPredictions: Navigate to Predictions
    Authenticated --> ViewingDashboard: Navigate to Dashboard
    Authenticated --> AdminPanel: Navigate to Admin (if admin)
    
    ViewingPredictions --> EditingPredictions: Start editing
    EditingPredictions --> SavingPredictions: Auto-save/Manual save
    SavingPredictions --> ViewingPredictions: Success
    SavingPredictions --> EditingPredictions: Failure
    
    ViewingPredictions --> LockedPredictions: Lock date reached
    LockedPredictions --> ViewingPredictions: View only mode
    
    ViewingDashboard --> ViewingLeaderboard: View rankings
    ViewingDashboard --> ViewingStats: View statistics
    ViewingDashboard --> ComparingUsers: Compare with others
    
    AdminPanel --> EnteringResults: Enter match results
    EnteringResults --> CalculatingScores: Trigger calculation
    CalculatingScores --> AdminPanel: Complete
    
    Authenticated --> NotAuthenticated: Logout
    ViewingPredictions --> NotAuthenticated: Session expired
    ViewingDashboard --> NotAuthenticated: Session expired
```

## 10. Deployment Pipeline

```mermaid
graph LR
    Dev[Developer] -->|git push| GitHub[GitHub Repository]
    
    GitHub -->|trigger| FrontendCI[Frontend CI/CD]
    GitHub -->|trigger| BackendCI[Backend CI/CD]
    
    FrontendCI -->|npm test| FrontendTests[Run Tests]
    FrontendTests -->|pass| FrontendBuild[npm run build]
    FrontendBuild -->|deploy| GitHubPages[GitHub Pages]
    
    BackendCI -->|npm test| BackendTests[Run Tests]
    BackendTests -->|pass| BackendBuild[Build Docker Image]
    BackendBuild -->|deploy| Railway[Railway/Render]
    
    Railway -->|connect| MongoDB[MongoDB Atlas]
    Railway -->|connect| Auth0Service[Auth0]
    Railway -->|connect| APIFootballService[API-Football]
    
    GitHubPages -->|API calls| Railway
    
    User[End User] -->|access| GitHubPages
```

## Note sui Diagrammi

Questi diagrammi forniscono una visione completa dell'architettura e dei flussi dell'applicazione. Sono stati creati usando Mermaid per essere facilmente modificabili e versionabili insieme al codice.

Per visualizzare i diagrammi:
1. Usa un editor Markdown con supporto Mermaid (VS Code con estensione)
2. Visualizza su GitHub (supporto nativo)
3. Usa Mermaid Live Editor: https://mermaid.live/