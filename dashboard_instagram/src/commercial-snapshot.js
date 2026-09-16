const fs = require('node:fs/promises');
const path = require('node:path');

const API_VERSION = 'v24.0';
const ACCOUNT_METRICS = [
  { key: 'views', apiName: 'views' },
  { key: 'reach', apiName: 'reach' },
  { key: 'interactions', apiName: 'total_interactions' },
  { key: 'follows_and_unfollows', apiName: 'follows_and_unfollows' },
  { key: 'profile_views', apiName: 'profile_views' },
  { key: 'profile_links_taps', apiName: 'profile_links_taps' },
];

function loadDotEnv(file) {
  let source;
  try { source = require('node:fs').readFileSync(file, 'utf8'); } catch (error) { if (error.code === 'ENOENT') return; throw error; }
  for (const line of source.split(/\r?\n/)) {
    const match = line.match(/^([A-Z][A-Z0-9_]*)=(.*)$/);
    if (match && process.env[match[1]] === undefined) process.env[match[1]] = match[2];
  }
}

function assertDate(value, name) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(`${value}T00:00:00Z`))) throw new Error(`${name} deve usar o formato YYYY-MM-DD.`);
}

function normalizeValues(data) {
  const item = data?.data?.[0];
  const values = Array.isArray(item?.values) ? item.values : [];
  if (!item || values.length === 0) return { status: 'unavailable', total: null, values: [] };
  const normalized = values.filter((entry) => typeof entry.value === 'number').map((entry) => ({ value: entry.value, endTime: entry.end_time || null }));
  if (normalized.length === 0) return { status: 'unavailable', total: null, values: [] };
  return { status: 'available', total: normalized.reduce((sum, entry) => sum + entry.value, 0), values: normalized };
}

async function requestJson(fetchImpl, url) {
  const response = await fetchImpl(url);
  const body = await response.json();
  if (!response.ok || body.error) {
    const error = new Error(body?.error?.message || `HTTP ${response.status}`);
    error.code = body?.error?.code || response.status;
    throw error;
  }
  return body;
}

function buildUrl({ baseUrl, accountId, accessToken, metric, since, until, audience }) {
  const url = new URL(`${baseUrl}/${API_VERSION}/${accountId}/insights`);
  url.searchParams.set('metric', metric);
  url.searchParams.set('access_token', accessToken);
  if (audience) {
    url.searchParams.set('period', 'lifetime');
    url.searchParams.set('metric_type', 'total_value');
    url.searchParams.set('breakdown', 'age,gender');
    url.searchParams.set('timeframe', 'last_30_days');
  } else {
    url.searchParams.set('period', 'day');
    url.searchParams.set('since', since);
    url.searchParams.set('until', until);
  }
  return url.toString();
}

async function fetchMetric(options, metric) {
  try {
    const raw = await requestJson(options.fetchImpl, buildUrl({ ...options, metric: metric.apiName }));
    return { key: metric.key, apiName: metric.apiName, ...normalizeValues(raw), raw };
  } catch (error) {
    return { key: metric.key, apiName: metric.apiName, status: 'unavailable', total: null, values: [], error: { code: error.code || null, message: error.message }, raw: null };
  }
}

async function fetchAudience(options) {
  try { return { status: 'available', raw: await requestJson(options.fetchImpl, buildUrl({ ...options, metric: 'follower_demographics', audience: true })) }; }
  catch (error) { return { status: 'unavailable', raw: null, error: { code: error.code || null, message: error.message } }; }
}

async function createCommercialSnapshot({ accountId, accessToken, since, until, outputRoot, fetchImpl = global.fetch, baseUrl = 'https://graph.instagram.com', now = new Date() }) {
  if (!accountId || !accessToken) throw new Error('accountId e accessToken são obrigatórios.');
  if (typeof fetchImpl !== 'function') throw new Error('fetch não está disponível nesta versão do Node.');
  assertDate(since, 'since'); assertDate(until, 'until');
  if (since > until) throw new Error('since deve ser anterior ou igual a until.');

  const options = { accountId, accessToken, since, until, fetchImpl, baseUrl };
  const metrics = await Promise.all(ACCOUNT_METRICS.map((metric) => fetchMetric(options, metric)));
  const audience = await fetchAudience(options);
  const id = `instagram-${now.toISOString().replace(/[:.]/g, '-')}`;
  const directory = path.join(outputRoot, id);
  const generatedAt = now.toISOString();
  const normalized = { id, source: 'instagram-api', apiVersion: API_VERSION, generatedAt, accountId, window: { since, until }, metrics: metrics.map(({ raw, ...metric }) => metric), audience: { status: audience.status, ...(audience.error ? { error: audience.error } : {}) } };
  const raw = { generatedAt, accountId, window: { since, until }, metrics: metrics.map(({ key, apiName, raw: metricRaw, error }) => ({ key, apiName, raw: metricRaw, error })), audience };
  await fs.mkdir(directory, { recursive: true });
  const normalizedPath = path.join(directory, 'snapshot.normalized.json');
  const rawPath = path.join(directory, 'snapshot.raw.json');
  await Promise.all([fs.writeFile(normalizedPath, `${JSON.stringify(normalized, null, 2)}\n`, 'utf8'), fs.writeFile(rawPath, `${JSON.stringify(raw, null, 2)}\n`, 'utf8')]);
  return { ...normalized, paths: { normalized: normalizedPath, raw: rawPath } };
}

module.exports = { ACCOUNT_METRICS, API_VERSION, createCommercialSnapshot, loadDotEnv };
