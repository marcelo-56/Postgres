import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres", 
  password: "mB*007!",
  port: 5432,
  database: "world",
  host: "localhost",
});

db.connect();

let totalCorrect = 0;



// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentQuestion = {};
let quiz = [];
db.query("SELECT * FROM flags", (err,res) => {
  if (err) {
    console.error("Cannot execute query", err.stack);
  } else {
    currentQuestion = res.rows;
  }
  db.end();
});

console.log(currentQuestion);


// GET home page
app.get("/", (req, res) => {
  totalCorrect = 0;
  quiz = nextQuestion();
  console.log(quiz);
  res.render("index.ejs", { question: quiz });
});

// POST a new post
app.post("/submit", (req, res) => {
  
  let answer = req.body.answer.trim();
  let isCorrect = false;
  if (quiz.name.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    console.log(totalCorrect);
    isCorrect = true;
  }

  quiz = nextQuestion();
  
  res.render("index.ejs", {
    question: quiz,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});

function nextQuestion() {
  const randomCountry = currentQuestion[Math.floor(Math.random() * currentQuestion.length)];
  return randomCountry;
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
