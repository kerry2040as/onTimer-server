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
function add(userid='',username='',eventid,eventname='',deposite,hostname='',confirm,datetime){
  const sql =`
    INSERT INTO members ($<this:name>)
    VALUES
    ($<userid>,$<username>,$<eventid>,$<eventname>,$<deposite>,$<hostname>,$<confirm>,$<datetime>)
    RETURNING *
  `;
    db.any(`UPDATE userinfo SET usercoins = usercoins-$2 WHERE userid = $1`,[userid,deposite]);
  db.any(`UPDATE events SET totalmoney = totalmoney+$2 WHERE eventid = $1`,[eventid,deposite]);
  return db.one(sql,{userid,username,eventid,eventname,deposite,hostname,confirm,datetime});
}
function modify(userid='',username='',eventid,eventname='',deposite,hostname='',confirm){
  console.log("enter modify");
  const sql = `
    UPDATE members SET username = $2,eventid = $3,eventname = $4,hostname = $6,confirm =$7 WHERE userid=$1
    RETURNING *
  `;
    return db.any(sql,[userid,username,eventid,eventname,deposite,hostname,confirm]);
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
  modify,
  listmember
};
