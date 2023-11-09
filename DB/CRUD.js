const express = require('express');
const { PASSWORD } = require('./DB.config');
const SQL = require('./web');
const path = require('path');
const cookie = require('cookie-parser');
const { time, count } = require('console');
const app = express();
app.use(cookie());



const createTable = (req,res)=>{
    const Q1 = 'CREATE TABLE IF NOT EXISTS `Surgeries` (id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, Date date NOT NULL, SurgeryType varchar(100) NOT NULL, PlanedDuration Time NOT NULL, Leader varchar(3) NOT NULL, Duration Time NOT NULL, BMI varchar(20) NOT NULL, Age varchar(20) NOT NULL, PastProblems varchar(3) NOT NULL, Complications int NOT NULL, Satisfaction int NOT NULL, Reoperation varchar(3) NOT NULL, DePoint varchar(200) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8';
    SQL.query(Q1, (err, result) => {
        if (err) throw err;
        console.log("Table created");
    });
    res.redirect('/selectStatistics');
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


      const countExceed = (req, res) => {
        return new Promise((resolve, reject) => {
            console.log('hi this is datastats');
            const Q5 = 'SELECT COUNT(*) AS value FROM Surgeries WHERE PlanedDuration<Duration';
            SQL.query(Q5, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }          
                const num = results[0].value;  
                console.log(num);
                res.cookie("countExceed", num);  
                res.redirect("/countOnTime"); 
                }) 
            })
    };




    const countOnTime = (req, res) => {
        return new Promise((resolve, reject) => {
            console.log('hi this is datastats');
            const Q6 = 'SELECT COUNT(*) AS value FROM Surgeries WHERE PlanedDuration>=Duration';
            SQL.query(Q6, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }          
                const num = results[0].value;  
                console.log(num);
                res.cookie("countOnTime", num);  
                res.redirect("/getJan"); 
                }) 
            })
    };


    const getJan = (req, res) => {
        return new Promise((resolve, reject) => {
            console.log('hi this is datastats');
            const Q7 = 'SELECT COUNT(*) AS value FROM Surgeries WHERE MONTH(Date)=01 AND YEAR(Date) = YEAR(CURRENT_DATE())';
            SQL.query(Q7, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }          
                const num = results[0].value;  
                console.log(num);
                res.cookie("getJan", num);  
                res.redirect("/getFab"); 
                }) 
            })
    };

    const getFab = (req, res) => {
        return new Promise((resolve, reject) => {
            console.log('hi this is datastats');
            const Q8 = 'SELECT COUNT(*) AS value FROM Surgeries WHERE MONTH(Date)=02 AND YEAR(Date) = YEAR(CURRENT_DATE())';
            SQL.query(Q8, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }          
                const num = results[0].value;  
                console.log(num);
                res.cookie("getFab", num);  
                res.redirect("/getMar"); 
                }) 
            })
    };

    const getMar = (req, res) => {
        return new Promise((resolve, reject) => {
            console.log('hi this is datastats');
            const Q9 = 'SELECT COUNT(*) AS value FROM Surgeries WHERE MONTH(Date)=3 AND YEAR(Date) = YEAR(CURRENT_DATE())';
            SQL.query(Q9, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }          
                const num = results[0].value;  
                console.log(num);
                res.cookie("getMar", num);  
                res.redirect("/getApr"); 
                }) 
            })
    };

    const getApr = (req, res) => {
        return new Promise((resolve, reject) => {
            console.log('hi this is datastats');
            const Q10 = 'SELECT COUNT(*) AS value FROM Surgeries WHERE MONTH(Date)=4 AND YEAR(Date) = YEAR(CURRENT_DATE())';
            SQL.query(Q10, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }          
                const num = results[0].value;  
                console.log(num);
                res.cookie("getApr", num);  
                res.redirect("/getMay"); 
                }) 
            })
    };

    const getMay = (req, res) => {
        return new Promise((resolve, reject) => {
            console.log('hi this is datastats');
            const Q11 = 'SELECT COUNT(*) AS value FROM Surgeries WHERE MONTH(Date)=5 AND YEAR(Date) = YEAR(CURRENT_DATE())';
            SQL.query(Q11, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }          
                const num = results[0].value;  
                console.log(num);
                res.cookie("getMay", num);  
                res.redirect("/getJun"); 
                }) 
            })
    };

    const getJun = (req, res) => {
        return new Promise((resolve, reject) => {
            console.log('hi this is datastats');
            const Q12 = 'SELECT COUNT(*) AS value FROM Surgeries WHERE MONTH(Date)=6 AND YEAR(Date) = YEAR(CURRENT_DATE())';
            SQL.query(Q12, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }          
                const num = results[0].value;  
                console.log(num);
                res.cookie("getJun", num);  
                res.redirect("/getJul"); 
                }) 
            })
    };

    const getJul = (req, res) => {
        return new Promise((resolve, reject) => {
            console.log('hi this is datastats');
            const Q13 = 'SELECT COUNT(*) AS value FROM Surgeries WHERE MONTH(Date)=7 AND YEAR(Date) = YEAR(CURRENT_DATE())';
            SQL.query(Q13, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }          
                const num = results[0].value;  
                console.log(num);
                res.cookie("getJul", num);  
                res.redirect("/getAug"); 
                }) 
            })
    };

    const getAug = (req, res) => {
        return new Promise((resolve, reject) => {
            console.log('hi this is datastats');
            const Q14 = 'SELECT COUNT(*) AS value FROM Surgeries WHERE MONTH(Date)=8 AND YEAR(Date) = YEAR(CURRENT_DATE())';
            SQL.query(Q14, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }          
                const num = results[0].value;  
                console.log(num);
                res.cookie("getAug", num);  
                res.redirect("/getSep"); 
                }) 
            })
    };

    const getSep = (req, res) => {
        return new Promise((resolve, reject) => {
            console.log('hi this is datastats');
            const Q15 = 'SELECT COUNT(*) AS value FROM Surgeries WHERE MONTH(Date)=9 AND YEAR(Date) = YEAR(CURRENT_DATE())';
            SQL.query(Q15, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }          
                const num = results[0].value;  
                console.log(num);
                res.cookie("getSep", num);  
                res.redirect("/getOct"); 
                }) 
            })
    };

    const getOct = (req, res) => {
        return new Promise((resolve, reject) => {
            console.log('hi this is datastats');
            const Q16 = 'SELECT COUNT(*) AS value FROM Surgeries WHERE MONTH(Date)=10 AND YEAR(Date) = YEAR(CURRENT_DATE())';
            SQL.query(Q16, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }          
                const num = results[0].value;  
                console.log(num);
                res.cookie("getOct", num);  
                res.redirect("/getNov"); 
                }) 
            })
    };

    const getNov = (req, res) => {
        return new Promise((resolve, reject) => {
            console.log('hi this is datastats');
            const Q17 = 'SELECT COUNT(*) AS value FROM Surgeries WHERE MONTH(Date)=11 AND YEAR(Date) = YEAR(CURRENT_DATE())';
            SQL.query(Q17, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }          
                const num = results[0].value;  
                console.log(num);
                res.cookie("getNov", num);  
                res.redirect("/getDec"); 
                }) 
            })
    };

    const getDec = (req, res) => {
        return new Promise((resolve, reject) => {
            console.log('hi this is datastats');
            const Q18 = 'SELECT COUNT(*) AS value FROM Surgeries WHERE MONTH(Date)=12 AND YEAR(Date) = YEAR(CURRENT_DATE())';
            SQL.query(Q18, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }          
                const num = results[0].value;  
                console.log(num);
                res.cookie("getDec", num);  
                res.redirect("/gettype1"); 
                }) 
            })
    };


    const getType1 = (req, res) => {
        return new Promise((resolve, reject) => {
            console.log('hi this is datastats');
            const Q19 = 'SELECT COUNT(*) AS value FROM Surgeries WHERE SurgeryType = "Coronary Artery Bypass Grafting (CABG)" ';
            SQL.query(Q19, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }          
                const num = results[0].value;  
                console.log(num);
                res.cookie("gettype1", num);  
                res.redirect("/gettype2"); 
                }) 
            })
    };

    const getType2 = (req, res) => {
        return new Promise((resolve, reject) => {
            console.log('hi this is datastats');
            const Q20 = 'SELECT COUNT(*) AS value FROM Surgeries WHERE SurgeryType = "Valve Replacement Surgery" ';
            SQL.query(Q20, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }          
                const num = results[0].value;  
                console.log(num);
                res.cookie("gettype2", num);  
                res.redirect("/gettype3"); 
                }) 
            })
    };

    const getType3 = (req, res) => {
        return new Promise((resolve, reject) => {
            console.log('hi this is datastats');
            const Q21 = 'SELECT COUNT(*) AS value FROM Surgeries WHERE SurgeryType = "Atrial Septal Defect (ASD) Closure" ';
            SQL.query(Q21, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }          
                const num = results[0].value;  
                console.log(num);
                res.cookie("gettype3", num);  
                res.redirect("/gettype4"); 
                }) 
            })
    };

    const getType4 = (req, res) => {
        return new Promise((resolve, reject) => {
            console.log('hi this is datastats');
            const Q22 = 'SELECT COUNT(*) AS value FROM Surgeries WHERE SurgeryType = "Ventricular Septal Defect (VSD) Repair" ';
            SQL.query(Q22, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }          
                const num = results[0].value;  
                console.log(num);
                res.cookie("gettype4", num);  
                res.redirect("/gettype5"); 
                }) 
            })
    };

    const getType5 = (req, res) => {
        return new Promise((resolve, reject) => {
            console.log('hi this is datastats');
            const Q23 = 'SELECT COUNT(*) AS value FROM Surgeries WHERE SurgeryType = "Heart Transplantation" ';
            SQL.query(Q23, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }          
                const num = results[0].value;  
                console.log(num);
                res.cookie("gettype5", num);  
                res.redirect("/getJan1"); 
                }) 
            })
    };



    const getJan1 = (req, res) => {
        return new Promise((resolve, reject) => {
            console.log('hi this is datastats');
            const Q24 = 'SELECT AVG(Satisfaction) AS value FROM Surgeries WHERE MONTH(Date)=01 AND YEAR(Date) = YEAR(CURRENT_DATE())';
            SQL.query(Q24, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }          
                const num = results[0].value;  
                console.log(num);
                res.cookie("getJan1", num);  
                res.redirect("/getFab1"); 
                }) 
            })
    };

    const getFab1 = (req, res) => {
        return new Promise((resolve, reject) => {
            console.log('hi this is datastats');
            const Q25 = 'SELECT AVG(Satisfaction) AS value FROM Surgeries WHERE MONTH(Date)=02 AND YEAR(Date) = YEAR(CURRENT_DATE())';
            SQL.query(Q25, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }          
                const num = results[0].value;  
                console.log(num);
                res.cookie("getFab1", num);  
                res.redirect("/getMar1"); 
                }) 
            })
    };

    const getMar1 = (req, res) => {
        return new Promise((resolve, reject) => {
            console.log('hi this is datastats');
            const Q26 = 'SELECT AVG(Satisfaction) AS value FROM Surgeries WHERE MONTH(Date)=03 AND YEAR(Date) = YEAR(CURRENT_DATE())';
            SQL.query(Q26, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }          
                const num = results[0].value;  
                console.log(num);
                res.cookie("getMar1", num);  
                res.redirect("/getApr1"); 
                }) 
            })
    };

    const getApr1 = (req, res) => {
        return new Promise((resolve, reject) => {
            console.log('hi this is datastats');
            const Q27 = 'SELECT AVG(Satisfaction) AS value FROM Surgeries WHERE MONTH(Date)=04 AND YEAR(Date) = YEAR(CURRENT_DATE())';
            SQL.query(Q27, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }          
                const num = results[0].value;  
                console.log(num);
                res.cookie("getApr1", num);  
                res.redirect("/getMay1"); 
                }) 
            })
    };

    const getMay1 = (req, res) => {
        return new Promise((resolve, reject) => {
            console.log('hi this is datastats');
            const Q28 = 'SELECT AVG(Satisfaction) AS value FROM Surgeries WHERE MONTH(Date)=05 AND YEAR(Date) = YEAR(CURRENT_DATE())';
            SQL.query(Q28, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }          
                const num = results[0].value;  
                console.log(num);
                res.cookie("getMay1", num);  
                res.redirect("/getJun1"); 
                }) 
            })
    };

    const getJun1 = (req, res) => {
        return new Promise((resolve, reject) => {
            console.log('hi this is datastats');
            const Q29 = 'SELECT AVG(Satisfaction) AS value FROM Surgeries WHERE MONTH(Date)=06 AND YEAR(Date) = YEAR(CURRENT_DATE())';
            SQL.query(Q29, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }          
                const num = results[0].value;  
                console.log(num);
                res.cookie("getJun1", num);  
                res.redirect("/getJul1"); 
                }) 
            })
    };

    const getJul1 = (req, res) => {
        return new Promise((resolve, reject) => {
            console.log('hi this is datastats');
            const Q30 = 'SELECT AVG(Satisfaction) AS value FROM Surgeries WHERE MONTH(Date)=07 AND YEAR(Date) = YEAR(CURRENT_DATE())';
            SQL.query(Q30, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }          
                const num = results[0].value;  
                console.log(num);
                res.cookie("getJul1", num);  
                res.redirect("/getAug1"); 
                }) 
            })
    };

    const getAug1 = (req, res) => {
        return new Promise((resolve, reject) => {
            console.log('hi this is datastats');
            const Q31 = 'SELECT AVG(Satisfaction) AS value FROM Surgeries WHERE MONTH(Date)=08 AND YEAR(Date) = YEAR(CURRENT_DATE())';
            SQL.query(Q31, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }          
                const num = results[0].value;  
                console.log(num);
                res.cookie("getAug1", num);  
                res.redirect("/getSep1"); 
                }) 
            })
    };

    const getSep1 = (req, res) => {
        return new Promise((resolve, reject) => {
            console.log('hi this is datastats');
            const Q32 = 'SELECT AVG(Satisfaction) AS value FROM Surgeries WHERE MONTH(Date)=09 AND YEAR(Date) = YEAR(CURRENT_DATE())';
            SQL.query(Q32, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }          
                const num = results[0].value;  
                console.log(num);
                res.cookie("getSep1", num);  
                res.redirect("/getOct1"); 
                }) 
            })
    };

    const getOct1 = (req, res) => {
        return new Promise((resolve, reject) => {
            console.log('hi this is datastats');
            const Q33 = 'SELECT AVG(Satisfaction) AS value FROM Surgeries WHERE MONTH(Date)=10 AND YEAR(Date) = YEAR(CURRENT_DATE())';
            SQL.query(Q33, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }          
                const num = results[0].value;  
                console.log(num);
                res.cookie("getOct1", num);  
                res.redirect("/getNov1"); 
                }) 
            })
    };

    const getNov1 = (req, res) => {
        return new Promise((resolve, reject) => {
            console.log('hi this is datastats');
            const Q34 = 'SELECT AVG(Satisfaction) AS value FROM Surgeries WHERE MONTH(Date)=11 AND YEAR(Date) = YEAR(CURRENT_DATE())';
            SQL.query(Q34, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }          
                const num = results[0].value;  
                console.log(num);
                res.cookie("getNov1", num);  
                res.redirect("/getDec1"); 
                }) 
            })
    };

    const getDec1 = (req, res) => {
        return new Promise((resolve, reject) => {
            console.log('hi this is datastats');
            const Q35 = 'SELECT AVG(Satisfaction) AS value FROM Surgeries WHERE MONTH(Date)=01 AND YEAR(Date) = YEAR(CURRENT_DATE())';
            SQL.query(Q35, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }          
                const num = results[0].value;  
                console.log(num);
                res.cookie("getDec1", num);  
                res.render("Graphs"); 
                }) 
            })
    };
      





    const leaderPercentage = (req, res) => {
        const selectedMonth = req.query.month;
        const selectedYear = req.query.year;
    
        const Q5 = "SELECT COUNT(*) AS Name FROM Surgeries WHERE MONTH(Date) = ? AND YEAR(Date) = ?";
        const Q6 = "SELECT COUNT(*) AS Name FROM Surgeries WHERE MONTH(Date) = ? AND YEAR(Date) = ? AND Leader = 'Yes'";
    
        SQL.query(Q5, [selectedMonth, selectedYear], (err, mysqlres) => {
            if (err) {
                console.log(err);
                res.status(400).send(err);
                return;
            }
            const count = mysqlres[0].Name;
    
            if (count === 0) {
                res.send("No surgeries yet!");
                return;
            }
    
            SQL.query(Q6, [selectedMonth, selectedYear], (err, mysqlres) => {
                if (err) {
                    console.log(err);
                    res.status(400).send(err);
                    return;
                }
                const leader = mysqlres[0].Name;
                const pre = (leader * 100) / count;
                const roundedPre = pre.toFixed(2);
    
                res.cookie("leadPre", roundedPre + "%");
                res.redirect("/Reop?month=" + selectedMonth + "&year=" + selectedYear);
            });
        });
    };
    
    const Reop = (req, res) => {
        const selectedMonth = req.query.month;
        const selectedYear = req.query.year;
    
        const Q7 = "SELECT COUNT(*) AS Name FROM Surgeries WHERE MONTH(Date) = ? AND YEAR(Date) = ?";
        const Q8 = "SELECT COUNT(*) AS Name FROM Surgeries WHERE MONTH(Date) = ? AND YEAR(Date) = ? AND Reoperation = 'Yes'";
    
        SQL.query(Q7, [selectedMonth, selectedYear], (err, mysqlres) => {
            if (err) {
                console.log(err);
                res.status(400).send(err);
                return;
            }
            const count = mysqlres[0].Name;
    
            if (count === 0) {
                res.send("No surgeries yet!");
                return;
            }
    
            SQL.query(Q8, [selectedMonth, selectedYear], (err, mysqlres) => {
                if (err) {
                    console.log(err);
                    res.status(400).send(err);
                    return;
                }
                const leader = mysqlres[0].Name;
                const pre = (leader * 100) / count;
                const roundedPre = pre.toFixed(2);
    
                res.cookie("Reop", roundedPre);
                res.redirect("/totalSurgeriesLastMonth?month=" + selectedMonth + "&year=" + selectedYear);
            });
        });
    };
    
    const totalSurgeriesLastMonth = (req, res) => {
        const selectedMonth = req.query.month;
        const selectedYear = req.query.year;
    
        const Q9 = "SELECT COUNT(*) AS Name FROM Surgeries WHERE MONTH(Date) = ? AND YEAR(Date) = ?";
        const values = [selectedMonth, selectedYear];
    
        SQL.query(Q9, values, (err, mysqlres) => {
            if (err) {
                console.log(err);
                res.status(400).send(err);
                return;
            }
            const count = mysqlres[0].Name;
    
            if (count === 0) {
                res.send("No surgeries yet!");
                return;
            }
    
            res.cookie("totalSurgeriesLastMonth", count);
            res.redirect(`/avgSatisfactionLastMonth?month=${selectedMonth}&year=${selectedYear}`);
        });
    };
    
    const avgSatisfactionLastMonth = (req, res) => {
        const selectedMonth = req.query.month;
        const selectedYear = req.query.year;
    
        const Q10 = "SELECT AVG(Satisfaction) AS AvgSatisfaction FROM Surgeries WHERE MONTH(Date) = ? AND YEAR(Date) = ?";
        const values = [selectedMonth, selectedYear];
    
        SQL.query(Q10, values, (err, mysqlres) => {
            if (err) {
                console.log(err);
                res.status(400).send(err);
                return;
            }
    
            const avgSatisfaction = mysqlres[0].AvgSatisfaction;
    
            if (avgSatisfaction === null) {
                res.send("No surgeries yet!");
                return;
            }
    
            res.cookie("avgSatisfactionLastMonth", avgSatisfaction);
            res.redirect(`/avgComplications?month=${selectedMonth}&year=${selectedYear}`);
        });
    };
    
    const avgComplications = (req, res) => {
        const selectedMonth = req.query.month;
        const selectedYear = req.query.year;
    
        const Q11 = "SELECT AVG(Complications) AS AvgComplications FROM Surgeries WHERE MONTH(Date) = ? AND YEAR(Date) = ?";
        const values = [selectedMonth, selectedYear];
    
        SQL.query(Q11, values, (err, mysqlres) => {
            if (err) {
                console.log(err);
                res.status(400).send(err);
                return;
            }
    
            const avgComplications = mysqlres[0].AvgComplications;
    
            if (avgComplications === null) {
                res.send("No surgeries yet!");
                return;
            }
    
            res.cookie("avgComplications", avgComplications);
            res.redirect(`/durationExceededPlan?month=${selectedMonth}&year=${selectedYear}`);
        });
    };
    
    const durationExceededPlan = (req, res) => {
        const selectedMonth = req.query.month;
        const selectedYear = req.query.year;
    
        const Q12 = "SELECT COUNT(*) AS Name FROM Surgeries WHERE MONTH(Date) = ? AND YEAR(Date) = ? AND Duration > PlanedDuration";
        const values = [selectedMonth, selectedYear];
    
        SQL.query(Q12, values, (err, mysqlres) => {
            if (err) {
                console.log(err);
                res.status(400).send(err);
                return;
            }
            const count = mysqlres[0].Name;
    
            if (count === 0) {
                res.send("No surgeries yet!");
                return;
            }
    
            res.cookie("durationExceededPlan", count);
            res.redirect(`/surgeryTypesCount?month=${selectedMonth}&year=${selectedYear}`);
        });
    };
    
    const surgeryTypesCount = (req, res) => {
        const selectedMonth = req.query.month;
        const selectedYear = req.query.year;
    
        const Q13 = "SELECT SurgeryType, COUNT(SurgeryType) AS Count FROM Surgeries WHERE MONTH(Date) = ? AND YEAR(Date) = ? GROUP BY SurgeryType";
        const values = [selectedMonth, selectedYear];
    
        SQL.query(Q13, values, (err, mysqlres) => {
            if (err) {
                console.log(err);
                res.status(400).send(err);
                return;
            }
            const surgeryTypesCounts = mysqlres;
    
            if (surgeryTypesCounts.length === 0) {
                res.send("No surgeries yet!");
                return;
            }
    
            res.cookie("surgeryTypesCount", surgeryTypesCounts);
            res.render('Statistics', {
                v2: req.cookies.leadPre,
                v3: req.cookies.Reop,
                v4: req.cookies.totalSurgeriesLastMonth,
                v5: req.cookies.avgSatisfactionLastMonth,
                v6: req.cookies.avgComplications,
                v7: req.cookies.durationExceededPlan,
                v8: req.cookies.surgeryTypesCount,
            });
        });
    };


module.exports = { createTable, dropTable, insertSurgery, getPoints, countExceed, countOnTime, getJan, getFab, getMar, getApr, getMay, getJun, getJul, getAug, getSep, getOct, getNov, getDec, getType1, getType2, getType3, getType4, getType5, getJan1, getFab1, getMar1, getApr1, getMay1, getJun1, getJul1, getAug1, getSep1, getOct1, getNov1, getDec1, leaderPercentage, Reop, totalSurgeriesLastMonth, avgSatisfactionLastMonth, avgComplications, durationExceededPlan, surgeryTypesCount }