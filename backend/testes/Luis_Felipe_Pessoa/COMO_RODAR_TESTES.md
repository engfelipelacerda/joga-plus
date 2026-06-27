# Como Rodar os Testes — Luis Felipe Pessoa

## Módulo testado

`src/modules/assessment/assessmentController.js`

---

## Pré-requisitos

- Node.js v18+
- npm

---

## Instalação

Na raiz da pasta `backend/`, instale as dependências:

```bash
cd backend
npm install
```

O Vitest já está listado como `devDependency` no `package.json` do projeto.

---

## Rodando os testes

```bash
npx vitest run testes/Luis_Felipe_Pessoa/assessmentController.test.js
```

### Saída esperada

```
 RUN  v4.x.x

 ✓ testes/Luis_Felipe_Pessoa/assessmentController.test.js (17 tests)

 Test Files  1 passed (1)
       Tests  17 passed (17)
```

---

## Cenários testados

| #   | Função      | Cenário                                              |
| --- | ----------- | ---------------------------------------------------- |
| 1   | `create`    | Retorna 400 quando `jogo_id` não é enviado           |
| 2   | `create`    | Retorna 400 quando `nota` não é enviada              |
| 3   | `create`    | Retorna 400 quando `nota` é menor que 0              |
| 4   | `create`    | Retorna 400 quando `nota` é maior que 5              |
| 5   | `create`    | Retorna 400 quando comentário excede 500 caracteres  |
| 6   | `create`    | Retorna 403 quando jogo não está na lista "jogados"  |
| 7   | `create`    | Retorna 403 quando jogo não está em nenhuma lista    |
| 8   | `create`    | Retorna 409 quando usuário já avaliou o jogo         |
| 9   | `create`    | Retorna 201 e cria avaliação com dados válidos       |
| 10  | `listAll`   | Retorna 200 com todas as avaliações do usuário       |
| 11  | `getByGame` | Retorna 200 com avaliação individual e média do jogo |
| 12  | `update`    | Retorna 400 quando `jogo_id` não é enviado           |
| 13  | `update`    | Retorna 400 quando `nota` está fora do intervalo     |
| 14  | `update`    | Retorna 404 quando avaliação não existe              |
| 15  | `update`    | Retorna 200 e atualiza avaliação com dados válidos   |
| 16  | `remove`    | Retorna 404 quando avaliação não existe              |
| 17  | `remove`    | Retorna 200 e remove avaliação existente             |

---

## Observações

- Nenhum banco de dados é necessário — os modelos são mockados com `vi.mock()`.
- Nenhuma variável de ambiente (`.env`) é necessária para rodar os testes.
- Cada teste é isolado via `vi.clearAllMocks()` no `beforeEach`.
