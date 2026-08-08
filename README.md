# Ramen Go API

[![NestJS](https://img.shields.io/badge/built%20with-NestJS-red.svg)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/written%20in-TypeScript-blue.svg)](https://www.typescriptlang.org/)

API RESTful para a aplicação "Ramen Go", uma plataforma onde usuários podem montar e pedir seu próprio ramen. Esta API gerencia os ingredientes (caldos, proteínas) e o processamento de pedidos.

## Contexto da Aplicação

Para ajudar a imaginar como esses dados vão estar sendo utilizados pelo cliente web e/ou mobile, abaixo está o link para o layout da aplicação que consumiria esta API.

[**Layout no Figma**](https://www.figma.com/design/uDdX536s8ylGc6TVSstATk/RamenGo-%5B2022%5D?node-id=1-21&t=1lJRXdvwphTCg64Q-1)

## Tecnologias Utilizadas

- [NestJS](https://nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)

## Como Começar

Siga os passos abaixo para configurar e executar o projeto localmente.

1.  **Clone o repositório**
    ```bash
    git clone https://github.com/seu-usuario/ramen-go-api.git
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

4.  **Inicie a aplicação**
    ```bash
    # Modo de desenvolvimento
    npm run start:dev
    ```
    A API estará disponível em `http://localhost:3000`.

## Estrutura do Código

A estrutura de pastas do projeto segue os princípios de Arquitetura Limpa, separando as responsabilidades em camadas bem definidas:

```
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
    -   `POST /order`: Realiza um novo pedido (protegido).
-   **Upload**
    -   `POST /image-upload`: Rota para upload de imagem (protegido).

## Autenticação

Para acessar os endpoints protegidos, é necessário enviar uma chave de API no cabeçalho `x-api-key` de cada requisição.

`x-api-key: <sua-chave-de-api>`

Endpoints públicos, como a listagem de caldos e proteínas, não exigem autenticação.