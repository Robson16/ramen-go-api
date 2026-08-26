# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [1.4.0](https://github.com/Robson16/ramen-go-api/compare/v1.3.0...v1.4.0) (2026-08-26)

### Features

* **auth:** Protect catalog and consolidate global guards ([4c005b1](https://github.com/Robson16/ramen-go-api/commit/4c005b12ce461471dba2771a0771a6889bea90e8))
* **order:** add use case to update order status ([933e7af](https://github.com/Robson16/ramen-go-api/commit/933e7af289209b1e3cfd0e64ead47a57289ef1a4))
* **orders:** add admin order status update endpoint and E2E tests ([ce0f75b](https://github.com/Robson16/ramen-go-api/commit/ce0f75b5d83a709e2744ae00c7bf5ce2e280a2a1))
* **orders:** add order status enum and lifecycle support ([2d93692](https://github.com/Robson16/ramen-go-api/commit/2d936929f42e82bc8c023073281a8555e25e4e94))
* **restaurant:** add broth and protein delete controllers ([e624b04](https://github.com/Robson16/ramen-go-api/commit/e624b04c1649860402e6427c15ecfd9bbc1b2dca))
* **restaurant:** add broth and protein deletion use cases ([b129e91](https://github.com/Robson16/ramen-go-api/commit/b129e91d9ece886e92fa84f8b7287c06f273d408))
* **restaurant:** add broth and protein edit controllers ([803210a](https://github.com/Robson16/ramen-go-api/commit/803210a7a9cb4f88fdf3a88485498d6ddf0ffad7))
* **restaurant:** add broth and protein edit use cases ([f8dc345](https://github.com/Robson16/ramen-go-api/commit/f8dc3451d20755a18da64ac48f9948156e251e4f))
* **restaurant:** add broth update and deletion support ([becd43e](https://github.com/Robson16/ramen-go-api/commit/becd43e85648996961a67edba967ad0a0d7eaa95))
## [1.3.0](https://github.com/Robson16/ramen-go-api/compare/v1.2.0...v1.3.0) (2026-08-21)

### Features

* add user role table column ([f482c6b](https://github.com/Robson16/ramen-go-api/commit/f482c6b93ccfab7544d60b4b541fd53ff9474485))
* **auth:** add role-based access control for users ([c5c030d](https://github.com/Robson16/ramen-go-api/commit/c5c030d5b888c4ed786ae0ea9b929c6c8f5de885))
* **auth:** enforce role-based access and order ownership ([38c240f](https://github.com/Robson16/ramen-go-api/commit/38c240f9c1664b0fe804e4e11f314f56c5c267e4))
* **auth:** protect restaurant routes with role-based access ([1f9138c](https://github.com/Robson16/ramen-go-api/commit/1f9138c0a3bbb40325d8c5883406693e95d1045b))
* list users route ([2b94fa0](https://github.com/Robson16/ramen-go-api/commit/2b94fa05acc2a602f94c6391ea4eb46c255d9cba))
* **orders:** add admin endpoint to list all orders ([194c1e3](https://github.com/Robson16/ramen-go-api/commit/194c1e349dbf0245f931b87b9036b0ce360422b2))
* **orders:** add endpoint to list authenticated user orders ([55d922c](https://github.com/Robson16/ramen-go-api/commit/55d922c3996377d01458f807d8d9c41973dfb9d5))
* **orders:** add use case to list all orders ([71ebff3](https://github.com/Robson16/ramen-go-api/commit/71ebff3d4ed06cb821031b4e462dd466b4a81843))
* **orders:** add use case to list orders by user ([fca6878](https://github.com/Robson16/ramen-go-api/commit/fca6878711188a542f373c4b7336411de9789e7f))
* **orders:** repository implementation for find many orders and find many by user ([f77aee4](https://github.com/Robson16/ramen-go-api/commit/f77aee4bcf86a3b31c5a3fa20288dd26bfc21e76))
## [1.2.0](https://github.com/Robson16/ramen-go-api/compare/v1.1.1...v1.2.0) (2026-08-18)

### Features

* **email:** adds a welcome template and sends it upon user registration. ([739a68e](https://github.com/Robson16/ramen-go-api/commit/739a68eb1ad48594e9960fc5ca7d2a0df1b168c6))
* **email:** implements nodemailer and password recovery template ([249843d](https://github.com/Robson16/ramen-go-api/commit/249843dc8c4653b5315af68ae3e4ebb788467629))
## [1.1.1](https://github.com/Robson16/ramen-go-api/compare/v1.1.0...v1.1.1) (2026-08-17)
## [1.1.0](https://github.com/Robson16/ramen-go-api/compare/v1.0.1...v1.1.0) (2026-08-14)

### Features

* **account:** implement auth, profile management and standardize names ([e6c5398](https://github.com/Robson16/ramen-go-api/commit/e6c53987a9180b2e416ae4cc3bbe0639f7aa31f3))
* **account:** implement password recovery controllers and finish epic 2 ([0e5db5d](https://github.com/Robson16/ramen-go-api/commit/0e5db5da988eb3e442f2806b897829ec54d4961c))
* **account:** implement user domain, use cases and unit tests ([aa6a176](https://github.com/Robson16/ramen-go-api/commit/aa6a176d1d7252118df4b47347fdb7663927f481))
* **auth:** migrate to JWT, implement bcrypt and mail provider mock ([c007758](https://github.com/Robson16/ramen-go-api/commit/c0077582a99baeecf8c06a13ab2b95577ba2a1bd))
* create account and authenticate route ([96f74f2](https://github.com/Robson16/ramen-go-api/commit/96f74f2ca7d6ef215bb22fb4a3f120dcc47a2ad2))
* **database:** create user and token tables, mappers and repositories ([61891a0](https://github.com/Robson16/ramen-go-api/commit/61891a035547e43244a4e510bd96a11899ef8341))
* delete user route ([be5a784](https://github.com/Robson16/ramen-go-api/commit/be5a7846d7480b5d53f701c3e1661a85c7b1eb3f))
* get user profile route ([c4376d2](https://github.com/Robson16/ramen-go-api/commit/c4376d21c098e07d4751f28da382a1777ece9b63))
* user authenticate use case ([ec148a3](https://github.com/Robson16/ramen-go-api/commit/ec148a32e407008b0a2f96f7efb31531cb588942))
* user delete use case ([de13cff](https://github.com/Robson16/ramen-go-api/commit/de13cffebbd9d6597c3c3e2330aa1019243f4c88))
* user edit use case ([d41df8b](https://github.com/Robson16/ramen-go-api/commit/d41df8b3c9ab8722f22fbf719da4b351ab8426a0))
* user entity and repository classes ([da5c37d](https://github.com/Robson16/ramen-go-api/commit/da5c37d983e4d3ffd0543b5edc71ffa4a577f1cd))
* user get profile use case ([9d0c2d4](https://github.com/Robson16/ramen-go-api/commit/9d0c2d4d8f5a31fb33d9ea3bd12ec610675e3792))
* user register use case ([0eee890](https://github.com/Robson16/ramen-go-api/commit/0eee8908da7dc991fee315f09dc221fe36cf6e5d))
* user reset and update password use cases ([fe53dfc](https://github.com/Robson16/ramen-go-api/commit/fe53dfc84292575c552e821d485be5ac512648a0))
* users table ([0ea62da](https://github.com/Robson16/ramen-go-api/commit/0ea62da0a68e94212657e567529122a93c71247b))

### Bug Fixes

* **env:** add missing APP_URL to environment validation schema ([2ed10dd](https://github.com/Robson16/ramen-go-api/commit/2ed10dd3d15dc5a7cc6c9e751e07abaf01c2ff06))
* **restaurant:** migrate controllers and e2e tests to use JWT authentication ([4173080](https://github.com/Robson16/ramen-go-api/commit/4173080d9d562a1379bad25fae7548dc05bf1a4a))
## 1.0.1 (2026-08-08)

### Features

* add get order by id route; implement use case and controller; create order factory for tests; update client.http ([06c1740](https://github.com/Robson16/ramen-go-api/commit/06c1740d1662c3796f6bce889b01dc37dc58d471))
* add price column to broth table ([5efe4b9](https://github.com/Robson16/ramen-go-api/commit/5efe4b93bac8ca16705b8ed100860c91e79eaded))
* add some error handlers ([3a4b46a](https://github.com/Robson16/ramen-go-api/commit/3a4b46a5f897df6fced2d153b5353da266d9cf9b))
* auth module with api key ([4007d40](https://github.com/Robson16/ramen-go-api/commit/4007d40d1c32a837d5949f9fe53d61c23e9efd06))
* create broth ([9dc0f9a](https://github.com/Robson16/ramen-go-api/commit/9dc0f9a2e3b36b9cc822ef474cb20014bd0608b8))
* creation of orders ([e3cefb6](https://github.com/Robson16/ramen-go-api/commit/e3cefb631370873255cd4256012d83d07faf19ad))
* database seed file ([ede13b8](https://github.com/Robson16/ramen-go-api/commit/ede13b8eed8ec3e6176a1021d45d409f33a78707))
* images for active and inactive representation ([b0acb2f](https://github.com/Robson16/ramen-go-api/commit/b0acb2f0c14a5e4927e3ddb9e4788d74254b173d))
* init project with nestjs and prisma ([f132bc5](https://github.com/Robson16/ramen-go-api/commit/f132bc51d0ce6ff436ffdd8d42d2a623e02e793e))
* list of broths ([a7c5381](https://github.com/Robson16/ramen-go-api/commit/a7c5381c018d0ed304af09d11dbbeb28e845c7f8))
* list of proteins ([abf78ee](https://github.com/Robson16/ramen-go-api/commit/abf78ee837a135b04fd96f96de18c1e4157e8066))
* protein table and entity ([87f756d](https://github.com/Robson16/ramen-go-api/commit/87f756d072d6bde6461efc0eae3549b709185182))
* readme update ([f4436ae](https://github.com/Robson16/ramen-go-api/commit/f4436aee842ca53d7d33bb2b36ef3571299f51ae))

### Bug Fixes

* Adjusts build structure and startup script ([9c565a6](https://github.com/Robson16/ramen-go-api/commit/9c565a6319c0b7aeab1eec3597bda7b669ee32f2))
* cors config ([0a0b69d](https://github.com/Robson16/ramen-go-api/commit/0a0b69dd5ecbfe4bdc97f6b16bda6b640d47adbf))
