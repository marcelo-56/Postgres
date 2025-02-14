import e from "express";
import pg from 'pg';
import bodyParser from "body-parser";

const app = e();
const db = new pg.Client( {
    user: 'postgres',
    password: 'mB*007!',
    host: 'localhost',
    port: 5432,
    database: 'PROYECT-JANUS'
});
var check = false;
var user ="";
var login = "Login";
db.connect();

async function checkUser(username, password) {
    const a = await db.query("SELECT username, password FROM users");
    let users = [];
    users = a.rows;
    
    users.forEach(element => { 
        if (element.username == username) {
            if (element.password == password) { 
                check = true;
                user = username; 
            };
        };
    });
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(e.static('public'));

app.get("/", async (req, res) => {
    res.render("LOGIN.ejs", {login: login});
});

app.post("/signin", async (req,res) => {
    check = false;
    await checkUser(req.body.username, req.body.password).then(() => {
        if(check==true) {
            res.redirect("/home");
         } else {
            res.redirect("/");
            login = "Not existent, try again";
         }
    });
});

app.get("/home", (req,res) => {
    res.render("index.ejs", {user: user});
});

app.get("/nutrition", (req,res) => {
    res.render("nutrition.ejs");
});

app.get("/training", (req,res) => {
    res.render("trainings.ejs");
})

app.get("/contact", (req,res) => {
    try {
       res.redirect("https://wa.me/595962141933"); 
    } catch (error) {
        console.log(error);
        
    }
    
})

app.listen(3000, ()=>{
    console.log('runnin');
    
})