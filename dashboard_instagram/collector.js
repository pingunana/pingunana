#!/usr/bin/env node

const path = require('node:path');
const { createCommercialSnapshot, loadDotEnv } = require('./src/commercial-snapshot');

function readArg(args, name) {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
}

function defaultWindow(now, days) {
  const until = new Date(now);
  until.setUTCDate(until.getUTCDate() - 2);
  until.setUTCHours(0, 0, 0, 0);
  const since = new Date(until);
  since.setUTCDate(since.getUTCDate() - days + 1);
  return { since: since.toISOString().slice(0, 10), until: until.toISOString().slice(0, 10) };
}

async function main() {
  loadDotEnv(path.join(__dirname, '.env'));
  const args = process.argv.slice(2);
  const days = Number(readArg(args, '--days') || 30);
  if (!Number.isInteger(days) || days < 1 || days > 90) throw new Error('Use --days com um inteiro entre 1 e 90.');

  const window = defaultWindow(new Date(), days);
  const since = readArg(args, '--since') || window.since;
  const until = readArg(args, '--until') || window.until;
  const accountId = readArg(args, '--account-id') || process.env.INSTAGRAM_ACCOUNT_ID;
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!accountId || !accessToken) {
    throw new Error('Faltam INSTAGRAM_ACCOUNT_ID ou INSTAGRAM_ACCESS_TOKEN em dashboard_instagram/.env. Use o assistente de configuração antes de solicitar um snapshot.');
  }

  const snapshot = await createCommercialSnapshot({ accountId, accessToken, since, until, outputRoot: path.join(__dirname, 'runtime', 'snapshots') });
  console.log(`Snapshot criado: ${snapshot.id}`);
  console.log(`Janela: ${snapshot.window.since} a ${snapshot.window.until}`);
  for (const metric of snapshot.metrics) console.log(`${metric.key}: ${metric.status === 'available' ? metric.total : 'indisponível'}`);
  console.log(`Arquivo normalizado: ${snapshot.paths.normalized}`);
}

main().catch((error) => {
  console.error(`Falha ao criar snapshot comercial: ${error.message}`);
  process.exitCode = 1;
});
