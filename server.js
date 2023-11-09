const express = require('express');
const path = require('path');
const app = express();
const cookie = require('cookie-parser');
const bodyParser = require('body-parser');
const CRUD = require('./DB/CRUD');
const SQL = require("./DB/web")
const port = 3000;
app.use(express.static(path.join(__dirname, "static")));
app.use(bodyParser.json());
app.use(cookie());
app.use(bodyParser.urlencoded({extended:true}));
app.set('views',path.join(__dirname, "views"));
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.static(path.join(__dirname, 'static'), { type: 'application/javascript' }));
const { accessSync } = require('fs');



app.get('/', CRUD.createTable);
app.get('/dropTable', CRUD.dropTable);
app.get('/insertSurgery', CRUD.insertSurgery);
app.get('/getPoints', CRUD.getPoints);
app.get('/chart', CRUD.countExceed);
app.get('/countOnTime', CRUD.countOnTime);
app.get('/getJan', CRUD.getJan);
app.get('/getFab', CRUD.getFab);
app.get('/getMar', CRUD.getMar);
app.get('/getApr', CRUD.getApr);
app.get('/getMay', CRUD.getMay);
app.get('/getJun', CRUD.getJun);
app.get('/getJul', CRUD.getJul);
app.get('/getAug', CRUD.getAug);
app.get('/getSep', CRUD.getSep);
app.get('/getOct', CRUD.getOct);
app.get('/getNov', CRUD.getNov);
app.get('/getDec', CRUD.getDec);
app.get('/gettype1', CRUD.getType1);
app.get('/gettype2', CRUD.getType2);
app.get('/gettype3', CRUD.getType3);
app.get('/gettype4', CRUD.getType4);
app.get('/gettype5', CRUD.getType5);
app.get('/getJan1', CRUD.getJan1);
app.get('/getFab1', CRUD.getFab1);
app.get('/getMar1', CRUD.getMar1);
app.get('/getApr1', CRUD.getApr1);
app.get('/getMay1', CRUD.getMay1);
app.get('/getJun1', CRUD.getJun1);
app.get('/getJul1', CRUD.getJul1);
app.get('/getAug1', CRUD.getAug1);
app.get('/getSep1', CRUD.getSep1);
app.get('/getOct1', CRUD.getOct1);
app.get('/getNov1', CRUD.getNov1);
app.get('/getDec1', CRUD.getDec1);



app.get('/brief', (req,res)=>{
    res.render("brief")});

app.get('/debrief', (req,res)=>{
    res.render("debrief")});

app.get('/Graphs', (req,res)=>{
    res.render("Graphs")});



app.get('/leadPre', CRUD.leaderPercentage);
app.get('/Reop', CRUD.Reop);
app.get('/totalSurgeriesLastMonth', CRUD.totalSurgeriesLastMonth);
app.get('/avgSatisfactionLastMonth', CRUD.avgSatisfactionLastMonth);
app.get('/avgComplications', CRUD.avgComplications);
app.get('/durationExceededPlan', CRUD.durationExceededPlan);
app.get('/surgeryTypesCount', CRUD.surgeryTypesCount);
app.get('/leaderPercentage', CRUD.leaderPercentage);




app.get('/selectStatistics', (req, res) => {
  res.cookie("surgeryTypesCount", "");
  res.render('selectStatistics');
});

app.post('/selectStatistics', (req, res) => {
  const selectedMonth = req.body.month;
  const selectedYear = req.body.year;
  res.redirect(`/leaderPercentage?month=${selectedMonth}&year=${selectedYear}`);
});

    
// set up listen
app.listen(port, ()=>{
    console.log("server is running on port", port);
});