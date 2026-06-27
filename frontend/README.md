# Joga+ — Frontend

Interface web do projeto **Joga+**, uma plataforma para organizar sua biblioteca de jogos, acompanhar promoções via CheapShark e gerenciar listas personalizadas.

---

## Tecnologias

- [React 19](https://react.dev/)
- [Vite 8](https://vite.dev/)
- [React Router DOM 7](https://reactrouter.com/)
- [Lucide React](https://lucide.dev/) — ícones

---

## Pré-requisitos

- **Node.js** v18 ou superior
- **npm** v9 ou superior
- Backend do Joga+ rodando em `http://localhost:3333`

---

## Instalação

Clone o repositório e entre na pasta do frontend:

```bash
cd frontend
npm install
```

---

## Rodando em desenvolvimento

```bash
npm run dev
```

O Vite sobe o servidor em **http://localhost:5173** por padrão.

> O backend precisa estar rodando em `http://localhost:3333` antes de abrir o frontend. Veja o README do backend para instruções.

---

## Outros comandos

| Comando           | O que faz                                           |
| ----------------- | --------------------------------------------------- |
| `npm run dev`     | Inicia o servidor de desenvolvimento com hot reload |
| `npm run build`   | Gera a versão de produção na pasta `dist/`          |
| `npm run preview` | Serve localmente o build de produção                |
| `npm run lint`    | Roda o ESLint para verificar o código               |

---

## Estrutura de pastas

```
frontend/
├── public/                       # Arquivos estáticos
├── src/
│   ├── assets/                   # Imagens e ícones estáticos
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/               # Componentes reutilizáveis
│   │   ├── BacklogStatusPill.jsx # Pill de status do backlog
│   │   ├── PrivateRoute.jsx      # Proteção de rotas autenticadas
│   │   └── SidebarLayout.jsx     # Layout com sidebar para páginas autenticadas
│   ├── contexts/                 # Contextos globais do React
│   │   └── AuthContext.jsx       # Autenticação (token + usuário)
│   ├── pages/                    # Páginas da aplicação
│   │   ├── Backlog.jsx           # Lista de backlog do usuário
│   │   ├── Favorites.jsx         # Jogos favoritos
│   │   ├── Home.jsx              # Landing page
│   │   ├── Library.jsx           # Biblioteca de jogos
│   │   ├── Login.jsx             # Tela de login
│   │   ├── Menu.jsx              # Dashboard principal
│   │   ├── Profile.jsx           # Perfil do usuário
│   │   ├── Register.jsx          # Tela de cadastro
│   │   └── Settings.jsx          # Configurações
│   ├── services/
│   │   └── api.js                # Cliente HTTP centralizado (injeta JWT automaticamente)
│   ├── App.css                   # Estilos globais da aplicação
│   ├── App.jsx                   # Rotas da aplicação
│   ├── index.css                 # Reset e variáveis CSS
│   ├── library.css               # Estilos da página de biblioteca
│   ├── login.css                 # Estilos da tela de login
│   ├── main.jsx                  # Ponto de entrada
│   ├── menu.css                  # Estilos do dashboard
│   ├── profile.css               # Estilos da página de perfil
│   └── register.css              # Estilos da tela de cadastro
├── index.html                    # HTML base
├── package.json
└── vite.config.js                # Configuração do Vite
```

---

## Variáveis e configuração

O frontend não usa arquivo `.env`. A URL do backend está definida diretamente em `src/services/api.js`:

```js
const BASE_URL = "http://localhost:3333";
```

Se o backend rodar em outra porta ou host, altere essa constante.

---

## Fluxo de autenticação

1. Usuário acessa `/login` e entra com username e senha
2. O backend retorna um **token JWT**
3. O token é salvo no `localStorage` e injetado automaticamente em todas as chamadas à API
4. Os dados do usuário são buscados via `GET /users/me` e ficam disponíveis globalmente pelo `AuthContext`
5. Rotas como `/menu` e `/library` são protegidas — redirecionam para `/login` se não houver token válido
6. O botão **Sair** no sidebar remove o token e redireciona para `/login`

---

## Integração com CheapShark

A busca de jogos e verificação de promoções usam a [API CheapShark](https://www.cheapshark.com/api/) via backend:

| Ação                              | Rota backend                |
| --------------------------------- | --------------------------- |
| Buscar jogos por título           | `GET /games/search?titulo=` |
| Salvar jogo no banco              | `POST /games`               |
| Adicionar à lista do usuário      | `POST /lists`               |
| Ver biblioteca do usuário         | `GET /lists`                |
| Verificar promoções dos desejados | `POST /promos/check`        |
| Ver promoções ativas              | `GET /promos`               |
