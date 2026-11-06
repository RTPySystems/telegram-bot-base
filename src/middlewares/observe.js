export function observe(logger) {
  return async (ctx, next) => {
    const started = performance.now();
    try {
      await next();
    } finally {
      logger.debug(
        { durationMs: Math.round(performance.now() - started), update: ctx.update.update_id },
        'Update processado.',
      );
    }
  };
}
