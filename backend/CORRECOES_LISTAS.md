# Correção de Favoritos e BackLog

O erro encontrado no terminal foi:

```txt
Unknown column 'status' in 'field list'
```

Isso significa que o código já tentava usar `lists.status`, mas a tabela `lists` do banco ainda estava antiga e não tinha essa coluna.

## O que foi corrigido

- `src/server.js` agora chama `ensureListsSchema()` antes de subir o Express.
- `src/database/ensureListsSchema.js` foi criado para garantir automaticamente:
  - `tipo_lista` com `backlog` e `favoritos`;
  - coluna `status` com `quer_jogar`, `joguei` e `talvez`.
- `prisma/patch_lists_backlog_favorites.sql` também foi atualizado para corrigir o banco manualmente.

## Como testar

```bash
cd backend
npm install
npm run dev
```

Ao iniciar, deve aparecer:

```txt
[Banco] Schema da tabela lists verificado.
Express subiu!
```

Depois abra o frontend e teste Favoritar/BackLog.

## Se o backend reclamar de permissão no ALTER TABLE

Execute manualmente no MySQL Workbench o arquivo:

```txt
backend/prisma/patch_lists_backlog_favorites.sql
```

Ou rode:

```bash
mysql -u SEU_USUARIO -p NOME_DO_BANCO < prisma/patch_lists_backlog_favorites.sql
```
