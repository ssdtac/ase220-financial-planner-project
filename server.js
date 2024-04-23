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
    // mongodb
    db=await connect()
    result = await find(db, "financial-planner", "users", { username, password })
    if (result[0] == undefined) {
        res.json(400)
    }
    else {
        console.log(result[0].username)
        console.log(result[0]._id.toString())
        if (result[0].username == username) {
    
            const token = jwt.sign({username}, SECRET_KEY)
            res.redirect(301, `/dashboard?user=${result[0]._id.toString()}&token=${token}`)
        }
    }
    
    db.close()
});

// An example protected route
app.get('/protected', authenticateToken, (req, res) => {
    res.send('This is a protected route');
});

//Serve login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "html", 'index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, "html", 'dashboard.html'));
});

//Serve transaction details page as /transaction
app.get('/transaction', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'transaction-detail.html'));
});


//MONGODB
app.get('/api/users/:id', async function (req, res) {
    console.log("token provided", req.params.id)
    db=await connect()
    result = await find(db, "financial-planner", "users", new ObjectId(req.params.id))
    if (result != []) {
        console.log(result)
        res.json(result[0])

    }
    else {
        res.json("404 - not found");
    }
    db.close()
});



//MONGODB
app.get('/api/findid/:id/:password', async function (req, res) {
    console.log("username provided", req.params.id)
    console.log("password provided", req.params.password)

    db=await connect()
    result = await find(db, "financial-planner", "users", {"username": req.params.id, "password": req.params.password})
    if (result != []) {
        console.log(result)
        res.json(result[0])

    }
    else {
        console.log("Authentication failed!")
        res.json(400);
    }
    db.close()
});

app.get('/api/users/:id', async function (req, res) {
    console.log("token provided", req.params.id)
    db=await connect()
    result = await find(db, "financial-planner", "users", new ObjectId(req.params.id))
    if (result != []) {
        console.log(result)
        res.json(result[0])

    }
    else {
        res.json("404 - not found");
    }
    db.close()
});

app.get('/api/users.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'json', 'users.json'));
});

//update existing user
app.put('/api/users/:id', (req, res) => {
    client.connect(function(err,db){
        if(err) throw err    
        const database=db.db('financial-planner')
        database.collection('users').find({username: req.params.id}).toArray(function(err, result){
            if (err) throw err
            console.log(result[0])
            if (result[0] == undefined) {
                data = req.body
                delete data._id
                database.collection('users').replaceOne({_id: new ObjectId(req.params.id)}, req.body,function(err,result){
                    if (err) throw err
                })
                database.collection('users').find({username: req.params.id}).toArray(function(err, result){
                    if (err) throw err
                    res.json({ok: true});
                    db.close()
                })
            }
            else {
                res.json({ok: false});
                db.close()
            }
           
        })
    })
    
    
});

//create user
app.post('/api/users/:id', async function(req, res) {
    client.connect(function(err,db){
        if(err) throw err    
        const database=db.db('financial-planner')
        database.collection('users').find({username: req.params.id}).toArray(function(err, result){
            if (err) throw err
            console.log(result[0])
            if (result[0] == undefined) {
                database.collection('users').insertOne(req.body,function(err,result){
                    if (err) throw err
                })
                database.collection('users').find({username: req.params.id}).toArray(function(err, result){
                    if (err) throw err
                    res.json(result[0]._id.toString())
                    db.close()
                })
            }
            else {
                res.json(400)
                db.close()
            }
           
        })
    })
    
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
    client.connect(function(err,db){
        if(err) throw err    
        const database=db.db('financial-planner')
        mongoID = new ObjectId(req.params.id)
        database.collection('users').find({_id: mongoID}).toArray(function(err, result){
            if (err) throw err
            console.log(result[0])
            if (result[0] != undefined) {
                database.collection('users').deleteOne({_id: mongoID},function(err,result){
                    if (err) throw err
                })
                database.collection('users').find({_id: mongoID}).toArray(function(err, result){
                    if (err) throw err
                    res.json({ok: true});
                    db.close()
                })
            }
            else {
                res.json({ok: false});
                db.close()
            }
           
        })
    })
});

//Serve static CSS/JS
app.use(express.static('css'));
app.use(express.static('js'));

//Start the server
app.listen(port, () => {
    console.log(`Financial Planner live on port ${port}`);
});
