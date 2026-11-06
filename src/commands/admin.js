import { Composer } from 'grammy';
import { adminOnly } from '../middlewares/admin.js';

export function adminCommands(adminIds, startedAt = Date.now(), clock = Date.now) {
  const commands = new Composer();
  commands.command('status', adminOnly(adminIds), async (ctx) => {
    const uptime = Math.floor((clock() - startedAt) / 1000);
    const memory = Math.round(process.memoryUsage().rss / 1024 / 1024);
    await ctx.reply(`Painel do bot\nTempo online: ${uptime}s\nMemória do processo: ${memory} MB`);
  });
  return commands;
}
