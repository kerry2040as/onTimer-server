if (!global.db) {
    const pgp = require('pg-promise')();
    db = pgp(process.env.DB_URL);
}
// const postModel = require('./posts.js');
//
// function create(postId, mood) {
//     const sql = `
//         UPDATE posts
//         SET $2:name = $2:name + 1
//         WHERE id = $1
//         RETURNING *
//     `;
//     return db.one(sql, [postId, mood.toLowerCase() + 'Votes']);
// }
//
function infoall(){
  const sql = `
  SELECT * FROM userinfo  ORDER BY userid LIMIT 30
  `;
  return db.any(sql);
}
function info(userid=''){
    const sql = `
    SELECT *
    FROM userinfo
    WHERE userid = $1
    ORDER BY userid LIMIT 10
    `;
    return db.any(sql,[userid]);
}
function add(userid='',username='',userphonenumber=''){
  const sql = `
  INSERT INTO userinfo($<this:name>)
  VALUES
  ($<userid>,$<username>,$<userphonenumber>)
  RETURNING *
  `;
  return db.one(sql,{userid,username,userphonenumber});
}
function modify(userid='',username,usercoins,userphonenumber){
    const sql =`
    UPDATE userinfo SET username = $2,usercoins = $3,userphonenumber = $4 WHERE userid = $1
    RETURNING *`;
    return db.one(sql,[userid,username,usercoins,userphonenumber]);
}
function addmoney(userid='',usercoins){
    const sql =`
    UPDATE userinfo set usercoins = usercoins + $2 WHERE userid= $1
    RETURNING *
    `;
    console.log("modifyMoney!!!!!----------")
    return db.any(sql,[userid,usercoins]);
}
function modifyprofile(userid='',userprofile=''){
  const sql =`
  UPDATE userinfo SET userprofile = $2 WHERE userid = $1
  RETURNING *`;
  return db.one(sql,[userid,userprofile]);
}
function modifypreparetime(userid='',preparetime){
  const sql =`
  UPDATE userinfo SET preparetime = $2 WHERE userid = $1
  RETURNING *
  `;
  return db.one(sql,[userid,preparetime]);
}
module.exports = {
    info,
    add,
    infoall,
    modify,
    addmoney,
    modifyprofile,
    modifypreparetime
};
