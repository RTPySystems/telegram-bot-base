import { InlineKeyboard } from 'grammy';

export function mainMenu() {
  return new InlineKeyboard()
    .text('Ver comandos', 'menu:help')
    .text('Sobre o projeto', 'menu:about')
    .row()
    .url('Conheça a RTCloud', 'https://rtcloud.com.br');
}
