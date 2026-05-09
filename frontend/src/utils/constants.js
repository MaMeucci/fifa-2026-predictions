// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Auth0 Configuration
export const AUTH0_CONFIG = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  audience: import.meta.env.VITE_AUTH0_AUDIENCE,
  redirectUri: import.meta.env.VITE_AUTH0_REDIRECT_URI || window.location.origin + '/callback',
};

// Tournament Configuration
export const TOURNAMENT_CONFIG = {
  name: 'FIFA World Cup 2026',
  startDate: new Date(import.meta.env.VITE_TOURNAMENT_START || '2026-06-11T00:00:00Z'),
  lockDate: new Date(import.meta.env.VITE_PREDICTIONS_LOCK_DATE || '2026-06-10T23:59:59Z'),
  hosts: ['Canada', 'Mexico', 'United States'],
};

// Match Phases
export const MATCH_PHASES = {
  GROUP: 'group',
  ROUND16: 'round16',
  QUARTER: 'quarter',
  SEMI: 'semi',
  FINAL: 'final',
  THIRD_PLACE: 'third_place',
};

// Groups
export const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

// Match Signs
export const MATCH_SIGNS = {
  HOME: '1',
  DRAW: 'X',
  AWAY: '2',
};

// Scoring Rules
export const SCORING_RULES = {
  EXACT_RESULT: 6,
  CORRECT_SIGN: 3,
  BONUS_THRESHOLD: 5,
  BONUS_POINTS: 5,
  ROUND16_TEAM: 20,
  ROUND16_POSITION: 5,
  QUARTER_TEAM: 20,
  SEMI_TEAM: 30,
  FINAL_TEAM: 50,
  WINNER_TEAM: 60,
  FIRST_PLACE: 80,
  SECOND_PLACE: 50,
  THIRD_PLACE: 25,
  FOURTH_PLACE: 25,
  TOP_SCORER: 30,
  CAPISCIONE_TOP: 25,
  CAPISCIONE_OUTSIDER: 20,
  CAPISCIONE_MATERASSO: 15,
};

// Capiscione Groups
export const CAPISCIONE_GROUPS = {
  TOP: {
    name: 'Top',
    description: 'Squadre favorite',
    teams: ['Brasile', 'Argentina', 'Francia', 'Inghilterra', 'Spagna'],
    points: SCORING_RULES.CAPISCIONE_TOP,
  },
  OUTSIDER: {
    name: 'Outsider',
    description: 'Sorprese possibili',
    teams: ['Portogallo', 'Olanda', 'Uruguay', 'Colombia', 'Croazia'],
    points: SCORING_RULES.CAPISCIONE_OUTSIDER,
  },
  MATERASSO: {
    name: 'Materasso',
    description: 'Outsider estreme',
    teams: ['Messico', 'Giappone', 'Senegal', 'Marocco', 'Stati Uniti'],
    points: SCORING_RULES.CAPISCIONE_MATERASSO,
  },
};

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

// Auth Providers
export const AUTH_PROVIDERS = {
  LOCAL: 'local',
  AUTH0: 'auth0',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'fifa2026_access_token',
  REFRESH_TOKEN: 'fifa2026_refresh_token',
  USER: 'fifa2026_user',
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH_REGISTER: '/auth/register',
  AUTH_LOGIN: '/auth/login',
  AUTH_AUTH0_CALLBACK: '/auth/auth0/callback',
  AUTH_REFRESH: '/auth/refresh',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_ME: '/auth/me',
  
  // Predictions
  PREDICTIONS_MY: '/predictions/my',
  PREDICTIONS: '/predictions',
  PREDICTIONS_USER: (userId) => `/predictions/${userId}`,
  PREDICTIONS_ALL: '/predictions/all',
  
  // Matches
  MATCHES: '/matches',
  MATCHES_GROUP: (group) => `/matches/group/${group}`,
  MATCHES_PHASE: (phase) => `/matches/${phase}`,
  MATCH_DETAIL: (id) => `/matches/${id}`,
  MATCH_RESULT: (id) => `/matches/${id}/result`,
  
  // Scores
  SCORES_LEADERBOARD: '/scores/leaderboard',
  SCORES_MY: '/scores/my',
  SCORES_USER: (userId) => `/scores/${userId}`,
  SCORES_CALCULATE: '/scores/calculate',
  SCORES_CALCULATE_USER: (userId) => `/scores/calculate/${userId}`,
  
  // Settings
  SETTINGS: '/settings',
  SETTINGS_KEY: (key) => `/settings/${key}`,
  SETTINGS_CAPISCIONE: '/settings/capiscione',
  
  // Admin
  ADMIN_USERS: '/admin/users',
  ADMIN_USER_ROLE: (id) => `/admin/users/${id}/role`,
  ADMIN_AUDIT_LOGS: '/admin/audit-logs',
  ADMIN_IMPORT_RESULTS: '/admin/import-results',
  ADMIN_STATS: '/admin/stats',
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  CALLBACK: '/callback',
  PREDICTIONS: '/predictions',
  ALL_PREDICTIONS: '/all-predictions',
  SCORING_RULES: '/scoring-rules',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
  NOT_FOUND: '*',
};

// Query Keys for React Query
export const QUERY_KEYS = {
  USER: 'user',
  PREDICTIONS: 'predictions',
  MATCHES: 'matches',
  SCORES: 'scores',
  LEADERBOARD: 'leaderboard',
  SETTINGS: 'settings',
};

// Validation Rules
export const VALIDATION = {
  USERNAME_MIN: 3,
  USERNAME_MAX: 30,
  PASSWORD_MIN: 8,
  SCORE_MIN: 0,
  SCORE_MAX: 20,
};

// Date Formats
export const DATE_FORMATS = {
  FULL: 'DD/MM/YYYY HH:mm',
  DATE_ONLY: 'DD/MM/YYYY',
  TIME_ONLY: 'HH:mm',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  LEADERBOARD_LIMIT: 50,
};

// Toast Messages
export const TOAST_MESSAGES = {
  SUCCESS: {
    PREDICTION_SAVED: 'Pronostici salvati con successo!',
    LOGIN_SUCCESS: 'Login effettuato con successo!',
    REGISTER_SUCCESS: 'Registrazione completata!',
    RESULT_SAVED: 'Risultato salvato con successo!',
  },
  ERROR: {
    GENERIC: 'Si è verificato un errore. Riprova.',
    NETWORK: 'Errore di connessione. Verifica la tua connessione internet.',
    UNAUTHORIZED: 'Accesso non autorizzato.',
    PREDICTIONS_LOCKED: 'I pronostici sono bloccati. Non puoi più modificarli.',
    INVALID_CREDENTIALS: 'Credenziali non valide.',
  },
  WARNING: {
    PREDICTIONS_INCOMPLETE: 'Completa tutti i pronostici prima di salvare.',
    LOCK_APPROACHING: 'Attenzione! I pronostici verranno bloccati tra poco.',
  },
};

// Theme Colors - FIFA 2026 Official Colors
export const THEME_COLORS = {
  PRIMARY: '#00B8A9', // Turchese FIFA 2026
  SECONDARY: '#E91E63', // Magenta vibrante
  SUCCESS: '#4caf50',
  ERROR: '#f44336',
  WARNING: '#FFC107', // Giallo/Oro
  INFO: '#00BCD4', // Cyan
  DARK: '#1A1A2E', // Blu scuro
  LIGHT: '#F8F9FA', // Grigio chiaro
};

// Made with Bob
