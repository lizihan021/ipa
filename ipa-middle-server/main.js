const express = require('express')
const app = express()
const sqlite3 = require('sqlite3').verbose();
import "isomorphic-fetch"

app.set('views', __dirname + '/public');
app.set('view engine', 'ejs');
let db = new sqlite3.Database(__dirname + '/model/robot.sqlite');

db.all("SELECT * FROM robots", function(err, rows){
  console.log(rows)
});

//////////////////////////////////////
//given robot_id and url, send request
function send_ajax_request(robot_id, uri){
  let db = new sqlite3.Database(__dirname + '/model/robot.sqlite');
  let query = "SELECT ip FROM robots WHERE robotid=" + robot_id;

  db.get(query, function(err, row){
    if(row){
      fetch("http://" + row['ip'] + uri, { credentials: 'same-origin' })
        .then((response)=>{
          if (!response.ok) throw Error(response.statusText);
          console.log("response")
          return response.json();
        })
        .then((data)=>{
          console.log("no response")
        })
        .catch((error) => {
          // delete ip
          console.log(error)
        });
    }
  });
}

function insert_robot_ip(id, ip, res){
  let db = new sqlite3.Database(__dirname + '/model/robot.sqlite');
  let query = "SELECT ip FROM robots WHERE robotid=" + id;
  let update_query = "UPDATE robots SET ip='" + ip + "' WHERE robotid=" + id ;
  let insert_query = "INSERT INTO robots(ip, robotid) VALUES ('" + ip + "', " + id + ");"
  console.log(insert_query)
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

app.get('/robot/:id', function(req, res){
  console.log("Accessed robot with id: " + req.params.id)
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
  console.log("Accessed robot " + req.params.id + " with control: " + req.params.control)
  send_ajax_request(req.params.id, ":3000/control/" + req.params.control)
});

app.get('/setip/:id/:ip', function(req, res){
  console.log("Updated robot " + req.params.id + " with ip: " + req.params.ip)
  insert_robot_ip(req.params.id, req.params.ip, res)
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

db.close();
