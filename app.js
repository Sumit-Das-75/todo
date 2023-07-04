//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const { redirect } = require("express/lib/response");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://sumitdas8740:Sumit-123@cluster0.njblfl1.mongodb.net/newItems');

const newItemsSchema = {
  name: String
};

const Item = mongoose.model("Nitem", newItemsSchema)

const item1 = new Item({
  name: "Welcome to the todo list app"
})

const item2 = new Item({
  name: "+ <-- press to add element"
})

const item3 = new Item({
  name: "press the BOX if checked"
})

const defaultitems = [item1, item2, item3]

const listSchema={
  name: String,
  items:[newItemsSchema]
}

const List = mongoose.model("List",listSchema)

let foundItems = [];

app.get("/", function (req, res) {

  const day = date.getDate();

  async function finds() {
    foundItems = await Item.find();
    if (foundItems.length === 0) {
      Item.insertMany(defaultitems);
    }
    else {
      console.log(foundItems);
      res.render("list", { listTitle: day, newListItems: foundItems })
    }
  }

  finds();


});
 


app.post("/", function (req, res) {

  const itemName = req.body.newItem;

  const Fitem = new Item({
    name: itemName
  })

  Item.insertMany(Fitem);
  res.redirect("/");

});

app.post("/delete", function (req, res) {
  const checkeedItemId = req.body.checkbox;

  async function del() {
    await Item.findByIdAndRemove(checkeedItemId)
  }
  del();
  res.redirect("/")
})

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
