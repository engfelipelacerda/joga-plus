# Testes Unitários — Módulo de Listas (`listController`)

Testes escritos com **Vitest** para o módulo `listController.js` do projeto JogaPlus.

---

## Módulo testado

`src/modules/list/listController.js`

O módulo gerencia todas as operações de listas de jogos do usuário: adicionar, listar, filtrar por tipo, mover entre listas e remover.

---

## Pré-requisitos

- Node.js **v18+**
- npm

---

## Como instalar e rodar

### 1. Entrar na pasta do backend

```bash
cd backend
```

### 2. Instalar as dependências (incluindo o Vitest)

```bash
npm install
```

> O Vitest já está listado em `devDependencies` no `package.json`.

### 3. Rodar os testes

```bash
npx vitest run testes/Eduardo_Santiago/listController.test.js
```

### 4. Saída esperada

```
 RUN  v4.x.x /caminho/para/backend

 ✓ testes/Eduardo_Santiago/listController.test.js (10 tests)

 Test Files  1 passed (1)
       Tests  10 passed (10)
```

---

## Estrutura dos arquivos de teste

```
backend/
└── testes/
    └── Eduardo_Santiago/
        ├── COMO_RODAR_TESTES.md
        └── listController.test.js
```

---

## Cenários cobertos

| #   | Função       | Cenário                                                       |
| --- | ------------ | ------------------------------------------------------------- |
| 1   | `add`        | Retorna 400 quando `jogo_id` ou `tipo_lista` não são enviados |
| 2   | `add`        | Retorna 400 quando `tipo_lista` for inválido                  |
| 3   | `add`        | Retorna 400 quando `prioridade` estiver fora do intervalo     |
| 4   | `add`        | Retorna 404 quando o jogo não existir no banco                |
| 5   | `add`        | Retorna 409 quando o jogo já estiver na lista do usuário      |
| 6   | `add`        | Retorna 201 e adiciona jogo com dados válidos                 |
| 7   | `listAll`    | Retorna 200 com todos os jogos das listas do usuário          |
| 8   | `listByType` | Retorna 400 quando o tipo informado na rota for inválido      |
| 9   | `moveToList` | Retorna 200 e move jogo existente para outra lista            |
| 10  | `remove`     | Retorna 200 e exclui jogo existente da lista                  |

---

## Observação importante

Esses testes são **unitários**. Eles não acessam o banco de dados diretamente, porque os métodos de `listModel` e `gameModel` são substituídos por mocks durante a execução.

Isso permite testar a lógica do `listController` de forma isolada, sem depender do MySQL, Prisma ou dados reais cadastrados.
