

CREATE TABLE IF NOT EXISTS athletes (
    "_id" serial NOT NULL, 
    "email_address" varchar NOT NULL, 
    "password" varchar,
    "athlete_name" varchar NOT NULL,
    "age" int,
    CONSTRAINT "athletes_id_pk" PRIMARY KEY ("_id") 
);

CREATE TABLE IF NOT EXISTS workout_card (
    "_id" serial NOT NULL, 
    "workout_content" char NOT NULL, 
    "date" timestamp,
    "athlete_id" serial REFERENCES athletes("_id"),
    CONSTRAINT "workout_card_id_pk" PRIMARY KEY ("_id")
);

CREATE TABLE IF NOT EXISTS subscription (
    "_id" serial NOT NULL,
    "athlete_id" serial REFERENCES athletes("_id") NOT NULL,
    "following" serial REFERENCES athletes("_id") NOT NULL,
    CONSTRAINT "subscription_id_pk" PRIMARY KEY ("_id")
);

CREATE TABLE IF NOT EXISTS tag (
    "_id" serial NOT NULL,
    "workout_id" serial REFERENCES workout_card("_id") NOT NULL,
    "athlete_id" serial REfERENCES athletes("_id") NOT NULL,
    CONSTRAINT "tag_id_pk" PRIMARY KEY ("_id")
);
