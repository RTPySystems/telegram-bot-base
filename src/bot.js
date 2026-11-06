import { Bot } from 'grammy';
import { rateLimit } from './middlewares/rate-limit.js';
import { observe } from './middlewares/observe.js';
import { publicCommands } from './commands/public.js';
import { adminCommands } from './commands/admin.js';
import { callbacks } from './handlers/callbacks.js';
import { errorHandler } from './handlers/errors.js';

export function createBot(config, logger, { botInfo, clock = Date.now } = {}) {
  const bot = new Bot(config.token, { botInfo });
  bot.use(observe(logger));
  bot.use(rateLimit({ limit: config.rateLimitMax, windowMs: config.rateLimitWindowMs, clock }));
  bot.use(publicCommands());
  bot.use(adminCommands(config.adminIds, clock(), clock));
  bot.use(callbacks());
  bot.on('message:text', async (ctx) => {
    if (ctx.message.text.startsWith('/')) await ctx.reply('Não conheço esse comando. Veja /help.');
  });
  bot.catch(errorHandler(logger));
  return bot;
}
