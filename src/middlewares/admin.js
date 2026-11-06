export function adminOnly(adminIds) {
  return async (ctx, next) => {
    if (!ctx.from || !adminIds.has(String(ctx.from.id))) {
      await ctx.reply('Este comando é restrito aos administradores do bot.');
      return;
    }
    await next();
  };
}
