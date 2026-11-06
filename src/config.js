import { ConfigError, integer, logLevel, required } from './lib/env.js';

export function loadConfig(env = process.env) {
  const token = required(env, 'TELEGRAM_BOT_TOKEN', /^\d+:[A-Za-z0-9_-]+$/);
  const admins = (env.TELEGRAM_ADMIN_IDS || '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
  if (admins.some((id) => !/^\d+$/.test(id))) {
    throw new ConfigError('TELEGRAM_ADMIN_IDS aceita apenas IDs numéricos separados por vírgula.');
  }
  return {
    token,
    adminIds: new Set(admins),
    rateLimitMax: integer(env, 'RATE_LIMIT_MAX', 5, 1, 100),
    rateLimitWindowMs: integer(env, 'RATE_LIMIT_WINDOW_MS', 10_000, 1000, 3_600_000),
    logLevel: logLevel(env),
  };
}
