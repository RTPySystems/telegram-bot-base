import { Composer } from 'grammy';
import { mainMenu } from '../keyboards/main-menu.js';

export const helpText = [
  'Comandos disponíveis:',
  '/start — Abrir o menu',
  '/help — Mostrar esta ajuda',
  '/ping — Testar a resposta do bot',
  '/status — Resumo de execução (administradores)',
].join('\n');

export function publicCommands() {
  const commands = new Composer();
  commands.command('start', (ctx) =>
    ctx.reply('Tudo pronto por aqui! Escolha uma opção abaixo para começar.', {
      reply_markup: mainMenu(),
    }),
  );
  commands.command('help', (ctx) => ctx.reply(helpText, { reply_markup: mainMenu() }));
  commands.command('ping', (ctx) => ctx.reply('Pong! Bot online e recebendo comandos.'));
  return commands;
}
