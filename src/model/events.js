if (!global.db) {
    const pgp = require('pg-promise')();
    db = pgp(process.env.DB_URL);
}

function list(userid,start){
  const where =[];
  if(userid)
      where.push(`userid = $1`);
  if(start)
      where.push(`id < $2`);
  const sql = `
      SELECT *
      FROM members
      ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
      ORDER BY id DESC
      LIMIT 10
  `;
  console.log('here is');
  console.log(sql);
  return db.any(sql, [userid,start]);
}
function eventinfo(eventid){
  const where =[];
  const sql = `
      SELECT *
      FROM events
      WHERE eventid = $1
  `;
  console.log(sql);
  console.log(eventid);
  return db.any(sql,[eventid]);
}
function create(eventname='',datetime,mindeposite,maxdeposite,address='',about='',latitude,longitude,hoster,hostername=''){
  const sql = `
    INSERT INTO events ($<this:name>)
    VALUES ($<eventname>,$<datetime>,$<mindeposite>,$<maxdeposite>,$<address>,$<about>,$<latitude>,$<longitude>,$<hoster>,$<hostername>)
    RETURNING *
  `;
    return db.one(sql,{eventname,datetime,mindeposite,maxdeposite,address,about,latitude,longitude,hoster,hostername});
}
function modify(eventid,eventname='',datetime,mindeposite,maxdeposite,address='',about='',latitude,longitude){
  const sql = `
    UPDATE events SET eventname = '$1:value',datetime = $2,mindeposite = $3,maxdeposite = $4,address = '$5:value',about ='$6:value',latitude = $7,longitude = $8 WHERE eventid=$9
    RETURNING *
  `;
    return db.one(sql,[eventname,datetime,mindeposite,maxdeposite,address,about,latitude,longitude,eventid]);
}
// function list(searchText = '', start) {
//     const where = [];
//     if (searchText)
//         where.push(`text ILIKE '%$1:value%'`);
//     if (start)
//         where.push('id < $2');
//     const sql = `
//         SELECT *
//         FROM posts
//         ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
//         ORDER BY id DESC
//         LIMIT 10
//     `;
//     console.log("here is");
//     console.log(sql);
//     return db.any(sql, [searchText, start]);
// }

// function create(mood, text) {
//     const sql = `
//         INSERT INTO posts ($<this:name>)
//         VALUES ($<mood>, $<text>)
//         RETURNING *
//     `;
//     return db.one(sql, {mood, text});
// }
//
module.exports = {
    list,
    create,
    eventinfo,
    modify
};
