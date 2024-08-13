CREATE TABLE
    "public"."post_keyword" (
        "post_id" uuid NOT NULL,
        "keyword_id" uuid NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now (),
        "updated_at" timestamptz NOT NULL DEFAULT now (),
        PRIMARY KEY ("post_id", "keyword_id"),
        FOREIGN KEY ("keyword_id") REFERENCES "public"."keyword" ("id") ON UPDATE restrict ON DELETE restrict,
        FOREIGN KEY ("post_id") REFERENCES "public"."post" ("id") ON UPDATE restrict ON DELETE restrict
    );

CREATE INDEX "post_keyword_post_id_idx" ON "public"."post_keyword" (post_id);

CREATE INDEX "post_keyword_keyword_id_idx" ON "public"."post_keyword" (keyword_id);

CREATE INDEX "post_keyword_created_at_idx" ON "public"."post_keyword" USING btree ("created_at" DESC);