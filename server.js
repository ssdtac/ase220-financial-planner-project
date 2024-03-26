const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')
const app = express()
const port = 5500

app.use(bodyParser.urlencoded({ extended:false }))
app.use(bodyParser.json())

//Serve homepage and dashboard
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "html", 'index.html'))
})

//Serve transaction details page as /transaction
app.get('/transaction', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'transaction-detail.html'))
})

app.get('/api/users/:id', (req, res) =>  {
    if (fs.existsSync(`./json/users/${req.params.id}.json`)) {
        res.sendFile(path.join(__dirname, 'json', 'users', `${req.params.id}.json`))

    }
    else {
        res.json("404 - not found")
    }
})

//Serve transaction details page as /transaction
app.get('/api/users.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'json', 'users.json'))
})

//update existing user
app.put('/api/users/:id', (req, res) => {
    if(fs.existsSync(`./json/users/${req.params.id}.json`)){
        data = express.json(req.body);
        fs.writeFileSync(`./json/users/${req.params.id}.json`, JSON.stringify(data, null, 2));
        res.json({ok:true});
    } else {
        
        res.json({ok:false});
    }
});

//create user
app.post('/api/users/:id', (req, res) => {
    if(!fs.existsSync(`json/users/${req.params.id}.json`)) {
        fs.writeFileSync(`json/users/${req.params.id}.json`, JSON.stringify(req.body, null, 2));
        res.sendStatus(200)
    } else {
        res.sendStatus(400)   
    }
})

//create user in users file
app.put('/api/users.json', (req, res) =>{
    id = req.params.id
    res.setHeader('Content-Type', 'application/json')
    console.log(req.body)
    console.log(req.headers)
    fs.writeFileSync("./json/users.json", JSON.stringify(req.body, null, 2))
    res.sendStatus(200)
});

//Serve static CSS/JS
app.use(express.static('css'))
app.use(express.static('js'))

//Start the server
app.listen(port, () => {
  console.log(`Financial Planner live on port ${port}`)
})