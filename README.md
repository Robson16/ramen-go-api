# Ramen Go API

Ramen Go é uma aplicação web projetada para permitir aos usuários personalizar e montar seus pedidos de ramen. Utilizando uma API backend, a plataforma expõe endpoints RESTful que fornecem listas de caldos e proteínas disponíveis. A API também inclui um endpoint para processar pedidos, onde as seleções dos usuários são recebidas em formato JSON, validadas e armazenadas, retornando um código de pedido único como confirmação.

### Regras da aplicação

- [X] Rota de upload de Imagem;
- [X] Rota de criação de Caldo; 
- [X] Rota de lista de Caldos; 
- [X] Rota de criação de Proteínas; 
- [X] Rota de lista de Proteínas;
- [X] Rota para realizar o pedido;

### Regras de negócio
- [X] Deve ser necessario fornecer uma chave de api nos cabeçalhos da requisições para usar a aplicação;
- [X] O Usuario só podera selecionar uma opção de caldos e proteínas cada;

### Contexto da aplicação

Para ajudar a imaginar como esses dados vão estar sendo utilizados pelo cliente web e/ou mobile.

Abaixo o link para o layout da aplicação que utilizaria essa API.

https://www.figma.com/design/uDdX536s8ylGc6TVSstATk/RamenGo-%5B2022%5D?node-id=1-21&t=1lJRXdvwphTCg64Q-1