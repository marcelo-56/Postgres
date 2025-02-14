import express from "express";
import pg from "pg";
import bodyParser from "body-parser";

const port = 3000;
const app = express();
const db = new pg.Client( {
  user: 'postgres',
  host: 'localhost',
  password: 'mB*007!',
  port: 5432,
  database: 'world'
});
db.connect();
let countries =[];
var countries2 = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get("/", async (req, res) => { 
  const result = await db.query("SELECT country_code FROM visited_countries");

  countries = result.rows;
  countries.forEach(element => {
    countries2.push(element.country_code);
  });
  
  
  res.render("index.ejs", { total: countries.length, countries: countries2});
});


app.post("/add", async (req, res) => { 
  try {
    
    const result = await db.query("SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",[req.body.country.toLowerCase()]);
        countries = result.rows;  
      try {
          await db.query("INSERT INTO visited_countries(country_code) VALUES ($1)", [countries[0].country_code]);
          countries2.push(countries[0].country_code);
          
          res.render("index.ejs", { total : countries2.length, countries: countries2});
      } catch (err) {
        console.error("already added this lil bitch");
        res.redirect("/");
      }

  } catch (err) {
    console.error("no existo");
    res.redirect("/");
  }
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);    
});