import { MigrationInterface, QueryRunner } from 'typeorm';

export class products1660722102758 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      ` CREATE TABLE "products" (
        id serial PRIMARY KEY,
        name VARCHAR ( 50 ) UNIQUE NOT NULL,
        price VARCHAR ( 50 ) NOT NULL,
        quantity INT DEFAULT 0,
        createdAt TIMESTAMP NOT NULL,
        updatedAt TIMESTAMP NOT NULL );
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "products"`);
  }
}
