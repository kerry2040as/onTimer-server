if (!global.db) {
    const pgp = require('pg-promise')();
    db = pgp(process.env.DB_URL);
}

function list(userid='',start){
  const where =[];
  if(userid)
      where.push(`userid = $1`);
  if(start)
      where.push(`id < $2`);
  const sql = `
      SELECT *
      FROM members
      ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
      ORDER BY datetime ASC
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
function create(eventname='',datetime,mindeposite,maxdeposite,address='',about='',latitude,longitude,hoster='',hostername=''){
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
function remove(userid='',eventid){
  const sql =`
  DELETE FROM events
  WHERE hoster=$1 AND eventid =$2
  `;
  return db.result(sql,[userid,eventid]);
}
function infoall(){
  const sql = `
  SELECT * FROM events  ORDER BY datetime ASC LIMIT 30
  `;
  return db.any(sql);
}
function modifymoney(eventid,userid,money){
  const sql = `
    UPDATE events SET totalmoney=$3 WHERE eventid=$1 AND hoster=$2
    RETURNING *
  `;
    return db.one(sql,[eventid,userid,money]);
}
module.exports = {
    list,
    create,
    eventinfo,
    modify,
    remove,
    infoall,
    modifymoney
};
