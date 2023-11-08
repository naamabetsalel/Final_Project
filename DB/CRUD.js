const express = require('express');
const { PASSWORD } = require('./DB.config');
const SQL = require('./web');
const path = require('path');
const cookieParser = require('cookie-parser');
const { time, count } = require('console');
const app = express();
app.use(cookieParser());



const createTable = (req,res)=>{
    const Q1 = 'CREATE TABLE IF NOT EXISTS `Surgeries` (id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, Date date NOT NULL, SurgeryType varchar(100) NOT NULL, PlanedDuration Time NOT NULL, Leader varchar(3) NOT NULL, Duration Time NOT NULL, BMI varchar(20) NOT NULL, Age varchar(20) NOT NULL, PastProblems varchar(3) NOT NULL, Complications int NOT NULL, Satisfaction int NOT NULL, Reoperation varchar(3) NOT NULL, DePoint varchar(200) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8';
    SQL.query(Q1, (err, result) => {
        if (err) throw err;
        console.log("Table created");
    });
    res.redirect('/leadPre')
    }

const dropTable = (req,res)=>{
    const Q2 = 'DROP TABLE IF EXISTS Surgeries';    
    SQL.query(Q2, (err,mysqlres)=>{
        if (err) {
            console.log(err);
            res.status(400).send(err);
            return;
        }
        res.send("hi - tables dropped");
        return;
    })};


    const insertSurgery = (req, res) => {
        const newSurgery = {
          date: req.query.date,
          type: req.query.SurgeryType,
          lead: req.query.lead,
          duration: req.query.duration,
          BMI: req.query.BMI,
          age: req.query.age,
          pastProblems: req.query.pastProblems,
          complications: req.query.complication,
          satisfaction: req.query.satisfaction,
          reoperation: req.query.reoperation,
          point: req.query.point
        };

        let planDur = '';
        if(newSurgery.type == 'Coronary Artery Bypass Grafting (CABG)'){
            planDur = '04:30'
        }
        if(newSurgery.type == 'Valve Replacement Surgery'){
            planDur = '03:00'
        }
        if(newSurgery.type == 'Atrial Septal Defect (ASD) Closure'){
            planDur = '01:30'
        }
        if(newSurgery.type == 'Ventricular Septal Defect (VSD) Repair'){
            planDur = '01:30'
        }
        if(newSurgery.type == 'Heart Transplantation'){
            planDur = '05:00'
        }

        let bmi = ''
        if(newSurgery.BMI<=25){
            bmi = 'normal'
        }
        if(newSurgery.BMI<=18){
            bmi = 'underweight'
        }
        if(newSurgery.BMI>25){
            bmi = 'overweight'
        }
         

        let age = '';
        if(newSurgery.age<60){
            age = 'adult'
        }
        if(newSurgery.age<30){
            age = 'young'
        }
        if(newSurgery.age>=60){
            age = 'old'
        }

        
      
        const Q3 = 'INSERT INTO Surgeries (Date, SurgeryType, PlanedDuration, Leader, Duration, BMI, Age, PastProblems, Complications, Satisfaction, Reoperation, DePoint) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      
        SQL.query(Q3, [
          newSurgery.date,
          newSurgery.type,
          planDur,
          newSurgery.lead,
          newSurgery.duration,
          bmi,
          age,
          newSurgery.pastProblems,
          newSurgery.complications,
          newSurgery.satisfaction,
          newSurgery.reoperation,
          newSurgery.point
        ], (err, mysqlres) => {
          if (err) {
            console.log(err);
            res.status(400).send(err);
            return;
          }
          console.log("Surgery saved");
          res.redirect('/debrief')
        });
      };


      const getPoints = (req, res) => {
        const findSurgery = {
          type: req.query.SurgeryType,
          BMI: req.query.BMI,
          age: req.query.age 
        };
        let bmi = ''
        if(findSurgery.BMI<=25){
            bmi = 'normal'
        }
        if(findSurgery.BMI<=18){
            bmi = 'underweight'
        }
        if(findSurgery.BMI>25){
            bmi = 'overweight'
        }

        let age = '';
        if(findSurgery.age<60){
            age = 'adult'
        }
        if(findSurgery.age<30){
            age = 'young'
        }
        if(findSurgery.age>=60){
            age = 'old'
        }

        const Q4 = 'SELECT DePoint FROM Surgeries WHERE SurgeryType = ? AND BMI = ? AND Age = ? ORDER BY Date DESC LIMIT 3';
      
        SQL.query(Q4, [findSurgery.type, bmi, age] , (err, mysqlres) => {
          if (err) {
            console.log(err);
            res.status(400).send(err);
            return;
          }
          console.log(mysqlres);
          res.render('Points', { v1: mysqlres });
        });
      };


      const countExceed = () => {
        return new Promise((resolve, reject) => {
            console.log('hi this is datastats');
            const Q5 = 'SELECT COUNT(*) FROM Surgeries WHERE PlanedDuration<Duration';
            SQL.query(Q5, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }                    
                    resolve({
                        results: results
                    });
                }) 
            })
    };


      



module.exports = { createTable, dropTable, insertSurgery, getPoints, countExceed}