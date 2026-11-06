# Operação e diagnóstico

## Erro 409 / conflito no getUpdates

Há outra instância usando o mesmo token, ou um webhook anterior ainda está ativo. Pare a outra instância. Se estiver migrando de webhook, remova-o conscientemente pela Bot API antes de usar long polling. Não execute dois pollers em paralelo.

## Administrador sem acesso

`TELEGRAM_ADMIN_IDS` usa IDs numéricos de usuário, não apelidos, telefones ou IDs de chat. Uma lista vazia nega todos os acessos. Reinicie o processo após alterar as variáveis.

## Botões ficam carregando

Todo callback precisa de `answerCallbackQuery`. A base confirma os callbacks conhecidos, desconhecidos e os cliques limitados por excesso de ações.

## Limites e falhas da API

Updates bloqueados por rate limiting não geram respostas de texto, para não multiplicar spam. Em callbacks, o aviso é mostrado no próprio clique. Erros `GrammyError` e `HttpError` são registrados sem token ou payload. Não há reenvio cego: ações podem ter chegado à plataforma antes de a conexão cair.

## Antes de publicar uma alteração

- Rode lint, formatação, testes e smoke test de startup.
- Verifique `git diff --staged` para confirmar que não há segredos ou dados pessoais.
- Confira mudanças de dependências e o lockfile. Não troque versões maiores sem revisar a API.
- Teste com uma conta dedicada e permissões mínimas antes de promover a alteração.
- Use os logs da hospedagem para acompanhar reinícios e consumo real; não há SLA de aplicação nesta base.

## Segredos e logs

As variáveis do painel têm preferência prática sobre arquivos empacotados. Não envie `.env`
para repositórios, imagens Docker ou issues. O logger registra apenas metadados operacionais,
não o conteúdo das conversas. Para investigar um problema, reproduza com dados fictícios e
não habilite logs brutos de SDK em produção.

## Encerramento e reinício

`SIGINT` e `SIGTERM` interrompem conexões e removem listeners. Há um prazo máximo de 10 segundos
para tarefas pendentes. Reinicie o processo após mudar variáveis de ambiente. Verifique a política
de reinício da hospedagem para não transformar erro permanente de credenciais em loop contínuo.

[Voltar ao README](../README.md)
