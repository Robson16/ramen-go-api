# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

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
