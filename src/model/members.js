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
function add(userid='',username='',eventid,eventname='',deposite,hostname='',confirm,datetime){


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
          ($<userid>,$<username>,$<eventid>,$<eventname>,$<deposite>,$<hostname>,$<confirm>,$<datetime>)
          RETURNING *
        `;
          db.any(`UPDATE userinfo SET usercoins = usercoins-$2 WHERE userid = $1`,[userid,deposite]);
          db.any(`UPDATE events SET totalmoney = totalmoney+$2 WHERE eventid = $1`,[eventid,deposite]);
          return db.one(sql,{userid,username,eventid,eventname,deposite,hostname,confirm,datetime});
      }
    }
  );

}

// function add(userid='',username='',eventid,eventname='',deposite,hostname='',confirm,datetime){
//   const sql =`
//     INSERT INTO members ($<this:name>)
//     VALUES
//     ($<userid>,$<username>,$<eventid>,$<eventname>,$<deposite>,$<hostname>,$<confirm>,$<datetime>)
//     RETURNING *
//   `;
//     db.any(`UPDATE userinfo SET usercoins = usercoins-$2 WHERE userid = $1`,[userid,deposite]);
//   db.any(`UPDATE events SET totalmoney = totalmoney+$2 WHERE eventid = $1`,[eventid,deposite]);
//   return db.one(sql,{userid,username,eventid,eventname,deposite,hostname,confirm,datetime});
// }

function modify(userid='',username='',eventid,eventname='',deposite,hostname='',confirm){
  console.log("enter modify");
  const sql = `
    UPDATE members SET username = $2,eventname = $4,hostname = $6,confirm =$7 WHERE userid=$1 AND eventid = $3
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
function invitemembers(userid='',username='',eventid,eventname='',deposite,hostname='',datetime){
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
          ($<userid>,$<username>,$<eventid>,$<eventname>,$<deposite>,$<hostname>,$<confirm>,$<datetime>)
          RETURNING *
        `;
          return db.one(sql,{userid,username,eventid,eventname,deposite,hostname,confirm,datetime});
      }
    }
  );

}

// function add(userid='',username='',eventid,eventname='',deposite,hostname='',confirm,datetime){
//   const sql =`
//     INSERT INTO members ($<this:name>)
//     VALUES
//     ($<userid>,$<username>,$<eventid>,$<eventname>,$<deposite>,$<hostname>,$<confirm>,$<datetime>)
//     RETURNING *
//   `;
//     db.any(`UPDATE userinfo SET usercoins = usercoins-$2 WHERE userid = $1`,[userid,deposite]);
//   db.any(`UPDATE events SET totalmoney = totalmoney+$2 WHERE eventid = $1`,[eventid,deposite]);
//   return db.one(sql,{userid,username,eventid,eventname,deposite,hostname,confirm,datetime});
// }
function confirm(eventid,userid){
  confirm = 1;
  console.log("enter confirm");
  const sql = `
    UPDATE members SET confirm = $3 WHERE userid=$1 AND eventid=$2
    RETURNING *
  `;
  db.any(`UPDATE userinfo SET usercoins = usercoins-$2 WHERE userid = $1`,[userid,deposite]);
  db.any(`UPDATE events SET totalmoney = totalmoney+$2 WHERE eventid = $1`,[eventid,deposite]);
    return db.any(sql,[userid,eventid,confirm]);
}

module.exports = {
  add,
  remove,
  modify,
  listmember,
  memberinfo,
  invitemembers,
  confirm
};
