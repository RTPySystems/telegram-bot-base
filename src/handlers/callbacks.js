import { Composer } from 'grammy';
import { helpText } from '../commands/public.js';

export function callbacks() {
  const handler = new Composer();
  handler.callbackQuery('menu:help', async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.reply(helpText);
  });
  handler.callbackQuery('menu:about', async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.reply('Uma base modular por RTPySystems, criador da RTCloud. https://rtcloud.com.br');
  });
  handler.on('callback_query:data', (ctx) =>
    ctx.answerCallbackQuery({ text: 'Este botão não está mais disponível.' }),
  );
  return handler;
}
