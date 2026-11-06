import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig } from '../src/config.js';

const env = { TELEGRAM_BOT_TOKEN: '123:token_teste' };
test('valida token, administradores e limites', () => {
  assert.throws(() => loadConfig({}), /TELEGRAM_BOT_TOKEN/);
  assert.throws(() => loadConfig({ TELEGRAM_BOT_TOKEN: 'errado' }), /TELEGRAM_BOT_TOKEN/);
  assert.equal(loadConfig(env).adminIds.size, 0);
  assert.equal(loadConfig({ ...env, TELEGRAM_ADMIN_IDS: '42, 99' }).adminIds.has('42'), true);
  assert.throws(() => loadConfig({ ...env, TELEGRAM_ADMIN_IDS: 'admin' }), /ADMIN_IDS/);
  assert.throws(() => loadConfig({ ...env, RATE_LIMIT_MAX: '0' }), /RATE_LIMIT_MAX/);
});
