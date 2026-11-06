import test from 'node:test';
import assert from 'node:assert/strict';
import { createBot } from '../src/bot.js';
import { loadConfig } from '../src/config.js';
import { errorHandler } from '../src/handlers/errors.js';

const logger = { debug() {}, error() {}, warn() {} };
function setup(max = 10) {
  const config = loadConfig({
    TELEGRAM_BOT_TOKEN: '123:teste',
    TELEGRAM_ADMIN_IDS: '42',
    RATE_LIMIT_MAX: String(max),
  });
  const bot = createBot(config, logger, {
    botInfo: {
      id: 123,
      is_bot: true,
      first_name: 'Teste',
      username: 'teste_bot',
      can_join_groups: true,
      can_read_all_group_messages: false,
      supports_inline_queries: false,
    },
  });
  const calls = [];
  bot.api.config.use(async (_, method, payload) => {
    calls.push({ method, payload });
    return {
      ok: true,
      result:
        method === 'answerCallbackQuery'
          ? true
          : { message_id: 1, date: 1, chat: { id: 1, type: 'private' }, text: payload.text },
    };
  });
  return { bot, calls };
}
function message(text, userId = 10) {
  return {
    update_id: 1,
    message: {
      message_id: 1,
      date: 1,
      chat: { id: userId, type: 'private' },
      from: { id: userId, is_bot: false, first_name: 'Teste' },
      text,
      entities: text.startsWith('/')
        ? [{ type: 'bot_command', offset: 0, length: text.split(' ')[0].length }]
        : [],
    },
  };
}

test('start envia menu inline e ping responde', async () => {
  const { bot, calls } = setup();
  await bot.handleUpdate(message('/start'));
  assert.ok(calls[0].payload.reply_markup.inline_keyboard.length);
  await bot.handleUpdate(message('/ping'));
  assert.match(calls[1].payload.text, /Pong/);
});

test('status é restrito a IDs autorizados', async () => {
  const { bot, calls } = setup();
  await bot.handleUpdate(message('/status'));
  assert.match(calls[0].payload.text, /restrito/);
  await bot.handleUpdate(message('/status', 42));
  assert.match(calls[1].payload.text, /Tempo online/);
});

test('limite impede respostas em sequência', async () => {
  const { bot, calls } = setup(1);
  await bot.handleUpdate(message('/ping'));
  await bot.handleUpdate(message('/ping'));
  assert.equal(calls.length, 1);
});

test('callback é reconhecido e confirmado', async () => {
  const { bot, calls } = setup();
  await bot.handleUpdate({
    update_id: 2,
    callback_query: {
      id: 'query',
      from: { id: 10, is_bot: false, first_name: 'Teste' },
      chat_instance: '1',
      data: 'menu:help',
      message: message('/start').message,
    },
  });
  assert.equal(calls[0].method, 'answerCallbackQuery');
  assert.match(calls[1].payload.text, /Comandos disponíveis/);
});

test('comandos desconhecidos recebem ajuda', async () => {
  const { bot, calls } = setup();
  await bot.handleUpdate(message('/desconhecido'));
  assert.match(calls[0].payload.text, /Não conheço/);
});

test('erro de comando recebe resposta segura', async () => {
  const replies = [];
  await errorHandler(logger)({
    error: new Error('interno'),
    ctx: { chat: {}, reply: async (text) => replies.push(text) },
  });
  assert.match(replies[0], /Não consegui/);
});
