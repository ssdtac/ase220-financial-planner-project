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
        res.send({ok:true});
    } else {
        res.send({ok:false});
    }
});

//create user
app.post('/api/users/:id', (req, res) => {
    if(!fs.existsSync(`json/users/${req.params.id}.json`)) {
        //console.log(`wrote file sync ${req.params.id}.json`)
        fs.writeFileSync(`json/users/${req.params.id}.json`, JSON.stringify(req.body, null, 2));
        res.send({ok:true})
    } else {
        // bad request
        res.send({ok:false})   
    }
})

//create user in users file
app.put('/api/users.json', (req, res) =>{
    id = req.params.id
    res.setHeader('Content-Type', 'application/json')
    console.log(req.body)
    if (req.headers['content-type'] === 'application/json') {
        fs.writeFileSync("./json/users.json", JSON.stringify(req.body, null, 2))
        //console.log("wrote file sync users.json")
        res.send({ok:true})
    } else {
        // bad request
        res.send({ok:false})
    }
});

app.delete('/api/users/:id', (req, res) => {
    const filePath = path.join(__dirname, 'json', 'users', `${req.params.id}.json`);
    
    if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(err);
                // Internal Server Error
                return res.sendStatus(500);
            }
            // Successfully deleted
            res.sendStatus(200);
        });
    } else {
        // File not found
        res.sendStatus(404);
    }
});


//Serve static CSS/JS
app.use(express.static('css'))
app.use(express.static('js'))

//Start the server
app.listen(port, () => {
  console.log(`Financial Planner live on port ${port}`)
})