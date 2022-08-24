import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterTblUserAddDefaultTime1660798002121
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      ALTER TABLE users ALTER COLUMN createdat SET DEFAULT now();
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      ALTER TABLE users ALTER COLUMN createdat DROP DEFAULT;
      `,
    );
  }
}
