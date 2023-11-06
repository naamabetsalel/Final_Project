const express = require('express');
const { PASSWORD } = require('./DB.config');
const SQL = require('./web');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());


const createTable = (req,res)=>{
    const Q1 = 'CREATE TABLE IF NOT EXISTS `Surguries` (id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, Date date NOT NULL, SurguryType varchar(30) NOT NULL, Duration Time NOT NULL, BMI int NOT NULL, Age int NOT NULL, PastProblems varchar(3) NOT NULL, Complication int NOT NULL, Satisfaction int NOT NULL, Reoperation varchar(3) NOT NULL, DePoint varchar(200) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8';
    SQL.query(Q1, (err, result) => {
        if (err) throw err;
        console.log("Table created");
    });
    res.render('Statistics')
    }

const dropTable = (req,res)=>{
    const Q2 = 'DROP TABLE IF EXISTS Surguries';    
    SQL.query(Q2, (err,mysqlres)=>{
        if (err) {
            console.log(err);
            res.status(400).send(err);
            return;
        }
        res.send("hi - tables dropped");
        return;
    })};


const insertSurgery = (req,res)=>{
    const newSurgery = {
        date: req.query.Date,
        type: req.query.SurgeryType,
        duration: req.query.Duration,
        BMI: req.query.BMI,
        age: req.query.Age,
        pastProblems: req.query.PastProblems,
        complications: req.query.Complications,
        satisfaction: req.query.Satisfaction,
        reoperation: req.query.Reoperation,
        point: req.query.DePoint
      };
    
      const Q3 = 'INSERT INTO Surguries (Date, SurgeryType, Duration, BMI, Age, PastProblems, Complications, Satisfaction, Reoperation, DePoint) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      SQL.query(Q5, [newSurgery.date, newSurgery.type, newSurgery.duration, newSurgery.BMI, newSurgery.age, newSurgery.pastProblems, newSurgery.complications, newSurgery.satisfaction, newSurgery.reoperation, newSurgery.point], (err, mysqlres) => {
        if (err) {
          console.log(err);
          res.status(400).send(err);
          return;
        }
        });
        res.send("surgury saved")
}

module.exports = {createTable, dropTable, insertSurgery}