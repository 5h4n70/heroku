//jshint esversion:10
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const app = express();
const wait = require('util').promisify(setInterval);
///mongo stuffs  start

const mongoose = require('mongoose');
const dbName = 'todo_db';
const url = `mongodb://localhost/${dbName}`;
const url2 = 'mongodb+srv://sehrik123:sehrik69@webapps.tdsj6.mongodb.net/todoApp?retryWrites=true&w=majority';
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('er', (er) => {
  console.error(er);
});

const todoSchema = new mongoose.Schema({
  task_name: {
    type: String,
    required: true
  },
  is_done: Boolean
});

const todoClass = mongoose.model('todo_list', todoSchema);


//mongo stuffs end 

let found_items = [];



app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


app.get("/", function (req, res) {
  const day = date.getDate();
  todoClass.find({}, function (er, rt) {
        res.render("list", {
          listTitle:`Today is ${day}`,
          newListItems: rt
        });
      });
});


app.post("/", function (req, res) {
  const item_name = req.body.newItem;
  if (item_name.length) {
    todoClass.create({
      task_name: item_name,
      is_done: false
    });
  }
  return res.redirect('/');
});


app.post('/delete',  function (req, res) {
  const del = req.body.checked;
   todoClass.findByIdAndRemove(del, function (er, pr) {
    if (er) return console.error(er);
  });
  return res.redirect('/');

});

let port = process.env.PORT;
if(port ==null || port ==''){
  port = 4000;
}
app.listen(port, function () {
  console.log("Server started on port " + port);
});