/**
 * Debug + Fix script: verifica e (se necessario) imposta il topScorer
 * nel documento KnockoutResults del DB di produzione.
 *
 * Usage:
 *   cd backend && node scripts/debugTopScorer.js
 *
 * Per impostare il topScorer admin direttamente da CLI:
 *   TOP_SCORER="Mbappé" node scripts/debugTopScorer.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const KnockoutResults = require('../src/models/KnockoutResults');
const Prediction = require('../src/models/Prediction');
const User = require('../src/models/User');
const Match = require('../src/models/Match');

// ── Copia esatta delle funzioni di scoreCalculationService.js ──────────────
const normalizePlayerName = (name) => {
  if (!name || typeof name !== 'string') return '';
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[a-z]\.\s*/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const comparePlayerNames = (name1, name2) => {
  const normalized1 = normalizePlayerName(name1);
  const normalized2 = normalizePlayerName(name2);
  if (!normalized1 || !normalized2) return false;
  if (normalized1 === normalized2) return true;
  const surname1 = normalized1.split(' ').pop();
  const surname2 = normalized2.split(' ').pop();
  if (surname1 && surname2 && surname1 === surname2) return true;
  return false;
};
// ──────────────────────────────────────────────────────────────────────────

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connesso a MongoDB\n');

  // ── Se viene passato TOP_SCORER=xxx, imposta/aggiorna il documento ─────
  const newTopScorer = process.env.TOP_SCORER;
  if (newTopScorer) {
    console.log(`⚙️  Impostazione topScorer admin = "${newTopScorer}"...`);
    let kr = await KnockoutResults.findOne();
    if (!kr) {
      kr = new KnockoutResults();
    }
    kr.topScorer = { playerName: newTopScorer.trim(), team: { name: '', code: '' } };
    kr.lastUpdated = new Date();
    await kr.save();
    console.log(`✅ topScorer salvato: "${kr.topScorer.playerName}"\n`);
  }

  // ── 1. Leggi l'answer admin ─────────────────────────────────────────────
  const kr = await KnockoutResults.findOne();
  if (!kr) {
    console.log('❌ KnockoutResults NON trovato nel DB.');
    console.log('   → Imposta il capocannoniere admin con:');
    console.log('     TOP_SCORER="Mbappé" node scripts/debugTopScorer.js\n');
    await mongoose.connection.close();
    return;
  }

  const adminAnswer = kr.topScorer?.playerName || '';
  console.log('=== ADMIN ANSWER ===');
  if (!adminAnswer) {
    console.log('  ⚠️  topScorer.playerName è VUOTO nel documento KnockoutResults!');
    console.log('   → Imposta il capocannoniere admin con:');
    console.log('     TOP_SCORER="Mbappé" node scripts/debugTopScorer.js\n');
  } else {
    console.log(`  Raw:        "${adminAnswer}"`);
    console.log(`  Normalized: "${normalizePlayerName(adminAnswer)}"`);
    console.log(`  Char codes: [${[...adminAnswer].map(c => c.codePointAt(0).toString(16)).join(', ')}]`);
  }
  console.log();

  // ── 2. Partite finite (blocca calculateAllScores se 0) ─────────────────
  const finishedMatches = await Match.find({ status: 'FINISHED' });
  console.log(`=== PARTITE FINITE: ${finishedMatches.length} ===`);
  if (finishedMatches.length === 0) {
    console.log('⚠️  Il vecchio codice bloccava calculateAllScores() qui.');
    console.log('   Il fix del 2025-07-20 ha rimosso questo blocco.\n');
  }
  console.log();

  // ── 3. Pronostici utenti ────────────────────────────────────────────────
  const predictions = await Prediction.find().populate('user', 'username');
  console.log(`=== PRONOSTICI UTENTI (${predictions.length} totali) ===`);

  let matched = 0;
  for (const pred of predictions) {
    const username = pred.user?.username || '(utente sconosciuto)';
    const raw = pred.topScorer?.playerName || '';
    if (!raw) {
      console.log(`  ⬜  ${username}: (nessun pronostico capocannoniere)`);
      continue;
    }
    const norm = normalizePlayerName(raw);
    const isMatch = adminAnswer ? comparePlayerNames(raw, adminAnswer) : false;
    if (isMatch) matched++;
    const icon = isMatch ? '✅' : '❌';
    console.log(`  ${icon} ${username}`);
    console.log(`       Raw:        "${raw}"`);
    console.log(`       Normalized: "${norm}"`);
  }

  console.log();
  console.log(`=== RISULTATO: ${matched} su ${predictions.length} utenti dovrebbero ricevere punti ===`);
  console.log();
  console.log('Ora esegui "Ricalcola Punteggi" dall\'interfaccia admin per aggiornare i punteggi.');

  await mongoose.connection.close();
};

run().catch(err => {
  console.error('❌ Errore:', err);
  process.exit(1);
});
