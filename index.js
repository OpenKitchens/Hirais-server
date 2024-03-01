const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const fs = require("fs")
const path = require("path")

let database

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const corsOptions = {
  origin: '*', //  全てのオリジンを許可
}
app.use(cors(corsOptions))

//  ブラウザにHTMLを送信
app.get('/', (req, res) => {
  fs.readFile("client.html", 'utf-8', (err, data) => {
    if (err) {
      console.error(err)
      res.status(500).send('ファイルの読み込みに失敗しました。')
    } else {
      res.send(data)
    }
  })
})

app.post("/getThread", (req,res) => {
  res.send(database[req.body.threadID])
})

app.post("/getThreads", (req,res) => {
  res.send(database.threads)
})

app.post("/count",(req,res) => {
  console.log("hhhhhhhhhh")
  let threadID = req.body.threadID
  let key = req.body.key
  database[threadID][key]++
  databaseUpdate()
  res.send("success")
})

app.post("/uncount",(req,res) => {
  console.log("hhhhhhhhhh")
  let threadID = req.body.threadID
  let key = req.body.key
  database[threadID][key]--
  if(database[threadID][key] <= 0){
    database[threadID][key] = 0
  }
  databaseUpdate()
  res.send("success")
})

//  ブラウザからのPOSTリクエストを処理
app.post('/postThread', (req, res) => {
  //書き込み
  database[req.body.threadID] = req.body
  console.log(database)
  database.threads.push(req.body)
  res.send("success")
  databaseUpdate()
})

app.post("/reset",(req,res) => {
  //データのリセット
  database = {threads: []}
  databaseUpdate()
})

function databaseUpdate() {
  fs.writeFile('database.json', JSON.stringify(database), (err) => {
    if (err) {
      console.error(err)
      return
    }
  })
}

//  サーバーを起動

const PORT = process.env.PORT ||  3000
app.listen(PORT, () => {
  //読み込み
  fs.readFile('database.json', "utf-8", (err, data) => {
    if(data) {
      database = JSON.parse(data)
    } else {
      console.log(err)
    }
  })
  console.log(`Server is running on port ${PORT}`)
})