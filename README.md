# Ramen Go API

[![NestJS](https://img.shields.io/badge/built%20with-NestJS-red.svg)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/written%20in-TypeScript-blue.svg)](https://www.typescriptlang.org/)

API RESTful para a aplicação "Ramen Go", uma plataforma onde usuários podem montar e pedir seu próprio ramen. Esta API gerencia os ingredientes (caldos, proteínas) e o processamento de pedidos.

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
- Armazenamento: Cloudflare R2 / S3 — Integração de arquivos usando `@aws-sdk/client-s3` (R2 compatível com S3).
- Testes: Vitest + Supertest — Testes unitários e E2E com mocks e integrações.
- Docker & Docker Compose — Facilita rodar serviços dependentes (PostgreSQL) localmente.
- Qualidade: Prettier & ESLint — Formatação e linting para consistência no código.

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

3.  **Configure as variáveis de ambiente**
    Crie um arquivo `.env` na raiz do projeto e adicione a chave de API.
    ```env
    # .env
    API_KEY=your-secret-api-key
    ```

    ### Cloudflare R2 (S3 compatível)

    Se você pretende usar o Cloudflare R2 para armazenar imagens, siga estes passos:

    1. No painel do Cloudflare, acesse **R2** e crie um novo bucket (anote o nome do bucket).
    2. Ainda no painel do R2, crie **Access Keys** (Access Key ID e Secret Access Key) — copie e armazene em local seguro.
    3. Identifique o **Account ID** da sua conta Cloudflare (disponível no canto superior direito do painel ou nas configurações da conta).
    4. Defina as variáveis de ambiente locais com os valores obtidos:

    ```env
    # Cloudflare R2 / S3
    CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id
    AWS_BUCKET_NAME=your-r2-bucket-name
    AWS_ACCESS_KEY_ID=your-r2-access-key-id
    AWS_SECRET_ACCESS_KEY=your-r2-secret-access-key
    ```

    Observações:
    - Use o `AWS_BUCKET_NAME` ao enviar/ler objetos.
    - Garanta que as chaves tenham permissões para leitura/escrita no bucket.
    - Em produção, armazene as chaves em um cofre de segredos ou variáveis de ambiente do provedor (não no repositório).

4.  **Inicie a aplicação**
    ```bash
    # Modo de desenvolvimento
    npm run start:dev
    ```
    A API estará disponível em `http://localhost:3333`.

## Documentação da API (Swagger)

A API possui uma documentação interativa gerada automaticamente com o Swagger. Nela, você pode visualizar todos os endpoints, os formatos de envio/resposta, e até mesmo testar as requisições direto do navegador.

- **Local:** [http://localhost:3333/api](http://localhost:3333/api)
- **Produção (Render):** [https://ramen-go-api-xyjm.onrender.com/api](https://ramen-go-api-xyjm.onrender.com/api)

**Testando rotas protegidas:**
1. Acesse a documentação pelo navegador.
2. Clique no botão verde **"Authorize"** localizado no canto superior direito.
3. Insira o valor da sua `API_KEY` e clique em *Authorize*. 
4. Agora você pode expandir os endpoints e usar o botão *"Try it out"* para realizar chamadas reais para a API.

## Estrutura do Código

A estrutura de pastas do projeto segue os princípios de Arquitetura Limpa, separando as responsabilidades em camadas bem definidas:

```text
.
├── prisma/                 # Configuração do banco de dados (Schema, Migrations e Seeds)
├── src/
│   ├── core/               # Lógica compartilhada, classes base (Entity, Either) e erros globais
│   ├── domain/             # Núcleo da aplicação (Regras de Negócio e Casos de Uso)
│   │   └── restaurant/
│   │       ├── application/ # Contratos (Interfaces) e Casos de Uso (Use Cases)
│   │       └── enterprise/  # Entidades principais (Broth, Protein, Order)
│   └── infra/              # Integrações externas e dependências de framework (NestJS)
│       ├── auth/           # Guardas de rota e autenticação (API Key)
│       ├── database/       # Integração com Prisma, Repositórios e Mappers
│       ├── env/            # Validação de variáveis de ambiente com Zod
│       ├── http/           # Controladores (REST) e Presenters
│       └── storage/        # Integração com armazenamento de arquivos (Cloudflare R2)
├── test/                   # Testes automatizados (E2E, Factories e Repositórios In-Memory)
├── .env.example            # Exemplo das variáveis de ambiente necessárias
├── docker-compose.yml      # Configuração para subir o banco PostgreSQL local via Docker
└── package.json            # Dependências e scripts do projeto
```

## Funcionalidades e Endpoints

-   **Caldos (Broths)**
    -   `GET /broths`: Lista todos os caldos disponíveis.
    -   `POST /broths`: Cria um novo caldo (protegido).
-   **Proteínas (Proteins)**
    -   `GET /proteins`: Lista todas as proteínas disponíveis.
    -   `POST /proteins`: Cria uma nova proteína (protegida).
-   **Pedidos (Orders)**
    -   `GET /orders/:id`: Recupera um pedido por ID (protegido).
    -   `POST /orders`: Realiza um novo pedido (protegido).
-   **Upload**
    -   `POST /image-upload`: Rota para upload de imagem (protegido).

## Autenticação

Para acessar os endpoints protegidos, é necessário enviar uma chave de API no cabeçalho `x-api-key` de cada requisição.

`x-api-key: <sua-chave-de-api>`

Endpoints públicos, como a listagem de caldos e proteínas, não exigem autenticação.