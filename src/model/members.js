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
function memberinfo(eventid,userid=''){
  const sql =`
  SELECT * FROM members WHERE eventid = $1 AND userid= $2
  `;
  return db.any(sql,[eventid,userid]);
}
function add(userid='',username='',eventid,eventname='',deposit,hostername='',datetime,alarmtime){

  var confirm = 1;
  const sql_init=`
  SELECT * FROM members WHERE eventid = $1 AND userid= $2
  `;
  return db.any(sql_init,[eventid,userid]).then((events)=>
    {
      var eve = [];
      eve=events;
      if(eve.length>=1){
        var errormessage="joined";
        return errormessage;
      }else{
        sql =`
        INSERT INTO members ($<this:name>)
          VALUES
          ($<userid>,$<username>,$<eventid>,$<eventname>,$<deposit>,$<hostername>,$<datetime>,$<alarmtime>,$<confirm>)
          RETURNING *
        `;
          db.any(`UPDATE userinfo SET usercoins = usercoins-$2 WHERE userid = $1`,[userid,deposit]);
          db.any(`UPDATE events SET totalmoney = totalmoney+$2 WHERE eventid = $1`,[eventid,deposit]);
          return db.one(sql,{userid,username,eventid,eventname,deposit,hostername,datetime,alarmtime,confirm});
      }
    }
  );

}

function modify(userid='',username='',eventid,eventname='',hostername='',alarmtime,confirm){
  console.log("enter modify");
  const sql = `
    UPDATE members SET username = $3,eventname = $4,hostername = $5,alarmtime=$6,confirm =$7 WHERE userid=$1 AND eventid = $2
    RETURNING *
  `;
    return db.any(sql,[userid,eventid,username,eventname,hostername,alarmtime,confirm]);
}
function remove(userid='',eventid){
  const sql =`
  DELETE FROM members
  WHERE userid=$1 AND eventid =$2
  `;
  return db.result(sql,[userid,eventid]);
}
function invitemembers(userid='',username='',eventid,eventname='',deposit,hostername='',datetime,alarmtime){
  var confirm = 0;
  const sql_init=`
  SELECT * FROM members WHERE eventid = $1 AND userid= $2
  `;
  return db.any(sql_init,[eventid,userid]).then((events)=>
    {
      var eve = [];
      eve=events;
      if(eve.length>=1){
        var errormessage="joined";
        return errormessage;
      }else{
        sql =`
        INSERT INTO members ($<this:name>)
          VALUES
          ($<userid>,$<username>,$<eventid>,$<eventname>,$<deposit>,$<hostername>,$<alarmtime>,$<confirm>,$<datetime>)
          RETURNING *
        `;
          return db.one(sql,{userid,username,eventid,eventname,deposit,hostername,alarmtime,confirm,datetime});
      }
    }
  );

}

// }
function confirm(eventid,userid,deposit){
  confirm = 1;
  console.log("enter confirm");
  const sql = `
    UPDATE members SET confirm = $3,deposit = $4  WHERE userid=$1 AND eventid=$2
    RETURNING *
  `;
  db.any(`UPDATE userinfo SET usercoins = usercoins-$2 WHERE userid = $1`,[userid,deposit]);
  db.any(`UPDATE events SET totalmoney = totalmoney+$2 WHERE eventid = $1`,[eventid,deposit]);
    return db.any(sql,[userid,eventid,confirm,deposit]);
}
function deleteallmember(eventid){
  const sql =`
  DELETE FROM members
  WHERE  eventid =$1
  `;
  return db.result(sql,[eventid]);
}
module.exports = {
  add,
  remove,
  modify,
  listmember,
  memberinfo,
  invitemembers,
  confirm,
  deleteallmember
};
