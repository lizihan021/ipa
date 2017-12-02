const express = require('express')
const app = express()
const cors = require('cors')
const sqlite3 = require('sqlite3').verbose();
import "isomorphic-fetch"

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors())

app.set('views', __dirname + '/public');
app.set('view engine', 'ejs');
let db = new sqlite3.Database(__dirname + '/model/robot.sqlite');

db.all("SELECT * FROM robots", function(err, rows){
  console.log(rows)
});


//////////////////////////////////////
//given robot_id and url, send request
function insert_robot_ip(id, ip, res){
  let db = new sqlite3.Database(__dirname + '/model/robot.sqlite');
  let query = "SELECT ip FROM robots WHERE robotid=" + id;
  let update_query = "UPDATE robots SET ip='" + ip + "' WHERE robotid=" + id ;
  let insert_query = "INSERT INTO robots(ip, robotid) VALUES ('" + ip + "', " + id + ");"
  // console.log(insert_query)
  db.get(query, function(err, row){
    if (row){
      db.run(update_query)
      db.get(query, function(err, row){
        res.render('mes', {mes:"updated "+row['ip']})
      });
    }
    else{
      db.run(insert_query)
      db.get(query, function(err, row){
        res.render('mes', {mes:"inserted "+row['ip']})
      });
    }
  });
}

//////////////////////////////////
// routes information 
app.get('/', function (req, res) {
  let db = new sqlite3.Database(__dirname + '/model/robot.sqlite');
  let query = "SELECT * FROM robots";
  db.all(query, function(err, row){
    res.render('index', {robots: row});
  });
  
})


/////////////////////////////////
// get the translated command
app.post('/api/parseaction', function (req, res) {
  let reqjson = req.body;
  let db = new sqlite3.Database(__dirname + '/model/robot.sqlite');
  let query = "SELECT * FROM commands WHERE command='" + req.body.text + "'"
  console.log(query)
  db.get(query, (err, row)=> {
    console.log(row)
    if (row){
      let res_body = {
        commands: row['colist']
      }
      res.send(JSON.stringify(res_body))
    }
    else{
      let query = "INSERT INTO confuses(commnad) VALUES('" + req.body.text +"')";
      db.run(query)
    }
  });
})

/////////////////////////////////
// get all the confusion commands (used by the worker)
app.get('/api/getconfusion', function (req, res) {
  let reqjson = req.body;
  let db = new sqlite3.Database(__dirname + '/model/robot.sqlite');
  let query = "SELECT * FROM confuses"
  db.all(query, (err, row)=> {
    console.log(row)
    res.header('Access-Control-Allow-Origin', '*');
    res.send(JSON.stringify(row))
  });
})


/////////////////////////////////
// accept the translation information given by the worker
app.post('/api/interpretaction', (req, res)=>{
  let reqjson = req.body;
  console.log(reqjson)
  let db = new sqlite3.Database(__dirname + '/model/robot.sqlite');
  let query = "INSERT INTO commands(command, colist) VALUES('"
    + req.body.text + "'," + req.body.decry + ")";
  console.log(query)
  db.run(query);
  let query2 = "DELETE FROM confuses WHERE command='" + req.body.text + "'";

  db.run(query2);
  res.send(JSON.stringify({"dumy" : 1}))
});

app.get('/robot/:id', function(req, res){
  // console.log("Accessed robot with id: " + req.params.id)
  let db = new sqlite3.Database(__dirname + '/model/robot.sqlite');
  let query = "SELECT ip FROM robots WHERE robotid=" + req.params.id;

  db.get(query, function(err, row){
    if(row){
      res.render('robot', {robot_num: req.params.id, robot_ip:row['ip']});
    }
    else{
      res.render('mes', {mes: "robot with id " + req.params.id + " was not found"});
    }
  });
})
// xxx TODO: vulnerble to SQL inject
app.get('/robot/:id/:control', function(req, res){
  // console.log("Accessed robot " + req.params.id + " with control: " + req.params.control)
  send_ajax_request(req.params.id, ":3000/control/" + req.params.control)
});

app.get('/setip/:id/:ip', function(req, res){
  // console.log("Updated robot " + req.params.id + " with ip: " + req.params.ip)
  insert_robot_ip(req.params.id, req.params.ip, res)
});

app.listen(3000, function () {
  // console.log('Example app listening on port 3000!')
})

db.close();
