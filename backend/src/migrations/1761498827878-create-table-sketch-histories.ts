import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableSketchHistories1761498827878 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE sketches (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                image_url TEXT NOT NULL,
                thumbnail_url TEXT NOT NULL,
                created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE IF EXISTS sketches;
        `);
    }

}
