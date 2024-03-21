const express = require('express')
const path = require('path')
const app = express()
const port = 5500


//Serve homepage and dashboard
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

//Serve transaction details page as /transaction
app.get('/transaction', (req, res) => {
    res.sendFile(path.join(__dirname, 'transaction-detail.html'))
})

app.get('/api/users/:id', (req, res) =>  {
    res.sendFile(path.join(__dirname, 'json', `${req.params.id}.json`))
})

//Serve static CSS/JS
app.use(express.static('css'))
app.use(express.static('js'))

//Start the server
app.listen(port, () => {
  console.log(`Financial Planner live on port ${port}`)
})