import { MigrationInterface, QueryRunner } from 'typeorm';

export class initialSchema1668934398753 implements MigrationInterface {
  name = 'initialSchema1668934398753';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'user')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "display_name" character varying, "role" "public"."user_role_enum" NOT NULL DEFAULT 'user', "email" character varying NOT NULL, "phone" character varying, "is_verified" boolean NOT NULL DEFAULT false, "telegram_link" character varying, "profile_picture" character varying, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_8e1f623798118e629b46a9e6299" UNIQUE ("phone"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."media_item_type_enum" AS ENUM('video', 'image')`,
    );
    await queryRunner.query(
      `CREATE TABLE "media_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" character varying NOT NULL, "type" "public"."media_item_type_enum" NOT NULL DEFAULT 'image', "position" integer, "listingId" uuid, CONSTRAINT "PK_ca307a9a9117b0c8edc6eb4cd97" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tag" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_6a9775008add570dc3e5a0bab7b" UNIQUE ("name"), CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "state" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_549ffd046ebab1336c3a8030a12" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "city" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "stateId" uuid NOT NULL, CONSTRAINT "PK_b222f51ce26f7e5ca86944a6739" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."listing_type_enum" AS ENUM('Apartment', 'Villa', 'Land', 'Duplex', 'Condominium')`,
    );
    await queryRunner.query(
      `CREATE TABLE "listing" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text NOT NULL, "price" numeric, "number_of_floors" integer, "floor_size" integer, "lot_size" integer, "year_built" integer, "total_number_of_rooms" integer, "number_of_bath_rooms" integer, "number_of_bed_rooms" integer, "type" "public"."listing_type_enum", "location" geography(Point,4326), "neighbourhood" character varying, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "document" tsvector, "userId" uuid, "cityId" uuid, CONSTRAINT "PK_381d45ebb8692362c156d6b87d7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_favorites_listing" ("userId" uuid NOT NULL, "listingId" uuid NOT NULL, CONSTRAINT "PK_6682aec2a342ddab8c020e7cf06" PRIMARY KEY ("userId", "listingId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2675cfef40fd77510475dd6061" ON "user_favorites_listing" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ed4571cfc0bcf3a11243097736" ON "user_favorites_listing" ("listingId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "listing_tags" ("listingId" uuid NOT NULL, "tagId" uuid NOT NULL, CONSTRAINT "PK_3c27e8e550c8c7533a61fdeff3b" PRIMARY KEY ("listingId", "tagId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_57f6ef3ec34bb984a04a6698a0" ON "listing_tags" ("listingId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d3574d2336b100fc72f900e88a" ON "listing_tags" ("tagId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "media_item" ADD CONSTRAINT "FK_2d421aab0b8551f1b718c7ee6f7" FOREIGN KEY ("listingId") REFERENCES "listing"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "city" ADD CONSTRAINT "FK_e99de556ee56afe72154f3ed04a" FOREIGN KEY ("stateId") REFERENCES "state"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "listing" ADD CONSTRAINT "FK_33bd8a3b7eeccb95ae45038d956" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "listing" ADD CONSTRAINT "FK_108aec21868d3c577a94634df00" FOREIGN KEY ("cityId") REFERENCES "city"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_favorites_listing" ADD CONSTRAINT "FK_2675cfef40fd77510475dd6061d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_favorites_listing" ADD CONSTRAINT "FK_ed4571cfc0bcf3a112430977367" FOREIGN KEY ("listingId") REFERENCES "listing"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "listing_tags" ADD CONSTRAINT "FK_57f6ef3ec34bb984a04a6698a09" FOREIGN KEY ("listingId") REFERENCES "listing"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "listing_tags" ADD CONSTRAINT "FK_d3574d2336b100fc72f900e88ab" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listing_tags" DROP CONSTRAINT "FK_d3574d2336b100fc72f900e88ab"`,
    );
    await queryRunner.query(
      `ALTER TABLE "listing_tags" DROP CONSTRAINT "FK_57f6ef3ec34bb984a04a6698a09"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_favorites_listing" DROP CONSTRAINT "FK_ed4571cfc0bcf3a112430977367"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_favorites_listing" DROP CONSTRAINT "FK_2675cfef40fd77510475dd6061d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "listing" DROP CONSTRAINT "FK_108aec21868d3c577a94634df00"`,
    );
    await queryRunner.query(
      `ALTER TABLE "listing" DROP CONSTRAINT "FK_33bd8a3b7eeccb95ae45038d956"`,
    );
    await queryRunner.query(
      `ALTER TABLE "city" DROP CONSTRAINT "FK_e99de556ee56afe72154f3ed04a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "media_item" DROP CONSTRAINT "FK_2d421aab0b8551f1b718c7ee6f7"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d3574d2336b100fc72f900e88a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_57f6ef3ec34bb984a04a6698a0"`,
    );
    await queryRunner.query(`DROP TABLE "listing_tags"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ed4571cfc0bcf3a11243097736"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2675cfef40fd77510475dd6061"`,
    );
    await queryRunner.query(`DROP TABLE "user_favorites_listing"`);
    await queryRunner.query(`DROP TABLE "listing"`);
    await queryRunner.query(`DROP TYPE "public"."listing_type_enum"`);
    await queryRunner.query(`DROP TABLE "city"`);
    await queryRunner.query(`DROP TABLE "state"`);
    await queryRunner.query(`DROP TABLE "tag"`);
    await queryRunner.query(`DROP TABLE "media_item"`);
    await queryRunner.query(`DROP TYPE "public"."media_item_type_enum"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
  }
}
