import { MigrationInterface, QueryRunner } from 'typeorm';

export class Users1660653321912 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE users (
                id serial PRIMARY KEY,
                email VARCHAR ( 50 ) UNIQUE NOT NULL,
                firstName VARCHAR ( 50 ) NOT NULL,
                lastName VARCHAR ( 50 ) NOT NULL,
                password VARCHAR NOT NULL,
                isActive BOOLEAN NOT NULL,
                createdAt TIMESTAMP NOT NULL,
                updatedAt TIMESTAMP NOT NULL );
            `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
