CREATE TABLE
    "public"."keyword" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid (),
        "keyword" text NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now (),
        "hidden_at" timestamptz DEFAULT null,
        PRIMARY KEY ("id"),
        UNIQUE ("id"),
        UNIQUE ("keyword")
    );

CREATE INDEX keyword_created_at_idx ON "public"."keyword" USING btree ("created_at" DESC);

CREATE INDEX "keyword_hidden_at_idx" ON "public"."keyword" USING btree ("hidden_at" DESC);

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION prevent_delete()
RETURNS TRIGGER AS $$
BEGIN
RAISE EXCEPTION 'Deletion of rows is not allowed.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER no_delete
BEFORE DELETE ON "public"."keyword"
FOR EACH ROW EXECUTE FUNCTION prevent_delete();

