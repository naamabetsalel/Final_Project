const express = require('express');
const path = require('path');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const CRUD = require('./DB/CRUD');
const SQL = require("./DB/web")
const port = 3000;
app.use(express.static(path.join(__dirname, "static")));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.set('views',path.join(__dirname, "views"));
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.static(path.join(__dirname, 'static'), { type: 'application/javascript' }));



app.get('/', CRUD.createTable);
app.get('/dropTable', CRUD.dropTable);
app.get('/insertSurgery', CRUD.insertSurgery);
app.get('/getPoints', CRUD.getPoints);

app.get('/brief', (req,res)=>{
    res.render("brief")});

app.get('/debrief', (req,res)=>{
    res.render("debrief")});

app.get('/private', (req,res)=>{
    res.render("private")});


    app.get('/countExceed', (req, res) => {
        CRUD.countExceed()
          .then(results => {
            const exceed = results.results;
            const responseData = { exceed }
            console.log(responseData)
            res.json(responseData);
          })
          .catch(err => {
            console.error('Error while extracting data', err);
            res.status(500).json({ error: 'Internal server error' });
          });
      });

    
    
// set up listen
app.listen(port, ()=>{
    console.log("server is running on port", port);
});