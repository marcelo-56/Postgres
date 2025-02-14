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

async function getItems() {
  const a = await db.query("SELECT * FROM items");
    console.log(a.rows);
    
}

getItems();