# Suíte de testes

Aluno: Pedro Rickson Fernandes Aragão - 542619
<br>
Módulo: Login
<br>

### Testes:

```text
- UT01 Autenticar usuário com credenciais válidas.
- UT02 Rejeitar usuário inexistente.
- UT03 Rejeitar senha incorreta.
- UT04 Gerar JWT.
- UT11 Deve chamar UserRepository.findUserByUsername com o username informado.
- UT12 Deve retornar erro quando o repositório lançar uma exceção.
- UT13 Deve chamar bcrypt.compare com a senha informada e o hash armazenado.
- UT14 Deve gerar JWT contendo o ID do usuário.
```

---

## Como rodar:

clone o repositório:

```bash
    git clone https://github.com/engfelipelacerda/joga-plus.git && cd joga-plus/backend
```

Mude para a branch com os testes:

```bash
    git switch tests/login-pedro
```

Instale as dependências:

```bash
    npm install
```

Rode os testes:

```bash
    npm test
```
