import { WindowLimiter } from '../lib/window-limiter.js';

export function rateLimit({ limit, windowMs, clock = Date.now }) {
  const limiter = new WindowLimiter({ limit, windowMs, clock });
  return async (ctx, next) => {
    if (!ctx.from) return;
    const result = limiter.take(String(ctx.from.id));
    if (!result.allowed) {
      // Não respondemos a cada mensagem bloqueada para não amplificar spam.
      if (ctx.callbackQuery) {
        await ctx.answerCallbackQuery({ text: 'Muitas ações seguidas. Aguarde um pouco.' });
      }
      return;
    }
    await next();
  };
}
