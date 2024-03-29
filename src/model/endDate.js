if (!global.db) {
    const pgp = require('pg-promise')();
    db = pgp(process.env.DB_URL);
}
 const eventModel    = require('./events.js');
 const memberModel   = require('./members.js');
 const userinfoModel = require('./userinfo.js');

function sharemoney(eventid){
  var allmembers;
  var goodmembers=[];
  var sharemoney=0;
  var basemoney=0;

  var havepeoplewin=0;

  return eventModel.eventinfo(eventid)
  .then((events)=>{
      if(events){
        if(events[0].status !=0){
          var error = "money has been shared";
          console.log(error);
          throw error;
        }
        else{
          db.any(`UPDATE events SET status = 1 where eventid=$1`,[eventid]);
          sharemoney = events[0].totalmoney;
          console.log("拿取獎金池");
          console.log(sharemoney);
          return memberModel.listmember(eventid);
        }
      }
    throw " events not exists";
  }).then(members =>{
    allmembers = members;
    console.log("showallmember");
    console.log(allmembers);

  }).then(() => {
    allmembers.forEach((elements)=>{
      if(elements.late == false){
        goodmembers.push(elements);
        userinfoModel.addmoney(elements.userid,elements.deposit);
        sharemoney -=elements.deposit;
        basemoney  +=elements.deposit;
        console.log("還錢，顯示殘存獎金:");
        console.log(sharemoney);
        havepeoplewin=1;
      }else{
        var cashflow=0-elements.deposit;
        const sql_no_money = `
        INSERT INTO cashflow ($<this:name>)
        VALUES
        ($<userid>,$<username>,$<eventid>,$<hoster>,$<eventname>,$<cashflow>,$<datetime>)
        RETURNING *
        `;
        var userid=elements.userid;
        var username=elements.username;
        var eventid=elements.eventid;
        var eventname=elements.eventname;
        var datetime=elements.datetime;
        var hoster  =elements.hoster;
        var log=db.one(sql_no_money,{userid,username,eventid,hoster,eventname,cashflow,datetime});
        console.log(log);
      }
    });
    console.log("放入了");
    console.log(goodmembers);
    return goodmembers;
  }).then((member)=>{
    console.log("發出獎金");
    if(havepeoplewin){
      member.forEach((elements)=>{
        var gain = elements.deposit/basemoney*sharemoney;
        console.log("userid: " + elements.userid + "分到" + gain );
        userinfoModel.addmoney(elements.userid,gain);
        var cashflow=gain;
        const sql_money = `
        INSERT INTO cashflow ($<this:name>)
        VALUES
        ($<userid>,$<username>,$<eventid>,$<eventname>,$<hoster>,$<cashflow>,$<datetime>)
        RETURNING *
        `;
        var userid=elements.userid;
        var username=elements.username;
        var eventid=elements.eventid;
        var eventname=elements.eventname;
        var datetime=elements.datetime;
        var hoster  =elements.hoster;
        db.one(sql_money,{userid,username,eventid,eventname,hoster,cashflow,datetime});

      });
    }else{
      console.log("沒有人不遲到");
    }
  }).then(()=>{
    console.log("well");
    var finish = 'finsihsharemoney';
    console.log(finish);
    return finish;
  }).catch((e)=>{
    return e;
  });

}
function arrive(eventid,userid='',arrivetime,late){
    const sql =`
    UPDATE members SET arrivetime=$3,late = $4,status = 1 WHERE userid = $2 AND eventid = $1
    RETURNING *`;
    return db.one(sql,[eventid,userid,arrivetime,late]);
}
function logByUser(userid=''){

  const sql = `
      SELECT *
      FROM cashflow
      WHERE userid = $1
  `;
  return db.any(sql,[userid]);
}
function logByEvent(eventid){

  const sql = `
      SELECT *
      FROM cashflow
      WHERE eventid = $1
  `;
  return db.any(sql,[eventid]);
}

module.exports = {
    sharemoney,
    arrive,
    logByEvent,
    logByUser
};
