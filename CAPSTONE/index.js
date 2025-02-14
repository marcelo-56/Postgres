import e from 'express';
import pg from 'pg';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = e();
var genres = [];
var books = [];
var notes = [];
const placeholder1 = [{name: 'test', description: 'd1' }]
const db = new pg.Client({
    user: 'postgres',
    database: 'capstone',
    password: 'mB*007!',
    host: 'localhost',
    port: 5432
});
db.connect();

async function getGenres() {
    const a = await db.query("SELECT category FROM books");
    genres = a.rows;
}

async function getBooks() {
    const a = await db.query("SELECT * FROM books");
    books = a.rows;
}

app.use(e.static('public'));
app.use(bodyParser.urlencoded({extended:true}));


app.get("/", async (req, res) => {
    await getGenres().then(async () => {
        await getBooks().then(async()=> {
            const randomBook = books[Math.floor(Math.random()*books.length)];
            const photo = `https://covers.openlibrary.org/b/isbn/${randomBook.isbn}-M.jpg`;
            res.render("index.ejs", {genres: genres, book: randomBook, photo: photo});
        })
    })
   
    
});

async function filterBooksByGenre(genre) {
    const a = await db.query("SELECT * FROM books WHERE category = $1", [genre]);
    books = a.rows;
}


app.post("/books", async (req, res) => {
    if (req.body.name) {
        await db.query("INSERT INTO books(name, isbn, description, rating, category) VALUES($1, $2, $3, $4, $5)", [req.body.name, req.body.isbn, req.body.description, req.body.rating, req.body.category]).then(() => {
            res.redirect("/books");

        });
    } else
    if (Object.keys(req.body).length === 0 ) {  //checking if the user is not passing any filters
        res.redirect("/books");
    } else {
    await filterBooksByGenre(req.body.genre).then(()=> {
        books.forEach(book => {
            book.photo = `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`;
        });
        res.render("books.ejs", { books: books });
    });
}
});

app.get("/books", async (req,res) => {
    await getBooks().then(()=> {
        books.forEach(book => {
            book.photo = `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`;
        });
        res.render("books.ejs", {books: books});
    });
})

app.post("/notes", async (req,res) => {
    console.log(req.body);
    if (req.body.name) {
    await db.query("SELECT id FROM books WHERE name =$1", [req.body.name]).then( async (response)=> {
        const a = response.rows;
        const id = a[0].id;
        await db.query("SELECT * FROM notes WHERE book_id=$1", [a[0].id]).then((response) => {
            notes = response.rows;
            console.log(notes);
            res.render("notes.ejs", {notes: notes, id: id});
        });
    })
} else {
    await db.query("INSERT INTO notes (note, chapter, page, date, book_id) VALUES ($1,$2,$3,$4,$5)", [req.body.note, req.body.chapter, req.body.page, req.body.date, req.body.book_id]).then(async () => {
        console.log("Recorded");
        await db.query("SELECT * FROM notes WHERE book_id=$1", [req.body.book_id]).then((response) => {
            notes = response.rows;
            const id = req.body.book_id;
        res.render("notes.ejs", {notes: notes, id: id} )
        });
    })
    }
});



app.listen(3000, () => {
    console.log("runnin 2");
    
})
