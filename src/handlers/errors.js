import { GrammyError, HttpError } from 'grammy';

export function errorHandler(logger) {
  return async ({ error, ctx }) => {
    if (error instanceof GrammyError) {
      logger.warn({ errorCode: error.error_code }, 'A API do Telegram recusou uma operação.');
      // Sem reenvio automático: pode ser bloqueio, limite ou chat indisponível.
      return;
    }
    if (error instanceof HttpError) {
      logger.error({ err: error }, 'Não foi possível acessar a API do Telegram.');
      return;
    }
    logger.error({ err: error }, 'Falha ao processar comando.');
    try {
      if (ctx.chat) await ctx.reply('Não consegui concluir agora. Tente novamente em instantes.');
    } catch (err) {
      logger.warn({ err }, 'Não foi possível avisar o chat.');
    }
  };
}
