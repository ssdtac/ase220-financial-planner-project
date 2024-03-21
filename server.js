const express = require('express')
const fs = require('fs')
const app = express()
const port = 5500

app.get('/', (req, res) => {
    let content = fs.readFileSync('index.html', 'utf8')
    res.send(content)
})

app.get('/transaction', (req, res) => {
    let content = fs.readFileSync('transaction-detail.html', 'utf8')
    res.send(content)
})

app.use(express.static('css'))
app.use(express.static('js'))


app.listen(port, () => {
  console.log(`Financial Planner live on port ${port}`)
})