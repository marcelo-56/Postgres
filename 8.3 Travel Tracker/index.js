import express from "express";
import bodyParser from "body-parser";
import pg from "pg";


const app = express();
const port = 3000;

const db = new pg.Client({
   user: "postgres",
   password: "mB*007!",
   database: "world", 
   port: 5432,
   host: "localhost"
});
db.connect();

var countries = [];
function database() {
  db.query("SELECT country_code FROM visited_countries", (err, res) => {
    if (err) {
      console.error("Cannot execute the query", err.message); 
    } else { 
      countries = res.rows;
    }
  });
};
var countries2 = [];
var cat =[];
var t1 = [];


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


database();
app.get("/", (req, res) => {
  let total = countries.length;
  console.log(total);
  countries.forEach(element => {
    cat.push(element.country_code);
  });
  res.render("index.ejs", {
    total : total,
    countries : cat
  });
});

async function checkIfVisited(t) {
  try {
  const result = await db.query("SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",[t.toLowerCase()]);  
  t1 = result.rows;
  } catch (err) { console.error("this bitch don't exist foo"); }
  return t1;
}

app.post("/add", async (req,res) => {
  let t = req.body.country;
  try{
  t1 = await checkIfVisited(t);
  
  db.query("INSERT INTO visited_countries (country_code) VALUES ($1)", [t1[0].country_code], (err, res) => {
    if (err) {
      console.error("Cannot execute the query,", "already inputted this piece of shit");
    };
    });
    database(); 
    for (let i = 0; i< countries.length; i++) { 
      cat.push(countries[i].country_code);
    }
     cat.push(t1[0].country_code);
    res.render("index.ejs", { total: countries.length, countries: cat});
  } catch (err) { console.error("NO EXIST NIGGER");
    for (let i = 0; i< countries.length; i++) { 
      cat.push(countries[i].country_code);
    }
    var cancer = "no existo"
     res.render("index.ejs", {total : countries.length, countries: cat, error: cancer});}
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
