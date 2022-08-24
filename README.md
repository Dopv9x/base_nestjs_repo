<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

- [x] NestJS, Postgres, Repository pattern
- [x] TypeORM
- [x] Migrations
- [ ] Seeds
- [x] Environment (development, test, staging, production)
- [x] Express (DI, authz, utils, logging, response, error handling and example)
- [x] Batches
- [x] Folder structure
- [x] Coding convention (eslint, prettier)
- [ ] Unit test with jest
- [x] Gitlab CI/CD
- [ ] Update guideline
- [ ] Infrastructure as code with Cloudformation or Terraform

## Requirement

- Node 16.x
- Yarn 1.x
- PostgreSQL

## Installation

```bash
$ yarn install
```

## Migration
Note: The TypeORM is not setting to auto synchronize between entity and DB table when application booting. If you wish to migration database, please using following command.
### Create new migration
```bash
$ yarn run migrate:create <migration name>
```
### Migrate database
```bash
$ yarn run migrate:up
```
## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [HuuSon](https://www.facebook.com/Son.IT.Ptit/)
- Website - [https://nestjs.com](https://nestjs.com/)

## License

  Nest is [MIT licensed](LICENSE).
