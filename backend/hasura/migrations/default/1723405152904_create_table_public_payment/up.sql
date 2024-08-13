CREATE TABLE
  "public"."payment" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid (),
    "created_at" timestamptz NOT NULL DEFAULT now (),
    "user_id" uuid NOT NULL,
    "amount" numeric NOT NULL,
    "currency" text NOT NULL,
    "intent" text NOT NULL,
    "processor" text NOT NULL,
    "status" text NOT NULL,
    "method" text,
    "receipt_url" text,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("user_id") REFERENCES "auth"."users" ("id") ON UPDATE restrict ON DELETE restrict,
    UNIQUE ("id")
  );

CREATE INDEX payment_created_at_idx ON "public"."payment" USING btree ("created_at" DESC);

CREATE INDEX payment_user_id_idx ON "public"."payment" USING btree ("user_id");

CREATE INDEX payment_amount_idx ON "public"."payment" USING btree ("amount");

CREATE INDEX payment_currency_idx ON "public"."payment" USING btree ("currency");

CREATE INDEX payment_intent_idx ON "public"."payment" USING btree ("intent");

CREATE INDEX payment_processor_idx ON "public"."payment" USING btree ("processor");

CREATE INDEX payment_status_created_at_idx ON "public"."payment" USING btree ("status");

CREATE INDEX payment_receipt_url_idx ON "public"."payment" USING btree ("receipt_url");

CREATE EXTENSION IF NOT EXISTS pgcrypto;