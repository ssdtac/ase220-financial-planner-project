const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const csvParser = require('csv-parser');
const csvWriter = require('csv-write-stream');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const uri = fs.readFileSync("uri.txt", "utf-8");
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
var db = null


async function connect(){
	let connection=await client.connect()
	return connection
}

async function insert(db,database,collection,document){
  let dbo=db.db(database)
  let result=await dbo.collection(collection).insertOne(document)
  console.log(result)
  return result;
}

async function find(db,database,collection,criteria){
  let dbo=db.db(database)
  let result=await dbo.collection(collection).find(criteria).toArray()
  //console.log(result)
  return result;
}

async function start() {
    db=await connect()
    result = await find(db, "financial-planner", "users", {username: 'cassiancc'})
    console.log(result)

}

// start()

const app = express();
const port = 5500;

const SECRET_KEY = 'secret_key';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Middleware to authenticate token
function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (token == null) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden
        req.user = user;
        next();
    });
}

// User Signup
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 8);
    const writer = csvWriter({ sendHeaders: false });
    writer.pipe(fs.createWriteStream('users.csv', { flags: 'a' }));
    writer.write({ username, password: hashedPassword });
    writer.end();
    res.json({ message: 'Signup successful' });
});

// User Login
app.post('/login', async function (req, res) {
    const { username, password } = req.body;

    db=await connect()
    result = await find(db, "financial-planner", "users", {username: username})

    console.log(result[0].username)
    console.log(result[0]._id.toString())
    if (result[0].username == username) {
        res.redirect(301, `/?user=${result[0]._id.toString()}`)
    }
    db.close()
});

// An example protected route
app.get('/protected', authenticateToken, (req, res) => {
    res.send('This is a protected route');
});

//Serve homepage and dashboard
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "html", 'index.html'));
});

//Serve transaction details page as /transaction
app.get('/transaction', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'transaction-detail.html'));
});

app.get('/api/legacyusers/:id', (req, res) =>  {
    if (fs.existsSync(`./json/users/${req.params.id}.json`)) {
        res.sendFile(path.join(__dirname, 'json', 'users', `${req.params.id}.json`));
    } else {
        res.json("404 - not found");
    }
});

app.get('/api/users/:id', async function (req, res) {
    const { token } = req.params.id;

    console.log("token provided", req.params.id)

    db=await connect()
    result = await find(db, "financial-planner", "users", new ObjectId(req.params.id))
    if (result != []) {
        res.send(result)

    }
    db.close()
});

app.get('/api/users.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'json', 'users.json'));
});

//update existing user
app.put('/api/users/:id', (req, res) => {
    if(fs.existsSync(`./json/users/${req.params.id}.json`)){
        fs.writeFileSync(`./json/users/${req.params.id}.json`, JSON.stringify(req.body, null, 2));
        res.json({ok: true});
    } else {
        res.json({ok: false});
    }
});

//create user
app.post('/api/users/:id', (req, res) => {
    if(!fs.existsSync(`json/users/${req.params.id}.json`)) {
        fs.writeFileSync(`json/users/${req.params.id}.json`, JSON.stringify(req.body, null, 2));
        res.json({ok: true});
    } else {
        res.json({ok: false});   
    }
});

//create user in users file
app.put('/api/users.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if (req.headers['content-type'] === 'application/json') {
        fs.writeFileSync("./json/users.json", JSON.stringify(req.body, null, 2));
        res.json({ok: true});
    } else {
        res.json({ok: false});
    }
});

//delete user
app.delete('/api/users/:id', (req, res) => {
    const filePath = path.join(__dirname, 'json', 'users', `${req.params.id}.json`);
    
    if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(err);
                return res.sendStatus(500); // Internal Server Error
            }
            // If the file has been deleted, remove it from users.json
            const file = fs.readFileSync(path.join(__dirname, 'json', 'users.json'), 'utf8');
            let parsedFile = JSON.parse(file);
            let removeUsername = "";
            Object.entries(parsedFile).forEach(function(user) {
                user = user[1];
                if (user.blobId == req.params.id) {
                    removeUsername = user.username;
                }
            });
            delete parsedFile[removeUsername];
            fs.writeFileSync("./json/users.json", JSON.stringify(parsedFile, null, 2));
            res.sendStatus(200); // Successfully deleted
        });
    } else {
        res.sendStatus(404); // File not found
    }
});

//Serve static CSS/JS
app.use(express.static('css'));
app.use(express.static('js'));

//Start the server
app.listen(port, () => {
    console.log(`Financial Planner live on port ${port}`);
});
