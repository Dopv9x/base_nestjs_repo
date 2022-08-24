import { MigrationInterface, QueryRunner } from 'typeorm';

export class addRolesUser1660721810963 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE users ADD COLUMN roles VARCHAR ( 50 ); `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE users DROP COLUMN roles');
  }
}
