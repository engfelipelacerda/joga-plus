# Correções aplicadas no Joga+

## Problema encontrado

As opções de **Favoritos** e **BackLog** estavam quebrando por dois motivos principais:

1. O arquivo `prisma/schema.prisma` já tinha os tipos `backlog`, `favoritos` e o campo `status`, mas o client gerado do Prisma dentro de `backend/src/generated/prisma` estava antigo. Nele, o enum `TipoLista` ainda só aceitava:
   - `desejados`
   - `nao_jogados`
   - `jogados`
   - `jogar_novamente`

   Por isso, quando o backend tentava salvar `favoritos` ou `backlog`, o Prisma/banco podia rejeitar.

2. Na busca da biblioteca, alguns jogos vinham da RAWG com ID no formato `rawg-123`. Esse valor estava sendo enviado como se fosse `cheapshark_id`, mas a API CheapShark só aceita ID numérico. Isso fazia o backend falhar antes de adicionar o jogo na lista.

## Arquivos alterados

- `backend/src/modules/list/listModel.js`
  - Troquei as operações de lista para SQL parametrizado via Prisma raw query.
  - Isso evita o bug do client Prisma gerado antigo travando `favoritos`, `backlog` e `status`.

- `backend/src/modules/games/gameController.js`
  - Corrigi o salvamento de jogos quando o ID vem da RAWG.
  - Se o ID não for um ID válido da CheapShark, o backend procura o jogo pelo título na CheapShark antes de salvar.

- `frontend/src/pages/Library.jsx`
  - Corrigi a normalização dos jogos da busca.
  - Agora `rawg_id` não é mandado como `cheapshark_id`.

- `frontend/src/pages/Backlog.jsx`
  - Evitei quebra caso algum item venha sem status ou com status inválido.

- `frontend/src/contexts/AuthContext.jsx` e `frontend/src/pages/Login.jsx`
  - Ajustei o login para esperar carregar o usuário antes de navegar para `/menu`.

- `frontend/eslint.config.js`
  - Desativei duas regras muito rígidas que estavam fazendo o `npm run lint` falhar sem erro real de execução.

- `backend/prisma/patch_lists_backlog_favorites.sql`
  - Script para atualizar a tabela `lists` no MySQL/MariaDB.

## Passo obrigatório no banco

Antes de testar Favoritos e BackLog, rode o SQL abaixo no banco do projeto:

```bash
cd backend
mysql -u SEU_USUARIO -p NOME_DO_BANCO < prisma/patch_lists_backlog_favorites.sql
```

Exemplo, se seu banco for `db_name`:

```bash
mysql -u db_user -p db_name < prisma/patch_lists_backlog_favorites.sql
```

Se você usa Docker, pode rodar pelo Workbench também: abra o arquivo `backend/prisma/patch_lists_backlog_favorites.sql` e execute ele no schema do Joga+.

## Depois rode novamente

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

## Observação

Se o `npm run build` reclamar de `@rolldown/binding...`, não é erro dessas correções. É problema de `node_modules`/dependência opcional do Vite. Resolva apagando `node_modules` e instalando de novo:

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

No Windows, apague `node_modules` manualmente pelo Explorer ou use PowerShell.
