import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateScrapeSchema1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    await queryRunner.query(`
      CREATE TABLE scrape_jobs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        status VARCHAR NOT NULL,
        created_at TIMESTAMP DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE TABLE web_pages (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        scrape_job_id UUID REFERENCES scrape_jobs(id) ON DELETE CASCADE,
        title VARCHAR(250) NOT NULL,
        url TEXT NOT NULL,
        status VARCHAR NOT NULL,
        error_message TEXT,
        created_at TIMESTAMP DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE TYPE media_type_enum AS ENUM ('IMAGE', 'VIDEO');
    `);

    await queryRunner.query(`
      CREATE TABLE media_assets (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(250) NULL,
        web_page_id UUID REFERENCES web_pages(id) ON DELETE CASCADE,
        type media_type_enum NOT NULL,
        media_url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT now()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP EXTENSION "uuid-ossp" CASCADE;`);
    await queryRunner.query(`DROP TABLE media_assets`);
    await queryRunner.query(`DROP TYPE media_type_enum`);
    await queryRunner.query(`DROP TABLE web_pages`);
    await queryRunner.query(`DROP TABLE scrape_jobs`);
  }
}
