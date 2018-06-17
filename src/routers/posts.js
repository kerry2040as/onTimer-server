const express = require('express');
const bodyParser = require('body-parser');
const accessController = require('../middleware/access-controller.js');

const eventsModel = require('../model/events.js');
const membersModel = require('../model/members.js');
const userinfoModel = require('../model/userinfo.js');
const enddateModel  = require('../model/endDate.js');
const router = express.Router();

router.use(bodyParser.json());
router.use(accessController); // Allows cross-origin HTTP requests

//test share money
router.get('/sharemoney', function(req, res, next) {
    const {eventid} = req.query;
    enddateModel.sharemoney(eventid).then(events => {
        console.log("finishshare");
        res.json(events);
    }).catch(next);
});
router.post('/arrive', function(req,res,next){
    const {eventid,userid,arrivetime,late}=req.body;
    enddateModel.arrive(eventid,userid,arrivetime,late).then(events => {
        res.json(events);
    }).catch(next);
});
// List
router.get('/events', function(req, res, next) {
    const {userid, start} = req.query;
    eventsModel.list(userid, start).then(events => {
        res.json(events);
    }).catch(next);
});

router.post('/createvents', function(req,res,next){
    const {eventname,datetime,mindeposite,maxdeposite,address,about,latitude,longitude,hoster,hostername}=req.body;
    eventsModel.create(eventname,datetime,mindeposite,maxdeposite,address,about,latitude,longitude,hoster,hostername).then(events => {
        res.json(events);
    }).catch(next);
});
router.get('/eventinfo',function(req,res,next){
  const{eventid}=req.query;
  eventsModel.eventinfo(eventid).then(events =>{
      res.json(events);
  }).catch(next);
});
router.get('/eventinfoall',function(req,res,next){
  eventsModel.infoall().then(events =>{
    res.json(events);
  }).catch(next);
});
router.post('/modifyevents', function(req,res,next){
  const {eventid,eventname,datetime,mindeposite,maxdeposite,address,about,latitude,longitude,hoster}=req.body;
  eventsModel.modify(eventid,eventname,datetime,mindeposite,maxdeposite,address,about,latitude,longitude).then(events =>{
      res.json(events);
  }).catch(next);
});
router.post('/modifymoney', function(req,res,next){
  const {eventid,userid,money}=req.body;
  eventsModel.modifymoney(eventid,userid,money).then(events =>{
      res.json(events);
  }).catch(next);
});
router.post('/remevent', function(req,res,next){
  const {userid,eventid}=req.body;
  eventsModel.remove(userid,eventid).then(events =>{
      res.json(events);
  }).catch(next);
});
router.post('/addmembers', function(req,res,next){
  const {userid,username,eventid,eventname,deposite,hostname,confirm,datetime}=req.body;
  membersModel.add(userid,username,eventid,eventname,deposite,hostname,confirm,datetime).then(events =>{
      res.json(events);
  }).catch(next);
});
router.post('/invitemembers', function(req,res,next){
  const {userid,username,eventid,eventname,deposite,hostname,datetime}=req.body;
  membersModel.invitemembers(userid,username,eventid,eventname,deposite,hostname,datetime).then(events =>{
      res.json(events);
  }).catch(next);
});
router.get('/confirmevents',function(req,res,next){
  const{eventid,userid,deposite}=req.query;
  membersModel.confirm(eventid,userid,deposite).then(events =>{
      res.json(events);
  }).catch(next);
});
router.post('/modifymembers', function(req,res,next){
  const {userid,username,eventid,eventname,deposite,hostname,confirm}=req.body;
  membersModel.modify(userid,username,eventid,eventname,deposite,hostname,confirm).then(events =>{
      res.json(events);
  }).catch(next);
});
router.post('/remmembers', function(req,res,next){
  const {userid,eventid}=req.body;
  membersModel.remove(userid,eventid).then(events =>{
      res.json(events);
  }).catch(next);
});
router.get('/userinfo',function(req,res,next){
  const{userid}=req.query;
  userinfoModel.info(userid).then(events =>{
      res.json(events);
  }).catch(next);
});
router.get('/userinfoall',function(req,res,next){
  userinfoModel.infoall().then(events =>{
    res.json(events);
  }).catch(next);
});
router.post('/adduser', function(req,res,next){
  const {userid,username,userphonenumber}=req.body;
  userinfoModel.add(userid,username,userphonenumber).then(events =>{
      res.json(events);
  }).catch(next);
});
router.post('/modifyuser', function(req,res,next){
  const {userid,username,usercoins,userphonenumber}=req.body;
  userinfoModel.modify(userid,username,usercoins,userphonenumber).then(events =>{
      res.json(events);
  }).catch(next);
});
router.get('/listmember',function(req,res,next){
  const {eventid}=req.query;
  membersModel.listmember(eventid).then(events =>{
    res.json(events);
  }).catch(next);
});
router.get('/memberinfo',function(req,res,next){
  const {eventid,userid}=req.query;
  membersModel.memberinfo(eventid,userid).then(events =>{
    res.json(events);
  }).catch(next);
});
// //List todos
// router.get('/todos',function(req,res,next){
//   const {unaccomplishedOnly,searchText,start} = req.query;
//   console.log("entering");
//   todoModel.lists(req.query.unaccomplishedOnly,searchText,start).then(todos => {
//     res.json(todos);
//   }).catch(next);
// });
// //Create todo
// router.post('/todos',function(req,res,next){
//   const{mood,text}=req.body;
//   if(!mood || !text){
//     const err = new Error('Mood and text are required');
//     err.status = 400;
//     throw err;
//   }
//   todoModel.create(mood, text).then(todos=>{
//     res.json(todos);
//   }).catch(next);
// });
//accomplish
// router.post('/todos/:id/',function(req,res,next){
//   const {id} = req.params;
//   if(!id){
//     const err = new Error('Post ID required');
//     err.status = 400;
//     throw err;
//   }
//   console.log("搞定拉");
//   todoModel.accomplish(id).then(todos =>{
//     res.json(todos);
//   }).catch(next);
// });
// // Create
// router.post('/posts', function(req, res, next) {
//     const {mood, text} = req.body;
//     if (!mood || !text) {
//         const err = new Error('Mood and text are required');
//         err.status = 400;
//         throw err;
//     }
//     postModel.create(mood, text).then(post => {
//         res.json(post);
//     }).catch(next);
// });
//
// // Vote
// router.post('/posts/:id/:mood(clear|clouds|drizzle|rain|thunder|snow|windy)Votes', function(req, res, next) {
//     const {id, mood} = req.params;
//     if (!id || !mood) {
//         const err = new Error('Post ID and mood are required');
//         err.status = 400;
//         throw err;
//     }
//     voteModel.create(id, mood).then(post => {
//         res.json(post);
//     }).catch(next);
// });

module.exports = router;
