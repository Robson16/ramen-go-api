# Ramen Go API

[![NestJS](https://img.shields.io/badge/built%20with-NestJS-red.svg)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/written%20in-TypeScript-blue.svg)](https://www.typescriptlang.org/)

API RESTful para a aplicação "Ramen Go", uma plataforma onde usuários podem criar contas, autenticar-se, montar e pedir seu próprio ramen. Esta API gerencia usuários, ingredientes (caldos, proteínas) e o processamento de pedidos.

## Contexto da Aplicação

Para ajudar a imaginar como esses dados vão estar sendo utilizados pelo cliente web e/ou mobile, abaixo está o link para o layout da aplicação que consumiria esta API.

[**Layout no Figma**](https://www.figma.com/design/uDdX536s8ylGc6TVSstATk/RamenGo-%5B2022%5D?node-id=1-21&t=1lJRXdvwphTCg64Q-1)

## Tecnologias Utilizadas

- [NestJS](https://nestjs.com/) — Framework Node.js para construção de APIs escaláveis e modulares.
- [TypeScript](https://www.typescriptlang.org/) — Superset do JavaScript com tipagem estática, melhorando manutenção e DX.
- [Prisma](https://www.prisma.io/) — ORM com geração de client e suporte a migrations para PostgreSQL.
- [PostgreSQL](https://www.postgresql.org/) — Banco de dados relacional usado em desenvolvimento e produção.
- [Zod](https://github.com/colinhacks/zod) — Validação de schemas e parsing seguro de variáveis de ambiente.
- [Swagger / OpenAPI](https://swagger.io/) — Documentação interativa da API gerada via `@nestjs/swagger`.
- **JWT & Bcrypt** — Autenticação segura via JSON Web Tokens e hash de senhas.
- **Nodemailer & Handlebars** — Envio de e-mails transacionais (como recuperação de senha) utilizando templates HTML dinâmicos.
- Armazenamento: Cloudflare R2 / S3 — Integração de arquivos usando `@aws-sdk/client-s3`.
- Testes: Vitest + Supertest — Testes unitários e E2E com mocks, banco de dados isolados em memória e fake providers.
- Docker & Docker Compose — Facilita rodar serviços dependentes (PostgreSQL) localmente.

## Como Começar

Siga os passos abaixo para configurar e executar o projeto localmente.

1.  **Clone o repositório**
    ```bash
    git clone https://github.com/Robson16/ramen-go-api.git
    cd ramen-go-api
    ```

2.  **Instale as dependências**
    ```bash
    npm install
    ```

3.  **Suba o Banco de Dados (Docker)**
    ```bash
    docker-compose up -d
    ```

4.  **Configure as variáveis de ambiente**
    Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:
    ```env
    # Application Front-End
    APP_URL="http://localhost:3000"

    # Application Back-End
    APP_PORT="3333"

    DATABASE_URL="postgresql://postgres:docker@localhost:5432/ramengo?schema=public"
    JWT_SECRET="sua-chave-secreta-jwt"

    # Cloudflare R2 / S3
    CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id
    AWS_BUCKET_NAME=your-r2-bucket-name
    AWS_ACCESS_KEY_ID=your-r2-access-key-id
    AWS_SECRET_ACCESS_KEY=your-r2-secret-access-key

    # SMTP / E-mail
    SMTP_HOST="sandbox.smtp.mailtrap.io"
    SMTP_PORT=2525
    SMTP_USER="seu_usuario_aqui"
    SMTP_PASS="sua_senha_aqui"
    MAIL_FROM="Equipe Ramen Go <noreply@ramengo.com>"
    ```

    - `APP_URL`: URL do frontend, usada nos links de redefinição de senha enviados por e-mail.
    - `APP_PORT`: porta em que a API backend será iniciada.
    - `SMTP_*`: configurações do provedor de e-mail usado para envio real das mensagens.

5.  **Execute as Migrations**
    Para criar as tabelas no banco de dados:
    ```bash
    npx prisma migrate dev
    ```

6.  **Inicie a aplicação**
    ```bash
    npm run start:dev
    ```
    A API estará disponível em `http://localhost:3333`.

## Documentação da API (Swagger)

A API possui uma documentação interativa gerada automaticamente com o Swagger. Nela, você pode visualizar todos os endpoints, os formatos de envio/resposta, e testar as requisições.

- **Local:** [http://localhost:3333/api](http://localhost:3333/api)

**Testando rotas protegidas:**
1. Crie uma conta na rota `POST /accounts`.
2. Faça login na rota `POST /sessions` para receber o seu `access_token`.
3. Copie o token, clique no botão verde **"Authorize"** (no topo do Swagger) e cole o token.
4. Agora você pode testar rotas protegidas (como gerenciar perfil ou criar pedidos).

## Estrutura do Código

O projeto segue os princípios de Arquitetura Limpa (Clean Architecture) e Domain-Driven Design (DDD), separando as responsabilidades:

```text
.
├── prisma/                 # Schema do Prisma, Migrations e Seeds
├── src/
│   ├── core/               # Lógica compartilhada, base de Entidades e erros globais
│   ├── domain/             # Núcleo da aplicação (Casos de Uso e Regras de Negócio)
│   │   ├── account/        # Domínio de Usuários e Autenticação
│   │   └── restaurant/     # Domínio de Catálogo e Pedidos (Broths, Proteins, Orders)
│   └── infra/              # Camada externa e framework (NestJS)
│       ├── auth/           # JwtStrategy, Guards e Decorators
│       ├── cryptography/   # Implementações de Hash (Bcrypt) e Encriptação (JWT)
│       ├── database/       # Integração com Prisma, Repositórios e Mappers
│       ├── env/            # Validação Zod para variáveis de ambiente
│       ├── http/           # Controladores (REST) e Presenters (DTOs)
│       ├── mailing/        # Provedores de envio de e-mails
│       └── storage/        # Integração R2 / S3 para imagens
└── test/                   # Testes automatizados (E2E, Factories)
```

## Funcionalidades e Endpoints

### 👤 Contas e Autenticação (Accounts)

*   `POST /accounts`: Cria uma nova conta de usuário.
*   `POST /sessions`: Realiza login e retorna um JWT.
*   `GET /profile`: Retorna o perfil do usuário logado (protegido).
*   `PUT /profile`: Edita os dados do próprio perfil (protegido).
*   `DELETE /profile`: Exclui a própria conta permanentemente (protegido).
*   `POST /password/forgot`: Solicita a recuperação de senha e envia um e-mail com o token.
*   `PATCH /password/reset`: Redefine a senha do usuário utilizando o token de recuperação.

### 🍜 Catálogo e Pedidos (Restaurant)

#### Caldos (Broths)

*   `GET /broths`: Lista todos os caldos disponíveis.
*   `POST /broths`: Cria um novo caldo (protegido).

#### Proteínas (Proteins)

*   `GET /proteins`: Lista todas as proteínas disponíveis.
*   `POST /proteins`: Cria uma nova proteína (protegida).

#### Pedidos (Orders)

*   `GET /orders/:id`: Recupera os detalhes de um pedido específico (protegido).
*   `POST /orders`: Realiza um novo pedido enviando ID do caldo e proteína (protegido).

#### Upload

*   `POST /image-upload`: Faz upload de imagens para os ingredientes no R2 (protegido).

### Autenticação

A aplicação utiliza JWT (JSON Web Token). Após fazer login na rota de sessões, você deve incluir o token gerado no cabeçalho `Authorization` das requisições protegidas:

```
Authorization: Bearer <seu-jwt-token>
```

Endpoints de catálogo (`GET /broths` e `GET /proteins`) são públicos e não exigem autenticação.