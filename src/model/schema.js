require('../../config.js');
const pgp = require('pg-promise')();
const db = pgp(process.env.DB_URL);

const schemaSql = `
    -- Extensions
    --CREATE EXTENSION IF NOT EXISTS pg_trgm;

    --Drop (droppable only when no dependency)
    --DROP INDEX IF EXISTS posts_idx_text;
    --DROP INDEX IF EXISTS posts_idx_ts;
    --DROP TABLE IF EXISTS events;
    --DROP TYPE IF EXISTS  userinfo;
    DROP TABLE IF EXISTS userInfo;
    DROP TABLE IF EXISTS events;
    DROP TABLE IF EXISTS userinfo;
    DROP TABLE IF EXISTS members;
    DROP TABLE IF EXISTS cashflow;

    CREATE TABLE events (
        eventid         serial PRIMARY KEY NOT NULL,
        eventname       text,
        datetime        bigint,
        mindeposit      integer,
        maxdeposit      integer,
        address         text,
        about           text,
        latitude        double precision,
        longitude       double precision,
        hoster          text,
        hostername      text,
        totalmoney      real NOT NULL DEFAULT 0,
        status          integer default 0,
        currency        integer default 0,
        ts              bigint NOT NULL DEFAULT (extract(epoch from now()))
    );
    CREATE TABLE userinfo (
        id              serial PRIMARY KEY NOT NULL,
        userid          text,
        userpicture     bytea,
        username        text,
        userprofile     text,
        usercoins       integer NOT NULL DEFAULT 0,
        currency        integer default 0,
        userphonenumber text,
        preparetime     bigint,
        recommendtime   bigint,
        ts              bigint NOT NULL DEFAULT (extract(epoch from now())),
        token           text,
        status          integer default 0
    );
    CREATE TABLE members (
        id             serial PRIMARY KEY NOT NULL,
        userid         text,
        username       text,
        eventid        serial,
        eventname      text,
        deposit        real,
        hoster         text,
        hostername     text,
        datetime       bigint,
        alarmtime      bigint,
        arrivetime     bigint,
        late           boolean DEFAULT TRUE,
        confirm        int,
        status         int default 0

    );
    CREATE TABLE cashflow (
        id             serial PRIMARY KEY NOT NULL,
        userid         text,
        username       text,
        eventid        serial,
        eventname      text,
        hoster         text,
        cashflow       integer NOT NULL DEFAULT 0,
        datetime       bigint
    );

    -- CREATE INDEX posts_idx_ts ON posts USING btree(ts);
    -- CREATE INDEX posts_idx_text ON posts USING gin(text gin_trgm_ops);
    --TODO
    -- CREATE INDEX todos_idx_ts ON todos USING btree(ts);
    -- CREATE INDEX todos_idx_text ON todos USING gin(text gin_trgm_ops);
`;

const dataSql = `
    -- Populate dummy posts

    INSERT INTO userinfo(username,usercoins,userphonenumber,ts)
    SELECT
        'Aaa',
        (i*100),
        '0912345'||i||i||(i+1),
        round(extract(epoch from now()) + (i - 20) * 3600.0)
    FROM generate_series(1, 20) AS s(i);
    INSERT INTO events(eventname,datetime,mindeposite,maxdeposite,address,about,latitude,longitude,ts)
    SELECT
        'party'|| i,
        round(extract(epoch from now()) + (i) * 3600.0),
        10,
        100,
        'road'||i,
        'sohappy',
        (i+1.5),
        (i+2.4),
        round(extract(epoch from now()) + (i - 20) * 3600.0)
    FROM generate_series(1, 20) AS s(i);

    INSERT INTO members(username,userid,eventid,eventname,deposite,hostname)
    SELECT
        'Aaa',
        (i*100),
        i,
        'party'||i,
        (i*100),
        'john'
    FROM generate_series(1, 20) AS s(i);

`;
console.log("hello");
db.none(schemaSql).then(() => {
    console.log('Schema created');
    // db.none(dataSql).then(() => {
    //     console.log('Data populated');

    // });
    pgp.end();
}).catch(err => {
    console.log('Error creating schema', err);
});
