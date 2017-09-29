const express = require('express')
const app = express()

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
var MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb://admin:admin@ds149069.mlab.com:49069/ipa_robot', function (err, db) {
  if (err) throw err

  db.collection('commands').find().toArray(function (err, result) {
    if (err) throw err
    console.log(result)
  })
  app.get('/', function (req, res) {
    res.render("index");
  })

  app.get('/robot/:id', function(req, res){
    console.log(req.params.id)
    var ip_adress = "";
    db.collection('commands').find({_id : parseInt(req.params.id)}).toArray(function (err, result) {
      if (err) throw err
      console.log(result)
      ip_adress = "http://" + result[0]["message"]
      console.log(ip_adress)
      res.redirect(ip_adress)
    })

  })

  app.listen(3000, function () {
      console.log('Example app listening on port 3000!')
  })

})



