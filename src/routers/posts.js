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
    const {eventname,datetime,mindeposit,maxdeposit,address,about,latitude,longitude,hoster,hostername}=req.body;
    eventsModel.create(eventname,datetime,mindeposit,maxdeposit,address,about,latitude,longitude,hoster,hostername).then(events => {
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
  const {eventid,eventname,datetime,mindeposit,maxdeposit,address,about,latitude,longitude,hoster}=req.body;
  eventsModel.modify(eventid,eventname,datetime,mindeposit,maxdeposit,address,about,latitude,longitude).then(events =>{
      res.json(events);
  }).catch(next);
});
router.post('/modifymoney', function(req,res,next){
  const {eventid,userid,money}=req.body;
  eventsModel.modifymoney(eventid,userid,money).then(events =>{
      res.json(events);
  }).catch(next);
});
router.post('/modifystatus', function(req,res,next){
  const {eventid,status}=req.body;
  eventsModel.modifystatus(eventid,status).then(events =>{
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
  const {userid,username,eventid,eventname,deposit,hostername,datetime,alarmtime}=req.body;
  membersModel.add(userid,username,eventid,eventname,deposit,hostername,datetime,alarmtime).then(events =>{
      res.json(events);
  }).catch(next);
});
router.post('/invitemembers', function(req,res,next){
  const {userid,username,eventid,eventname,deposit,hostername,datetime,alarmtime}=req.body;
  membersModel.invitemembers(userid,username,eventid,eventname,deposit,hostername,datetime,alarmtime).then(events =>{
      res.json(events);
  }).catch(next);
});
router.get('/confirmevents',function(req,res,next){
  const{eventid,userid,deposit}=req.query;
  membersModel.confirm(eventid,userid,deposit).then(events =>{
      res.json(events);
  }).catch(next);
});
router.post('/modifymembers', function(req,res,next){
  const {userid,username,eventid,eventname,hostername,alarmtime,confirm}=req.body;
  membersModel.modify(userid,username,eventid,eventname,hostername,alarmtime,confirm).then(events =>{
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
router.post('/modifyprofile', function(req,res,next){
  const {userid,userprofile}=req.body;
  userinfoModel.modifyprofile(userid,userprofile).then(events =>{
      res.json(events);
  }).catch(next);
});
router.post('/modifypreparetime', function(req,res,next){
  const {userid,preparetime}=req.body;
  userinfoModel.modifypreparetime(userid,preparetime).then(events =>{
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
router.get('/deleteallmember',function(req,res,next){
  const {eventid}=req.query;
  membersModel.deleteallmember(eventid).then(events =>{
    res.json(events);
  }).catch(next);
});
router.get('/logByUser',function(req,res,next){
  const {userid}=req.query;
  enddateModel.logByUser(userid).then(events =>{
    res.json(events);
  }).catch(next);
});
router.get('/logByEvent',function(req,res,next){
  const {eventid}=req.query;
  enddateModel.logByEvent(eventid).then(events =>{
    res.json(events);
  }).catch(next);
});



module.exports = router;
