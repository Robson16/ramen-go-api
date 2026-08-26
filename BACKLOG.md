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
- [x] Atualizar ESLint para a v10 (Migrar para Flat Config `eslint.config.js`).
- [x] Atualizar NestJS para a v11 e resolver possíveis *breaking changes*.
- [x] Atualizar Prisma para a v7.
- [x] Atualizar Vitest para a v4.

---

## 📧 Épico 4: Infraestrutura de E-mails (Produção)

**User Story:**
> *"As a system, I want to send real, formatted emails using an SMTP provider and template engine so that users receive professional recovery links and welcome messages in their real inboxes."*

### Tarefas
- [x] Instalar e configurar as bibliotecas `nodemailer` e `handlebars`.
- [x] Implementar o `NodemailerMailProvider` seguindo o contrato de envio de e-mails.
- [x] Desenvolver os templates HTML na pasta de views (ex: `password-reset.hbs`).
- [x] Substituir o provedor de console pelo provedor real no `MailModule` (ambiente de produção).
- [x] Desenvolver o template HTML de boas-vindas (`welcome.hbs`).
- [x] Injetar o `MailProvider` e disparar o e-mail de boas-vindas no caso de uso de registro (`user-register.usecase.ts`).
- [x] Atualizar os testes (unitários e E2E) de registro para fazer mock do envio com o `FakeMailProvider`.

---

## 🛡️ Épico 5: Painel Administrativo (BackOffice) e Histórico do Cliente

**User Story:**
> *"As a system administrator, I want a secure set of routes to manage all users and orders. As a regular user, I want to see a history of all my own past orders."*

### Tarefas

**Infraestrutura (Database & Segurança)**
- [x] Adicionar o `enum Role { USER, ADMIN }` no `schema.prisma` e vinculá-lo ao model `User`.
- [x] Rodar a migration (`add_user_role`) e atualizar a entidade e o mapper.
- [x] Criar o decorador `@Roles()` e o `RolesGuard` para proteger as rotas administrativas.

**Domain & Application**
- [x] Criar o caso de uso `user-list.usecase.ts` (Account Domain).
- [x] Criar o caso de uso `order-list-all.usecase.ts` (Restaurant Domain).
- [x] Criar o caso de uso `order-list-by-user.usecase.ts` (Restaurant Domain).

**HTTP (Controllers & E2E)**
- [x] Criar a estrutura base de rotas administrativas em `src/infra/http/controllers/`.
- [x] Implementar o controlador `list-users.controller.ts` (`GET /users`).
- [x] Implementar o controlador `list-all-orders.controller.ts` (`GET /orders`).
- [x] Implementar o controlador `list-user-orders.controller.ts` (`GET /orders`) para o cliente.
- [x] Desenvolver testes E2E garantindo o funcionamento do RBAC e erro `403 Forbidden`.

---

## 🍽️ Épico 6: Gestão Completa de Catálogo e Pedidos (Admin CRUD)

### Tarefas

### User Story 1: Acesso autenticado ao catálogo

> *"As an authenticated user, I want to browse the broth and protein catalog so that I can choose the ingredients for my order."*

**Catálogo para usuários autenticados**
- [x] Exigir autenticação nas rotas de listagem (`GET /broths` e `GET /proteins`), permitindo acesso a usuários autenticados sem exigir a role `ADMIN`.
- [x] Adicionar testes E2E para garantir `401 Unauthorized` sem token e acesso permitido para usuários autenticados comuns.

### User Story 2: Administração do catálogo e dos pedidos

> *"As a system administrator, I want to fully manage the restaurant's catalog and update the status of customer orders, ensuring the menu is always up to date and the operation flows correctly."*

**Gestão administrativa do Catálogo (Broths, Proteins & Images)**
- [x] Confirmar a aplicação do Guardião de Segurança (`@Roles('ADMIN')`) nas rotas de criação já existentes (`POST /broths`, `POST /proteins` e `POST /images`).
- [x] Criar casos de uso para edição e exclusão de caldos (`broth-edit` e `broth-delete`).
- [x] Criar casos de uso para edição e exclusão de proteínas (`protein-edit` e `protein-delete`).
- [x] Implementar os controllers correspondentes em `src/infra/http/controllers/` (ex: `PUT /broths/:id`, `DELETE /broths/:id`).
- [x] Proteger todas essas novas rotas com `@Roles('ADMIN')` e garantir nos testes E2E o bloqueio (`403 Forbidden`) para usuários comuns.

**Gestão administrativa de Pedidos (Orders)**
- [x] Criar enum de Status do Pedido no Prisma (ex: `PENDING`, `PREPARING`, `READY`, `DELIVERED`).
- [x] Criar caso de uso `order-update-status.usecase.ts` (ex: atualizar de pendente para em preparo).
- [x] Implementar o controller `PATCH /orders/:orderId/status` restrito a administradores.

---

## 🧹 Épico 7: Padronização de Nomes de Arquivos

**User Story:**
> *"As a developer, I want files to follow a consistent naming convention so that I can locate and understand the project's modules more quickly."*

**Convenção definida:**
- Usar `kebab-case` nos nomes dos arquivos.
- Nomear arquivos de acordo com o recurso e a ação: `recurso-ação`.
- Manter os sufixos por responsabilidade: `.controller.ts`, `.usecase.ts`, `.repository.ts`, `.presenter.ts`, `.mapper.ts` e `.spec.ts`.
- Manter as classes em `PascalCase`, refletindo o nome do arquivo (ex: `UserListController` e `UserListUseCase`).

### Tarefas

**Levantamento & Convenção**
- [x] Mapear arquivos que usam ordem ou formato diferente da convenção definida.
- [x] Confirmar a convenção na documentação do projeto e evitar novos nomes fora do padrão.

**Domain & Application**
- [x] Revisar os arquivos de use cases e confirmar que seguem o formato `recurso-ação.usecase.ts` (ex: `user-list.usecase.ts`).
- [x] Renomear classes, imports, configurações dos módulos e referências nos testes para acompanhar o padrão `RecursoAçãoTipo`.

**HTTP & Infraestrutura**
- [x] Renomear controllers para o formato `recurso-ação.controller.ts` (ex: `list-users.controller.ts` para `users-list.controller.ts`).
- [x] Revisar presenters, mappers, repositories e providers e padronizar seus nomes em `recurso-ação` quando houver ação explícita.
- [x] Atualizar os nomes dos arquivos de teste para acompanhar os arquivos testados e a convenção `recurso-ação`.

**Validação**
- [x] Executar lint, testes unitários e testes E2E após a padronização.
- [x] Confirmar que não existem imports ou referências apontando para os nomes antigos.

## 🖼️ Épico 8: Desacoplamento de Uploads e Avatares de Usuário (Segregação de Contextos)

**User Story:**
> *"As a developer, I want to segregate image upload responsibilities so that domains do not share generic media endpoints. As a user, I want to upload my own profile avatar in standard image formats."*

**Contexto Arquitetural:**
- O upload de imagens atual atende aos SVGs de caldos e proteínas e deve ser restrito administrativamente ao domínio `restaurant`.
- Um novo fluxo de upload deve ser criado no domínio `account` exclusivamente para a foto de perfil (`avatarUrl`) do usuário.
- O upload de avatar deve ser acoplado apenas ao usuário, não gerando registros na tabela global `images` (que é exclusiva do catálogo do restaurante).

### Tarefas

**Refactor do Domínio de Restaurante**
- [ ] Renomear o caso de uso `image-upload-and-create.usecase.ts` para `ingredient-image-upload.usecase.ts`, deixando claro o seu escopo.
- [ ] Renomear o controller `image-upload.controller.ts` para refletir a especificidade do catálogo administrativo.
- [ ] Garantir que a validação deste caso de uso permita estritamente arquivos `.svg` (padrão de UI do catálogo).

**Banco de Dados & Entidades**
- [ ] Adicionar a coluna opcional `avatarUrl` (string) na tabela `users` no `schema.prisma` e gerar a migration.
- [ ] Atualizar a entidade `User` e o `prisma-user-mapper.ts` no domínio `account` para mapear e refletir o novo campo.

**Domínio de Conta (Account)**
- [ ] Criar o caso de uso `user-avatar-upload.usecase.ts` na camada de aplicação de conta.
- [ ] Implementar a regra de negócio para utilizar o `uploader` da infraestrutura e fazer o update direto do `avatarUrl` via `UserRepository`.
- [ ] Adicionar validação de payload permitindo apenas imagens `.png`, `.jpg` e `.jpeg`, com limite máximo de tamanho (ex: 2MB).
- [ ] Implementar o controller `PATCH /profile/avatar` restrito ao usuário autenticado (`@UseGuards(JwtAuthGuard)`).

**Validação**
- [ ] Atualizar testes unitários e testes E2E afetados pela renomeação no domínio `restaurant`.
- [ ] Criar testes unitários para o novo caso de uso `user-avatar-upload`.
- [ ] Criar teste E2E garantindo o funcionamento e a segurança da nova rota `PATCH /profile/avatar`.