# 🍜 Ramen Go API - Backlog & TODOs

## 📦 Épico 1: Gestão de Pedidos

**User Story:**
> *"As a client application, I want to retrieve a specific order by its ID so that I can display the order details and status to the user."*

### Tarefas (Tasks)

**Domain & Application (Regras de Negócio)**
- [x] Adicionar o método `findById(id: string): Promise<Order | null>` no contrato `order-repository.ts`.
- [x] Criar o arquivo `order-get-by-id.usecase.ts`.
- [x] Escrever os testes unitários em `order-get-by-id.usecase.spec.ts`.

**Database (Infraestrutura)**
- [x] Implementar o método `findById` no repositório em memória (`in-memory-order-repository.ts`).
- [x] Implementar o método `findById` no Prisma (`prisma-order-repository.ts`).

**HTTP (Controladores)**
- [x] Criar o controlador `get-order.controller.ts` para a rota `GET /order/:id`.
- [x] Escrever o teste E2E `get-order.controller.e2e-spec.ts`.

---

## 👥 Épico 2: Gestão de Usuários (Users CRUD)

**User Story:**
> *"As an administrator, I want to manage (create, read, update, delete) user accounts so that I can maintain the platform's access control."*

### Tarefas (Tasks)

**Banco de Dados & Entidade**
- [x] Adicionar o model `User` no `schema.prisma` (id, name, email, password, createdAt, updatedAt).
- [x] Rodar a migration (`npx prisma migrate dev`).
- [x] Criar a entidade `user.ts` na pasta `domain/restaurant/enterprise/entities`.

**Application (Contratos e Use Cases)**
- [x] Criar a interface `user-repository.ts` (métodos: create, findById, findByEmail, save, delete).
- [x] Criar o caso de uso `user-create.usecase.ts` e seus testes unitários.
- [ ] Criar o caso de uso `user-list.usecase.ts` e seus testes unitários.
- [x] Criar o caso de uso `user-update.usecase.ts` e seus testes unitários.
- [x] Criar o caso de uso `user-delete.usecase.ts` e seus testes unitários.

**Infraestrutura (Prisma)**
- [x] Criar o mapper `prisma-user-mapper.ts`.
- [x] Criar o repositório `prisma-user-repository.ts` implementando a comunicação com o banco.

**Controllers & Testes E2E**
- [ ] Criar os controladores para as rotas (`POST`, `GET`, `PUT`, `DELETE` em `/users`).
- [ ] Desenvolver os testes E2E (`.e2e-spec.ts`) para todas as rotas do CRUD de usuários.

---

## 🛠️ Épico 3: Débito Técnico (Tech Debt)
- [ ] Atualizar ESLint para a v10 (Migrar para Flat Config `eslint.config.js`)
- [ ] Atualizar NestJS para a v11 e resolver breaking changes
- [ ] Atualizar Prisma para a v7
- [ ] Atualizar Vitest para a v4

---

## 📧 Épico 4: Infraestrutura de E-mails (Produção)

**User Story:**
> *"As a system, I want to send real, formatted emails using an SMTP provider and template engine so that users receive professional recovery links in their real inboxes."*

### Tarefas (Tasks)
- [ ] Instalar as bibliotecas `nodemailer` e `handlebars`.
- [ ] Criar a implementação real `NodemailerMailProvider`.
- [ ] Criar os templates HTML na pasta de views (ex: `password-reset.hbs`).
- [ ] Substituir o `ConsoleMailProvider` pelo `NodemailerMailProvider` no `MailModule` (quando for para produção).