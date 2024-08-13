CREATE TABLE "public"."post" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "hidden_at" timestamptz DEFAULT null,
  "user_id" uuid NOT NULL,
  "title" Text NOT NULL,
  "content" text,
  "status" text NOT NULL DEFAULT 'draft',
  PRIMARY KEY ("id"),
  FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE restrict ON DELETE restrict
  );

CREATE INDEX "post_created_at_idx" ON "public"."post" USING btree ("created_at" DESC);
CREATE INDEX "post_hidden_at_idx" ON "public"."post" USING btree ("hidden_at" DESC);
CREATE INDEX "post_user_id_idx" on "public"."post" using btree ("user_id");
CREATE INDEX "post_title_idx" on "public"."post" using btree ("title");
CREATE INDEX "post_content_idx_gin" ON "public"."post" USING gin (to_tsvector ('simple', content));
CREATE INDEX "post_status_idx" on "public"."post" using btree ("status");

CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_post_updated_at"
BEFORE UPDATE ON "public"."post"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_post_updated_at" ON "public"."post"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;


CREATE OR REPLACE FUNCTION prevent_delete()
RETURNS TRIGGER AS $$
BEGIN
RAISE EXCEPTION 'Deletion of rows is not allowed.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER no_delete
BEFORE DELETE ON "public"."post"
FOR EACH ROW EXECUTE FUNCTION prevent_delete();

