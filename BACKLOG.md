# 🍜 Ramen Go API - Backlog & TODOs

## 📦 Épico 1: Gestão de Pedidos (Consultas)

**User Story:**
> *"As a client application, I want to retrieve a specific order by its ID so that I can display the order details and status to the user."*

### Tarefas

**Domain & Application**
- [x] Adicionar o método `findById(id: string): Promise<Order | null>` no contrato `order-repository.ts`.
- [x] Criar o caso de uso `order-get-by-id.usecase.ts` e seus testes unitários.

**Infraestrutura (Database)**
- [x] Implementar o método `findById` no repositório em memória (`in-memory-order-repository.ts`).
- [x] Implementar o método `findById` no repositório do Prisma (`prisma-order-repository.ts`).

**HTTP (Controllers & E2E)**
- [x] Criar o controlador `get-order.controller.ts` para a rota `GET /order/:id`.
- [x] Desenvolver o teste E2E em `get-order.controller.e2e-spec.ts`.

---

## 👥 Épico 2: Gestão de Usuários (Autenticação, Self-Service e Recuperação)

**User Story:**
> *"As a user, I want to create an account, authenticate, manage my profile, and recover my password, so that I have full, secure, and independent control over my account."*

### Tarefas

**Infraestrutura (Database & Mappers)**
- [x] Adicionar o model `User` e `UserToken` no `schema.prisma`.
- [x] Rodar as migrations para criação das tabelas.
- [x] Criar a entidade `user.ts` e o mapper `prisma-user-mapper.ts`.
- [x] Implementar o repositório `prisma-user-repository.ts`.

**Domain & Application**
- [x] Criar o contrato `user-repository.ts`.
- [x] Criar os casos de uso de ciclo de vida e testes unitários (Register, Authenticate, Edit, Delete).
- [x] Implementar a lógica de geração de token e troca de senha (`user-send-password-reset` e `user-reset-password`).

**HTTP (Controllers & E2E)**
- [x] Criar controladores para as rotas de conta (`/accounts`, `/sessions`, `/profile`).
- [x] Desenvolver os testes E2E do fluxo de conta.
- [x] Criar controladores para recuperação de senha (`POST /password/forgot` e `PATCH /password/reset`).
- [x] Desenvolver os testes E2E do fluxo de recuperação de senha.

---

## 🛠️ Épico 3: Débito Técnico (Modernização)

**User Story:**
> *"As a developer, I want to update core dependencies so that the project remains secure, performant, and aligned with modern ecosystem standards."*

### Tarefas
- [ ] Atualizar ESLint para a v10 (Migrar para Flat Config `eslint.config.js`).
- [ ] Atualizar NestJS para a v11 e resolver possíveis *breaking changes*.
- [ ] Atualizar Prisma para a v7.
- [ ] Atualizar Vitest para a v4.

---

## 📧 Épico 4: Infraestrutura de E-mails (Produção)

**User Story:**
> *"As a system, I want to send real, formatted emails using an SMTP provider and template engine so that users receive professional recovery links in their real inboxes."*

### Tarefas
- [ ] Instalar e configurar as bibliotecas `nodemailer` e `handlebars`.
- [ ] Implementar o `NodemailerMailProvider` seguindo o contrato de envio de e-mails.
- [ ] Desenvolver os templates HTML na pasta de views (ex: `password-reset.hbs`).
- [ ] Substituir o provedor de console pelo provedor real no `MailModule` (ambiente de produção).

---

## 🛡️ Épico 5: Painel Administrativo (Backoffice & RBAC)

**User Story:**
> *"As a system administrator, I want a secure set of routes to manage all users, orders, and catalog items, ensuring full control over the platform's operation without mixing with the customer's self-service logic."*

### Tarefas

**Infraestrutura (Database & Segurança)**
- [ ] Adicionar o `enum Role { USER, ADMIN }` no `schema.prisma` e vinculá-lo ao model `User`.
- [ ] Rodar a migration (`add_user_role`) e atualizar a entidade e o mapper.
- [ ] Criar o decorador `@Roles()` e o `RolesGuard` para proteger as rotas administrativas.

**Domain & Application**
- [ ] Criar o caso de uso `fetch-users.usecase.ts` (Account Domain).
- [ ] Criar o caso de uso `order-list-all.usecase.ts` (Restaurant Domain).

**HTTP (Controllers & E2E)**
- [ ] Criar a estrutura base de rotas administrativas em `src/infra/http/controllers/admin/`.
- [ ] Implementar o controlador `fetch-users.controller.ts` (`GET /admin/users`).
- [ ] Implementar o controlador `list-all-orders.controller.ts` (`GET /admin/orders`).
- [ ] Desenvolver testes E2E garantindo que usuários com *role* `USER` recebam erro `403 Forbidden` nas rotas `/admin`.