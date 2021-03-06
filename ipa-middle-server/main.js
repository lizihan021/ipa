const express = require('express')
const app = express()
const sqlite3 = require('sqlite3').verbose();
let zip = require('express-zip');
import "isomorphic-fetch"

app.set('views', __dirname + '/public');
app.set('view engine', 'ejs');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: true} ))
//app.use(express.bodyParser({uploadDir:'/path/to/temporary/directory/to/store/uploaded/files'}));

////////////////////////////////////////
var multer = require('multer');
var Storage = multer.diskStorage({
    destination: function(req, file, callback) {
       callback(null, __dirname + "/public/images");
    },
    filename: function(req, file, callback) {
      let filename = file.fieldname + "_" + file.originalname
      callback(null, filename);
      let db = new sqlite3.Database(__dirname + '/model/robot.sqlite');
      let query = "INSERT INTO photos(photoname, robotid) VALUES (\"" + filename + "\", 1)"
      console.log(query)
      db.run(query)
      db.close()
    }
});
var upload = multer({
    storage: Storage
}).array("imgUploader", 3);



// the api to upload image to the database
app.post("/api/Upload", function(req, res) {
    let db = new sqlite3.Database(__dirname + '/model/robot.sqlite');
    let query = "SELECT * FROM photos WHERE robotid = 1 ORDER BY uploadtime ASC"
    db.all(query, function(err, row){
      if (row.length > 100) {
        query = "DELETE FROM photos WHERE photoname=\"" + row[0]["photoname"] + "\" OR photoname=\"" + row[1]["photoname"] + "\""
        fs.unlink(__dirname + "/public/images/" + row[0]["photoname"])
        fs.unlink(__dirname + "/public/images/" + row[1]["photoname"])
        db.run(query, function(err) {
          db.close()
          upload(req, res, function(err) {
            if (err) {
              console.log(err)
              return res.end("Something went wrong!");
            }
            return res.end("File uploaded sucessfully!.");
          });
        })
      }
      else {
        db.close()
        upload(req, res, function(err) {
          if (err) {
            console.log(err)
            return res.end("Something went wrong!");
          }
          return res.end("File uploaded sucessfully!.");
        });
      }      
      console.log("File uploaded sucessfully!.")
    });
});
///////////////////////////////////////

// the api for the download of files
app.get("/api/download", function(req, res){
  let num_filesstr = req.param("num") + ""
  console.log("some one asking for " + num_files + " images")
  let num_files = parseInt(num_filesstr)
  if (num_files > 40) {
    res.end("you are asking for too many files")
  }
  let db = new sqlite3.Database(__dirname + '/model/robot.sqlite');
  let query = "SELECT * FROM photos WHERE robotid = 1 ORDER BY uploadtime DESC"
  db.all(query, function(err, row){
    if (err) {
      res.end("error with the db!")
    }

    let file_arr = []
    for (let i = 0; i < num_files * 2; i++) {
      file_arr.push({ path : __dirname + "/public/images/" + row[i]["photoname"], name : row[i]["photoname"]})
    }
    console.log(file_arr)
    res.zip(file_arr);
  })
});





let db = new sqlite3.Database(__dirname + '/model/robot.sqlite');
let fs = require('fs')
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
      console.log("http://" + row['ip'] + uri)
      fetch("http://" + row['ip'] + uri, { credentials: 'same-origin' })
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          console.log("response")
          return response.json();
        })
        .then((data) => {
          console.log("no response")
        })
        .catch((error) => {
          // delete ip
          console.log(error)
        });
    }
  });
}


//////////////////////////////////////
//given robot id and command, we can add that into database
function add_control_database(robot_id, command){
  // let db = new sqlite3.Database(__dirname + '/model/robot.sqlite');
  // let query = "SELECT ip FROM robots WHERE robotid=" + robot_id;

  // db.get(query, function(err, row){
  //   if(row){
  //     console.log("http://" + row['ip'] + uri)
      
  //   }
  // });
  const mongoclient = require('mongodb').MongoClient;
  let mongourl = "mongodb://admin:admin@ds127936.mlab.com:27936/ipa_robot"
  mongoclient.connect(mongourl, function(err, db) {
    if (err) throw err;
    var myquery = { _id: parseInt(robot_id) };
    var newvalues = { $set: {command: command}};
    db.collection("commands").update(myquery, newvalues, {w:1} ,function(err, res) {
      if (err) throw err;
      console.log("1 document updated");
    });

  });

}


// inser the ip for a robot id
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
  console.log(reqjson)
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
      console.log(req.body.text)
      let query = "SELECT FROM confuses(command) WHERE command=" + req.body.text;
      db.get(query, (err, row)=> {
        if (row){
          console.log("error")
        }
        else{
          query = "INSERT INTO confuses(command) VALUES('" + req.body.text +"')";
          db.run(query)
          let res_body = {
            commands: ""
          }
          res.send(JSON.stringify(res_body))
        }
      })
    }
  });
})


// upload the picture
// WARNING: this api has been abondond
app.post('/api/uploadpicture', function(req, res){

  for (let key in new_body) {
    if (counter == 0){
      body = JSON.parse(key)
      counter = 1;
    }
  }

  let db = new sqlite3.Database(__dirname + '/model/robot.sqlite');
  let query = "SELECT ip FROM robots WHERE robotid=" + body_req.id;
  


  db.get(query, function(err, row){
    let body = body_req.pic
    
    let curnum = row['curnum']
    console.log(curnum)

    let filePath = ""
    if (curnum == 5){
      filePath = __dirname + '/public/images/' + curnum + '.txt';
    }
    else{
      filePath = __dirname + '/public/images/' + curnum + 1 + '.txt';
    }
    
    // fs.appendFile(filePath, body, function() {
    // console.log("image received")
    if (row) {
      if (curnum == 5) {
        fs.unlink('1.txt', function (err) {
          if (err) throw err;
          console.log('File deleted!');
        });
        fs.rename('2.txt', '1.txt', function (err) {
          if (err) throw err;
        });
        fs.rename('3.txt', '2.txt', function (err) {
          if (err) throw err;
        });
        fs.rename('4.txt', '3.txt', function (err) {
          if (err) throw err;
        });
        fs.rename('5.txt', '4.txt', function (err) {
          if (err) throw err;
        });

        fs.writeFile(filePath, body, function() {
          console.log("file saved")
        });
      }
      else {
        let query2 = "UPDATA robots SET curnum=" + curnum + " WHERE robotid=" + req.params.id
        db.run(query)
        
        fs.writeFile(filePath, body, function() {
          console.log("file saved")
        });
      }
    }
  });
})


// return all the avaliable command in the database
app.get('/api/getvalidco', function(req, res){
  let db = new sqlite3.Database(__dirname + '/model/robot.sqlite');
  let query = "SELECT * FROM commands"
  db.all(query, (err, row)=> {
    if (err) throw err;
    res.send(JSON.stringify(row))
  }) 
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
  console.log(req.body.text)
  console.log(req.body.decry, "decry")
  let vec = req.body.decry.split(" ")
  let tmp = req.body.decry

  let db = new sqlite3.Database(__dirname + '/model/robot.sqlite');
  let query = "INSERT INTO commands(command, colist) VALUES('"
    + req.body.text + "','" + tmp + "')";
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
      res.render('robot', {robot_num: req.params.id, robot_ip: row['ip'], robot_id: req.params.id});
    }
    else{
      res.render('mes', {mes: "robot with id " + req.params.id + " was not found"});
    }
  });
  
})


// xxx TODO: vulnerble to SQL inject
// the api to control the database that is used to control the robot
app.get('/robotcontrol/:id/:control', function(req, res){
  // console.log("Accessed robot " + req.params.id + " with control: " + req.params.control)
  // send_ajax_request(req.params.id, ":3000/control/" + req.params.control)
  console.log(req.params.id + " " + req.params.control)
  add_control_database(req.params.id, req.params.control)
  res.send(JSON.stringify({"dumy" : 1}))
});


app.get('/setip/:id/:ip', function(req, res){
  // console.log("Updated robot " + req.params.id + " with ip: " + req.params.ip)
  insert_robot_ip(req.params.id, req.params.ip, res)
});


///////////////////////////////////////////////
// the api to render the label page for the crowdworker
app.get('/transfer', function(req, res){
  // console.log("Updated robot " + req.params.id + " with ip: " + req.params.ip)
  res.render('transfer');
});


// binding port
app.listen(3000, function () {
  console.log('Middle server start at the localhost:3000!')
})

db.close();
