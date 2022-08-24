import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableUserAddDefaultUpdatedTime1660798400838
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE users ALTER COLUMN updatedat SET DEFAULT now();`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE users ALTER COLUMN updatedat DROP DEFAULT;`,
    );
  }
}
