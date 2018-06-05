if (!global.db) {
    const pgp = require('pg-promise')();
    db = pgp(process.env.DB_URL);
}
function listmember(eventid){
  const sql = `
  SELECT *
  FROM members
  WHERE eventid = $1
  `;
  console.log(sql);
  console.log(eventid);
  return db.any(sql,[eventid]);
}
function add(userid='',username='',eventid,eventname='',deposite,hostname=''){
  const sql =`
    INSERT INTO members ($<this:name>)
    VALUES
    ($<userid>,$<username>,$<eventid>,$<eventname>,$<deposite>,$<hostname>)
    RETURNING *
  `;
  db.any(`UPDATE events SET totalmoney = totalmoney+$2 WHERE eventid = $1`,[eventid,deposite]);
  return db.one(sql,{userid,username,eventid,eventname,deposite,hostname});
}
function remove(userid='',eventid){
  const sql =`
  DELETE FROM members
  WHERE userid=$1 AND eventid =$2
  `;
  return db.result(sql,[userid,eventid]);
}
module.exports = {
  add,
  remove,
  listmember
};
