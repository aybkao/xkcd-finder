var express = require('express');
var bodyParser = require('body-parser');
var Item = require('../database-mongo/index.js');
//var Comic = require('../database-mongo/getXkcd.js');
var request = require('request');
var app = express();

app.use(express.static(__dirname + '/../react-client/dist'));
// CORS
// https://enable-cors.org/server_expressjs.html
app.use('*/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
})

app.use(bodyParser.json());

app.get('/search/:kw', function (req, res) {
  // console.log("keyword: ", req.params.kw);
  // console.log(req.url);  
  Item.find(
  {"transcript": 
    {"$regex": req.params.kw, 
     "$options": "i"
    }
  }, 
  function(err, data) {
    if (err) throw err;
    console.log("this is returnd data after find", data)
    res.send(JSON.stringify(data))
  })
});


app.post('/itemlist', function (req, res) {
  console.log(req.body);
  console.log(req.url);  
  // if url is legit then save into database
  request(req.body.url, function (error, response, body) {
    if (error) {
      console.log("Fields of object for POST request is wrong")
      throw error;
    } else {
      // insert data into database
      var oneImage = new Item (
        {
          url: req.body.url,
          title: req.body.title,
          alt: req.body.alt,
          transcript: 'some words',
          num: 9999,
          safe_title: req.body.title,
          year: '2017',
          month: '4',
          day: '29'
        });
      oneImage.save(function(){
        res.end("POST request works")
      });
    }
  });
});

app.get('/items', function (req, res) {
  Item.find({}, function(err, items) {
    if(err) {
      console.log("cannot get items from mongo")
      //callback(err, null);
    } else {
      console.log("can get items from mongo", items)
      //callback(null, items);
      res.send(JSON.stringify(items));
    }
  });
})

app.get('/test', function (req, res) {
  res.end("THIS IS THE CONNECTION TO SERVER AND IT IS GOOD")
});

// app.get('/items', function (req, res) {
//   items.selectAll(function(err, data) {
//     if(err) {
//       res.sendStatus(500);
//     } else {
//       res.json(data);
//     }
//   });
// });

app.listen(3000, function() {
  console.log('listening on port 3000!');
});

