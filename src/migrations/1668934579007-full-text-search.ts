import { MigrationInterface, QueryRunner } from 'typeorm';

export class fullTextSearch1668934579007 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        update listing set document = setweight(to_tsvector(title), 'A') ||
            setweight(to_tsvector(coalesce(description, '')), 'B') ||
            setweight(to_tsvector(neighbourhood), 'C');

        CREATE INDEX document_idx ON listing USING GIN (document);
        
        CREATE FUNCTION listing_tsvector_trigger() RETURNS trigger AS $$
            begin
                new.document :=
                setweight(to_tsvector('english', coalesce(new.title, '')), 'A')
                || setweight(to_tsvector('english', coalesce(new.description, '')), 'B')
                || setweight(to_tsvector('english', coalesce(new.neighbourhood, '')), 'C');
                return new;
            end
      $$ LANGUAGE plpgsql;
      CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE
          ON listing FOR EACH ROW EXECUTE PROCEDURE listing_tsvector_trigger();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    //
    queryRunner.query(`DROP INDEX "document_idx"`);
    queryRunner.query(
      `DROP TRIGGER IF EXISTS "listing_tsvector_trigger" on "listing"`,
    );
  }
}
