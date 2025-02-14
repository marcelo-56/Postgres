import express from "express";
import bodyParser from "body-parser";
import pg from 'pg';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: 'postgres',
  password: 'mB*007!',
  host: 'localhost',
  port: 5432,
  database: 'permalist'
}); 
db.connect();


let items = [];

async function addItem(item) {
  await db.query("INSERT INTO items (title) VALUES($1)",[item]).then(res);
}

app.get("/", async (req, res) => {
  await db.query("SELECT * from items").then((response) => {
    items = response.rows;
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  })
  
});

app.post("/add", async (req, res) => {
  try {
  await db.query("INSERT INTO items (title) VALUES($1)",[req.body.newItem]).then(() => {
    res.redirect("/");
  }); } catch (err) {console.error(err.message);}
});

app.post("/edit", async (req, res) => {
  try {
  await db.query("UPDATE items SET title = $1 WHERE id = $2",[req.body.updatedItemTitle, req.body.updatedItemId]).then(() => {
    res.redirect("/");
  }); } catch (err) {console.error(err.message); }
});

app.post("/delete", async (req, res) => {
  try {
  await db.query("DELETE FROM items WHERE id = $1",[req.body.deleteItemId]).then(() => {
    res.redirect("/");  
  }); } catch (err) {console.error(err.message); }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
