import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateVitolaLengthToDecimal1746667354768 implements MigrationInterface {
    name = 'UpdateVitolaLengthToDecimal1746667354768'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vitola" ALTER COLUMN "length" TYPE decimal(4,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vitola" ALTER COLUMN "length" TYPE integer`);
    }
}
