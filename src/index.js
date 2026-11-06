import { loadConfig } from './config.js';
import { createLogger } from './lib/logger.js';
import { installShutdown } from './lib/shutdown.js';
import { startupError } from './lib/startup-error.js';
import { createBot } from './bot.js';

async function main() {
  const config = loadConfig();
  const logger = createLogger(config.logLevel);
  const bot = createBot(config, logger);
  const lifecycle = installShutdown({
    logger,
    stop: async () => {
      if (bot.isRunning()) await bot.stop();
    },
  });
  try {
    await bot.init();
    if (lifecycle.isStopping()) return;
    await bot.api.setMyCommands([
      { command: 'start', description: 'Abrir o menu' },
      { command: 'help', description: 'Ver comandos' },
      { command: 'ping', description: 'Testar conexão' },
    ]);
    if (lifecycle.isStopping()) return;
    await bot.start({
      allowed_updates: ['message', 'callback_query'],
      onStart: (info) => logger.info({ bot: info.username }, 'Bot online em long polling.'),
    });
  } catch (err) {
    await lifecycle.shutdown('startup', 1);
    throw err;
  }
}

main().catch(startupError);
